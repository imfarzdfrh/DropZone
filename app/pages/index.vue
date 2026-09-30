<script setup lang="ts">
const activeCategory = ref('All skins');
const searchQuery = ref('');
const cartCount = ref(0);
const favorites = ref<number[]>([]);

const categories = ['All skins', 'Rifles', 'Knives', 'Pistols', 'Gloves'];

const skins = [
  {
    id: 1,
    name: 'Vandal / Prism Shift',
    game: 'VALORANT',
    category: 'Rifles',
    price: 24.9,
    oldPrice: 32.0,
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
    price: 42.0,
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
    oldPrice: 16.0,
    label: '−20%',
    image:
      'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=1000&q=85',
    tone: 'blue',
  },
];

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
    <div class="announcement">
      <span class="announcement-dot" />
      <span>THE DROP IS LIVE</span>
      <span class="announcement-divider">/</span>
      <span>Get 10% off your first loadout with <strong>FIRSTDROP</strong></span>
      <span class="announcement-arrow">↗</span>
    </div>

    <header class="site-header">
      <a class="wordmark" href="#top" aria-label="Dropzone home">
        <span class="wordmark-mark">D</span>
        <span>DROPZONE<span class="wordmark-period">.</span></span>
      </a>
      <nav class="desktop-nav" aria-label="Main navigation">
        <a class="nav-link nav-link-active" href="#shop">Shop</a>
        <a class="nav-link" href="#shop" @click="activeCategory = 'Knives'">Knives</a>
        <a class="nav-link" href="#shop">How it works</a>
      </nav>
      <div class="header-actions">
        <label class="search-box">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" />
            <path d="m16 16 4 4" />
          </svg>
          <input v-model="searchQuery" aria-label="Search skins" placeholder="Search skins..." />
          <kbd>/</kbd>
        </label>
        <button class="cart-button" aria-label="Shopping cart">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 4h2l2.1 10.1a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 1.9-1.4L21 8H6" />
            <circle cx="10" cy="20" r="1" />
            <circle cx="18" cy="20" r="1" />
          </svg>
          <span>Cart</span><b>{{ cartCount }}</b>
        </button>
      </div>
    </header>

    <section id="top" class="hero">
      <div class="hero-copy">
        <div class="eyebrow"><span /> YOUR NEXT LOADOUT STARTS HERE</div>
        <h1>Looks that<br />hit <em>different.</em></h1>
        <p class="hero-description">
          The skins you want. The prices you don't expect.<br class="desktop-break" />
          Upgrade your game without the grind.
        </p>
        <div class="hero-actions">
          <a class="button-primary" href="#shop">Explore the drop <span>↗</span></a>
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
      <div class="hero-art" role="img" aria-label="Competitive gaming arena">
        <div class="hero-art-shade" />
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
        <a class="view-all" href="#shop">VIEW ALL SKINS <span>↗</span></a>
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
                @click="cartCount++"
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
      <a class="button-dark" href="#shop">Find your skin <span>↗</span></a>
      <span class="banner-star">✳</span>
    </section>

    <footer class="site-footer">
      <a class="wordmark footer-wordmark" href="#top"
        ><span class="wordmark-mark">D</span
        ><span>DROPZONE<span class="wordmark-period">.</span></span></a
      >
      <span>GOOD GAMES. BETTER LOOKS.</span>
      <span>© 2025 DROPZONE</span>
    </footer>
  </main>
</template>
