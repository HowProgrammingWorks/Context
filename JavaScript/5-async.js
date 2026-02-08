'use strict';

const { AsyncLocalStorage } = require('node:async_hooks');
const asyncLocalStorage = new AsyncLocalStorage();

const getBalance = async (accountId) => {
  const context = asyncLocalStorage.getStore();
  if (!context) throw new Error('No context');
  const { console, rbac, user, requestId } = context;
  console.log(`[${requestId}] User ${user.name} balance for ${accountId}`);
  if (!rbac.check(user.role, 'read:balance')) {
    console.error(`[${requestId}] Access denied for ${user.name}`);
    return null;
  }
  console.log(`[${requestId}] Balance for ${user.name}`);
  return Promise.resolve(15420.5);
};

// Usage

const rbac = {
  permissions: {
    admin: ['read:balance'],
    user: ['read:balance'],
    guest: [],
  },
  check: (role, permission) => rbac.permissions[role]?.includes(permission),
};

const context = {
  console,
  rbac,
  user: { name: 'Marcus', role: 'admin' },
  requestId: 'req-001',
};

asyncLocalStorage.run(context, () => {
  console.log('Call: getBalance("ACC-001")');
  getBalance('ACC-002').then((result) => {
    console.log('Result:', result);
  });
});
