'use strict';

const createAccountService = (context) => {
  const { console, accessPolicy, user } = context;

  const getBalance = (accountId) => {
    console.log(`User ${user.name} requesting balance for ${accountId}`);
    if (!accessPolicy.check(user.role, 'read:balance')) {
      console.error('Access denied: insufficient permissions');
      return null;
    }
    return 15420.5;
  };

  const getTransactions = (accountId) => {
    if (!accessPolicy.check(user.role, 'read:transactions')) {
      console.error('Access denied: insufficient permissions');
      return null;
    }
    console.log(`User ${user.name} reading transactions for ${accountId}`);
    return ['TR-123', 'TR-456', 'TR-789'];
  };

  return { getBalance, getTransactions };
};

// Usage

const accessPolicy = {
  permissions: {
    admin: ['read:balance', 'read:transactions', 'write:transactions'],
    user: ['read:balance'],
    guest: [],
  },
  check: (role, permission) =>
    accessPolicy.permissions[role]?.includes(permission),
};

const context = {
  console,
  accessPolicy,
  user: { name: 'Marcus', role: 'admin' },
};

const accountService = createAccountService(context);

console.log('Balance:', accountService.getBalance('ACC-001'));
console.log('Transactions:', accountService.getTransactions('ACC-001'));
