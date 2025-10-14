# Simple Payment Ledger API

A simple, in-memory transactional ledger API built with Node.js and Express. This API manages accounts with balances and allows for atomic fund transfers between accounts.

## Features

- **Account Management**: Create and retrieve accounts with balances
- **Atomic Transactions**: Secure fund transfers with rollback on failure
- **Balance Validation**: Prevents negative balances
- **Error Handling**:  error responses

## API Endpoints

### Accounts
- `POST /api/v1/accounts` - Create a new account
- `GET /api/v1/accounts/{accountId}` - Get account details
- `GET /api/v1/accounts` - Get all accounts for debugging

### Transactions
- `POST /api/v1/transactions` - Create a new transaction

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   # or for development with auto-restart:
   npm run dev
   ```

The API will be available at `http://localhost:3000`

## Example Usage

### Create an Account
```bash
curl -X POST http://localhost:3000/api/v1/accounts \
  -H "Content-Type: application/json" \
  -d '{"id": "user123", "initialBalance": 1000}'
```

### Get Account Details
```bash
curl http://localhost:3000/api/v1/accounts/user123
```

### Transfer Funds
```bash
curl -X POST http://localhost:3000/api/v1/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "fromAccountId": "user123",
    "toAccountId": "user456", 
    "amount": 100,
    "description": "Payment for services"
  }'
```

## Architecture

### Core Components
- **LedgerService**: Business logic and in-memory data management
- **Account Model**: Account entity with balance management
- **Transaction Model**: Transaction entity with validation
- **Express Routes**: RESTful API endpoints

### Environment Variables
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)


# System Design:

functional reqs: 
- transaction ledger API for 100k users
- manage accounts with balances
- ability to transfer money between accounts 

non functional reqs: 
- availibility
- scaling
- atomic
    - idempotency by having client send a key
    - key is stored with transaction, if another req is sent with the transactions we know its a duplicate

scaling & edge cases:
- transaction history tracking
- user profile
- notifications
- fraud detection
- multiple failed payments
- db failure 

additional features to add:
- rate limiting (express-rate)
- recovery 
- concurency control (locking account? etc)

Production Considerations

For production deployment:
- Database persistence (PostgreSQL, MongoDB)
- Redis for session management
- Load balancing for horizontal scaling
- etc