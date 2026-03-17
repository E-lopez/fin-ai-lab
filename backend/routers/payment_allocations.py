from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from uuid import UUID

from dependencies.db_client import get_session
from schemas.Payment_allocations import PaymentAllocation, PaymentAllocationRead, PaymentAllocationCreate

router = APIRouter(
  prefix="/payment_allocations",
  tags=["payment_allocations"],
  responses={404: {"description": "Not found"}},
)

@router.get("/payment/{payment_id}", response_model=list[PaymentAllocationRead])
async def get_allocations_by_payment_id(
    payment_id: UUID,
    session: Annotated[Session, Depends(get_session)]
):
    statement = select(PaymentAllocation).where(PaymentAllocation.payment_id == payment_id)
    results = session.exec(statement).all()
    return results

@router.post("/", response_model=PaymentAllocationRead)
async def create_payment_allocation(
    allocation: PaymentAllocationCreate,
    session: Annotated[Session, Depends(get_session)]
):
    db_allocation = PaymentAllocation(**allocation.model_dump())
    session.add(db_allocation)
    session.commit()
    session.refresh(db_allocation)
    return db_allocation
