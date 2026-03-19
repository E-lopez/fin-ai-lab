from typing import Annotated, Optional
from constants.HTTP_messages import HTTP_MESSAGES
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlmodel import Session, select, or_, func
from uuid import UUID
from decimal import Decimal
from datetime import date

from dependencies.db_client import get_session
from schemas.Borrowers import Borrower, BorrowerRead, BorrowerCreate
from schemas.Loans import Loan
from schemas.Loan_schedule import LoanSchedule
from schemas.Payment_allocations import PaymentAllocation
from functions.financial_utils import calculate_remaining_balance, calculate_remaining_interest, calculate_remaining_fees, calculate_total_balance

router = APIRouter(
  prefix="/borrowers",
  tags=["borrowers"],
  responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=list[BorrowerRead])
async def read_borrowers(
    session: Annotated[Session, Depends(get_session)],
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
    ):
    statement = select(Borrower).offset(offset).limit(limit)
    results = session.exec(statement).all()
    return results


@router.get("/search", response_model=list[BorrowerRead])
async def search_borrowers(
    session: Annotated[Session, Depends(get_session)],
    query: Annotated[str, Query(..., min_length=1)],
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
):
    search_filter = f"%{query}%"
    statement = select(Borrower).where(
        or_(
            Borrower.name.ilike(search_filter),
            Borrower.email.ilike(search_filter),
            Borrower.orgName.ilike(search_filter)
        )
    ).offset(offset).limit(limit)
    
    results = session.exec(statement).all()
    return results


@router.get(
        "/{borrower_id}/summary",
        responses={
            200: {"description": "Borrower summary retrieved successfully"},
            404: {"description": HTTP_MESSAGES["BORROWER_NOT_FOUND"]}
        })
async def get_borrower_summary(
    borrower_id: UUID,
    session: Annotated[Session, Depends(get_session)]
):
    borrower = session.get(Borrower, borrower_id)
    if not borrower:
        raise HTTPException(status_code=404, detail=HTTP_MESSAGES["BORROWER_NOT_FOUND"])
    
    loans_statement = select(Loan).where(
        Loan.borrower_id == borrower_id,
        Loan.status == "active"
    )
    active_loans = session.exec(loans_statement).all()
    
    total_debt = Decimal(0)
    for loan in active_loans:
        schedule_statement = select(LoanSchedule).where(LoanSchedule.loan_id == loan.id)
        schedules = session.exec(schedule_statement).all()
        
        for schedule in schedules:
            allocation_statement = select(PaymentAllocation).where(
                PaymentAllocation.schedule_id == schedule.id
            )
            allocations = session.exec(allocation_statement).all()
            
            allocated_principal = func.sum(a.allocated_principal for a in allocations)
            allocated_interest = func.sum(a.allocated_interest for a in allocations)
            allocated_fees = func.sum(a.allocated_fees for a in allocations)
            
            remaining_principal = calculate_remaining_balance(schedule.scheduled_principal, allocated_principal)
            remaining_interest = calculate_remaining_interest(schedule.scheduled_interest, allocated_interest)
            remaining_fees = calculate_remaining_fees(schedule.scheduled_fees, allocated_fees)
            
            total_debt += calculate_total_balance(remaining_principal, remaining_interest, remaining_fees)
    
    return {
        "borrower_id": borrower_id,
        "total_debt": total_debt,
        "number_of_active_loans": len(active_loans),
        "overall_standing": "active" if total_debt > 0 else "clear"
    }


@router.get(
    "/{borrower_id}/next-payment",
    responses={
        200: {"description": "Next payment retrieved successfully"},
        404: {"description": HTTP_MESSAGES["BORROWER_NOT_FOUND"]}}
)
async def get_next_payment(
    borrower_id: UUID,
    session: Annotated[Session, Depends(get_session)]
):
    # 1. Join Schedule to Loans to filter by borrower
    # 2. Sort by due_date to find the 'next' chronological requirement
    # 3. Subquery approach to check for 'unpaid' status
    
    statement = (
        select(LoanSchedule)
        .join(Loan)
        .where(
            Loan.borrower_id == borrower_id,
            Loan.status == "active"
        )
        .order_by(LoanSchedule.due_date.asc())
    )
    
    # Iterate until we find the first one that isn't fully paid
    all_upcoming = session.exec(statement).all()
    
    for schedule in all_upcoming:
        # Get total paid for this specific period
        print(schedule.id, schedule.loan_id)
        paid_data = session.exec(
            select(
                func.sum(PaymentAllocation.allocated_principal + 
                    PaymentAllocation.allocated_interest + 
                    PaymentAllocation.allocated_fees)
            ).where(PaymentAllocation.schedule_id == schedule.id)
        ).first()
        
        total_paid = paid_data or 0
        total_scheduled = (schedule.scheduled_principal + 
                           schedule.scheduled_interest + 
                           schedule.scheduled_fees)
        
        if total_paid < total_scheduled:
            return {
                "schedule_id": schedule.id,
                "due_date": schedule.due_date,
                "amount_due": total_scheduled - total_paid,
                "status": "overdue" if schedule.due_date < date.today() else "upcoming"
            }
            
    return {"message": "All loans are fully paid or no active loans found."}


@router.get(
        "/{borrower_id}", 
        response_model=BorrowerRead,
        responses={404: {"description": HTTP_MESSAGES["BORROWER_NOT_FOUND"]}}
    )
async def get_borrower_by_id(
    borrower_id: UUID,
    session: Annotated[Session, Depends(get_session)]
):
    borrower = session.get(Borrower, borrower_id)
    if not borrower:
        raise HTTPException(status_code=404, detail=HTTP_MESSAGES["BORROWER_NOT_FOUND"])
    return borrower


@router.patch(
        "/{borrower_id}",
        response_model=BorrowerRead,
        responses={404: {"description": HTTP_MESSAGES["BORROWER_NOT_FOUND"]}})
async def update_borrower(
    borrower_id: UUID,
    borrower_update: dict,
    session: Annotated[Session, Depends(get_session)]
):
    borrower = session.get(Borrower, borrower_id)
    if not borrower:
        raise HTTPException(status_code=404, detail=HTTP_MESSAGES["BORROWER_NOT_FOUND"])
    
    for key, value in borrower_update.items():
        if hasattr(borrower, key):
            setattr(borrower, key, value)
    
    session.add(borrower)
    session.commit()
    session.refresh(borrower)
    return borrower


@router.post("/", response_model=BorrowerRead)
async def create_borrower(
    borrower: BorrowerCreate,
    session: Annotated[Session, Depends(get_session)]
):
    db_borrower = Borrower(**borrower.model_dump())
    session.add(db_borrower)
    session.commit()
    session.refresh(db_borrower)
    return db_borrower
