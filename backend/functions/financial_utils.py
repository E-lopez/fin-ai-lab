from decimal import Decimal
from typing import Optional

def calculate_remaining_balance(
    scheduled_principal: Decimal,
    allocated_principal: Decimal
) -> Decimal:
    return scheduled_principal - allocated_principal

def calculate_remaining_interest(
    scheduled_interest: Decimal,
    allocated_interest: Decimal
) -> Decimal:
    return scheduled_interest - allocated_interest

def calculate_remaining_fees(
    scheduled_fees: Decimal,
    allocated_fees: Decimal
) -> Decimal:
    return scheduled_fees - allocated_fees

def calculate_total_balance(
    remaining_principal: Decimal,
    remaining_interest: Decimal,
    remaining_fees: Decimal
) -> Decimal:
    return remaining_principal + remaining_interest + remaining_fees
