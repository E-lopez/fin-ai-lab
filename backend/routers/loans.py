from typing import Annotated, Optional
from constants.HTTP_messages import HTTP_MESSAGES
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlmodel import Session, select, func
from uuid import UUID
from decimal import Decimal
from datetime import date

from dependencies.db_client import get_session
from schemas.Borrowers import Borrower
from schemas.Loans import Loan, LoanRead, LoanCreate
from schemas.Loan_schedule import LoanSchedule
from schemas.Payments import Payment
from schemas.Payment_allocations import PaymentAllocation
from schemas.dto.LoanSummary import LoanSummary
from functions.financial_utils import calculate_total_balance, calculate_remaining_balance, calculate_remaining_interest, calculate_remaining_fees

router = APIRouter(
  prefix="/loans",
  tags=["loans"],
  responses={404: {"description": "Not found"}},
)


@router.get("/", response_model=list[LoanRead])
async def get_loans(
    session: Annotated[Session, Depends(get_session)],
    borrower_id: Optional[UUID] = None,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100
):
    statement = select(Loan).offset(offset).limit(limit)
    if borrower_id:
        statement = statement.where(Loan.borrower_id == borrower_id)
    results = session.exec(statement).all()
    return results


@router.get("/status/{status}", response_model=list[LoanRead])
async def get_loans_by_status(
    status: str,
    session: Annotated[Session, Depends(get_session)]
):
    statement = select(Loan).where(Loan.status == status)
    results = session.exec(statement).all()
    return results


@router.get("/loans-summary")
async def get_loans_summary(
    session: Annotated[Session, Depends(get_session)],
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100
):
    # --- CTE 1: Total Owed (The Contract) ---
    schedule_sub = (
        select(
            LoanSchedule.loan_id,
            # Sum everything owed (Principal + Interest + Fees)
            func.sum(
                LoanSchedule.scheduled_principal + 
                LoanSchedule.scheduled_interest + 
                LoanSchedule.scheduled_fees
            ).label("total_contract_value"),
            func.max(LoanSchedule.due_date).label("last_due_date")
        )
        .group_by(LoanSchedule.loan_id)
        .cte("schedule_totals")
    )

    # --- CTE 2: Total Received (The Cash) ---
    payment_sub = (
        select(
            Payment.loan_id,
            func.sum(Payment.paid_amount).label("total_payments"),
            func.max(Payment.payment_date).label("last_payment_date")
        )
        .group_by(Payment.loan_id)
        .cte("payment_totals")
    )

    # --- CTE 3: Next Payment Date ---
    next_pay_sub = (
        select(
            LoanSchedule.loan_id,
            func.min(LoanSchedule.due_date).label("next_payment_date")
        )
        .where(LoanSchedule.due_date >= date.today())
        .group_by(LoanSchedule.loan_id)
        .cte("next_pay")
    )

    # --- Final Statement ---
    statement = (
        select(
            Loan.id,
            Borrower.name.label("borrower_name"),
            Loan.principal,
            Loan.status,
            Loan.start_date,
            schedule_sub.c.total_contract_value,
            schedule_sub.c.last_due_date,
            payment_sub.c.total_payments,
            payment_sub.c.last_payment_date,
            next_pay_sub.c.next_payment_date
        )
        .join(Borrower, Loan.borrower_id == Borrower.id)
        .outerjoin(schedule_sub, Loan.id == schedule_sub.c.loan_id)
        .outerjoin(payment_sub, Loan.id == payment_sub.c.loan_id)
        .outerjoin(next_pay_sub, Loan.id == next_pay_sub.c.loan_id)
    )
    results = session.exec(statement).all()

    summary_list = []
    today = date.today()
    for row in results:
        contract_value = row.total_contract_value or Decimal("0.00")
        paid_to_date = row.total_payments or Decimal("0.00")
        current_balance = contract_value - paid_to_date

        overdue_status = False
    
        if current_balance > 0:
            if row.next_payment_date and today > row.next_payment_date:
                overdue_status = True
                
            last_activity = row.last_payment_date or row.start_date
            days_since_payment = (today - last_activity).days
            
            if days_since_payment > 31:
                overdue_status = True

        summary_list.append(
            LoanSummary(
                id=row.id,
                borrower_name=row.borrower_name,
                amount=row.principal,
                status=row.status,
                start_date=row.start_date,
                total_payments=paid_to_date,
                total_balance=current_balance,
                last_due_date=row.last_due_date,
                last_payment_date=row.last_payment_date,
                next_payment_date=row.next_payment_date,
                is_overdue=overdue_status,
                days_since_payment=days_since_payment if current_balance > 0 else None
            )
        )

    return summary_list


