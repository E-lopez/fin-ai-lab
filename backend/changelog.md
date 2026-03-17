# Changelog

## Schemas Created

### Loans.py
- Created LoanBase, Loan, LoanCreate, and LoanRead models
- Mapped to loans table with all fields from SQL schema
- Includes foreign key to borrowers table
- Fields: borrower_id, principal, interest_rate, amortization_type, payment_frequency, term_months, start_date, status

### loan_schedule.py
- Created LoanScheduleBase, LoanSchedule, LoanScheduleCreate, and LoanScheduleRead models
- Mapped to loan_schedule table
- Includes foreign key to loans table
- Fields: loan_id, period, due_date, scheduled_principal, scheduled_interest, scheduled_fees
- Unique constraint on (loan_id, period)

### payments.py
- Created PaymentBase, Payment, PaymentCreate, and PaymentRead models
- Mapped to payments table
- Includes foreign key to loans table
- Fields: loan_id, paid_amount, payment_date

### payment_allocations.py
- Created PaymentAllocationBase, PaymentAllocation, PaymentAllocationCreate, and PaymentAllocationRead models
- Mapped to payment_allocations table
- Includes foreign keys to payments and loan_schedule tables
- Fields: payment_id, schedule_id, allocated_principal, allocated_interest, allocated_fees

## Endpoints Created

### borrowers.py
- GET /borrowers/ - Get all borrowers with pagination (offset, limit)
- GET /borrowers/{borrower_id} - Get borrower by ID
- POST /borrowers/ - Create new borrower

### loans.py
- GET /loans/borrower/{borrower_id}/active - Get all active loans for a borrower
- GET /loans/borrower/{borrower_id}/balance/{loan_id} - Calculate loan balance (remaining principal, interest, fees, and total)
- GET /loans/borrower/{borrower_id}/next-payment/{loan_id} - Calculate next payment amount and due date

## Utility Functions Created

### financial_utils.py
- calculate_remaining_balance() - Calculate remaining principal
- calculate_remaining_interest() - Calculate remaining interest
- calculate_remaining_fees() - Calculate remaining fees
- calculate_total_balance() - Calculate total balance from components

## Code Quality
- All functions follow lowercase_underscore naming convention
- Single responsibility principle applied
- Financial calculations isolated in utility functions
- Endpoints reuse get_borrower_by_id logic for validation
- No nested loops or complex conditionals
- Clean separation between routers, schemas, and utilities


## Additional Endpoints Implemented

### borrowers.py (Updated)
- GET /borrowers/search - Search borrowers by name, email, or orgName
- GET /borrowers/{borrower_id}/summary - Get borrower summary with total debt, number of active loans, and overall standing
- GET /borrowers/{borrower_id}/next-payment - Calculate borrower's next payment info (amount and due_date)
- PATCH /borrowers/{borrower_id} - Update borrower information

### loans.py (Updated)
- GET /loans/ - Get all loans with optional borrower_id filter
- GET /loans/status/{status} - Get loans by status
- GET /loans/{loan_id} - Get loan by ID
- GET /loans/{loan_id}/balance - Calculate loan balance
- POST /loans/ - Create loan related to borrower
- POST /loans/{loan_id}/disburse - Disburse loan and set start_date

### loan_schedules.py (Complete Implementation)
- GET /loan_schedules/loan/{loan_id} - Get loan schedule by loan_id
- GET /loan_schedules/{schedule_id} - Get loan schedule by ID
- GET /loan_schedules/loan/{loan_id}/late-days - Get scheduled payment late days
- GET /loan_schedules/loan/{loan_id}/next-scheduled-amounts - Get next scheduled amounts (principal, interest, fees)
- GET /loan_schedules/loan/{loan_id}/payment-progress - Get payment progress (scheduled vs paid)
- POST /loan_schedules/ - Create loan schedule
- POST /loan_schedules/loan/{loan_id}/late-fee - Create late fee ($30,000) after 3 days late

