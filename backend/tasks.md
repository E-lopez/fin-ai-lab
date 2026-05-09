# Endpoints by table:
- borrowers
Get all borrowers
Get borrower summary: total debt, number of active loans, and overall standing
Calculate borrower next payment info returns {amount, due_date}
Update Borrower PATCH /borrowers/{id} 
Search borrower by name, ID, orgName or email

create borrower
- loans
Create loan related to borrower
Get all loans and filter by borrower_id using a query: /loans?borrower_id=uuid
Get loan by id
Get loan by status
Calculate borrower loan balance
POST /loans/{id}/disburse: A loan is "Created" (Approved), but the start_date and interest usually shouldn't start until the money is actually sent (Disbursed)
- loan_schedule
Create loan-schedule related to loan
Get loan-schedule by loan_id
Get loan-schedule by loanScheduleId
Get scheduled payment late days if no payment for the scheduled period is found
Create late_fee by loan_id in loan_schedule if the payment is late by 3 days for a value of $30000. This should be a new row in the schedule with the same due_date
Get next scheduled amounts: {principal, interest, fees}
Get payment progress: payments scheduled - payments made to the same loan id
- payments
Create payment related to loan, if overpayment or underpyament calculate the allocations in cascading mode: first interest, then fees and lastly principal
Get payments by loan_id and user_id
Get next payment due_date
Get days to payment due_date
Reverse a payment and its allocations
Get payment stats, total collections for the day or month
- payment_allocations
Create payment_allocation by payment_id
Get allocations by payment_id

# Cron Job
Write the contest of the file cron_jobs.py at backend/scripts
- Then you will write the following functions in a file inside the backend/scripts folder, that will call the app data base using the schemas and client from /routers:
  - getLoans
    - no arguments
    - return a list of "active" loans
  - getLoanNextPayment
    - loan_id
    - reads loans table and related tables to calculate: next due date for a loan, amount due, remaining amount to be paid next due date, number of late days from the last missed due date, borrower email, borrower name, days to the next due date
  - composeEmail
    - args: borrower_name<string>, email_address <string>, due_date <string>, amount_due <string>
    - if the late_days is < 30 days ago
      - build an email with the subject "Recordatorio de Pago"
      - set the email body to "Tu pago por {amount_due} vence en {amount_due}"
      - send the email to the borrower email 
    - if the late_days is >= 30 days ago
      - build an email with the subject "Recordatorio de Pago Vencido"
      - set the email body to "Tu pago por {amount_due} se encuentra en mora desde {amount_due}. Se activará la cláusula aceleratoria a partir del día de hoy."
      - send the email to the borrower email 
  - The cron job will do the following:
    - Call getLoans
      - pass each loan_id to getLoanNextPayment
      - pass the result to composeEmail
  