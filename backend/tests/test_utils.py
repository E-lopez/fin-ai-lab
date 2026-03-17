from decimal import Decimal
from datetime import date
from functions.financial_utils import (
    calculate_remaining_balance,
    calculate_remaining_interest,
    calculate_remaining_fees,
    calculate_total_balance
)
from functions.date_utils import (
    calculate_days_between,
    calculate_days_late,
    calculate_days_until
)

def test_calculate_remaining_balance():
    scheduled = Decimal("1000.00")
    allocated = Decimal("300.00")
    result = calculate_remaining_balance(scheduled, allocated)
    assert result == Decimal("700.00")

def test_calculate_remaining_interest():
    scheduled = Decimal("50.00")
    allocated = Decimal("20.00")
    result = calculate_remaining_interest(scheduled, allocated)
    assert result == Decimal("30.00")

def test_calculate_remaining_fees():
    scheduled = Decimal("100.00")
    allocated = Decimal("100.00")
    result = calculate_remaining_fees(scheduled, allocated)
    assert result == Decimal("0.00")

def test_calculate_total_balance():
    principal = Decimal("500.00")
    interest = Decimal("25.00")
    fees = Decimal("10.00")
    result = calculate_total_balance(principal, interest, fees)
    assert result == Decimal("535.00")

def test_calculate_days_between():
    start = date(2024, 1, 1)
    end = date(2024, 1, 31)
    result = calculate_days_between(start, end)
    assert result == 30

def test_calculate_days_late():
    due_date = date(2024, 1, 1)
    current_date = date(2024, 1, 10)
    result = calculate_days_late(due_date, current_date)
    assert result == 9

def test_calculate_days_late_not_late():
    due_date = date(2024, 1, 10)
    current_date = date(2024, 1, 5)
    result = calculate_days_late(due_date, current_date)
    assert result == 0

def test_calculate_days_until():
    target_date = date(2024, 12, 31)
    current_date = date(2024, 12, 1)
    result = calculate_days_until(target_date, current_date)
    assert result == 30
