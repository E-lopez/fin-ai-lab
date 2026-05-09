from decimal import Decimal
from typing import Annotated, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from uuid import UUID
from datetime import date

from dependencies.db_client import get_session
from dependencies.auth import get_current_user

from schemas.Borrowers import Borrower
from schemas.Loans import Loan
from schemas.Payments import Payment, PaymentRead, PaymentCreate
from schemas.Payment_allocations import PaymentAllocation, PaymentAllocationCreate
from schemas.Loan_schedule import LoanSchedule
from schemas.Users import User

from functions.date_utils import calculate_days_until
from functions.email_utils import compose_success_email, send_email
from functions.payment_utils import allocate_payment_to_schedule, get_next_payment_for_borrower

from constants.HTTP_messages import HTTP_MESSAGES


router = APIRouter(
  prefix="/payments",
  tags=["payments"],
  responses={404: {"description": "Not found"}},
)


@router.get("/loan/{loan_id}", response_model=list[PaymentRead])
async def get_payments_by_loan_id(
    loan_id: UUID,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)]
):
    statement = select(Payment).where(Payment.loan_id == loan_id).order_by(Payment.payment_date)
    results = session.exec(statement).all()
    return results


@router.get("/loan/{loan_id}/next-due-date")
async def get_next_payment_due_date(
    loan_id: UUID,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)]
):
    today = date.today()
    
    statement = select(LoanSchedule).where(
        LoanSchedule.loan_id == loan_id,
        LoanSchedule.due_date >= today
    ).order_by(LoanSchedule.due_date)
    
    next_schedule = session.exec(statement).first()
    
    if not next_schedule:
        return {
            "loan_id": loan_id,
            "due_date": None,
            "message": "No upcoming payments"
        }
    
    return {
        "loan_id": loan_id,
        "due_date": next_schedule.due_date
    }


@router.get("/loan/{loan_id}/days-to-due-date")
async def get_days_to_payment_due_date(
    loan_id: UUID,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)]
):
    today = date.today()
    
    statement = select(LoanSchedule).where(
        LoanSchedule.loan_id == loan_id,
        LoanSchedule.due_date >= today
    ).order_by(LoanSchedule.due_date)
    
    next_schedule = session.exec(statement).first()
    
    if not next_schedule:
        return {
            "loan_id": loan_id,
            "days_to_due_date": None,
            "message": "No upcoming payments"
        }
    
    days_until_due = calculate_days_until(next_schedule.due_date)
    
    return {
        "loan_id": loan_id,
        "due_date": next_schedule.due_date,
        "days_to_due_date": days_until_due
    }


@router.get("/stats/daily")
async def get_daily_payment_stats(
    target_date: Optional[date] = None,
    session: Annotated[Session, Depends(get_session)] = None,
    current_user: Annotated[User, Depends(get_current_user)] = None
):
    if target_date is None:
        target_date = date.today()
    
    statement = select(Payment).where(Payment.payment_date == target_date)
    payments = session.exec(statement).all()
    
    total_collections = sum(p.paid_amount for p in payments)
    
    return {
        "date": target_date,
        "total_collections": total_collections,
        "number_of_payments": len(payments)
    }

@router.get("/stats/monthly")
async def get_monthly_payment_stats(
    year: int,
    month: int,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)]
):
    statement = select(Payment)
    payments = session.exec(statement).all()
    
    monthly_payments = [
        p for p in payments 
        if p.payment_date.year == year and p.payment_date.month == month
    ]
    
    total_collections = sum(p.paid_amount for p in monthly_payments)
    
    return {
        "year": year,
        "month": month,
        "total_collections": total_collections,
        "number_of_payments": len(monthly_payments)
    }


@router.post("/", response_model=PaymentRead)
async def create_payment(
    payment: PaymentCreate,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)]
):
    db_payment = Payment(**payment.model_dump())
    session.add(db_payment)
    session.commit()
    session.refresh(db_payment)
    
    remaining_amount = payment.paid_amount
    today = date.today()
    total_balance = Decimal(0)
    next_due_date = None

    schedules = session.exec(
        select(LoanSchedule).where(LoanSchedule.loan_id == payment.loan_id).order_by(LoanSchedule.due_date)
    ).all()

    for schedule in schedules:
        remaining_amount, period_remaining = allocate_payment_to_schedule(
            db_payment.id, schedule, remaining_amount, session
        )
        total_balance += period_remaining
        if next_due_date is None and schedule.due_date >= today:
            next_due_date = schedule.due_date

    session.commit()

    loan = session.get(Loan, payment.loan_id)
    borrower = session.get(Borrower, loan.borrower_id)
    next_payment = get_next_payment_for_borrower(borrower.id, session)

    print(f"next payment for borrower {borrower.name} is {next_payment}")
    
    template = compose_success_email(
        borrower_name=borrower.name,
        amount_due=payment.paid_amount,
        total_balance=total_balance,
        next_payment=next_payment["amount_due"] if next_payment else Decimal(0),
        next_due_date=next_payment["due_date"] if next_payment else "N/A"
    )

    print(f"Sending payment confirmation email to {borrower.email} for payment of ${payment.paid_amount:,.2f} with remaining balance ${total_balance:,.2f} and next due date {next_due_date} next payment amount ${next_payment['amount_due'] if next_payment else 'N/A'}")

    send_email(borrower.email, template['subject'], template['body'])
    
    return db_payment


@router.delete(
        "/{payment_id}",
        responses={
            200: {"description": HTTP_MESSAGES["PAYMENTS"]["PAYMENT_REVERSED_SUCCESSFULLY"]},
            404: {"description": HTTP_MESSAGES["PAYMENTS"]["PAYMENT_NOT_FOUND"]}
        }
    )
async def reverse_payment(
    payment_id: UUID,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)]
):
    payment = session.get(Payment, payment_id)
    if not payment:
        raise HTTPException(status_code=404, detail=HTTP_MESSAGES["PAYMENTS"]["PAYMENT_NOT_FOUND"])
    
    allocation_statement = select(PaymentAllocation).where(
        PaymentAllocation.payment_id == payment_id
    )
    allocations = session.exec(allocation_statement).all()
    
    for allocation in allocations:
        session.delete(allocation)
    
    session.delete(payment)
    session.commit()
    
    return {
        "payment_id": payment_id,
        "message": "Payment and allocations reversed successfully"
    }
