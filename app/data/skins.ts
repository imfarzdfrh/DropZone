export interface Skin {
  id: number;
  name: string;
  game: string;
  category: string;
  price: number;
  oldPrice: number | null;
  label: string;
  image: string;
  tone: string;
}

export const categories = ['All skins', 'Rifles', 'Knives', 'Pistols', 'Gloves'];

export const skins: Skin[] = [
  {
    id: 1,
    name: 'Vandal / Prism Shift',
    game: 'VALORANT',
    category: 'Rifles',
    price: 24.9,
    oldPrice: 32,
    label: 'HOT DROP',
    image:
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=85',
    tone: 'violet',
  },
  {
    id: 2,
    name: 'Phantom / Afterglow',
    game: 'VALORANT',
    category: 'Rifles',
    price: 18.5,
    oldPrice: null,
    label: 'NEW',
    image:
      'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=1000&q=85',
    tone: 'green',
  },
  {
    id: 3,
    name: 'Butterfly / Carbon',
    game: 'CS2',
    category: 'Knives',
    price: 42,
    oldPrice: null,
    label: 'RARE',
    image:
      'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=1000&q=85',
    tone: 'amber',
  },
  {
    id: 4,
    name: 'Ghost / Cold Snap',
    game: 'VALORANT',
    category: 'Pistols',
    price: 12.75,
    oldPrice: 16,
    label: '−20%',
    image:
      'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=1000&q=85',
    tone: 'blue',
  },
  {
    id: 5,
    name: 'Wraps / Static Bloom',
    game: 'CS2',
    category: 'Gloves',
    price: 31.5,
    oldPrice: null,
    label: 'JUST IN',
    image:
      'https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&w=1000&q=85',
    tone: 'green',
  },
];
