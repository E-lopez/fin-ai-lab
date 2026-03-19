import sys
import os
sys.path.insert(0, 'scripts/migrations')

from db_client import Base, get_engine
from sqlalchemy import Column, String, DateTime, text, DECIMAL, Date, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import sessionmaker
from utils import parse_date

class Borrower(Base):
    __tablename__ = 'borrowers'
    id = Column(UUID(as_uuid=True), primary_key=True)
    name = Column(String(100), nullable=False)

class Loan(Base):
    __tablename__ = 'loans'
    id = Column(UUID(as_uuid=True), primary_key=True)
    borrower_id = Column(UUID(as_uuid=True))
    principal = Column(DECIMAL(12, 2), nullable=False)
    term_months = Column(Integer, nullable=False)
    interest_rate = Column(DECIMAL(7, 4), nullable=False)

class LoanSchedule(Base):
    __tablename__ = 'loan_schedule'
    id = Column(UUID(as_uuid=True), primary_key=True)
    loan_id = Column(UUID(as_uuid=True))
    period = Column(Integer)
    due_date = Column(Date)
    scheduled_principal = Column(DECIMAL(12, 2))
    scheduled_interest = Column(DECIMAL(12, 2))
    scheduled_fees = Column(DECIMAL(12, 2))

class Payment(Base):
    __tablename__ = 'payments'
    id = Column(UUID(as_uuid=True), primary_key=True)
    loan_id = Column(UUID(as_uuid=True))
    paid_amount = Column(DECIMAL(12, 2))
    payment_date = Column(Date)

