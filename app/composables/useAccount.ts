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

async function saveAvatarBlob(id: string, blob: Blob) {
  const database = await openAvatarDatabase();
  await new Promise<void>((resolve, reject) => {
    const request = database
      .transaction(avatarStoreName, 'readwrite')
      .objectStore(avatarStoreName)
      .put(blob, id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
  database.close();
}

export async function readAvatarBlob(id: string): Promise<Blob | null> {
  if (!import.meta.client || !('indexedDB' in window)) return null;
  const database = await openAvatarDatabase();
  const blob = await new Promise<Blob | null>((resolve, reject) => {
    const request = database.transaction(avatarStoreName).objectStore(avatarStoreName).get(id);
    request.onsuccess = () => resolve((request.result as Blob | undefined) ?? null);
    request.onerror = () => reject(request.error);
  });
  database.close();
  return blob;
}

async function deleteAvatarBlob(id: string) {
  if (!import.meta.client || !('indexedDB' in window)) return;
  const database = await openAvatarDatabase();
  await new Promise<void>((resolve, reject) => {
    const request = database
      .transaction(avatarStoreName, 'readwrite')
      .objectStore(avatarStoreName)
      .delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
  database.close();
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
  const orderCount = computed(() => 3);
  const wishlistCount = computed(() => 4);

  onMounted(() => {
    if (initialized.value) return;
    try {
      const saved = localStorage.getItem(accountStorageKey);
      if (saved) {
        const data = JSON.parse(saved) as {
          user?: AccountUser | null;
          transactions?: WalletTransaction[];
        };
        user.value = data.user ?? null;
        transactions.value = data.transactions ?? [];
      }
    } catch {
      localStorage.removeItem(accountStorageKey);
    }
    initialized.value = true;
    watch(
      [user, transactions],
      ([nextUser, nextTransactions]) => {
        localStorage.setItem(
          accountStorageKey,
          JSON.stringify({ user: nextUser, transactions: nextTransactions }),
        );
      },
      { deep: true },
    );
  });

  function startDemoSession(email: string, username?: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const suggestedName = username?.trim() || normalizedEmail.split('@')[0] || 'player';
    const now = new Date().toISOString();
    user.value = {
      id: `demo-${Date.now()}`,
      username: suggestedName.replace(/\s+/g, '_'),
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
    if (!user.value) return;
    user.value = { ...user.value, ...profile };
  }

  async function uploadAvatar(file: File): Promise<string> {
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
    const oldAvatar = user.value?.avatar;
    if (oldAvatar) await deleteAvatarBlob(oldAvatar);
    if (user.value) user.value = { ...user.value, avatar: id };
    return id;
  }

  async function removeAvatar() {
    const oldAvatar = user.value?.avatar;
    if (oldAvatar) await deleteAvatarBlob(oldAvatar);
    if (user.value) user.value = { ...user.value, avatar: null };
  }

  function requestDeposit(amount: number) {
    if (!user.value || amount < 5 || amount > 500) return false;
    transactions.value = [
      {
        id: `request-${Date.now()}`,
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
