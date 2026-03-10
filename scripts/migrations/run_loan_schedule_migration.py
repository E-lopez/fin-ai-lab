import json
import sys
sys.path.insert(0, 'scripts/migrations')

from loan_schedule_table import process_loan_schedule
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
    id = Column(UUID(as_uuid=True), primary_key=True)
    borrower_id = Column(UUID(as_uuid=True))
    created_at = Column(DateTime(timezone=True))

class LoanSchedule(Base):
    __tablename__ = 'loan_schedule'
    
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text('gen_random_uuid()'))
    loan_id = Column(UUID(as_uuid=True), ForeignKey('loans.id'), index=True)
    period = Column(Integer, nullable=False)
    due_date = Column(Date, nullable=False, index=True)
    scheduled_principal = Column(DECIMAL(12, 2), nullable=False, server_default=text('0'))
    scheduled_interest = Column(DECIMAL(12, 2), nullable=False, server_default=text('0'))
    scheduled_fees = Column(DECIMAL(12, 2), nullable=False, server_default=text('0'))
    created_at = Column(DateTime(timezone=True), server_default=text('NOW()'))

def create_tables():
    engine = get_engine()
    Base.metadata.create_all(engine)
    with engine.connect() as conn:
        conn.execute(text('CREATE INDEX IF NOT EXISTS idx_schedule_loan ON loan_schedule(loan_id)'))
        conn.execute(text('CREATE INDEX IF NOT EXISTS idx_schedule_due_date ON loan_schedule(due_date)'))
        conn.commit()
    print("Loan schedule table created")

def upload_loan_schedule(schedule_data):
    engine = get_engine()
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        for schedule in schedule_data:
            borrower = session.query(Borrower).filter_by(name=schedule['user_name']).first()
            if borrower:
                # Find loan by borrower and match by start date or other criteria
                # For now, match by order - first loan for base, second for _II, etc.
                loans = session.query(Loan).filter_by(borrower_id=borrower.id).order_by(Loan.created_at).all()
                
                # Map suffix to loan index
                suffix_map = {'': 0, '_II': 1, '_III': 2, '_IV': 3, '_V': 4, '_feb-26': 1, '_acuerdo': 0}
                loan_index = suffix_map.get(schedule.get('loan_suffix', ''), 0)
                
                if loan_index < len(loans):
                    loan = loans[loan_index]
                    session.add(LoanSchedule(
                        loan_id=loan.id,
                        period=schedule['period'],
                        due_date=schedule['due_date'],
                        scheduled_principal=schedule['scheduled_principal'],
                        scheduled_interest=schedule['scheduled_interest'],
                        scheduled_fees=schedule['scheduled_fees']
                    ))
        session.commit()
        return len(schedule_data)
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()

if __name__ == '__main__':
    create_tables()
    data = json.loads(process_loan_schedule())
    count = upload_loan_schedule(data)
    print(f"\nUploaded {count} loan schedule entries")
