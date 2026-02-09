'use strict';

class AccountService {
  constructor(context) {
    this.context = context;
  }

  getBalance(accountId) {
    const { console, accessPolicy, user } = this.context;
    console.log(`User ${user.name} requesting balance for ${accountId}`);
    if (!accessPolicy.check(user.role, 'read:balance')) {
      console.error('Access denied: insufficient permissions');
      return null;
    }
    const balance = 15420.5;
    console.log('Access granted');
    return balance;
  }
}

// Usage

class AccessPolicy {
  constructor() {
    this.permissions = {
      admin: ['read:balance', 'read:transactions', 'write:transactions'],
      user: ['read:balance'],
      guest: [],
    };
  }

  check(role, permission) {
    return this.permissions[role]?.includes(permission);
  }
}

class User {
  constructor(name, role) {
    this.name = name;
    this.role = role;
  }
}

const accessPolicy = new AccessPolicy();
const user = new User('Marcus', 'admin');
const context = { console, accessPolicy, user };

const accountService = new AccountService(context);
const balance = accountService.getBalance('Account-123');
console.log(`Balance = $${balance}`);
