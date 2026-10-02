<script setup lang="ts">
import { categories, skins } from '~/data/skins';

const activeCategory = ref('All skins');
const searchQuery = ref('');
const { addToCart } = useCart();
const favorites = ref<number[]>([]);

const filteredSkins = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  return skins.filter((skin) => {
    const matchesCategory =
      activeCategory.value === 'All skins' || skin.category === activeCategory.value;
    const matchesQuery = !query || `${skin.name} ${skin.game}`.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });
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

    <section id="top" class="hero">
      <div class="hero-copy">
        <div class="eyebrow"><span /> YOUR NEXT LOADOUT STARTS HERE</div>
        <h1>Looks that<br />hit <em>different.</em></h1>
        <p class="hero-description">
          The skins you want. The prices you don't expect.<br class="desktop-break" />
          Upgrade your game without the grind.
        </p>
        <div class="hero-actions">
          <NuxtLink class="button-primary" to="/shop">Explore the drop <span>↗</span></NuxtLink>
          <div class="social-proof">
            <div class="avatar-stack"><i>J</i><i>M</i><i>K</i></div>
            <span><strong>2.4k+</strong> players geared up</span>
          </div>
        </div>
        <div class="hero-stats">
          <div>
            <strong>10k<span>+</span></strong
            ><small>SKINS DELIVERED</small>
          </div>
          <div>
            <strong>4.9<span>/5</span></strong
            ><small>PLAYER RATING</small>
          </div>
          <div>
            <strong>&lt; 2<span>m</span></strong
            ><small>AVG. DELIVERY</small>
          </div>
        </div>
      </div>
      <div class="hero-art" role="group" aria-label="Featured gaming gear">
        <div class="hero-art-shade" />
        <img
          class="hero-headset"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Oculus-Rift-CV1-Headset-Front_with_transparent_background.png/960px-Oculus-Rift-CV1-Headset-Front_with_transparent_background.png"
          alt="Black virtual reality gaming headset"
          width="960"
          height="663"
          fetchpriority="high"
        />
        <img
          class="hero-floating hero-controller"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Xbox-360-Controller-Black.png/960px-Xbox-360-Controller-Black.png"
          alt=""
          aria-hidden="true"
          width="960"
          height="726"
          loading="lazy"
        />
        <img
          class="hero-floating hero-keyboard"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Sega-Dreamcast-Keyboard.png/960px-Sega-Dreamcast-Keyboard.png"
          alt=""
          aria-hidden="true"
          width="960"
          height="454"
          loading="lazy"
        />
        <div class="hero-index">COLLECTION 01 <span>—</span> 2025</div>
        <div class="drop-card">
          <span class="drop-card-label">FEATURED DROP</span><strong>NEON<br />AFTERHOURS</strong
          ><span class="drop-card-bottom">LIMITED SERIES <i>↗</i></span>
        </div>
        <div class="hero-art-caption">
          <span class="live-dot" /> LIVE NOW <span class="caption-divider">/</span> 08 ITEMS
        </div>
      </div>
      <div class="hero-bottom-line">
        <span>BUILT FOR YOUR NEXT CLUTCH</span><span>SCROLL TO EXPLORE <b>↓</b></span>
      </div>
    </section>

    <section class="trust-strip" aria-label="Store benefits">
      <div><span class="trust-icon">✳</span><span>INSTANT DELIVERY</span></div>
      <div><span class="trust-icon">◈</span><span>SECURE CHECKOUT</span></div>
      <div><span class="trust-icon">↗</span><span>BEST PRICE. ALWAYS.</span></div>
      <div><span class="trust-icon">⌁</span><span>REAL PLAYER SUPPORT</span></div>
    </section>

    <section id="shop" class="shop-section">
      <div class="shop-heading">
        <div>
          <div class="eyebrow shop-eyebrow"><span /> THE GOOD STUFF</div>
          <h2>Fresh from the <em>drop.</em></h2>
        </div>
        <NuxtLink class="view-all" to="/shop">VIEW ALL SKINS <span>↗</span></NuxtLink>
      </div>
      <div class="shop-toolbar">
        <div class="category-list" aria-label="Filter by category">
          <button
            v-for="category in categories"
            :key="category"
            :class="['category-button', { 'category-active': activeCategory === category }]"
            @click="activeCategory = category"
          >
            {{ category }}
          </button>
        </div>
        <span class="results-count"
          >SHOWING {{ filteredSkins.length.toString().padStart(2, '0') }} ITEMS</span
        >
      </div>

      <div v-if="filteredSkins.length" class="product-grid">
        <article
          v-for="(skin, index) in filteredSkins"
          :key="skin.id"
          class="product-card"
          :style="{ '--card-delay': `${index * 70}ms` }"
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
        No skins match that search. Try another name or category.
      </div>
      <div class="shop-footer">
        <span>MORE HEAT COMING SOON</span><span class="footer-rule" /><span
          >CURATED FOR THE CLIMB <b>↗</b></span
        >
      </div>
    </section>

    <section class="bottom-banner">
      <div class="banner-pattern" />
      <div class="banner-copy">
        <span class="banner-kicker">DON'T JUST PLAY. ARRIVE.</span>
        <h2>Your next main<br />character energy.</h2>
      </div>
      <NuxtLink class="button-dark" to="/shop">Find your skin <span>↗</span></NuxtLink>
      <span class="banner-star">✳</span>
    </section>

    <SiteFooter />
  </main>
</template>
