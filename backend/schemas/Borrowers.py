from sqlmodel import Field, Session, SQLModel, create_engine, select

from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4
from sqlmodel import Field, SQLModel, Column, DateTime, text

class BorrowerBase(SQLModel):
    name: str = Field(max_length=100)
    email: str = Field(max_length=100, unique=True, index=True)
    gender: str = Field(max_length=10)
    orgName: Optional[str] = Field(default=None, max_length=100)

class Borrower(BorrowerBase, table=True):
    __tablename__ = "borrowers"
    
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

class BorrowerCreate(BorrowerBase):
    """Schema for Data Validation on POST requests"""
    pass

class BorrowerRead(BorrowerBase):
    """Schema for Data Returning on GET requests"""
    id: UUID
    created_at: datetime