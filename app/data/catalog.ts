import { demoProducts } from './demo/products';
import { skins } from './skins';
import type { Product } from '~/types/product';

// Keep original IDs so existing carts and wishlists remain valid.
export const products: Product[] = [
  ...demoProducts,
  ...skins.map((skin): Product => ({
    id: skin.id,
    name: skin.name,
    category: 'digital',
    subcategory: 'skins',
    kind: 'digital',
    price: skin.price,
    image: '/images/catalog/game.svg',
    summary: `${skin.game} · ${skin.category} · Sample collectible`,
    platform: skin.game,
    legacyCategory: skin.category,
  })),
];
