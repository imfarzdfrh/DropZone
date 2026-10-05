import { validAccount, validTransaction, validDeposit } from '~/utils/storeValidation';

export type WalletStatus = 'Completed' | 'Pending' | 'Failed' | 'Refunded';
export type WalletType = 'Deposit' | 'Purchase' | 'Refund';

export interface AccountUser {
  id: string;
  username: string;
  email: string;
  avatar: string | null;
  firstName: string;
  lastName: string;
  phone: string;
  bio: string;
  walletBalance: number;
  createdAt: string;
}

export interface WalletTransaction {
  id: string;
  type: WalletType;
  description: string;
  amount: number;
  status: WalletStatus;
  date: string;
}

const accountStorageKey = 'dropzone-account-v1';
const avatarDatabaseName = 'dropzone-avatar-store';
const avatarStoreName = 'avatars';

function openAvatarDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(avatarDatabaseName, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(avatarStoreName);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function avatarTransaction<T>(
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const database = await openAvatarDatabase();
  try {
    return await new Promise<T>((resolve, reject) => {
      const transaction = database.transaction(avatarStoreName, mode);
      const request = operation(transaction.objectStore(avatarStoreName));
      transaction.oncomplete = () => resolve(request.result);
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () =>
        reject(transaction.error ?? new Error('Avatar storage transaction aborted.'));
    });
  } finally {
    database.close();
  }
}

async function saveAvatarBlob(id: string, blob: Blob) {
  await avatarTransaction('readwrite', (store) => store.put(blob, id));
}

export async function readAvatarBlob(id: string): Promise<Blob | null> {
  if (!import.meta.client || !('indexedDB' in window)) return null;
  const blob = await avatarTransaction('readonly', (store) => store.get(id));
  return blob instanceof Blob ? blob : null;
}

async function deleteAvatarBlob(id: string) {
  if (!import.meta.client || !('indexedDB' in window)) return;
  await avatarTransaction('readwrite', (store) => store.delete(id));
}

function demoTransactions(): WalletTransaction[] {
  return [
    {
      id: 'demo-refund',
      type: 'Refund',
      description: 'Neon Circuit refund',
      amount: 8.5,
      status: 'Refunded',
      date: '2026-09-18',
    },
    {
      id: 'demo-purchase',
      type: 'Purchase',
      description: 'Arcade Phantom',
      amount: -24,
      status: 'Completed',
      date: '2026-09-12',
    },
  ];
}

export function useAccount() {
  const user = useState<AccountUser | null>('dropzone-account-user', () => null);
  const transactions = useState<WalletTransaction[]>('dropzone-wallet-transactions', () => []);
  const initialized = useState('dropzone-account-initialized', () => false);
  const isAuthenticated = computed(() => user.value !== null);
  const displayName = computed(() => {
    if (!user.value) return '';
    return (
      [user.value.firstName, user.value.lastName].filter(Boolean).join(' ') || user.value.username
    );
  });
  const orderCount = computed(() => 0);
  const { favorites } = useWishlist();
  const wishlistCount = computed(() => favorites.value.length);

  onMounted(() => {
    if (initialized.value) return;
    try {
      const saved = localStorage.getItem(accountStorageKey);
      if (saved) {
        const data = JSON.parse(saved) as {
          user?: AccountUser | null;
          transactions?: WalletTransaction[];
        };
        user.value = validAccount(data.user) ? data.user! : null;
        transactions.value =
          user.value && Array.isArray(data.transactions)
            ? data.transactions.filter(validTransaction)
            : [];
      }
    } catch {
      user.value = null;
      transactions.value = [];
      try {
        localStorage.removeItem(accountStorageKey);
      } catch {
        /* Storage unavailable. */
      }
    }
    initialized.value = true;
    const scope = effectScope(true);
    scope.run(() =>
      watch(
        [user, transactions],
        ([nextUser, nextTransactions]) => {
          try {
            localStorage.setItem(
              accountStorageKey,
              JSON.stringify({ user: nextUser, transactions: nextTransactions }),
            );
          } catch {
            /* Storage may be full or unavailable. */
          }
        },
        { deep: true, flush: 'sync' },
      ),
    );
    useNuxtApp().vueApp.onUnmount(() => scope.stop());
  });

  function startDemoSession(email: string, username?: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const suggestedName = username?.trim() || normalizedEmail.split('@')[0] || 'player';
    const now = new Date().toISOString();
    user.value = {
      id: `demo-${Date.now()}`,
      username: suggestedName
        .replace(/[^a-zA-Z0-9_]/g, '_')
        .slice(0, 20)
        .padEnd(3, '_'),
      email: normalizedEmail,
      avatar: null,
      firstName: username?.trim() ?? '',
      lastName: '',
      phone: '',
      bio: '',
      walletBalance: 125.5,
      createdAt: now,
    };
    transactions.value = demoTransactions();
  }

  function updateProfile(
    profile: Pick<AccountUser, 'username' | 'firstName' | 'lastName' | 'email' | 'phone' | 'bio'>,
  ) {
    if (!user.value) throw new Error('Sign in before editing your profile.');
    if (
      !/^[a-zA-Z0-9_]{3,20}$/.test(profile.username) ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email.trim())
    )
      throw new Error('Enter a valid username and email address.');
    user.value = { ...user.value, ...profile, email: profile.email.trim().toLowerCase() };
  }

  async function uploadAvatar(file: File): Promise<string> {
    const ownerId = user.value?.id;
    if (!ownerId) throw new Error('Sign in before uploading an avatar.');
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      throw new Error('Choose a JPG, PNG, or WebP image.');
    }
    if (file.size > 5 * 1024 * 1024) throw new Error('Image must be 5 MB or smaller.');
    const dimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => {
      const image = new Image();
      const source = URL.createObjectURL(file);
      image.onload = () => {
        resolve({ width: image.naturalWidth, height: image.naturalHeight });
        URL.revokeObjectURL(source);
      };
      image.onerror = () => {
        URL.revokeObjectURL(source);
        reject(new Error('This image could not be opened.'));
      };
      image.src = source;
    });
    if (
      dimensions.width < 64 ||
      dimensions.height < 64 ||
      dimensions.width > 4096 ||
      dimensions.height > 4096
    ) {
      throw new Error('Image dimensions must be between 64 px and 4096 px.');
    }
    const id = `avatar-${crypto.randomUUID()}`;
    await saveAvatarBlob(id, file);
    if (user.value?.id !== ownerId) {
      await deleteAvatarBlob(id);
      throw new Error('Your session changed. Please try again.');
    }
    const oldAvatar = user.value.avatar;
    user.value = { ...user.value, avatar: id };
    if (oldAvatar) await deleteAvatarBlob(oldAvatar).catch(() => {});
    return id;
  }

  async function removeAvatar() {
    const ownerId = user.value?.id;
    const oldAvatar = user.value?.avatar;
    if (oldAvatar) await deleteAvatarBlob(oldAvatar);
    if (user.value?.id === ownerId && user.value && user.value.avatar === oldAvatar)
      user.value = { ...user.value, avatar: null };
  }

  function requestDeposit(amount: number) {
    if (!user.value || !validDeposit(amount)) return false;
    transactions.value = [
      {
        id: `request-${crypto.randomUUID()}`,
        type: 'Deposit',
        description: 'Demo deposit request',
        amount,
        status: 'Pending',
        date: new Date().toISOString(),
      },
      ...transactions.value,
    ];
    return true;
  }

  function signOut() {
    user.value = null;
    transactions.value = [];
  }

  return {
    user,
    transactions,
    isAuthenticated,
    displayName,
    orderCount,
    wishlistCount,
    startDemoSession,
    updateProfile,
    uploadAvatar,
    removeAvatar,
    requestDeposit,
    signOut,
  };
}