@router.get(
        "/{loan_id}",
        response_model=LoanRead,
        responses={404: {"description": HTTP_MESSAGES["LOANS"]["LOAN_NOT_FOUND"]}})
async def get_loan_by_id(
    loan_id: UUID,
    session: Annotated[Session, Depends(get_session)]
):
    loan = session.get(Loan, loan_id)
    if not loan:
        raise HTTPException(status_code=404, detail=HTTP_MESSAGES["LOANS"]["LOAN_NOT_FOUND"])
    return loan


@router.get(
        "/{loan_id}/balance",
        responses={404: {"description": HTTP_MESSAGES["LOANS"]["LOAN_NOT_FOUND"]}})
async def calculate_loan_balance(
    loan_id: UUID,
    session: Annotated[Session, Depends(get_session)]
):
    loan = session.get(Loan, loan_id)
    if not loan:
        raise HTTPException(status_code=404, detail=HTTP_MESSAGES["LOANS"]["LOAN_NOT_FOUND"])
    
    schedule_statement = select(LoanSchedule).where(LoanSchedule.loan_id == loan_id)
    schedules = session.exec(schedule_statement).all()
    
    total_remaining_principal = Decimal(0)
    total_remaining_interest = Decimal(0)
    total_remaining_fees = Decimal(0)
    
    for schedule in schedules:
        allocation_statement = select(PaymentAllocation).where(
            PaymentAllocation.schedule_id == schedule.id
        )
        allocations = session.exec(allocation_statement).all()
        
        allocated_principal = sum(a.allocated_principal for a in allocations)
        allocated_interest = sum(a.allocated_interest for a in allocations)
        allocated_fees = sum(a.allocated_fees for a in allocations)
        
        total_remaining_principal += calculate_remaining_balance(schedule.scheduled_principal, allocated_principal)
        total_remaining_interest += calculate_remaining_interest(schedule.scheduled_interest, allocated_interest)
        total_remaining_fees += calculate_remaining_fees(schedule.scheduled_fees, allocated_fees)
    
    total_balance = calculate_total_balance(total_remaining_principal, total_remaining_interest, total_remaining_fees)
    
    return {
        "loan_id": loan_id,
        "remaining_principal": total_remaining_principal,
        "remaining_interest": total_remaining_interest,
        "remaining_fees": total_remaining_fees,
        "total_balance": total_balance
    }


@router.post("/", response_model=LoanRead)
async def create_loan(
    loan: LoanCreate,
    session: Annotated[Session, Depends(get_session)]
):
    db_loan = Loan(**loan.model_dump())
    db_loan.status = "pending"
    session.add(db_loan)
    session.commit()
    session.refresh(db_loan)
    return db_loan


@router.post(
        "/{loan_id}/disburse",
        response_model=LoanRead,
        responses={
            200: {"description": HTTP_MESSAGES["LOANS"]["LOAN_DISBURSED_SUCCESSFULLY"]},
            400: {"description": HTTP_MESSAGES["LOANS"]["LOAN_NOT_ACTIVE"]},
            404: {"description": HTTP_MESSAGES["LOANS"]["LOAN_NOT_FOUND"]}
        }
    )
async def disburse_loan(
    loan_id: UUID,
    session: Annotated[Session, Depends(get_session)],
    disbursement_date: date = None
):
    loan = session.get(Loan, loan_id)
    if not loan:
        raise HTTPException(status_code=404, detail=HTTP_MESSAGES["LOANS"]["LOAN_NOT_FOUND"])
    
    if loan.status != "pending":
        raise HTTPException(status_code=400, detail=HTTP_MESSAGES["LOANS"]["LOAN_NOT_ACTIVE"])
    
    if disbursement_date:
        loan.start_date = disbursement_date
    loan.status = "active"
    
    session.add(loan)
    session.commit()
    session.refresh(loan)
    return loan
