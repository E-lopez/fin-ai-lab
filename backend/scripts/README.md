# Backend Scripts

Automated scripts for scheduled tasks and maintenance operations.

## Cron Jobs

### Payment Reminder Cron Job

**File:** `cron_jobs.py`

**Purpose:** Automatically send payment reminder emails to borrowers with upcoming or overdue payments.

**Functions:**

- `get_loans()` - Retrieves all active loans from database
- `get_loan_next_payment(loan_id, session)` - Calculates next payment details for a loan
  - Returns: borrower_name, email_address, due_date, amount_due, days_to_due_date
- `compose_email(borrower_name, email_address, due_date, amount_due)` - Composes and sends email
  - If due date < 30 days overdue: "Recordatorio de Pago"
  - If due date >= 30 days overdue: "Recordatorio de Pago Vencido" with acceleration clause warning
- `run_payment_reminder_cron()` - Main function that orchestrates the entire process

**Usage:**

```bash
# Run manually
python scripts/cron_jobs.py

# Or schedule with cron (daily at 9 AM)
0 9 * * * cd /path/to/backend && python scripts/cron_jobs.py
```

**Environment Variables Required:**

- `SMTP_SERVER` - SMTP server address (default: smtp.gmail.com)
- `SMTP_PORT` - SMTP port (default: 587)
- `SMTP_USERNAME` - SMTP username/email
- `SMTP_PASSWORD` - SMTP password
- `FROM_EMAIL` - Sender email address (optional, defaults to SMTP_USERNAME)
- `DATABASE_URL` - Database connection string
- `DATABASE_PASSWORD` - Database password

**Email Templates:**

1. **Regular Reminder** (due date not yet 30 days overdue):
   - Subject: "Recordatorio de Pago"
   - Body: Payment amount and due date

2. **Overdue Notice** (30+ days overdue):
   - Subject: "Recordatorio de Pago Vencido"
   - Body: Payment amount, overdue date, and acceleration clause warning

**Process Flow:**

1. Fetch all active loans
2. For each loan:
   - Get next payment details (amount, due date, borrower info)
   - Calculate days until/since due date
   - Compose appropriate email based on overdue status
   - Send email to borrower
3. Log results

**Notes:**

- Only processes loans with status "active"
- Skips loans with no upcoming payments
- Handles email sending failures gracefully
- Logs all operations for monitoring
