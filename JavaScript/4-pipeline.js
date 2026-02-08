'use strict';

const { randomUUID } = require('node:crypto');

const generateRequestId = () => `req-${Date.now()}-${randomUUID()}`;

const appendTrace = (context, step) => {
  const { trace = [] } = context;
  return [...trace, step];
};

const pipeline =
  (...steps) =>
  (context) => {
    const initial = Promise.resolve(context);
    const next = (chain, mw) => chain.then((ctx) => mw(ctx));
    return steps.reduce(next, initial);
  };

const tracing = (context) => {
  const { console } = context;
  const next = {
    ...context,
    requestId: context.requestId ?? generateRequestId(),
    trace: appendTrace(context, 'tracing'),
  };
  console.log(`[${next.requestId}] trace: ${next.trace.join(' -> ')}`);
  return Promise.resolve(next);
};

const auth = (context) => {
  const { console, headers } = context;
  const user = headers?.user ?? { name: 'anonymous', role: 'guest' };
  console.log(`[${context.requestId}] auth: ${user.name}`);
  return Promise.resolve({ ...context, user });
};

const rbac = (context) => {
  const permissions = {
    admin: ['read:balance', 'read:transactions'],
    user: ['read:balance'],
    guest: [],
  };
  const check = (role, permission) => permissions[role]?.includes(permission);
  return Promise.resolve({ ...context, rbac: { check, permissions } });
};

const getBalance = (context) => {
  const { console, rbac, user, requestId } = context;
  if (!rbac.check(user.role, 'read:balance')) {
    console.error(`[${requestId}] Access denied for ${user.name}`);
    return Promise.resolve({ ...context, status: 403, body: null });
  }
  console.log(`[${requestId}] Balance for ${user.name}`);
  const result = { ...context, status: 200, body: { balance: 15420.5 } };
  return Promise.resolve(result);
};

// Usage

const execute = pipeline(tracing, auth, rbac, getBalance);

const context = {
  console,
  headers: { user: { name: 'Marcus', role: 'admin' } },
};

execute(context).then((ctx) => {
  console.log('Response:', ctx.status, ctx.body);
});
