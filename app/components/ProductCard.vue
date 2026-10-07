<script setup lang="ts">
import type { Product } from '~/types/product';
defineProps<{ product: Product }>();
const { addToCart } = useCart();
const { favorites, toggleFavorite } = useWishlist();
const added = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;
function add(id: number) {
  addToCart(id);
  added.value = true;
  clearTimeout(timer);
  timer = setTimeout(() => (added.value = false), 1600);
}
onBeforeUnmount(() => clearTimeout(timer));
</script>
<template>
  <Card as="article" class="catalog-product product-card">
    <div class="catalog-product-visual">
      <span class="product-kind"
        ><StoreIcon :name="product.kind === 'digital' ? 'download' : 'package'" :size="14" />{{
          product.kind === 'digital' ? 'Digital' : 'Physical'
        }}</span
      >
      <Button
        variant="ghost"
        size="icon"
        class="catalog-save"
        :aria-label="
          favorites.includes(product.id)
            ? `Remove ${product.name} from favorites`
            : 'Add to favorites'
        "
        :aria-pressed="favorites.includes(product.id)"
        @click="toggleFavorite(product.id)"
        ><StoreIcon name="heart" :size="20"
      /></Button>
      <img
        :src="product.image"
        :alt="`${product.name} — illustrative product image`"
        width="480"
        height="360"
        loading="lazy"
      >
    </div>
    <CardContent class="catalog-product-content">
      <span class="catalog-platform"
        ><bdi>{{ product.platform }}</bdi></span
      >
      <CardTitle>{{ product.name }}</CardTitle>
      <CardDescription>{{ product.summary }}</CardDescription>
      <div class="catalog-product-price">
        <bdi>${{ product.price.toFixed(2) }}</bdi
        ><span>Sample price</span>
      </div>
      <Button
        variant="outline"
        block
        :aria-label="`Add ${product.name} to cart`"
        @click="add(product.id)"
        ><StoreIcon :name="added ? 'check' : 'cart'" :size="18" /><span aria-live="polite">{{
          added ? 'Added to cart' : 'Add to cart'
        }}</span></Button
      >
    </CardContent>
  </Card>
</template>
