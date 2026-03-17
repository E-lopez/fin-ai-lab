from sqlmodel import Field, SQLModel, Column, DateTime, text
from datetime import datetime, date
from typing import Optional
from uuid import UUID, uuid4
from decimal import Decimal

class PaymentBase(SQLModel):
    loan_id: UUID = Field(foreign_key="loans.id")
    paid_amount: Decimal = Field(max_digits=12, decimal_places=2)
    payment_date: date

class Payment(PaymentBase, table=True):
    __tablename__ = "payments"
    
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

class PaymentCreate(PaymentBase):
    pass

class PaymentRead(PaymentBase):
    id: UUID
    created_at: datetime
