class Transaction {
  constructor(fromAccountId, toAccountId, amount, description = '') {
    this.id = this.generateId();
    this.fromAccountId = fromAccountId;
    this.toAccountId = toAccountId;
    this.amount = parseFloat(amount);
    this.description = description;
    this.status = 'pending';
    this.createdAt = new Date().toISOString();
    this.completedAt = null;
  }

  generateId() { // maybe generate something different
    return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Validate transaction data
  static validate(transactionData) {
    const errors = [];
    
    if (!transactionData.fromAccountId || typeof transactionData.fromAccountId !== 'string') {
      errors.push('From account ID is required and must be a string');
    }
    
    if (!transactionData.toAccountId || typeof transactionData.toAccountId !== 'string') {
      errors.push('To account ID is required and must be a string');
    }
    
    if (transactionData.fromAccountId === transactionData.toAccountId) {
      errors.push('From and to accounts cannot be the same');
    }
    
    const amount = parseFloat(transactionData.amount);
    if (isNaN(amount) || amount <= 0) {
      errors.push('Amount must be a positive number');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // to make txn atmoic
  markCompleted() {
    this.status = 'completed';
    this.completedAt = new Date().toISOString();
  }

  markFailed() {
    this.status = 'failed';
    this.completedAt = new Date().toISOString();
  }

  getTransactionInfo() {
    return {
      id: this.id,
      fromAccountId: this.fromAccountId,
      toAccountId: this.toAccountId,
      amount: this.amount,
      description: this.description,
      status: this.status,
      createdAt: this.createdAt,
      completedAt: this.completedAt
    };
  }
}

module.exports = Transaction;
