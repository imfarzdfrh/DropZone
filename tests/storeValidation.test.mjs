import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeCart,
  validQuantity,
  validDeposit,
  validAccount,
  validTransaction,
} from '../app/utils/storeValidation.ts';

test('cart rejects stale products, malformed storage and invalid quantities', () => {
  assert.deepEqual(normalizeCart({ 1: 2, 2: -1, 3: 1.5, 4: '2', 9: 1, '01': 2 }, [1, 2, 3, 4]), {
    1: 2,
  });
  for (const value of [null, [], 'invalid']) assert.deepEqual(normalizeCart(value, [1]), {});
  for (const value of [NaN, Infinity, 0, -1, 100, 1.5]) assert.equal(validQuantity(value), false);
  assert.equal(validQuantity(99), true);
});
test('deposits must be finite, in range and exact cents', () => {
  for (const amount of [NaN, Infinity, -Infinity, 4.99, 500.01, 5.001])
    assert.equal(validDeposit(amount), false);
  for (const amount of [5, 19.99, 500]) assert.equal(validDeposit(amount), true);
});
test('corrupted account and transaction storage is rejected before rendering', () => {
  assert.equal(validAccount({ walletBalance: '125' }), false);
  assert.equal(validAccount(null), false);
  const user = {
    id: 'a',
    username: 'player',
    email: 'a@b.com',
    avatar: null,
    firstName: '',
    lastName: '',
    phone: '',
    bio: '',
    walletBalance: 125.5,
    createdAt: '2026-10-05',
  };
  assert.equal(validAccount(user), true);
  assert.equal(validAccount({ ...user, walletBalance: Infinity }), false);
  assert.equal(validAccount({ ...user, createdAt: 'bad' }), false);
  const transaction = {
    id: 't',
    type: 'Deposit',
    description: 'Demo',
    amount: 5,
    status: 'Pending',
    date: '2026-10-05',
  };
  assert.equal(validTransaction(transaction), true);
  assert.equal(validTransaction({ ...transaction, type: null }), false);
  assert.equal(validTransaction({ ...transaction, amount: '5' }), false);
});
