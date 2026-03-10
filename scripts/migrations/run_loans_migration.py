import json
import sys
sys.path.insert(0, 'scripts/migrations')

from loans_table import process_loans
from db_client import Base, get_engine
from sqlalchemy import Column, String, DateTime, text, DECIMAL, Date, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import sessionmaker

class Borrower(Base):
    __tablename__ = 'borrowers'
    id = Column(UUID(as_uuid=True), primary_key=True)
    name = Column(String(100), nullable=False)

class Loan(Base):
    __tablename__ = 'loans'
    
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text('gen_random_uuid()'))
    borrower_id = Column(UUID(as_uuid=True), ForeignKey('borrowers.id'), nullable=False, index=True)
    principal = Column(DECIMAL(12, 2), nullable=False)
    interest_rate = Column(DECIMAL(7, 4), nullable=False)
    amortization_type = Column(String(30), nullable=False)
    payment_frequency = Column(String(20), nullable=False)
    term_months = Column(Integer, nullable=False)
    start_date = Column(Date, nullable=False)
    status = Column(String(20), server_default=text("'active'"))
    created_at = Column(DateTime(timezone=True), server_default=text('NOW()'))

def create_tables():
    engine = get_engine()
    Base.metadata.create_all(engine)
    with engine.connect() as conn:
        conn.execute(text('CREATE INDEX IF NOT EXISTS idx_loans_borrower ON loans(borrower_id)'))
        conn.commit()
    print("Loans table created")

def upload_loans(loans_data):
    engine = get_engine()
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        for loan in loans_data:
            borrower = session.query(Borrower).filter_by(name=loan['user_name']).first()
            if borrower:
                session.add(Loan(
                    borrower_id=borrower.id,
                    principal=loan['principal'],
                    interest_rate=loan['interest_rate'],
                    amortization_type=loan['amortization_type'],
                    payment_frequency=loan['payment_frequency'],
                    term_months=loan['term_months'],
                    start_date=loan['start_date'],
                    status=loan['status']
                ))
        session.commit()
        return len(loans_data)
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()

if __name__ == '__main__':
    create_tables()
    data = json.loads(process_loans())
    print("Prepared loan data:")
    print(json.dumps(data, indent=2, default=str))
    count = upload_loans(data)
    print(f"\nUploaded {count} loans")
