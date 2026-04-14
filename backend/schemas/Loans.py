from sqlmodel import Field, SQLModel, Column, DateTime, text, String
from datetime import datetime, date
from typing import Optional
from uuid import UUID, uuid4
from decimal import Decimal

class LoanBase(SQLModel):
    borrower_id: UUID = Field(foreign_key="borrowers.id")
    principal: Decimal = Field(max_digits=12, decimal_places=2)
    interest_rate: Decimal = Field(max_digits=7, decimal_places=4)
    amortization_type: str = Field(max_length=30)
    payment_frequency: str = Field(max_length=20)
    term_months: int = Field(nullable=False)
    start_date: date = Field(nullable=False)
    status: str = Field(
        default="active",
        sa_column=Column(String(20), server_default=text("'active'"), nullable=False)
    )

    def __init__(self, **data):
        if "interest_rate" in data and data["interest_rate"] is not None:
            rate = Decimal(str(data["interest_rate"]))
            if rate > 1:
                rate = rate / Decimal("100")
            data["interest_rate"] = rate

        if "principal" in data and data["principal"] is not None:
            data["principal"] = Decimal(str(data["principal"]))

        super().__init__(**data)

class Loan(LoanBase, table=True):
    __tablename__ = "loans"
    
    id: Optional[UUID] = Field(
        default_factory=uuid4,
        primary_key=True,
        sa_column_kwargs={
            "server_default": text("gen_random_uuid()"),
        }
    )
    
    created_at: Optional[datetime] = Field(
        default_factory=datetime.utcnow,
        sa_column=Column(
            DateTime(timezone=True), 
            nullable=False
        )
    )

class LoanCreate(LoanBase):
    pass

class LoanRead(LoanBase):
    id: UUID
    created_at: datetime
