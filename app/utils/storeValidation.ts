export function validQuantity(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0 && value <= 99;
}

export function normalizeCart(value: unknown, productIds: number[]): Record<number, number> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value).filter(
      ([id, quantity]) =>
        productIds.includes(Number(id)) && String(Number(id)) === id && validQuantity(quantity),
    ),
  );
}

export function validDeposit(amount: number): boolean {
  return (
    Number.isFinite(amount) &&
    amount >= 5 &&
    amount <= 500 &&
    Math.abs(amount * 100 - Math.round(amount * 100)) < 1e-8
  );
}

export function validAccount(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false;
  const user = value as Record<string, unknown>;
  return (
    ['id', 'username', 'email', 'firstName', 'lastName', 'phone', 'bio', 'createdAt'].every(
      (key) => typeof user[key] === 'string',
    ) &&
    (user.avatar === null || typeof user.avatar === 'string') &&
    typeof user.walletBalance === 'number' &&
    Number.isFinite(user.walletBalance) &&
    user.walletBalance >= 0 &&
    Number.isFinite(Date.parse(user.createdAt as string))
  );
}

export function validTransaction(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === 'string' &&
    typeof item.description === 'string' &&
    ['Deposit', 'Purchase', 'Refund'].includes(String(item.type)) &&
    ['Completed', 'Pending', 'Failed', 'Refunded'].includes(String(item.status)) &&
    typeof item.amount === 'number' &&
    Number.isFinite(item.amount) &&
    typeof item.date === 'string' &&
    Number.isFinite(Date.parse(item.date))
  );
}
