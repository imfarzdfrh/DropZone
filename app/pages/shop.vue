<script setup lang="ts">
import { categories, skins } from '~/data/skins';

const route = useRoute();
const activeCategory = ref(String(route.query.category ?? 'All skins'));
const searchQuery = ref(String(route.query.search ?? ''));
const sortBy = ref('featured');
const favorites = ref<number[]>([]);
const { addToCart } = useCart();

watch(
  () => route.query.category,
  (category) => {
    activeCategory.value = String(category ?? 'All skins');
  },
);
watch(
  () => route.query.search,
  (search) => {
    searchQuery.value = String(search ?? '');
  },
);

const visibleSkins = computed(() => {
  const matchingSkins = skins.filter((skin) => {
    const matchesCategory =
      activeCategory.value === 'All skins' || skin.category === activeCategory.value;
    const matchesSearch = `${skin.name} ${skin.game}`
      .toLowerCase()
      .includes(searchQuery.value.trim().toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (sortBy.value === 'price-low')
    return matchingSkins.sort((first, second) => first.price - second.price);
  if (sortBy.value === 'price-high')
    return matchingSkins.sort((first, second) => second.price - first.price);
  return matchingSkins;
});

function toggleFavorite(id: number) {
  favorites.value = favorites.value.includes(id)
    ? favorites.value.filter((favoriteId) => favoriteId !== id)
    : [...favorites.value, id];
}
</script>

<template>
  <main class="storefront">
    <SiteHeader />
    <section class="standard-hero shop-page-hero">
      <div>
        <span class="eyebrow"><span /> THE DROPZONE COLLECTION</span>
        <h1>Find your next<br ><em>favorite.</em></h1>
        <p>Curated looks for the moments everyone remembers.</p>
      </div>
      <div class="shop-hero-stamp">
        <span>DROP</span><strong>005</strong><i>NEW SEASON / LIVE NOW</i>
      </div>
    </section>

    <section class="catalog-section">
      <div class="catalog-toolbar">
        <div class="catalog-categories" aria-label="Filter skins by category">
          <button
            v-for="category in categories"
            :key="category"
            :class="['category-button', { 'category-active': activeCategory === category }]"
            @click="activeCategory = category"
          >
            {{ category }}
          </button>
        </div>
        <div class="catalog-controls">
          <label class="catalog-search">
            <span class="sr-only">Search products</span>
            <input v-model="searchQuery" type="search" placeholder="Search the collection" >
            <span aria-hidden="true">⌕</span>
          </label>
          <label class="sort-control">
            <span>SORT</span>
            <select v-model="sortBy" aria-label="Sort products">
              <option value="featured">Featured</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
          </label>
        </div>
      </div>
      <div class="catalog-meta">
        <span>{{ visibleSkins.length }} ITEMS IN THE DROP</span><span>UPDATED WEEKLY <i>✳</i></span>
      </div>

      <div v-if="visibleSkins.length" class="product-grid catalog-grid">
        <article
          v-for="(skin, index) in visibleSkins"
          :key="skin.id"
          class="product-card"
          :style="{ '--card-delay': `${index * 60}ms` }"
        >
          <div
            :class="['product-art', `tone-${skin.tone}`]"
            :style="{
              backgroundImage: `linear-gradient(180deg, rgba(10, 13, 13, .03) 20%, rgba(10, 13, 13, .72) 100%), url('${skin.image}')`,
            }"
          >
            <span class="product-label">{{ skin.label }}</span>
            <button
              :class="['favorite-button', { 'is-favorite': favorites.includes(skin.id) }]"
              :aria-label="
                favorites.includes(skin.id) ? 'Remove from favorites' : 'Add to favorites'
              "
              @click="toggleFavorite(skin.id)"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M20.8 8.8c0 4.1-8.8 10-8.8 10s-8.8-5.9-8.8-10a4.8 4.8 0 0 1 8.8-2.6 4.8 4.8 0 0 1 8.8 2.6Z"
                />
              </svg>
            </button>
            <span class="product-game">{{ skin.game }} <span>•</span> {{ skin.category }}</span>
          </div>
          <div class="product-info">
            <div>
              <h3>{{ skin.name }}</h3>
              <span class="product-condition">DIGITAL ITEM <i>·</i> IN STOCK</span>
            </div>
            <div class="product-buy">
              <div class="price">
                <strong>${{ skin.price.toFixed(2) }}</strong
                ><del v-if="skin.oldPrice">${{ skin.oldPrice.toFixed(2) }}</del>
              </div>
              <button
                class="add-button"
                :aria-label="`Add ${skin.name} to cart`"
                @click="addToCart(skin.id)"
              >
                +
              </button>
            </div>
          </div>
        </article>
      </div>
      <div v-else class="empty-state">
        Nothing in this drop matches that search. Try a different filter.
      </div>
    </section>
    <section class="catalog-signoff">
      <span>GOOD TASTE IS A SKILL.</span
      ><NuxtLink to="/how-it-works">HOW IT WORKS <b>↗</b></NuxtLink>
    </section>
    <SiteFooter />
  </main>
</template>
