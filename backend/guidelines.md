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


# Instructions
- Follow from fin-ai-lab/backend/guidelines.md the Coding Guidelines section for every change you will make.
- You will create the endpoints required for the interaction with my database, as you can see in the files already written by me, for example, db_client(), schemas/borrowers.py, schemas/loans.py
- For that, you will follow these steps:
  - use ../migrations/001_initial_schema.sql to write the sqlmodel schemas under the folder schemas. Name each file with the table name and mind the keys and indexes.
  - Write the endpoints described in the section Endpoints by table in this file.
  - Output the result under routers at its respective file, according to Coding Guidelines section above.
  - write tests for each endpoint
  - document your progress at the file indicated in Coding Guidelines section 

