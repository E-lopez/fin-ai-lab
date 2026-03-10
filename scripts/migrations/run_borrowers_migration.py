import json
import sys
sys.path.insert(0, 'scripts/migrations')

from borrowers_table import process_borrowers
from db_client import Base, get_engine
from sqlalchemy import Column, String, DateTime, text
from sqlalchemy.dialects.postgresql import UUID

class Borrower(Base):
    __tablename__ = 'borrowers'
    
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text('gen_random_uuid()'))
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False, unique=True)
    gender = Column(String(10), nullable=False)
    orgName = Column(String(100))
    created_at = Column(DateTime(timezone=True), server_default=text('NOW()'))

def create_tables():
    engine = get_engine()
    Base.metadata.create_all(engine)
    print("Borrowers table created")

def upload_borrowers(data):
    engine = get_engine()
    from sqlalchemy.orm import sessionmaker
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        for item in data:
            session.add(Borrower(**item))
        session.commit()
        return len(data)
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()

if __name__ == '__main__':
    create_tables()
    data = json.loads(process_borrowers())
    count = upload_borrowers(data)
    print(f"Uploaded {count} borrowers")
