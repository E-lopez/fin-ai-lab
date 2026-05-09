import sys
import os
from datetime import date
from decimal import Decimal

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlmodel import Session, select
from dependencies.db_client import get_engine
from schemas.Loans import Loan
from schemas.Borrowers import Borrower
from functions.email_utils import compose_reminder_email, send_email
from functions.payment_utils import get_next_payment_for_loan, get_next_payment_for_borrower
from functions.date_utils import calculate_days_until


def get_loans():
    engine = get_engine()
    with Session(engine) as session:
        statement = select(Loan).where(Loan.status == "active")
        loans = session.exec(statement).all()
        return loans
    
def get_borrowers():
    engine = get_engine()
    with Session(engine) as session:
        statement = select(Borrower)
        borrowers = session.exec(statement).all()
        return borrowers


def get_loan_next_payment(loan_id, session):
    loan = session.get(Loan, loan_id)
    if not loan:
        return None
    
    borrower = session.get(Borrower, loan.borrower_id)
    if not borrower:
        return None
    
    payment_info = get_next_payment_for_loan(loan_id, session)
    
    if not payment_info:
        return None
    
    return {
        "borrower_name": borrower.name,
        "email_address": borrower.email,
        "due_date": payment_info["due_date"],
        "amount_due": payment_info["amount_due"],
        "remaining_amount": payment_info["remaining_amount"],
        "late_days": payment_info["late_days"],
        "days_to_due_date": payment_info["days_to_due_date"]
    }


def try_send_email(email_address: str, subject: str, body: str, max_retries: int = 3):
    for attempt in range(1, max_retries + 1):
        print(f"Attempt {attempt} of {max_retries} to send email to {email_address}")
        success = send_email(email_address, subject, body)
        
        if success:
            return True
        
        if attempt < max_retries:
            print(f"Retry {attempt} failed, attempting again...")
    
    print(f"Failed to send email to {email_address} after {max_retries} attempts")
    return False


def run_payment_reminder_cron():
    print("Starting payment reminder cron job...")
    
    borrowers = get_borrowers()
    print(f"Found {len(borrowers)} borrowers")
    
    engine = get_engine()
    with Session(engine) as session:
        for borrower in borrowers:
            next_payment = get_next_payment_for_borrower(borrower.id, session)
            print(f"Next payment for borrower {borrower.name}: {next_payment}")
            if next_payment['status'] == 'paid' or next_payment['amount_due'] == 0:
                print(f"Borrower {borrower.name} has no upcoming payments or is fully paid. Skipping email.")
                continue
            
            template = compose_reminder_email(borrower_name=borrower.name, amount_due=next_payment['amount_due'], due_date=next_payment['due_date'], status=next_payment['status'])
            
            if template is None:
                print(f"No email template matched for borrower {borrower.name} due date: {next_payment['due_date']}. Skipping email.")
                continue
            
            try_send_email(borrower.email, template['subject'], template['body'])

    
    print("Payment reminder cron job completed")

if __name__ == "__main__":
    run_payment_reminder_cron()
