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


## Authentication System Implementation

### Schemas Created

#### users.py
- UserBase, User, UserCreate, UserRead models
- UserLogin, PasswordChange, Token models
- Fields: username, hashed_password, role, is_active
- Unique constraint on username

### Auth Utilities

#### auth_utils.py
- hash_password() - Hash passwords using bcrypt
- verify_password() - Verify password against hash
- create_access_token() - Generate JWT tokens
- decode_access_token() - Decode and validate JWT tokens
- Uses HS256 algorithm with configurable secret key
- 30-minute token expiration by default

### Auth Dependencies

#### auth.py
- get_current_user() - Extract and validate user from JWT token
- get_current_admin_user() - Verify user has admin role
- HTTPBearer security scheme
- Validates token, checks user exists and is active

### Auth Endpoints

#### routers/auth.py
- GET /auth/health - Public health check endpoint (no auth required)
- POST /auth/register - Create new user with username, password, and role
- POST /auth/login - Authenticate user and return JWT token
- POST /auth/change-password - Change password for authenticated user
- GET /auth/me - Get current authenticated user info

### Protected Routes

All existing endpoints now require authentication:
- All borrowers endpoints
- All loans endpoints
- All loan_schedules endpoints
- All payments endpoints
- All payment_allocations endpoints

Only public endpoint: GET /auth/health

### Database Migration

Created 002_users_table.sql:
- users table with UUID primary key
- username (unique), hashed_password, role, is_active fields
- Indexes on username and role
- Default role: "user"

### Security Features

- Passwords hashed with bcrypt
- JWT token-based authentication
- Bearer token scheme
- Role-based access control ready
- Active user validation
- Token expiration handling
- Secure password change with old password verification

### Dependencies Added

- python-jose[cryptography] - JWT handling
- passlib[bcrypt] - Password hashing
- python-multipart - Form data support


## All Routes Protected

### Protected Routers
All endpoints in the following routers now require authentication:
- borrowers.py - All 8 endpoints protected
- loans.py - All 8 endpoints protected
- loan_schedules.py - All 9 endpoints protected
- payments.py - All 8 endpoints protected
- payment_allocations.py - All 2 endpoints protected
- aggregations.py - All 1 endpoint protected

### Public Endpoints
Only the following endpoints remain public (no authentication required):
- GET /auth/health - Health check endpoint
- POST /auth/register - User registration
- POST /auth/login - User login

### Authentication Flow
1. User registers via POST /auth/register
2. User logs in via POST /auth/login to receive JWT token
3. User includes JWT token in Authorization header as "Bearer {token}"
4. All other endpoints validate token and extract user info
5. Invalid/expired tokens return 401 Unauthorized

### Implementation Details
- Added get_current_user dependency to all protected endpoints
- User object available in all protected route handlers
- Ready for role-based access control (admin vs user)
- Consistent authentication across entire API


## Automatic Database Table Creation

### Startup Event
Added FastAPI startup event to automatically create all database tables if they don't exist:
- users table
- borrowers table
- loans table
- loan_schedule table
- payments table
- payment_allocations table

### Implementation
- create_db_and_tables() function imports all table models
- SQLModel.metadata.create_all() creates missing tables
- Runs automatically on application startup
- Safe to run multiple times (only creates if not exists)

### Benefits
- No manual migration needed for initial setup
- Users table created automatically
- All tables created in correct order with foreign keys
- Development and testing simplified


## Cron Job Implementation - Payment Reminders

### Overview
Implemented automated payment reminder system that sends emails to borrowers with upcoming or overdue payments.

### Files Created

#### functions/email_utils.py
- send_email() - Generic email sending function using SMTP
- Configurable via environment variables
- Supports Gmail and other SMTP servers
- Error handling and logging

#### scripts/cron_jobs.py
Main cron job script with following functions:

**get_loans()**
- No arguments
- Returns list of all active loans from database
- Uses SQLModel session to query Loan table

**get_loan_next_payment(loan_id, session)**
- Arguments: loan_id, database session
- Queries loan, borrower, and schedule tables
- Calculates next payment details:
  - borrower_name
  - email_address
  - due_date
  - amount_due (principal + interest + fees - allocations)
  - days_to_due_date
- Returns None if no upcoming payment found

**compose_email(borrower_name, email_address, due_date, amount_due)**
- Arguments: borrower details and payment info
- Logic based on days overdue:
  - Less than 30 days overdue: "Recordatorio de Pago"
    - Body: "Tu pago por ${amount} vence el {date}"
  - 30+ days overdue: "Recordatorio de Pago Vencido"
    - Body: "Tu pago por ${amount} se encuentra en mora desde {date}. Se activará la cláusula aceleratoria a partir del día de hoy."
- Sends email using email_utils.send_email()
- Returns success/failure status

**run_payment_reminder_cron()**
- Main orchestration function
- Fetches all active loans
- For each loan:
  - Gets next payment details
  - Composes and sends appropriate email
  - Logs results
- Can be run manually or scheduled via cron

### scripts/README.md
- Documentation for cron job usage
- Environment variables required
- Email templates
- Process flow
- Cron scheduling examples

