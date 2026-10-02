import { skins } from '~/data/skins';

export function useCart() {
  const items = useState<Record<number, number>>('dropzone-cart', () => ({}));

  const count = computed(() =>
    Object.values(items.value).reduce((total, quantity) => total + quantity, 0),
  );

  const subtotal = computed(() =>
    Object.entries(items.value).reduce((total, [id, quantity]) => {
      const skin = skins.find((item) => item.id === Number(id));
      return total + (skin?.price ?? 0) * quantity;
    }, 0),
  );

  function addToCart(id: number) {
    items.value = { ...items.value, [id]: (items.value[id] ?? 0) + 1 };
  }

  function setQuantity(id: number, quantity: number) {
    const nextItems = Object.fromEntries(
      Object.entries(items.value).filter(([itemId]) => Number(itemId) !== id),
    ) as Record<number, number>;
    if (quantity > 0) nextItems[id] = quantity;
    items.value = nextItems;
  }

  function removeFromCart(id: number) {
    setQuantity(id, 0);
  }

  return { items, count, subtotal, addToCart, setQuantity, removeFromCart };
}
