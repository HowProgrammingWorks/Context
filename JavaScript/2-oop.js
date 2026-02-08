'use strict';

class AccountService {
  constructor(context) {
    this.context = context;
  }

  getBalance(accountId) {
    const { console, rbac, user } = this.context;
    console.log(`User ${user.name} requesting balance for ${accountId}`);
    if (!rbac.check(user.role, 'read:balance')) {
      console.error('Access denied: insufficient permissions');
      return null;
    }
    const balance = 15420.5;
    console.log('Access granted');
    return balance;
  }
}

// Usage

class RBAC {
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

const rbac = new RBAC();
const user = new User('Marcus', 'admin');
const context = { console, rbac, user };

const accountService = new AccountService(context);
const balance = accountService.getBalance('Account-123');
console.log(`Access granted: balance = $${balance}`);