### Design Principles Followed
- Single responsibility: Each function has one clear purpose
- Reusability: Uses existing financial_utils and date_utils functions
- Clean code: No nested loops, clear variable names
- Separation of concerns: Email logic separate from business logic
- Error handling: Graceful failure with logging

### Environment Variables Required
- SMTP_SERVER (default: smtp.gmail.com)
- SMTP_PORT (default: 587)
- SMTP_USERNAME
- SMTP_PASSWORD
- FROM_EMAIL (optional)
- DATABASE_URL
- DATABASE_PASSWORD

### Usage
Manual execution:
```bash
python scripts/cron_jobs.py
```

Scheduled execution (crontab):
```bash
0 9 * * * cd /path/to/backend && python scripts/cron_jobs.py
```

### Features
- Automatic detection of overdue payments
- Different email templates based on overdue status
- Formatted currency amounts
- Spanish language emails
- Comprehensive logging
- Error handling for missing data or email failures


## Cron Job Enhancement - Email Retry Logic

### Update to scripts/cron_jobs.py
Added retry mechanism to compose_email() function:
- max_retries parameter (default: 3)
- Attempts to send email up to 3 times before giving up
- Logs each attempt with attempt number
- Returns True on first successful send
- Returns False only after all retries exhausted
- Improves reliability for transient email sending failures

### Benefits
- Handles temporary network issues
- Reduces false negatives from email sending
- Provides detailed logging for troubleshooting
- Configurable retry count via parameter


## Cron Job Update - Enhanced Payment Information

### Updated get_loan_next_payment()
Now calculates and returns additional information:
- **late_days**: Number of days late from the oldest missed payment (0 if not late)
- **remaining_amount**: Total amount pending across all unpaid schedules
- Iterates through all schedules (not just next one) to calculate totals
- Tracks the oldest overdue payment to determine late days

### Updated compose_email()
Enhanced email formatting with three scenarios:

**1. Late >= 30 days:**
- Subject: "Recordatorio de Pago Vencido"
- Shows: late days count, next payment amount, total remaining amount
- Includes acceleration clause warning

**2. Late 1-29 days:**
- Subject: "Recordatorio de Pago Atrasado"
- Shows: late days count, next payment amount, total remaining amount
- Warning about additional charges

**3. Not late (upcoming payment):**
- Subject: "Recordatorio de Pago"
- Shows: next payment amount, due date, days until due
- Shows total remaining amount if different from next payment
- Friendly reminder

### Benefits
- More accurate late payment tracking
- Better visibility of total debt
- Graduated email severity based on late days
- Clearer information for borrowers
- Improved payment collection communication


## Cron Job Correction - Remaining Amount Definition

### Updated get_loan_next_payment()
Corrected `remaining_amount` calculation:
- **Previous**: Total amount pending across all unpaid schedules
- **Current**: Pending amount to be paid on the next due date only
- Logic: Sums all schedule periods that share the same next due date
- This represents the actual amount due on that specific date
- More accurate for payment reminders focused on immediate obligations


## Code Refactoring - Payment Calculation Reusability

### Created functions/payment_utils.py
New utility module with reusable payment calculation logic:

**get_next_payment_for_loan(loan_id, session)**
- Calculates next payment details for a specific loan
- Returns: due_date, amount_due, remaining_amount, late_days, days_to_due_date
- Handles all schedule periods and allocations
- Determines late days from oldest unpaid schedule
- Calculates remaining amount for next due date only

### Updated routers/borrowers.py
Refactored `get_next_payment()` endpoint:
- Now uses `get_next_payment_for_loan()` utility
- Iterates through all active loans for borrower
- Returns earliest payment across all loans
- Cleaner, more maintainable code
- Consistent with cron job logic

### Updated scripts/cron_jobs.py
Refactored `get_loan_next_payment()` function:
- Now uses `get_next_payment_for_loan()` utility
- Adds borrower information to result
- Eliminates code duplication
- Single source of truth for payment calculations

### Benefits
- DRY principle: Single payment calculation logic
- Easier to maintain and test
- Consistent results across API and cron jobs
- Reduced code complexity
- Follows coding guidelines (reuse util functions)

## 2024-01-XX - Fixed payment calculation discrepancy
- Fixed bug in payment_utils.py where remaining_amount didn't account for acceleration clause (30+ days late)
- Added total_remaining_amount calculation to track all unpaid amounts across all periods
- When late_days >= 30, remaining_amount now shows total loan balance (acceleration clause activated)
- When late_days < 30, remaining_amount shows only next due date amount
- Ensures cron job and API endpoint return identical values for all scenarios

## 2024-01-XX - Refactored email templates to HTML
- Converted compose_reminder_email body from plain text to HTML format
- Added inline CSS styling for better email presentation (font-family, line-height, color)
- Used <strong> tags to emphasize amounts and dates
- Improved readability and professional appearance of payment reminder emails

## 2024-01-XX - Fixed cron job email errors
- Fixed typo in payment_utils.py: changed "payed" to "paid" status
- Fixed due_date returning 0 instead of None for fully paid loans
- Added else clause in compose_reminder_email to return None when no template matches
- Added None check in cron_jobs.py to skip emails when no template is generated
- Prevents UnboundLocalError when subject/body variables are not defined
