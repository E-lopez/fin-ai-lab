import json
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from db_client import Base, get_engine
from sqlalchemy import Column, DateTime, text, DECIMAL, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import sessionmaker
from decimal import Decimal

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
    # Local tracker to keep track of how much is left to pay on each schedule period 
    # as we process multiple payments in this single execution.
    schedule_balances = {}
    
    try:
        # Get all payments ordered by date
        payments = session.query(Payment).order_by(Payment.payment_date).all()
        
        for payment in payments:
            schedules = session.query(LoanSchedule).filter_by(
                loan_id=payment.loan_id
            ).order_by(LoanSchedule.period).all()
            
            # Use Decimal for money to prevent the 0.3299999999871943 error
            remaining_payment = Decimal(str(payment.paid_amount))

            print(f"Processing payment {payment.id} for ${payment.paid_amount}")
            
            for schedule in schedules:
                if remaining_payment <= 0:
                    break
                
                sched_id = str(schedule.id)
                
                # If this is the first time we see this schedule period, initialize its balance
                if sched_id not in schedule_balances:
                    schedule_balances[sched_id] = {
                        'interest': Decimal(str(schedule.scheduled_interest)),
                        'fees': Decimal(str(schedule.scheduled_fees)),
                        'principal': Decimal(str(schedule.scheduled_principal))
                    }
                
                # Get the current "unpaid" balance for this period
                bal = schedule_balances[sched_id]
                
                # If this period is already fully paid by previous payments in the loop, skip it
                if bal['fees'] <= 0 and bal['interest'] <= 0 and bal['principal'] <= 0:
                    continue

                # Allocate in order: fees, interest, principal
                allocated_fees = min(remaining_payment, bal['fees'])
                remaining_payment -= allocated_fees
                bal['fees'] -= allocated_fees
                
                allocated_interest = min(remaining_payment, bal['interest'])
                remaining_payment -= allocated_interest
                bal['interest'] -= allocated_interest
                
                allocated_principal = min(remaining_payment, bal['principal'])
                remaining_payment -= allocated_principal
                bal['principal'] -= allocated_principal

                # Only create allocation if something was allocated
                if allocated_fees > 0 or allocated_interest > 0 or allocated_principal > 0:
                    print(f"  Allocated to Period {schedule.period} - fees: {allocated_fees}, int: {allocated_interest}, ppl: {allocated_principal}")
                    allocations.append({
                        'payment_id': str(payment.id),
                        'schedule_id': sched_id,
                        'allocated_principal': float(allocated_principal),
                        'allocated_interest': float(allocated_interest),
                        'allocated_fees': float(allocated_fees)
                    })
        
        print(f"Processed {len(allocations)} payment allocations")
        return json.dumps(allocations, indent=2)
        
    finally:
        session.close()

if __name__ == '__main__':
    print(process_payment_allocations())
