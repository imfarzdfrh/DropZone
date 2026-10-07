import { products as skins } from '~/data/catalog';
import { normalizeCart, validQuantity } from '~/utils/storeValidation';

export function useCart() {
  const items = useState<Record<number, number>>('dropzone-cart', () => ({}));
  const initialized = useState('dropzone-cart-initialized', () => false);
  const ids = skins.map((skin) => skin.id);
  onMounted(() => {
    if (initialized.value) return;
    try {
      items.value = normalizeCart(
        JSON.parse(localStorage.getItem('dropzone-cart-v1') || '{}'),
        ids,
      );
    } catch {
      items.value = {};
    }
    initialized.value = true;
    // Persistence belongs to the app, not the first component consuming this state.
    const scope = effectScope(true);
    scope.run(() =>
      watch(
        items,
        (value) => {
          try {
            localStorage.setItem('dropzone-cart-v1', JSON.stringify(value));
          } catch {
            /* Storage may be unavailable. */
          }
        },
        { deep: true, flush: 'sync' },
      ),
    );
    useNuxtApp().vueApp.onUnmount(() => scope.stop());
  });
  const count = computed(() =>
    Object.values(items.value).reduce((total, quantity) => total + quantity, 0),
  );
  const subtotal = computed(
    () =>
      Math.round(
        Object.entries(items.value).reduce((total, [id, quantity]) => {
          const skin = skins.find((item) => item.id === Number(id));
          return total + (skin?.price ?? 0) * quantity;
        }, 0) * 100,
      ) / 100,
  );
  function setQuantity(id: number, quantity: number) {
    if (!ids.includes(id) || !Number.isInteger(quantity) || quantity < 0 || quantity > 99) return;
    const next = Object.fromEntries(
      Object.entries(items.value).filter(([key]) => Number(key) !== id),
    );
    if (validQuantity(quantity)) next[id] = quantity;
    items.value = next;
  }
  function addToCart(id: number) {
    setQuantity(id, (items.value[id] ?? 0) + 1);
  }
  function removeFromCart(id: number) {
    setQuantity(id, 0);
  }
  return { items, count, subtotal, addToCart, setQuantity, removeFromCart };
}
