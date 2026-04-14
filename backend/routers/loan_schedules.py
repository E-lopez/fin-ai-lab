from typing import Annotated
from routers.loans import get_loan_by_id
from constants.HTTP_messages import HTTP_MESSAGES
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from uuid import UUID
from decimal import Decimal
from datetime import date
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException

from dependencies.db_client import get_session
from schemas.Loans import Loan
from schemas.Loan_schedule import LoanSchedule, LoanScheduleRead, LoanScheduleCreate
from schemas.Payment_allocations import PaymentAllocation
from schemas.Payments import Payment
from functions.schedule_utils import scheduler
from functions.date_utils import calculate_days_late
from functions.financial_utils import calculate_remaining_balance, calculate_remaining_interest, calculate_remaining_fees

router = APIRouter(
  prefix="/loan_schedules",
  tags=["loan_schedules"],
  responses={404: {"description": "Not found"}},
)

@router.get("/loan/{loan_id}", response_model=list[LoanScheduleRead])
async def get_loan_schedule_by_loan_id(
    loan_id: UUID,
    session: Annotated[Session, Depends(get_session)]
):
    statement = select(LoanSchedule).where(LoanSchedule.loan_id == loan_id).order_by(LoanSchedule.period)
    results = session.exec(statement).all()
    return results


@router.get(
        "/{schedule_id}",
        response_model=LoanScheduleRead,
        responses={404: {"description": HTTP_MESSAGES["SCHEDULES"]["SCHEDULE_NOT_FOUND"]}})
async def get_loan_schedule_by_id(
    schedule_id: UUID,
    session: Annotated[Session, Depends(get_session)]
):
    schedule = session.get(LoanSchedule, schedule_id)
    if not schedule:
        raise HTTPException(status_code=404, detail=HTTP_MESSAGES["SCHEDULES"]["SCHEDULE_NOT_FOUND"])
    return schedule

@router.get("/loan/{loan_id}/late-days")
async def get_scheduled_payment_late_days(
    loan_id: UUID,
    session: Annotated[Session, Depends(get_session)]
):
    today = date.today()
    
    statement = select(LoanSchedule).where(
        LoanSchedule.loan_id == loan_id,
        LoanSchedule.due_date < today
    ).order_by(LoanSchedule.due_date)
    
    schedules = session.exec(statement).all()
    
    late_schedules = []
    for schedule in schedules:
        allocation_statement = select(PaymentAllocation).where(
            PaymentAllocation.schedule_id == schedule.id
        )
        allocations = session.exec(allocation_statement).all()
        
        allocated_principal = sum(a.allocated_principal for a in allocations)
        allocated_interest = sum(a.allocated_interest for a in allocations)
        allocated_fees = sum(a.allocated_fees for a in allocations)
        
        remaining_principal = calculate_remaining_balance(schedule.scheduled_principal, allocated_principal)
        remaining_interest = calculate_remaining_interest(schedule.scheduled_interest, allocated_interest)
        remaining_fees = calculate_remaining_fees(schedule.scheduled_fees, allocated_fees)
        
        total_remaining = remaining_principal + remaining_interest + remaining_fees
        
        if total_remaining > 0:
            days_late = calculate_days_late(schedule.due_date)
            late_schedules.append({
                "schedule_id": schedule.id,
                "period": schedule.period,
                "due_date": schedule.due_date,
                "days_late": days_late,
                "remaining_amount": total_remaining
            })
    
    return late_schedules

@router.get("/loan/{loan_id}/next-scheduled-amounts")
async def get_next_scheduled_amounts(
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
            "principal": 0,
            "interest": 0,
            "fees": 0,
            "message": "No upcoming scheduled payments"
        }
    
    allocation_statement = select(PaymentAllocation).where(
        PaymentAllocation.schedule_id == next_schedule.id
    )
    allocations = session.exec(allocation_statement).all()
    
    allocated_principal = sum(a.allocated_principal for a in allocations)
    allocated_interest = sum(a.allocated_interest for a in allocations)
    allocated_fees = sum(a.allocated_fees for a in allocations)
    
    remaining_principal = calculate_remaining_balance(next_schedule.scheduled_principal, allocated_principal)
    remaining_interest = calculate_remaining_interest(next_schedule.scheduled_interest, allocated_interest)
    remaining_fees = calculate_remaining_fees(next_schedule.scheduled_fees, allocated_fees)
    
    return {
        "loan_id": loan_id,
        "schedule_id": next_schedule.id,
        "period": next_schedule.period,
        "due_date": next_schedule.due_date,
        "principal": remaining_principal,
        "interest": remaining_interest,
        "fees": remaining_fees
    }

