from sqlmodel import Field, SQLModel, Column, DateTime, text
from datetime import datetime, date
from typing import Optional
from uuid import UUID, uuid4
from decimal import Decimal

class LoanScheduleBase(SQLModel):
    loan_id: UUID = Field(foreign_key="loans.id")
    period: int
    due_date: date
    scheduled_principal: Decimal = Field(default=0, max_digits=12, decimal_places=2)
    scheduled_interest: Decimal = Field(default=0, max_digits=12, decimal_places=2)
    scheduled_fees: Decimal = Field(default=0, max_digits=12, decimal_places=2)

class LoanSchedule(LoanScheduleBase, table=True):
    __tablename__ = "loan_schedule"
    
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

class LoanScheduleCreate(LoanScheduleBase):
    pass

class LoanScheduleRead(LoanScheduleBase):
    id: UUID
    created_at: datetime
