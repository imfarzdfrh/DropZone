import { products as skins } from '~/data/catalog';

export function useWishlist() {
  const favorites = useState<number[]>('dropzone-wishlist', () => []);
  const initialized = useState('dropzone-wishlist-initialized', () => false);
  onMounted(() => {
    if (initialized.value) return;
    try {
      const saved: unknown = JSON.parse(localStorage.getItem('dropzone-wishlist-v1') || '[]');
      if (Array.isArray(saved))
        favorites.value = [...new Set(saved.filter((id) => skins.some((skin) => skin.id === id)))];
    } catch {
      favorites.value = [];
    }
    initialized.value = true;
    const scope = effectScope(true);
    scope.run(() =>
      watch(
        favorites,
        (value) => {
          try {
            localStorage.setItem('dropzone-wishlist-v1', JSON.stringify(value));
          } catch {
            /* Storage unavailable. */
          }
        },
        { deep: true, flush: 'sync' },
      ),
    );
    useNuxtApp().vueApp.onUnmount(() => scope.stop());
  });
  function toggleFavorite(id: number) {
    if (!skins.some((skin) => skin.id === id)) return;
    favorites.value = favorites.value.includes(id)
      ? favorites.value.filter((item) => item !== id)
      : [...favorites.value, id];
  }
  return { favorites, toggleFavorite };
}
