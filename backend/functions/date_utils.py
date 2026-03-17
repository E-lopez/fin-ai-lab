from datetime import date

def calculate_days_between(start_date: date, end_date: date) -> int:
    return (end_date - start_date).days

def calculate_days_late(due_date: date, current_date: date = None) -> int:
    if current_date is None:
        current_date = date.today()
    days = calculate_days_between(due_date, current_date)
    return max(0, days)

def calculate_days_until(target_date: date, current_date: date = None) -> int:
    if current_date is None:
        current_date = date.today()
    return calculate_days_between(current_date, target_date)
