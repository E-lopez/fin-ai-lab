-- 001_initial_schema.sql
-- Initial schema for AI Lending Lab Phase 1

-- Borrowers table
CREATE TABLE borrowers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  gender VARCHAR(10) NOT NULL,
  orgName VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Loans table (contract definition)
CREATE TABLE loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  borrower_id UUID REFERENCES borrowers(id) NOT NULL,
  principal DECIMAL(12,2) NOT NULL,
  interest_rate DECIMAL(7,4) NOT NULL, -- e.g., 0.05 for 5%
  amortization_type VARCHAR(30) NOT NULL, -- french, bullet, interest_only
  payment_frequency VARCHAR(20) NOT NULL, -- monthly, bimonthly, quarterly, semiannually, annually
  term_months INT NOT NULL,
  start_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'active', -- late, default, finished
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Expected schedule (immutable after creation)
CREATE TABLE loan_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_id UUID REFERENCES loans(id) ON DELETE CASCADE,
  period INT NOT NULL,
  due_date DATE NOT NULL,
  scheduled_principal DECIMAL(12,2) NOT NULL DEFAULT 0,
  scheduled_interest DECIMAL(12,2) NOT NULL DEFAULT 0,
  scheduled_fees DECIMAL(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (loan_id, period)
);

-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_id UUID REFERENCES loans(id) ON DELETE CASCADE,
  paid_amount DECIMAL(12,2) NOT NULL,
  payment_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment allocations (track how payment allocates to principal, interest, fees for each period)
CREATE TABLE payment_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
  schedule_id UUID REFERENCES loan_schedule(id) ON DELETE CASCADE,
  allocated_principal DECIMAL(12,2) NOT NULL DEFAULT 0,
  allocated_interest DECIMAL(12,2) NOT NULL DEFAULT 0,
  allocated_fees DECIMAL(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_loans_borrower ON loans(borrower_id);
CREATE INDEX idx_schedule_loan ON loan_schedule(loan_id);
CREATE INDEX idx_schedule_due_date ON loan_schedule(due_date);
CREATE INDEX idx_payments_loan ON payments(loan_id);
CREATE INDEX idx_allocations_payment ON payment_allocations(payment_id);
CREATE INDEX idx_allocations_schedule ON payment_allocations(schedule_id);