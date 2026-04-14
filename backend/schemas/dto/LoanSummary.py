from pydantic import BaseModel, Field, computed_field
from uuid import UUID
from decimal import Decimal
from datetime import date
from typing import Optional

class LoanSummary(BaseModel):
    # Basic Loan Info
    id: UUID
    borrower_name: str
    borrower_id: UUID
    amount: Decimal
    status: str
    start_date: date

    # Aggregated Payment Info (from payment_sub and allocation_sub)
    total_payments: Decimal = Field(default=Decimal("0.00"))

    # Calculated Remaining Balances
    total_balance: Decimal = Field(default=Decimal("0.00"))

    # Dates (Can be None for new or fully paid loans)
    last_due_date: Optional[date] = None
    last_payment_date: Optional[date] = None
    next_payment_date: Optional[date] = None
    is_overdue: bool = False
    days_since_payment: Optional[int] = None

    class Config:
        # This allows Pydantic to interface with SQLAlchemy Row objects directly 
        # if you decide to use ._asdict() or similar methods.
        from_attributes = True