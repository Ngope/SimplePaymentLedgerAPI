const Account = require('../models/Account');
const Transaction = require('../models/Transaction');

class LedgerService {
  constructor() {
    this.accounts = new Map();
    this.transactions = new Map();
    this.transactionLog = [];
  }

  createAccount(accountData) {
    const validation = Account.validate(accountData);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    if (this.accounts.has(accountData.id)) {
      throw new Error('Account already exists');
    }

    const account = new Account(accountData.id, accountData.initialBalance || 0);
    this.accounts.set(account.id, account);
    
    return account.getAccountInfo();
  }

  getAccount(accountId) {
    const account = this.accounts.get(accountId);
    if (!account) {
      throw new Error('Account not found');
    }
    return account.getAccountInfo();
  }

  // get all accounts
  getAccounts() {
    let accounts = [];
    for (const account of this.accounts.values()) {
      accounts.push(account.getAccountInfo());
    }
    return accounts;
  }

  async createTransaction(transactionData) {
    const validation = Transaction.validate(transactionData);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    const { fromAccountId, toAccountId, amount, description, shouldFail } = transactionData;
    
    const fromAccount = this.accounts.get(fromAccountId);
    const toAccount = this.accounts.get(toAccountId);
    
    if (!fromAccount) {
      throw new Error(`From account not found: ${fromAccount}`);
    }
    if (!toAccount) {
      throw new Error(`To account not found: ${toAccount}`);
    }

    const transaction = new Transaction(fromAccountId, toAccountId, amount, description);
    this.transactions.set(transaction.id, transaction);
    this.transactionLog.push({
      transactionId: transaction.id,
      fromAccount: fromAccountId,
      toAccount: toAccountId,
      action: 'created',
      timestamp: new Date().toISOString()
    });

    let debitResult;
    let creditResult;

    try {
      debitResult = fromAccount.debit(amount);
      creditResult = toAccount.credit(amount);

      if (shouldFail){
        throw new Error('mimicing if server failure or etc')
      }
      
      transaction.markCompleted();
      
      this.transactionLog.push({
        transactionId: transaction.id,
        fromAccount: fromAccountId,
        toAccount: toAccountId,
        action: 'completed',
        timestamp: new Date().toISOString()
      });

      return transaction.getTransactionInfo();
    } catch (error) {
      if (creditResult?.success){
        toAccount.debit(amount);
      }
      if (debitResult?.success) {
        fromAccount.credit(amount);  // Reverse the debit
      };
      console.log(`Transaction failed... Restored ${amount} to ${fromAccountId}. Balance: ${fromAccount.balance}`);

      transaction.markFailed();
      
      this.transactionLog.push({
        transactionId: transaction.id,
        action: 'failed',
        timestamp: new Date().toISOString(),
        error: error.message
      });

      throw error;
    }
  }

  getTransaction(transactionId) {
    const transaction = this.transactions.get(transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    return transaction.getTransactionInfo();
  }

  // Get all transactions

  // Get account transaction history
}

// Singleton instance
const ledgerService = new LedgerService();

module.exports = ledgerService;
