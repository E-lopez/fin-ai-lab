from sqlmodel import Field, SQLModel, Column, DateTime, text
from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4
from decimal import Decimal

class PaymentAllocationBase(SQLModel):
    payment_id: UUID = Field(foreign_key="payments.id")
    schedule_id: UUID = Field(foreign_key="loan_schedule.id")
    allocated_principal: Decimal = Field(default=0, max_digits=12, decimal_places=2)
    allocated_interest: Decimal = Field(default=0, max_digits=12, decimal_places=2)
    allocated_fees: Decimal = Field(default=0, max_digits=12, decimal_places=2)

class PaymentAllocation(PaymentAllocationBase, table=True):
    __tablename__ = "payment_allocations"
    
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

class PaymentAllocationCreate(PaymentAllocationBase):
    pass

class PaymentAllocationRead(PaymentAllocationBase):
    id: UUID
    created_at: datetime
