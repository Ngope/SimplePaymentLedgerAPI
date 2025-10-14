const express = require('express');
const ledgerService = require('../services/LedgerService');

const router = express.Router();

/*
 * 
 * Creates a new account with an initial balance.
 * Request Body:
 * - id (string, required): Unique identifier for the account
 * - initialBalance (number, optional): Starting balance (defaults to 0)
 * 
 * Response:
 * - 201 Created: Account created successfully
 * - 400 Bad Request: Missing account ID or validation errors
 * - 409 Conflict: Account with this ID already exists
 * - 500 Internal Server Error: Server error
 */
router.post('/', (req, res) => {
  try {
    const { id, initialBalance } = req.body;
    
    if (!id) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Account ID is required'
      });
    }

    const account = ledgerService.createAccount({ id, initialBalance });
    
    res.status(201).json({
      data: account,
      message: 'Account created successfully'
    });
  } catch (error) {
    if (error.message === 'Account already exists') {
      return res.status(409).json({
        error: 'Conflict',
        message: error.message
      });
    }
    
    res.status(400).json({
      error: 'Bad Request',
      message: error.message
    });
  }
});

/**
 * 
 * Retrieves the details of a specific account
 * 
 * Path Parameters:
 * - accountId (string, required): Unique identifier of the account
 * 
 * Response:
 * - 200 OK: Account details retrieved successfully
 * - 404 Not Found: Account with specified ID does not exist
 * - 500 Internal Server Error: Server error
 */
router.get('/:accountId', (req, res) => {
  try {
    const { accountId } = req.params;
    const account = ledgerService.getAccount(accountId);
    
    res.status(200).json({
      data: account
    });
  } catch (error) {
    if (error.message === 'Account not found') {
      return res.status(404).json({
        error: 'Not Found',
        message: error.message
      });
    }
    
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

/**
 * 
 * Retrieves all accounts
 * 
 * 
 * Response:
 * - 200 OK
 * - 404 Not Found: no accounts exists
 * - 500 Internal Server Error: Server error
 */
router.get('/', (req, res) => {
  try {
    const accounts = ledgerService.getAccounts();
    
    res.status(200).json({
      success: true,
      data: accounts
    });
  } catch (error) {
    if (error.message === 'Accounts not found') {
      return res.status(404).json({
        error: 'Not Found',
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