@router.get("/loan/{loan_id}/payment-progress")
async def get_payment_progress(
    loan_id: UUID,
    session: Annotated[Session, Depends(get_session)]
):
    schedule_statement = select(LoanSchedule).where(LoanSchedule.loan_id == loan_id)
    schedules = session.exec(schedule_statement).all()
    
    total_scheduled = Decimal(0)
    total_paid = Decimal(0)
    
    for schedule in schedules:
        scheduled_amount = schedule.scheduled_principal + schedule.scheduled_interest + schedule.scheduled_fees
        total_scheduled += scheduled_amount
        
        allocation_statement = select(PaymentAllocation).where(
            PaymentAllocation.schedule_id == schedule.id
        )
        allocations = session.exec(allocation_statement).all()
        
        paid_amount = sum(
            a.allocated_principal + a.allocated_interest + a.allocated_fees 
            for a in allocations
        )
        total_paid += paid_amount
    
    return {
        "loan_id": loan_id,
        "total_scheduled": total_scheduled,
        "total_paid": total_paid,
        "remaining": total_scheduled - total_paid,
        "progress_percentage": float((total_paid / total_scheduled * 100) if total_scheduled > 0 else 0)
    }


@router.post(
        "/",
        responses={
            200: {"description": HTTP_MESSAGES["SCHEDULES"]["SCHEDULE_CREATED_SUCCESSFULLY"]},
            500: {"description": HTTP_MESSAGES["SCHEDULES"]["SCHEDULE_CREATION_FAILED"]}
        })
async def create_loan_schedule(
    loan_id: UUID,
    session: Annotated[Session, Depends(get_session)]
):
    loan = await get_loan_by_id(loan_id, session)
    print(f"Generating schedule for loan: {loan}")
    schedule = scheduler(loan.amortization_type)(loan)
    try:
        db_entries = [LoanSchedule(loan_id=loan_id, **entry) for entry in schedule]
        session.add_all(db_entries)
        session.commit()

    except SQLAlchemyError as e:
        session.rollback()
        print(f"Database error: {e}")
        raise HTTPException(status_code=500, detail=HTTP_MESSAGES["SCHEDULES"]["SCHEDULE_CREATION_FAILED"])

    return {"message": f"Loan schedule created successfully with {len(schedule)} entries."}


@router.post(
        "/simulate",
        responses={
            200: {"description": HTTP_MESSAGES["SCHEDULES"]["SCHEDULE_CREATED_SUCCESSFULLY"]},
            500: {"description": HTTP_MESSAGES["SCHEDULES"]["SCHEDULE_CREATION_FAILED"]}
        })
async def create_loan_schedule(
    loan: Loan,
):
    schedule = scheduler(loan.amortization_type)(loan)

    return schedule


@router.post(
        "/loan/{loan_id}/late-fee",
        responses={
            200: {"description": HTTP_MESSAGES["SCHEDULES"]["LATE_FEE_CREATED"]},
            400: {"description": HTTP_MESSAGES["SCHEDULES"]["LATE_FEE_TOO_EARLY"]},
            404: {"description": HTTP_MESSAGES["SCHEDULES"]["SCHEDULE_NOT_FOUND_FOR_LOAN"]}
        })
async def create_late_fee(
    loan_id: UUID,
    schedule_id: UUID,
    session: Annotated[Session, Depends(get_session)]
):
    schedule = session.get(LoanSchedule, schedule_id)
    if not schedule or schedule.loan_id != loan_id:
        raise HTTPException(status_code=404, detail=HTTP_MESSAGES["SCHEDULES"]["SCHEDULE_NOT_FOUND_FOR_LOAN"])
    
    days_late = calculate_days_late(schedule.due_date)
    
    if days_late < 3:
        raise HTTPException(status_code=400, detail=HTTP_MESSAGES["SCHEDULES"]["LATE_FEE_TOO_EARLY"])
    
    late_fee_schedule = LoanSchedule(
        loan_id=loan_id,
        period=schedule.period,
        due_date=schedule.due_date,
        scheduled_principal=Decimal(0),
        scheduled_interest=Decimal(0),
        scheduled_fees=Decimal(30000)
    )
    
    session.add(late_fee_schedule)
    session.commit()
    session.refresh(late_fee_schedule)
    
    return {
        "loan_id": loan_id,
        "original_schedule_id": schedule_id,
        "late_fee_schedule_id": late_fee_schedule.id,
        "late_fee_amount": 30000,
        "days_late": days_late
    }
