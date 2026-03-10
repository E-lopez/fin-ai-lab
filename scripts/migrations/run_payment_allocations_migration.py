import json
import sys
sys.path.insert(0, 'scripts/migrations')

from payment_allocations_table import process_payment_allocations
from db_client import Base, get_engine
from sqlalchemy import Column, String, DateTime, text, DECIMAL, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import sessionmaker

class PaymentAllocation(Base):
    __tablename__ = 'payment_allocations'
    
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text('gen_random_uuid()'))
    payment_id = Column(UUID(as_uuid=True), ForeignKey('payments.id'), index=True)
    schedule_id = Column(UUID(as_uuid=True), ForeignKey('loan_schedule.id'), index=True)
    allocated_principal = Column(DECIMAL(12, 2), nullable=False, server_default=text('0'))
    allocated_interest = Column(DECIMAL(12, 2), nullable=False, server_default=text('0'))
    allocated_fees = Column(DECIMAL(12, 2), nullable=False, server_default=text('0'))
    created_at = Column(DateTime(timezone=True), server_default=text('NOW()'))

def create_tables():
    engine = get_engine()
    Base.metadata.create_all(engine)
    with engine.connect() as conn:
        conn.execute(text('CREATE INDEX IF NOT EXISTS idx_allocations_payment ON payment_allocations(payment_id)'))
        conn.execute(text('CREATE INDEX IF NOT EXISTS idx_allocations_schedule ON payment_allocations(schedule_id)'))
        conn.commit()
    print("Payment allocations table created")

def upload_payment_allocations(allocations_data):
    engine = get_engine()
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        for allocation in allocations_data:
            session.add(PaymentAllocation(
                payment_id=allocation['payment_id'],
                schedule_id=allocation['schedule_id'],
                allocated_principal=allocation['allocated_principal'],
                allocated_interest=allocation['allocated_interest'],
                allocated_fees=allocation['allocated_fees']
            ))
        session.commit()
        return len(allocations_data)
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()

if __name__ == '__main__':
    create_tables()
    data = json.loads(process_payment_allocations())
    count = upload_payment_allocations(data)
    print(f"\nUploaded {count} payment allocations")
