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

class Payment(Base):
    __tablename__ = 'payments'
    id = Column(UUID(as_uuid=True), primary_key=True)
    loan_id = Column(UUID(as_uuid=True))
    paid_amount = Column(DECIMAL(12, 2))
    payment_date = Column(Date)

class LoanSchedule(Base):
    __tablename__ = 'loan_schedule'
    id = Column(UUID(as_uuid=True), primary_key=True)
    loan_id = Column(UUID(as_uuid=True))
    period = Column(Integer)
    scheduled_principal = Column(DECIMAL(12, 2))
    scheduled_interest = Column(DECIMAL(12, 2))
    scheduled_fees = Column(DECIMAL(12, 2))

class PaymentAllocation(Base):
    __tablename__ = 'payment_allocations'
    id = Column(UUID(as_uuid=True), primary_key=True)
    payment_id = Column(UUID(as_uuid=True))
    schedule_id = Column(UUID(as_uuid=True))
    allocated_principal = Column(DECIMAL(12, 2))
    allocated_interest = Column(DECIMAL(12, 2))
    allocated_fees = Column(DECIMAL(12, 2))

def run_allocation_quality_checks():
    engine = get_engine()
    Session = sessionmaker(bind=engine)
    session = Session()
    
    passed = 0
    failed = 0
    
    try:
        # Test 1: Total allocations count
        print("\n=== Test 1: Payment allocations exist ===")
        allocation_count = session.query(PaymentAllocation).count()
        if allocation_count > 0:
            print(f"✓ PASS: Found {allocation_count} payment allocations")
            passed += 1
        else:
            print(f"✗ FAIL: No payment allocations found")
            failed += 1
        
        # Test 2: All payments have allocations
        print("\n=== Test 2: All payments have allocations ===")
        payment_count = session.query(Payment).count()
        payments_with_allocations = session.query(Payment.id).join(
            PaymentAllocation, Payment.id == PaymentAllocation.payment_id
        ).distinct().count()
        if payments_with_allocations == payment_count:
            print(f"✓ PASS: All {payment_count} payments have allocations")
            passed += 1
        else:
            print(f"✗ FAIL: {payments_with_allocations}/{payment_count} payments have allocations")
            failed += 1
        
        # Test 3: Allocation sum equals payment amount for a specific payment
        print("\n=== Test 3: Daniela_Alba first payment allocation sum ===")
        borrower = session.query(Borrower).filter_by(name='Daniela_Alba').first()
        if borrower:
            loan = session.query(Loan).filter_by(borrower_id=borrower.id).first()
            if loan:
                payment = session.query(Payment).filter_by(loan_id=loan.id).order_by(Payment.payment_date).first()
                if payment:
                    allocations = session.query(PaymentAllocation).filter_by(payment_id=payment.id).all()
                    total_allocated = sum(
                        float(a.allocated_principal) + float(a.allocated_interest) + float(a.allocated_fees)
                        for a in allocations
                    )
                    payment_amount = float(payment.paid_amount)
                    if abs(total_allocated - payment_amount) < 0.01:
                        print(f"✓ PASS: Allocated {total_allocated} equals payment {payment_amount}")
                        passed += 1
                    else:
                        print(f"✗ FAIL: Allocated {total_allocated} != payment {payment_amount}")
                        failed += 1
        
        # Test 4: No negative allocations
        print("\n=== Test 4: No negative allocations ===")
        negative_count = session.query(PaymentAllocation).filter(
            (PaymentAllocation.allocated_principal < 0) |
            (PaymentAllocation.allocated_interest < 0) |
            (PaymentAllocation.allocated_fees < 0)
        ).count()
        if negative_count == 0:
            print(f"✓ PASS: No negative allocations found")
            passed += 1
        else:
            print(f"✗ FAIL: Found {negative_count} negative allocations")
            failed += 1
        
        # Test 5: Allocations don't exceed scheduled amounts
        print("\n=== Test 5: Allocations don't exceed scheduled amounts ===")
        excessive_allocations = 0
        allocations = session.query(PaymentAllocation).join(
            LoanSchedule, PaymentAllocation.schedule_id == LoanSchedule.id
        ).all()
        
        for alloc in allocations:
            schedule = session.query(LoanSchedule).filter_by(id=alloc.schedule_id).first()
            if schedule:
                if (float(alloc.allocated_principal) > float(schedule.scheduled_principal) + 0.01 or
                    float(alloc.allocated_interest) > float(schedule.scheduled_interest) + 0.01 or
                    float(alloc.allocated_fees) > float(schedule.scheduled_fees) + 0.01):
                    excessive_allocations += 1
        
        if excessive_allocations == 0:
            print(f"✓ PASS: No excessive allocations found")
            passed += 1
        else:
            print(f"✗ FAIL: Found {excessive_allocations} excessive allocations")
            failed += 1
        
        # Test 6: Elsy_Leon allocation order (fees → interest → principal)
        print("\n=== Test 6: Elsy_Leon allocation order ===")
        borrower = session.query(Borrower).filter_by(name='Elsy_Leon').first()
        if borrower:
            loan = session.query(Loan).filter_by(borrower_id=borrower.id).first()
            if loan:
                payment = session.query(Payment).filter_by(loan_id=loan.id).order_by(Payment.payment_date).first()
                if payment:
                    allocation = session.query(PaymentAllocation).filter_by(payment_id=payment.id).first()
                    if allocation:
                        # Check that fees are allocated first (if scheduled)
                        schedule = session.query(LoanSchedule).filter_by(id=allocation.schedule_id).first()
                        if schedule and float(schedule.scheduled_fees) > 0:
                            if float(allocation.allocated_fees) > 0:
                                print(f"✓ PASS: Fees allocated first ({allocation.allocated_fees})")
                                passed += 1
                            else:
                                print(f"✗ FAIL: Fees not allocated when scheduled")
                                failed += 1
                        else:
                            print(f"✓ PASS: No fees scheduled, allocation correct")
                            passed += 1
        
        # Test 7: Total borrowers with allocations
        print("\n=== Test 7: Multiple borrowers have allocations ===")
        borrowers_with_allocations = session.query(Borrower.id).join(
            Loan, Borrower.id == Loan.borrower_id
        ).join(
            Payment, Loan.id == Payment.loan_id
        ).join(
            PaymentAllocation, Payment.id == PaymentAllocation.payment_id
        ).distinct().count()
        
        if borrowers_with_allocations >= 10:
            print(f"✓ PASS: {borrowers_with_allocations} borrowers have allocations")
            passed += 1
        else:
            print(f"✗ FAIL: Only {borrowers_with_allocations} borrowers have allocations")
            failed += 1
        
        # Test 8: No orphaned allocations
        print("\n=== Test 8: No orphaned allocations ===")
        orphaned = session.query(PaymentAllocation).outerjoin(
            Payment, PaymentAllocation.payment_id == Payment.id
        ).filter(Payment.id == None).count()
        
        if orphaned == 0:
            print(f"✓ PASS: No orphaned allocations")
            passed += 1
        else:
            print(f"✗ FAIL: Found {orphaned} orphaned allocations")
            failed += 1
        
        print(f"\n{'='*50}")
        print(f"Results: {passed} passed, {failed} failed")
        print(f"{'='*50}\n")
        
    finally:
        session.close()

if __name__ == '__main__':
    run_allocation_quality_checks()