### payments.py (Complete Implementation)
- GET /payments/loan/{loan_id} - Get payments by loan_id
- GET /payments/loan/{loan_id}/next-due-date - Get next payment due date
- GET /payments/loan/{loan_id}/days-to-due-date - Get days to payment due date
- GET /payments/stats/daily - Get daily payment stats (total collections)
- GET /payments/stats/monthly - Get monthly payment stats by year and month
- POST /payments/ - Create payment with cascading allocation (interest → fees → principal)
- DELETE /payments/{payment_id} - Reverse payment and its allocations

### payment_allocations.py (Complete Implementation)
- GET /payment_allocations/payment/{payment_id} - Get allocations by payment_id
- POST /payment_allocations/ - Create payment allocation

## Utility Functions Added

### date_utils.py
- calculate_days_between() - Calculate days between two dates
- calculate_days_late() - Calculate days late from due date
- calculate_days_until() - Calculate days until target date

## Key Features Implemented

### Payment Allocation Logic
- Cascading allocation: interest first, then fees, then principal
- Handles overpayment and underpayment automatically
- Allocates across multiple schedule periods in order

### Late Fee System
- Automatically creates late fee schedule entry
- $30,000 fee after 3 days late
- Maintains same due_date as original schedule

### Financial Calculations
- All balance calculations use utility functions
- Reusable across endpoints
- Deterministic and consistent

## Code Quality Maintained
- Single responsibility principle throughout
- No nested loops or complex conditionals
- Lowercase underscore naming convention
- Financial calculations isolated in utils
- Date operations isolated in date_utils
- Clean separation of concerns
- Endpoint reuse where applicable


## Tests Implementation

### Test Structure
- Created tests/ directory with comprehensive test coverage
- All tests use in-memory SQLite database for isolation
- FastAPI TestClient for endpoint testing
- Pytest fixtures for session and client management

### Test Files Created

#### test_borrowers.py
- test_create_borrower - Create new borrower
- test_read_borrowers - Get all borrowers with pagination
- test_get_borrower_by_id - Get borrower by ID
- test_get_borrower_by_id_not_found - Handle 404 errors
- test_search_borrowers - Search by name, email, orgName
- test_update_borrower - PATCH borrower data

#### test_loans.py
- test_create_loan - Create loan for borrower
- test_get_loans - Get loans with borrower_id filter
- test_get_loan_by_id - Get loan by ID
- test_get_loans_by_status - Filter loans by status
- test_disburse_loan - Disburse loan and update start_date

#### test_loan_schedules.py
- test_create_loan_schedule - Create schedule entry
- test_get_loan_schedule_by_loan_id - Get all schedules for loan
- test_get_loan_schedule_by_id - Get schedule by ID
- test_get_next_scheduled_amounts - Get next payment breakdown

#### test_payments.py
- test_create_payment - Create payment with auto-allocation
- test_get_payments_by_loan_id - Get all payments for loan
- test_reverse_payment - Delete payment and allocations
- test_get_daily_payment_stats - Daily collection stats
- test_get_monthly_payment_stats - Monthly collection stats

#### test_payment_allocations.py
- test_create_payment_allocation - Create allocation manually
- test_get_allocations_by_payment_id - Get all allocations for payment

#### test_utils.py
- test_calculate_remaining_balance - Financial calculation
- test_calculate_remaining_interest - Interest calculation
- test_calculate_remaining_fees - Fee calculation
- test_calculate_total_balance - Total balance calculation
- test_calculate_days_between - Date difference
- test_calculate_days_late - Late days calculation
- test_calculate_days_until - Days until target date

### Test Runner
- run_tests.py - Single executable to run all tests
- Usage: python run_tests.py or ./run_tests.py
- Provides colored output and summary
- Returns exit code for CI/CD integration

### Test Configuration
- conftest.py - Pytest fixtures and configuration
- In-memory database for fast, isolated tests
- Automatic dependency override for test client
- Clean state for each test run
