import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from dependencies.db_client import create_db_and_tables
from routers import borrowers, loans, loan_schedules, payments, payment_allocations, auth, aggregations


app = FastAPI()

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(borrowers.router)
app.include_router(loans.router)
app.include_router(loan_schedules.router)
app.include_router(payments.router)
app.include_router(payment_allocations.router)
app.include_router(aggregations.router)


@app.get("/")
def read_root():
    return {"Message": "Connection tested successfully!"}
