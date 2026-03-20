# Coding guidelines:
- Follow Single Resposibility principle whenever possible.
- Mathematical calculations, data wrangling operations or formatting operations must go inside the folder functions.
  - Organize the utils functions inside of independent files logically related: date utils, financial math utils, formating utils, etc.
- The endpoints are to be located inside routers/ folder
  - each route file represents a table and all operations for that table must go inside the related file
- keep code clean, avoid nested if or loops.
- Reuse End Points into other endpoints in case they require them, for instance, an endpoint needs to get the borrower_id to get the active loans should use the original get_borrower_by_id
- Reuse util funtions. Do no rewrite the same function for multiple cases.
- use lowercase underscored strings for function and variable names.
- Do not add comments to the code, but output to the (changelog.md) file the code written as you progress. 
  - WRITE YOUR PROGRESS SUCCINTLY but clear, explaining what changes did you apply.
- follow the importing style, do not write to sys.path unless absolutely needed.
- For things like Loan Balance and Days Late, do not just store these as static columns in DB. use @property or computed_field for these so they are calculated on the fly when the API is called, ensuring the data is never "stale."


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
<!-- Set the loan status to 'late' if the borrower is late by more than 3 days, 'default' if the user is late for more than 30 days, 'finished' if the balance - borrower payments is 0 OR < 0 -->
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

# Instructions
- Follow from fin-ai-lab/backend/guidelines.md the Coding Guidelines section for every change you will make.
- You will create the endpoints required for the interaction with my database, as you can see in the files already written by me, for example, db_client(), schemas/borrowers.py, schemas/loans.py
- For that, you will follow these steps:
  - use ../migrations/001_initial_schema.sql to write the sqlmodel schemas under the folder schemas. Name each file with the table name and mind the keys and indexes.
  - Write the endpoints described in the section Endpoints by table in this file.
  - Output the result under routers at its respective file, according to Coding Guidelines section above.
  - write tests for each endpoint
  - document your progress at the file indicated in Coding Guidelines section 










= POST

Create loan by borrower_id
Create loan_schedule by loan_id
Create payment
Create payment_allocation by payment_id



= PUT
Update loan status by loan_id 