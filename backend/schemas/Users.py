from sqlmodel import Field, SQLModel, Column, DateTime, text
from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4

class UserBase(SQLModel):
    username: str = Field(max_length=100, unique=True, index=True)
    role: str = Field(max_length=50, default="user")
    is_active: bool = Field(default=True)

class User(UserBase, table=True):
    __tablename__ = "users"
    
    id: Optional[UUID] = Field(
        default_factory=uuid4,
        primary_key=True,
        sa_column_kwargs={
            "server_default": text("gen_random_uuid()"),
        }
    )
    
    hashed_password: str = Field(max_length=255)
    
    created_at: Optional[datetime] = Field(
        default_factory=datetime.utcnow,
        sa_column=Column(
            DateTime(timezone=True), 
            nullable=False
        )
    )

class UserCreate(SQLModel):
    username: str
    password: str
    role: str = "user"

class UserRead(UserBase):
    id: UUID
    created_at: datetime

class UserLogin(SQLModel):
    username: str
    password: str

class PasswordChange(SQLModel):
    old_password: str
    new_password: str

class Token(SQLModel):
    access_token: str
    token_type: str
