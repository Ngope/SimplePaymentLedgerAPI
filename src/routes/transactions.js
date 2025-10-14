const express = require('express');
const ledgerService = require('../services/LedgerService');

const router = express.Router();

/*
 *  
 * Creates a new transaction to transfer funds between accounts.
 * 
 * Request Body:
 * - fromAccountId (string, required): ID of the account to debit from
 * - toAccountId (string, required): ID of the account to credit to  
 * - amount (number, required): Amount to transfer (must be positive)
 * - description (string, optional): Description of the transaction
 * 
 * Response:
 * - 201 Created: Transaction completed successfully
 * - 400 Bad Request: Missing required fields, insufficient funds, or validation errors
 * - 404 Not Found: Source or destination account not found
 * - 500 Internal Server Error: Server error
 */
router.post('/', async (req, res) => {
  try {
    const { fromAccountId, toAccountId, amount, description, shouldFail } = req.body;
    
    if (!fromAccountId || !toAccountId || !amount) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'fromAccountId, toAccountId, and amount are required'
      });
    }

    const transaction = await ledgerService.createTransaction({
      fromAccountId,
      toAccountId,
      amount,
      description,
      shouldFail
    });
    
    res.status(201).json({
      data: transaction,
      message: 'Transaction completed successfully'
    });
  } catch (error) {
    if (error.message.includes('Insufficient funds')) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Insufficient funds for transaction'
      });
    }
    
    if (error.message.includes('not found')) {
      return res.status(404).json({
        error: 'Not Found',
        message: error.message
      });
    }
    
    if (error.message.includes('Validation failed')) {
      return res.status(400).json({
        error: 'Bad Request',
        message: error.message
      });
    }
    
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

module.exports = router;