def run_quality_checks():
    engine = get_engine()
    Session = sessionmaker(bind=engine)
    session = Session()
    
    passed = 0
    failed = 0
    
    try:
        # Test 1: Diana_Lopez paid_amount in September 2025 equals 347800
        print("\n=== Test 1: Diana_Lopez payment in Sep-25 ===")
        borrower = session.query(Borrower).filter_by(name='Diana_Lopez').first()
        if not borrower:
            print("✗ FAIL: Borrower 'Diana_Lopez' not found in database")
            failed += 1
        elif borrower:
            loan = session.query(Loan).filter_by(borrower_id=borrower.id).first()
            if loan:
                payment_date = parse_date('Sep-25')
                payment = session.query(Payment).filter_by(
                    loan_id=loan.id,
                    payment_date=payment_date
                ).first()
                expected = 347800
                actual = float(payment.paid_amount) if payment else 0
                if abs(actual - expected) < 0.01:
                    print(f"✓ PASS: Expected {expected}, Got {actual}")
                    passed += 1
                else:
                    print(f"✗ FAIL: Expected {expected}, Got {actual}")
                    failed += 1
        
        # Test 2: Angelica_Mogollon principal_payment for Abr-27 is 3344942
        print("\n=== Test 2: Angelica_Mogollon scheduled_principal for Abr-27 ===")
        borrower = session.query(Borrower).filter_by(name='Angelica_Mogollon').first()
        if borrower:
            loan = session.query(Loan).filter_by(borrower_id=borrower.id).first()
            if loan:
                due_date = parse_date('Abr-27', day=10)
                schedule = session.query(LoanSchedule).filter_by(
                    loan_id=loan.id,
                    due_date=due_date
                ).first()
                expected = 3344942
                actual = float(schedule.scheduled_principal) if schedule else 0
                if abs(actual - expected) < 0.01:
                    print(f"✓ PASS: Expected {expected}, Got {actual}")
                    passed += 1
                else:
                    print(f"✗ FAIL: Expected {expected}, Got {actual}")
                    failed += 1
        
        # Test 3: Angelica_Mogollon interest_payment for Ene-28 is 61325
        print("\n=== Test 3: Angelica_Mogollon scheduled_interest for Ene-28 ===")
        borrower = session.query(Borrower).filter_by(name='Angelica_Mogollon').first()
        if borrower:
            loan = session.query(Loan).filter_by(borrower_id=borrower.id).first()
            if loan:
                due_date = parse_date('Ene-28', day=10)
                schedule = session.query(LoanSchedule).filter_by(
                    loan_id=loan.id,
                    due_date=due_date
                ).first()
                print(f"Debug: Found schedule - period={schedule.period}, due_date={schedule.due_date}, scheduled_interest={schedule.scheduled_interest}")
                expected = 61325
                actual = float(schedule.scheduled_interest) if schedule else 0
                if abs(actual - expected) < 0.01:
                    print(f"✓ PASS: Expected {expected}, Got {actual}")
                    passed += 1
                else:
                    print(f"✗ FAIL: Expected {expected}, Got {actual}")
                    failed += 1
        
        # Test 4: Nicolas_Topaga last scheduled_principal is 1000000
        print("\n=== Test 4: Nicolas_Topaga last scheduled_principal ===")
        borrower = session.query(Borrower).filter_by(name='Nicolas_Topaga').first()
        if borrower:
            loan = session.query(Loan).filter_by(borrower_id=borrower.id).first()
            if loan:
                schedule = session.query(LoanSchedule).filter_by(
                    loan_id=loan.id
                ).order_by(LoanSchedule.period.desc()).first()
                expected = 1000000
                actual = float(schedule.scheduled_principal) if schedule else 0
                if abs(actual - expected) < 0.01:
                    print(f"✓ PASS: Expected {expected}, Got {actual}")
                    passed += 1
                else:
                    print(f"✗ FAIL: Expected {expected}, Got {actual}")
                    failed += 1
        
        # Test 5: Gustavo_Bolivar scheduled_fees should be 0
        print("\n=== Test 5: Gustavo_Bolivar scheduled_fees should be 0 ===")
        borrower = session.query(Borrower).filter_by(name='Gustavo_Bolivar').first()
        if borrower:
            loan = session.query(Loan).filter_by(borrower_id=borrower.id).first()
            if loan:
                schedules = session.query(LoanSchedule).filter_by(loan_id=loan.id).all()
                all_zero = all(float(s.scheduled_fees) == 0 for s in schedules)
                if all_zero:
                    print(f"✓ PASS: All scheduled_fees are 0 ({len(schedules)} entries)")
                    passed += 1
                else:
                    non_zero = [float(s.scheduled_fees) for s in schedules if float(s.scheduled_fees) != 0]
                    print(f"✗ FAIL: Found non-zero fees: {non_zero}")
                    failed += 1
        
        # Test 6: Daniela_Bolivar loan principal is 21727500.12
        print("\n=== Test 6: Daniela_Bolivar loan principal ===")
        borrower = session.query(Borrower).filter_by(name='Daniela_Bolivar').first()
        if borrower:
            loan = session.query(Loan).filter_by(borrower_id=borrower.id).first()
            expected = 21727500.12
            actual = float(loan.principal) if loan else 0
            if abs(actual - expected) < 0.01:
                print(f"✓ PASS: Expected {expected}, Got {actual}")
                passed += 1
            else:
                print(f"✗ FAIL: Expected {expected}, Got {actual}")
                failed += 1
        
        # Test 7: Diana_Lopez interest_rate is 0.40 (40%)
        print("\n=== Test 7: Diana_Lopez interest_rate ===")
        borrower = session.query(Borrower).filter_by(name='Diana_Lopez').first()
        if borrower:
            loan = session.query(Loan).filter_by(borrower_id=borrower.id).first()
            expected = 0.20
            actual = float(loan.interest_rate) if loan else 0
            if abs(actual - expected) < 0.01:
                print(f"✓ PASS: Expected {expected}, Got {actual}")
                passed += 1
            else:
                print(f"✗ FAIL: Expected {expected}, Got {actual}")
                failed += 1
        
        # Test 8: Daniela_Alba total payments count
        print("\n=== Test 8: Daniela_Alba payment count ===")
        borrower = session.query(Borrower).filter_by(name='Daniela_Alba').first()
        if borrower:
            loan = session.query(Loan).filter_by(borrower_id=borrower.id).first()
            if loan:
                payment_count = session.query(Payment).filter_by(loan_id=loan.id).count()
                expected = 8
                if payment_count == expected:
                    print(f"✓ PASS: Expected {expected} payments, Got {payment_count}")
                    passed += 1
                else:
                    print(f"✗ FAIL: Expected {expected} payments, Got {payment_count}")
                    failed += 1
        
        # Test 9: Elsy_Leon first payment amount
        print("\n=== Test 9: Elsy_Leon first payment ===")
        borrower = session.query(Borrower).filter_by(name='Elsy_Leon').first()
        if borrower:
            loan = session.query(Loan).filter_by(borrower_id=borrower.id).first()
            print(f"Debug: Found loan for Elsy_Leon: {loan.id}, term_months={loan.term_months}")
            if loan:
                payment = session.query(Payment).filter_by(loan_id=loan.id).order_by(Payment.payment_date).first()
                expected = 190000
                actual = float(payment.paid_amount) if payment else 0
                if abs(actual - expected) < 0.01:
                    print(f"✓ PASS: Expected {expected}, Got {actual}")
                    passed += 1
                else:
                    print(f"✗ FAIL: Expected {expected}, Got {actual}")
                    failed += 1
        
        # Test 10: Nicolas_Topaga loan schedule count
        print("\n=== Test 10: Nicolas_Topaga schedule entry count ===")
        borrower = session.query(Borrower).filter_by(name='Nicolas_Topaga').first()
        if borrower:
            loan = session.query(Loan).filter_by(borrower_id=borrower.id).first()
            if loan:
                schedule_count = session.query(LoanSchedule).filter_by(loan_id=loan.id).count()
                expected = 6
                if schedule_count == expected:
                    print(f"✓ PASS: Expected {expected} schedule entries, Got {schedule_count}")
                    passed += 1
                else:
                    print(f"✗ FAIL: Expected {expected} schedule entries, Got {schedule_count}")
                    failed += 1
        
        # Test 11: Pedro_Mogollon scheduled_interest for Feb-26
        print("\n=== Test 11: Pedro_Mogollon scheduled_interest for Feb-26 ===")
        borrower = session.query(Borrower).filter_by(name='Pedro_Mogollon').first()
        if borrower:
            loan = session.query(Loan).filter_by(borrower_id=borrower.id).first()
            if loan:
                due_date = parse_date('Feb-26', day=10)
                schedule = session.query(LoanSchedule).filter_by(
                    loan_id=loan.id,
                    due_date=due_date
                ).first()
                expected = 146669
                actual = float(schedule.scheduled_interest) if schedule else 0
                if abs(actual - expected) < 0.01:
                    print(f"✓ PASS: Expected {expected}, Got {actual}")
                    passed += 1
                else:
                    print(f"✗ FAIL: Expected {expected}, Got {actual}")
                    failed += 1
        
        # Test 12: Santiago_Guevara payment in Feb-26
        print("\n=== Test 12: Santiago_Guevara payment in Feb-26 ===")
        borrower = session.query(Borrower).filter_by(name='Santiago_Guevara').first()
        if borrower:
            loan = session.query(Loan).filter_by(borrower_id=borrower.id).first()
            if loan:
                payment_date = parse_date('Feb-26')
                payment = session.query(Payment).filter_by(
                    loan_id=loan.id,
                    payment_date=payment_date
                ).first()
                expected = 93334
                actual = float(payment.paid_amount) if payment else 0
                if abs(actual - expected) < 0.01:
                    print(f"✓ PASS: Expected {expected}, Got {actual}")
                    passed += 1
                else:
                    print(f"✗ FAIL: Expected {expected}, Got {actual}")
                    failed += 1
        
        # Test 13: Tatiana_Ariza scheduled_fees should be 100000 (french amortization)
        print("\n=== Test 13: Tatiana_Ariza first scheduled_fees should be 100000 ===")
        borrower = session.query(Borrower).filter_by(name='Tatiana_Ariza').first()
        if borrower:
            loan = session.query(Loan).filter_by(borrower_id=borrower.id).first()
            if loan:
                schedules = session.query(LoanSchedule).filter_by(loan_id=loan.id).all()
                first_100k = float(schedules[0].scheduled_fees) == 100000 if schedules else False
                if first_100k and len(schedules) > 0:
                    print(f"✓ PASS: First scheduled_fees is 100000 ({len(schedules)} entries)")
                    passed += 1
                else:
                    fees = [float(s.scheduled_fees) for s in schedules]
                    print(f"✗ FAIL: Expected all 100000, Got: {fees}")
                    failed += 1
        
        # Test 14: Diana_Cepeda loan term_months
        print("\n=== Test 14: Diana_Cepeda loan term_months ===")
        borrower = session.query(Borrower).filter_by(name='Diana_Cepeda').first()
        if borrower:
            loan = session.query(Loan).filter_by(borrower_id=borrower.id).first()
            expected = 6
            actual = loan.term_months if loan else 0
            if actual == expected:
                print(f"✓ PASS: Expected {expected}, Got {actual}")
                passed += 1
            else:
                print(f"✗ FAIL: Expected {expected}, Got {actual}")
                failed += 1
        
        # Test 15: Total borrowers count
        print("\n=== Test 15: Total borrowers count ===")
        borrower_count = session.query(Borrower).count()
        expected = 16
        if borrower_count == expected:
            print(f"✓ PASS: Expected {expected} borrowers, Got {borrower_count}")
            passed += 1
        else:
            print(f"✗ FAIL: Expected {expected} borrowers, Got {borrower_count}")
            failed += 1
        
        print(f"\n{'='*50}")
        print(f"Results: {passed} passed, {failed} failed")
        print(f"{'='*50}\n")
        
    finally:
        session.close()

if __name__ == '__main__':
    run_quality_checks()
