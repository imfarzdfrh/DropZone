<script setup lang="ts">
import { skins } from '~/data/skins';
const { favorites, toggleFavorite } = useWishlist();
const { addToCart } = useCart();
const savedItems = computed(() => skins.filter((skin) => favorites.value.includes(skin.id)));
useSeoMeta({ title: 'Wishlist | Dropzone', description: 'Your saved Dropzone items.' });
</script>

<template>
  <AccountShell>
    <section class="account-panel">
      <div class="account-section-heading">
        <div>
          <h2>Your wishlist</h2>
          <p>Items saved in this browser.</p>
        </div>
      </div>
      <article v-for="skin in savedItems" :key="skin.id" class="transaction-row">
        <div class="transaction-description">
          <strong>{{ skin.name }}</strong
          ><span>${{ skin.price.toFixed(2) }}</span>
        </div>
        <Button size="sm" @click="addToCart(skin.id)">Add to cart</Button>
        <Button
          size="sm"
          variant="ghost"
          :aria-label="`Remove ${skin.name} from wishlist`"
          @click="toggleFavorite(skin.id)"
          >Remove</Button
        >
      </article>
      <p v-if="!savedItems.length">
        No saved items yet. <NuxtLink to="/shop">Explore the shop ↗</NuxtLink>
      </p>
    </section>
  </AccountShell>
</template>
