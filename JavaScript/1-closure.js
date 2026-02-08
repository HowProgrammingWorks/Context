'use strict';

const withContext = (context) => (accountId) => {
  const { console, rbac, user } = context;
  console.log(`User ${user.name} requesting balance for ${accountId}`);
  if (!rbac.check(user.role, 'read:balance')) {
    console.error('Access denied: insufficient permissions');
    return null;
  }
  const balance = 15420.5;
  console.log('Access granted');
  return balance;
};

// Usage

const rbac = {
  permissions: {
    admin: ['read:balance', 'read:transactions', 'write:transactions'],
    user: ['read:balance'],
    guest: [],
  },
  check: (role, permission) => rbac.permissions[role]?.includes(permission),
};

const context = { console, rbac, user: { name: 'Marcus', role: 'admin' } };
const getBalance = withContext(context);
const balance = getBalance('Account-123');
console.log(`Access granted: balance = $${balance}`);
