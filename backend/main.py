from fastapi import FastAPI

from routers import borrowers, loans, loan_schedules, payments, payment_allocations

app = FastAPI()

app.include_router(borrowers.router)
app.include_router(loans.router)
app.include_router(loan_schedules.router)
app.include_router(payments.router)
app.include_router(payment_allocations.router)


@app.get("/")
def read_root():
    return {"Message": "Connection tested successfully!"}
