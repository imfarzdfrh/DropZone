export interface StoreCategory {
  id: string;
  label: string;
  icon: string;
  description: string;
  children: { id: string; label: string }[];
}

export const storeCategories: StoreCategory[] = [
  {
    id: 'accounts',
    label: 'Game accounts',
    icon: 'user',
    description: 'Your next adventure starts here.',
    children: [
      { id: 'game-accounts', label: 'Game accounts' },
      { id: 'steam-accounts', label: 'Steam accounts' },
    ],
  },
  {
    id: 'digital',
    label: 'Digital essentials',
    icon: 'wallet',
    description: 'Top up. Unlock. Keep playing.',
    children: [
      { id: 'gift-cards', label: 'Gift cards' },
      { id: 'steam-wallet', label: 'Steam Wallet' },
      { id: 'game-credit', label: 'In-game credit' },
      { id: 'subscriptions', label: 'Subscriptions' },
      { id: 'skins', label: 'Skins & collectibles' },
    ],
  },
  {
    id: 'games',
    label: 'Games',
    icon: 'gamepad',
    description: 'Find your next favourite world.',
    children: [
      { id: 'pc-games', label: 'PC games' },
      { id: 'console-games', label: 'Console games' },
      { id: 'digital-games', label: 'Digital editions' },
      { id: 'disc-games', label: 'Game discs' },
    ],
  },
  {
    id: 'peripherals',
    label: 'Gaming gear',
    icon: 'headphones',
    description: 'Small upgrades. A better setup.',
    children: [
      { id: 'mice', label: 'Mice' },
      { id: 'keyboards', label: 'Keyboards' },
      { id: 'headsets', label: 'Headsets' },
      { id: 'microphones', label: 'Microphones' },
      { id: 'mouse-pads', label: 'Mouse pads' },
      { id: 'controllers', label: 'Controllers' },
    ],
  },
  {
    id: 'computers',
    label: 'PCs & components',
    icon: 'cpu',
    description: 'Power your next build.',
    children: [
      { id: 'desktops', label: 'Gaming desktops' },
      { id: 'laptops', label: 'Gaming laptops' },
      { id: 'components', label: 'PC components' },
    ],
  },
  {
    id: 'monitors',
    label: 'Monitors',
    icon: 'monitor',
    description: 'See every detail.',
    children: [
      { id: 'gaming-monitors', label: 'Gaming monitors' },
      { id: 'monitor-accessories', label: 'Monitor accessories' },
    ],
  },
  {
    id: 'consoles',
    label: 'Consoles',
    icon: 'console',
    description: 'A new way to play.',
    children: [
      { id: 'gaming-consoles', label: 'Gaming consoles' },
      { id: 'console-accessories', label: 'Console accessories' },
    ],
  },
  {
    id: 'furniture',
    label: 'Chairs & desks',
    icon: 'chair',
    description: 'Make room for your best game.',
    children: [
      { id: 'chairs', label: 'Gaming chairs' },
      { id: 'desks', label: 'Gaming desks' },
    ],
  },
];

export const categoryRoute = (category: string, subcategory?: string) => ({
  path: '/shop',
  query: { category, ...(subcategory ? { subcategory } : {}) },
});
export function resolveCategory(category: unknown, subcategory?: unknown) {
  const selected = storeCategories.find((item) => item.id === category);
  return {
    category: selected,
    subcategory: selected?.children.find((item) => item.id === subcategory),
  };
}
