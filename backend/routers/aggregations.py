from typing import Annotated
from fastapi import APIRouter, Depends, Query
from sqlmodel import Session, select
from uuid import UUID

from schemas.Loans import Loan
from schemas.Loan_schedule import LoanSchedule
from schemas.Users import User

from dependencies.db_client import get_session
from dependencies.auth import get_current_user
from constants.HTTP_messages import HTTP_MESSAGES
from sqlalchemy import func


router = APIRouter(
  prefix="/aggregations",
  tags=["aggregations"],
  responses={404: {"description": "Not found"}},
)

@router.get("/overview")
async def get_aggregated_overview(
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)],
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100
):
    statement = (
        select(LoanSchedule)
        .join(Loan)
        .join_from(LoanSchedule, Loan, Loan.id == LoanSchedule.loan_id)
        .with_only_columns(
            Loan.borrower_id,
            func.count(Loan.id).label("total_loans"),
            func.sum(Loan.amount).label("total_amount"),
            func.sum(LoanSchedule.principal_due).label("total_principal_due"),
            func.sum(LoanSchedule.interest_due).label("total_interest_due"),
            func.sum(LoanSchedule.fees_due).label("total_fees_due")
        )
        .group_by(Loan.borrower_id)
        .offset(offset)
        .limit(limit)
    )

    results = session.exec(statement).all()
    return results
    