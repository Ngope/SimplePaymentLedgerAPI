class Account {
  constructor(id, initialBalance = 0) {
    this.id = id;
    this.balance = parseFloat(initialBalance);
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  static validate(accountData) {
    const errors = [];
    
    if (!accountData.id || typeof accountData.id !== 'string') {
      errors.push('Account ID is required and must be a string');
    }
    
    if (accountData.initialBalance !== undefined) {
      const balance = parseFloat(accountData.initialBalance);
      if (isNaN(balance) || balance < 0) {
        errors.push('Initial balance must be a non-negative number');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  hasSufficientFunds(amount) {
    return this.balance >= amount;
  }

  credit(amount) {
    if (amount < 0) {
      throw new Error('Credit amount cannot be negative');
    }
    this.balance += amount;
    this.updatedAt = new Date().toISOString();

    return { success: true }
  }

  debit(amount) {
    if (amount < 0) {
      return { success: true, error: 'Debit amount cannot be negative'};
    }
    if (!this.hasSufficientFunds(amount)) {
      return { success: true, error: 'Insufficient funds'};
    }
    this.balance -= amount;
    this.updatedAt = new Date().toISOString();

    return { success: true };
  }

  getAccountInfo() {
    return {
      id: this.id,
      balance: this.balance,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Account;
