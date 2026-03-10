import json
import sys
sys.path.insert(0, 'scripts/migrations')

from payments_table import process_payments
from db_client import Base, get_engine
from sqlalchemy import Column, String, DateTime, text, DECIMAL, Date, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import sessionmaker

class Borrower(Base):
    __tablename__ = 'borrowers'
    id = Column(UUID(as_uuid=True), primary_key=True)
    name = Column(String(100), nullable=False)

class Loan(Base):
    __tablename__ = 'loans'
    id = Column(UUID(as_uuid=True), primary_key=True)
    borrower_id = Column(UUID(as_uuid=True))
    created_at = Column(DateTime(timezone=True))

class Payment(Base):
    __tablename__ = 'payments'
    
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text('gen_random_uuid()'))
    loan_id = Column(UUID(as_uuid=True), ForeignKey('loans.id'), index=True)
    paid_amount = Column(DECIMAL(12, 2), nullable=False)
    payment_date = Column(Date, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=text('NOW()'))

def create_tables():
    engine = get_engine()
    Base.metadata.create_all(engine)
    with engine.connect() as conn:
        conn.execute(text('CREATE INDEX IF NOT EXISTS idx_payments_loan ON payments(loan_id)'))
        conn.commit()
    print("Payments table created")

def upload_payments(payments_data):
    engine = get_engine()
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        for payment in payments_data:
            borrower = session.query(Borrower).filter_by(name=payment['user_name']).first()
            if borrower:
                # Find loan by borrower and match by suffix
                loans = session.query(Loan).filter_by(borrower_id=borrower.id).order_by(Loan.created_at).all()
                
                # Map suffix to loan index
                suffix_map = {'': 0, '_II': 1, '_III': 2, '_IV': 3, '_V': 4, '_feb-26': 1, '_acuerdo': 0}
                loan_index = suffix_map.get(payment.get('loan_suffix', ''), 0)
                
                if loan_index < len(loans):
                    loan = loans[loan_index]
                    session.add(Payment(
                        loan_id=loan.id,
                        paid_amount=payment['paid_amount'],
                        payment_date=payment['payment_date']
                    ))
        session.commit()
        return len(payments_data)
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()

if __name__ == '__main__':
    create_tables()
    data = json.loads(process_payments())
    count = upload_payments(data)
    print(f"\nUploaded {count} payments")
