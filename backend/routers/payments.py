from typing import Annotated, Optional
from constants.HTTP_messages import HTTP_MESSAGES
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from uuid import UUID
from decimal import Decimal
from datetime import date, datetime

from dependencies.db_client import get_session
from schemas.Payments import Payment, PaymentRead, PaymentCreate
from schemas.Payment_allocations import PaymentAllocation, PaymentAllocationCreate
from schemas.Loan_schedule import LoanSchedule
from functions.date_utils import calculate_days_until

router = APIRouter(
  prefix="/payments",
  tags=["payments"],
  responses={404: {"description": "Not found"}},
)

@router.get("/loan/{loan_id}", response_model=list[PaymentRead])
async def get_payments_by_loan_id(
    loan_id: UUID,
    session: Annotated[Session, Depends(get_session)]
):
    statement = select(Payment).where(Payment.loan_id == loan_id).order_by(Payment.payment_date)
    results = session.exec(statement).all()
    return results

@router.get("/loan/{loan_id}/next-due-date")
async def get_next_payment_due_date(
    loan_id: UUID,
    session: Annotated[Session, Depends(get_session)]
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
    session: Annotated[Session, Depends(get_session)]
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
    session: Annotated[Session, Depends(get_session)] = None
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
    session: Annotated[Session, Depends(get_session)]
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
    session: Annotated[Session, Depends(get_session)]
):
    db_payment = Payment(**payment.model_dump())
    session.add(db_payment)
    session.commit()
    session.refresh(db_payment)
    
    remaining_amount = payment.paid_amount
    
    schedule_statement = select(LoanSchedule).where(
        LoanSchedule.loan_id == payment.loan_id
    ).order_by(LoanSchedule.due_date)
    
    schedules = session.exec(schedule_statement).all()
    
    for schedule in schedules:
        if remaining_amount <= 0:
            break
        
        allocation_statement = select(PaymentAllocation).where(
            PaymentAllocation.schedule_id == schedule.id
        )
        existing_allocations = session.exec(allocation_statement).all()
        
        allocated_interest = sum(a.allocated_interest for a in existing_allocations)
        allocated_fees = sum(a.allocated_fees for a in existing_allocations)
        allocated_principal = sum(a.allocated_principal for a in existing_allocations)
        
        remaining_interest = schedule.scheduled_interest - allocated_interest
        remaining_fees = schedule.scheduled_fees - allocated_fees
        remaining_principal = schedule.scheduled_principal - allocated_principal
        
        new_allocation = PaymentAllocation(
            payment_id=db_payment.id,
            schedule_id=schedule.id,
            allocated_principal=Decimal(0),
            allocated_interest=Decimal(0),
            allocated_fees=Decimal(0)
        )
        
        if remaining_interest > 0:
            allocation_to_interest = min(remaining_amount, remaining_interest)
            new_allocation.allocated_interest = allocation_to_interest
            remaining_amount -= allocation_to_interest
        
        if remaining_amount > 0 and remaining_fees > 0:
            allocation_to_fees = min(remaining_amount, remaining_fees)
            new_allocation.allocated_fees = allocation_to_fees
            remaining_amount -= allocation_to_fees
        
        if remaining_amount > 0 and remaining_principal > 0:
            allocation_to_principal = min(remaining_amount, remaining_principal)
            new_allocation.allocated_principal = allocation_to_principal
            remaining_amount -= allocation_to_principal
        
        if new_allocation.allocated_interest > 0 or new_allocation.allocated_fees > 0 or new_allocation.allocated_principal > 0:
            session.add(new_allocation)
    
    session.commit()
    
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
    session: Annotated[Session, Depends(get_session)]
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
