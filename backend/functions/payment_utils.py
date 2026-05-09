from decimal import Decimal
from datetime import date
from sqlmodel import Session, select, func
from uuid import UUID

from schemas.Loan_schedule import LoanSchedule
from schemas.Payment_allocations import PaymentAllocation
from schemas.Loans import Loan
from functions.financial_utils import calculate_remaining_balance, calculate_remaining_interest, calculate_remaining_fees, calculate_total_balance
from functions.date_utils import calculate_days_until, calculate_days_late

def allocate_payment_to_schedule(payment_id, schedule, remaining_amount: Decimal, session: Session):
    existing = session.exec(
        select(PaymentAllocation).where(PaymentAllocation.schedule_id == schedule.id)
    ).all()

    remaining_interest = schedule.scheduled_interest - sum(a.allocated_interest for a in existing)
    remaining_fees = schedule.scheduled_fees - sum(a.allocated_fees for a in existing)
    remaining_principal = schedule.scheduled_principal - sum(a.allocated_principal for a in existing)
    period_balance = remaining_interest + remaining_fees + remaining_principal

    allocation = PaymentAllocation(
        payment_id=payment_id,
        schedule_id=schedule.id,
        allocated_principal=Decimal(0),
        allocated_interest=Decimal(0),
        allocated_fees=Decimal(0)
    )

    if remaining_interest > 0:
        to_interest = min(remaining_amount, remaining_interest)
        allocation.allocated_interest = to_interest
        remaining_amount -= to_interest

    if remaining_amount > 0 and remaining_fees > 0:
        to_fees = min(remaining_amount, remaining_fees)
        allocation.allocated_fees = to_fees
        remaining_amount -= to_fees

    if remaining_amount > 0 and remaining_principal > 0:
        to_principal = min(remaining_amount, remaining_principal)
        allocation.allocated_principal = to_principal
        remaining_amount -= to_principal

    if allocation.allocated_interest > 0 or allocation.allocated_fees > 0 or allocation.allocated_principal > 0:
        session.add(allocation)

    allocated = allocation.allocated_interest + allocation.allocated_fees + allocation.allocated_principal
    period_remaining = max(Decimal(0), period_balance - allocated)

    return remaining_amount, period_remaining


def get_next_payment_for_loan(loan_id: UUID, session: Session):
    today = date.today()

    print(f"Calculating next payment for loan_id: {loan_id} as of {today}")
    
    statement = select(LoanSchedule).where(
        LoanSchedule.loan_id == loan_id
    ).order_by(LoanSchedule.due_date)
    
    all_schedules = session.exec(statement).all()
    
    if not all_schedules:
        return None
    
    late_days = 0
    next_due_date = None
    remaining_amount_for_next_due = Decimal(0)
    total_remaining_amount = Decimal(0)
    
    for schedule in all_schedules:
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
        
        period_remaining = calculate_total_balance(remaining_principal, remaining_interest, remaining_fees)
        
        if period_remaining > 0:
            total_remaining_amount += period_remaining
            
            if schedule.due_date < today:
                period_late_days = calculate_days_late(schedule.due_date)
                if period_late_days > late_days:
                    late_days = period_late_days
            
            if next_due_date is None:
                next_due_date = schedule.due_date
            
            if schedule.due_date == next_due_date:
                remaining_amount_for_next_due += period_remaining
    
    if next_due_date is None:
        return None
    
    days_to_due = calculate_days_until(next_due_date)
    
    remaining_amount = total_remaining_amount if late_days >= 30 else remaining_amount_for_next_due
    
    return {
        "due_date": next_due_date,
        "amount_due": remaining_amount_for_next_due,
        "remaining_amount": remaining_amount,
        "late_days": late_days,
        "days_to_due_date": days_to_due
    }


def get_next_payment_for_borrower(borrower_id: UUID, session: Session):
    # 1. Fetch all active schedules for this borrower
    statement = (
        select(LoanSchedule)
        .join(Loan)
        .where(
            Loan.borrower_id == borrower_id,
            Loan.status == "active"
        )
        .order_by(LoanSchedule.due_date.asc(), LoanSchedule.period.asc())
    )
    
    all_schedules = session.exec(statement).all()
    
    total_catch_up_amount = 0
    oldest_unpaid_date = None
    today = date.today()

    for schedule in all_schedules:
        # Get total paid for this specific period
        paid_data = session.exec(
            select(
                func.sum(
                    PaymentAllocation.allocated_principal + 
                    PaymentAllocation.allocated_interest + 
                    PaymentAllocation.allocated_fees
                )
            ).where(PaymentAllocation.schedule_id == schedule.id)
        ).first() or 0
        
        total_scheduled = (schedule.scheduled_principal + 
                           schedule.scheduled_interest + 
                           schedule.scheduled_fees)
                
        balance_for_period = total_scheduled - paid_data

        if balance_for_period <= 0:
            continue

        # If this period is in the past or is today, add it to the total due
        if schedule.due_date <= today:
            total_catch_up_amount += balance_for_period
            # Track the oldest date to show the user when they started falling behind
            if oldest_unpaid_date is None:
                oldest_unpaid_date = schedule.due_date
        else:
            # This is the first TRULY future payment. 
            # If we have no overdue amounts, we return just this one.
            # If we DO have overdue amounts, we usually stop here or add it depending on your policy.
            if total_catch_up_amount == 0:
                # is_catch_up_balance: False means this is a regular upcoming payment with no overdue amounts
                # True means the amount includes accumulated past-due payments (catch-up required)
                return {
                    "amount_due": float(balance_for_period),
                    "due_date": schedule.due_date,
                    "status": "upcoming",
                    "is_catch_up_balance": False
                }
            break # We found all past-due amounts, stop looking at the future.

    if total_catch_up_amount > 0:
        return {
            "amount_due": float(total_catch_up_amount),
            "due_date": oldest_unpaid_date,
            "status": "overdue",
            "is_catch_up_balance": True
        }
            
    return {
        "amount_due": 0,
        "due_date": None,
        "status": "paid",
        "is_catch_up_balance": False
    }
            