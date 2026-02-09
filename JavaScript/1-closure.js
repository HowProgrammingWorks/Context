'use strict';

const withContext = (context) => {
  const { console, accessPolicy, user } = context;
  const getBalance = (accountId) => {
    console.log(`User ${user.name} requesting balance for ${accountId}`);
    if (!accessPolicy.check(user.role, 'read:balance')) {
      console.error('Access denied: insufficient permissions');
      return null;
    }
    const balance = 15420.5;
    console.log('Access granted');
    return balance;
  };
  return getBalance;
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
const getBalance = withContext(context);
const balance = getBalance('Account-123');
console.log(`Balance = $${balance}`);
