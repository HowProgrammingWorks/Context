'use strict';

const createContext = (base, data = {}) => Object.freeze({ ...base, ...data });

const withUser = (base, user) => createContext(base, { user });

const withRequest = (base, requestId) => createContext(base, { requestId });

const getBalance = (context, accountId) => {
  const { console, rbac, user, requestId } = context;
  if (!user) {
    console.error('No user in context');
    return null;
  }
  console.log(`Request ID: ${requestId}`);
  console.log(`User ${user.name} requesting balance for account ${accountId}`);
  if (!rbac.check(user.role, 'read:balance')) {
    console.error(`Access denied for ${user.name}`);
    return null;
  }
  return 15420.5;
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

const context1 = createContext({ console, rbac });
console.log('Context 1:', getBalance(context1, 'ACC-002'), '\n');

const context2 = withUser(context1, { name: 'Marcus', role: 'admin' });
console.log('Context 2:', getBalance(context2, 'ACC-002'), '\n');

const context3 = withRequest(context2, 'req-' + Date.now());
console.log('Context 3:', getBalance(context3, 'ACC-002'), '\n');
