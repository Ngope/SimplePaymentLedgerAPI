**me**: just for /routes/transactions give me a comment block of the user should expect from Transaction endpoint

**AI** :
Purpose: Creates a new transaction to transfer funds between accounts
Request Details:
fromAccountId (required): Source account ID to debit from
toAccountId (required): Destination account ID to credit to
amount (required): Transfer amount (must be positive)
description (optional): Transaction description
Response Codes:
201 Created: Transaction completed successfully
400 Bad Request: Missing fields, insufficient funds, or validation errors
404 Not Found: Source or destination account not found
500 Internal Server Error: Server error


**me**: do the same comment blocks for accounts endpoints

**AI**:
Purpose: Creates a new account with an optional initial balance
Request Details:
id (required): Unique identifier for the account
initialBalance (optional): Starting balance (defaults to 0)
Response Codes:
201 Created: Account created successfully
400 Bad Request: Missing account ID or validation errors
409 Conflict: Account with this ID already exists
500 Internal Server Error: Server error

Purpose: Retrieves the details of a specific account by its ID
Path Parameters:
accountId (required): Unique identifier of the account
Response Codes:
200 OK: Account details retrieved successfully
404 Not Found: Account with specified ID does not exist
500 Internal Server Error: Server error

**me**: Create a README for this project. Focus on how to run the project locally, a small overview of the project, and feature/endpoints 

output is in README