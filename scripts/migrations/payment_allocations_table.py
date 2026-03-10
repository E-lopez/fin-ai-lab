import json
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from db_client import Base, get_engine
from sqlalchemy import Column, DateTime, text, DECIMAL, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import sessionmaker

class Payment(Base):
    __tablename__ = 'payments'
    id = Column(UUID(as_uuid=True), primary_key=True)
    loan_id = Column(UUID(as_uuid=True))
    paid_amount = Column(DECIMAL(12, 2))
    payment_date = Column(DateTime)

class LoanSchedule(Base):
    __tablename__ = 'loan_schedule'
    id = Column(UUID(as_uuid=True), primary_key=True)
    loan_id = Column(UUID(as_uuid=True))
    period = Column(DECIMAL)
    due_date = Column(DateTime)
    scheduled_principal = Column(DECIMAL(12, 2))
    scheduled_interest = Column(DECIMAL(12, 2))
    scheduled_fees = Column(DECIMAL(12, 2))

def process_payment_allocations():
    """Calculate payment allocations by matching payments to schedules"""
    engine = get_engine()
    Session = sessionmaker(bind=engine)
    session = Session()
    
    allocations = []
    
    try:
        # Get all payments ordered by date
        payments = session.query(Payment).order_by(Payment.payment_date).all()
        
        for payment in payments:
            # Get unpaid schedules for this loan ordered by period
            schedules = session.query(LoanSchedule).filter_by(
                loan_id=payment.loan_id
            ).order_by(LoanSchedule.period).all()
            
            remaining_payment = float(payment.paid_amount)
            
            for schedule in schedules:
                if remaining_payment <= 0:
                    break
                
                # Calculate what's owed for this period
                owed_interest = float(schedule.scheduled_interest)
                owed_fees = float(schedule.scheduled_fees)
                owed_principal = float(schedule.scheduled_principal)
                
                # Allocate in order: fees, interest, principal
                allocated_fees = min(remaining_payment, owed_fees)
                remaining_payment -= allocated_fees
                
                allocated_interest = min(remaining_payment, owed_interest)
                remaining_payment -= allocated_interest
                
                allocated_principal = min(remaining_payment, owed_principal)
                remaining_payment -= allocated_principal
                
                # Only create allocation if something was allocated
                if allocated_fees > 0 or allocated_interest > 0 or allocated_principal > 0:
                    allocations.append({
                        'payment_id': str(payment.id),
                        'schedule_id': str(schedule.id),
                        'allocated_principal': allocated_principal,
                        'allocated_interest': allocated_interest,
                        'allocated_fees': allocated_fees
                    })
        
        print(f"Processed {len(allocations)} payment allocations")
        return json.dumps(allocations, indent=2)
        
    finally:
        session.close()

if __name__ == '__main__':
    print(process_payment_allocations())
