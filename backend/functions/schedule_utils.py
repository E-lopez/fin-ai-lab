from decimal import Decimal, ROUND_HALF_UP
from typing import Callable, List
from datetime import date
from dateutil.relativedelta import relativedelta

from constants.financial_conventions import CENT_ROUND
from schemas.Loans import Loan
from .financial_utils import get_fee_amount, get_monthly_rate


def get_periodicity(payment_frequency: str) -> int:
    freq_map = {
        "monthly": 1,
        "bimonthly": 2,
        "quarterly": 3,
        "semiannually": 6,
        "annually": 12
    }
    return freq_map[payment_frequency]


def french_amortization_schedule(loan: Loan) -> List[dict]:
    monthly_rate = get_monthly_rate(Decimal(str(loan.interest_rate)))
    payment = loan.principal * (monthly_rate * (1 + monthly_rate)**loan.term_months) / ((1 + monthly_rate)**loan.term_months - 1)
    
    schedule = []
    balance = loan.principal
    today = date.today()
    current_date = date(today.year, today.month, 10)
    current_period = 1

    for month in range(1, loan.term_months + 1):
        scheduled_interest = balance * monthly_rate
        scheduled_principal = payment - scheduled_interest
        fee = get_fee_amount(loan.principal) if month == 1 else 0

        schedule.append({
            "period": current_period,
            "due_date": current_date.isoformat(),
            "scheduled_principal": scheduled_principal.quantize(CENT_ROUND, ROUND_HALF_UP),
            "scheduled_interest": scheduled_interest.quantize(CENT_ROUND, ROUND_HALF_UP),
            "scheduled_fees": fee
        })
        current_period += 1
        current_date += relativedelta(months=1)
    
    return schedule


def bullet_amortization_schedule(loan: Loan) -> List[dict]:
    monthly_rate = loan.interest_rate / Decimal('12')
    # Number of principal payment events
    periodicity = loan.term_months if loan.payment_frequency == 'maturity' else get_periodicity(loan.payment_frequency)
    num_principal_payments = loan.term_months // periodicity
    
    # Calculate the fixed principal installment 
    # (Using a simplified straight-line or annuity-based approach depending on preference)
    # For this example, let's assume a fixed principal reduction to keep it clear:
    periodic_principal_payment = (loan.principal / Decimal(num_principal_payments)).quantize(Decimal('0.01'))

    schedule = []
    remaining_balance = loan.principal
    today = date.today()
    current_date = date(today.year, today.month, 10)
    current_period = 1

    for month in range(1, loan.term_months + 1):
        # 1. Interest is ALWAYS calculated and due monthly
        interest_due = (remaining_balance * monthly_rate).quantize(Decimal('0.01'), ROUND_HALF_UP)
        fee = get_fee_amount(loan.principal) if month == 1 else 0
        
        # 2. Principal is ONLY due if we hit the periodicity "beat"
        principal_due = Decimal('0.00')
        if month % periodicity == 0:
            if month == loan.term_months:
                principal_due = remaining_balance # Clean up rounding
            else:
                principal_due = periodic_principal_payment
        
        schedule.append({
            "period": current_period,
            "due_date": current_date.isoformat(),
            "scheduled_principal": principal_due.quantize(CENT_ROUND, ROUND_HALF_UP),
            "scheduled_interest": interest_due.quantize(CENT_ROUND, ROUND_HALF_UP),
            "scheduled_fees": fee
        })

        # Update balance ONLY after the principal was actually paid
        current_period += 1
        remaining_balance -= principal_due
        current_date += relativedelta(months=1)

    return schedule


def scheduler(amortization_type: str) -> Callable:
    if amortization_type == "french":
        return french_amortization_schedule
    elif amortization_type == "bullet":
        return bullet_amortization_schedule
    else:
        raise ValueError(f"Unsupported amortization type: {amortization_type}")