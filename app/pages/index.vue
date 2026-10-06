<script setup lang="ts">
import { categories, skins } from '~/data/skins';

const activeCategory = ref('All skins');
const searchQuery = ref('');
const { addToCart } = useCart();
const { favorites, toggleFavorite } = useWishlist();

const filteredSkins = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  return skins.filter((skin) => {
    const matchesCategory =
      activeCategory.value === 'All skins' || skin.category === activeCategory.value;
    const matchesQuery = !query || `${skin.name} ${skin.game}`.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });
});
</script>

<template>
  <main class="storefront">
    <SiteHeader />

    <section id="top" class="hero">
      <div class="hero-copy">
        <div class="eyebrow"><span /> YOUR NEXT LOADOUT STARTS HERE</div>
        <h1>NEXT ROUND.<br >NEW <em>LOADOUT.</em></h1>
        <p class="hero-description">
          Precision. Style. A loadout that feels like you.<br class="desktop-break" >
          Inspired by Counter-Strike. Built for your next clutch.
        </p>
        <div class="hero-actions">
          <Button variant="primary" class="button-primary" to="/shop"
            >Explore the drop <span>↗</span></Button
          >
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
      <div
        class="hero-art tactical-art"
        role="img"
        aria-label="CS2-inspired tactical loadout graphic"
      >
        <div class="tactical-crosshair" aria-hidden="true" />
        <div class="hero-index">DROPZONE <span>/</span> LOADOUT DIVISION</div>
        <div class="tactical-emblem">
          <strong>CS2</strong><span>COUNTER-STRIKE / NEXT ROUND</span>
        </div>
        <div class="hero-art-caption"><span class="live-dot" /> LOCK IN YOUR LOADOUT</div>
        <span class="tactical-tag">READY / 01</span>
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
        <Button variant="ghost" class="view-all" to="/shop">VIEW ALL SKINS <span>↗</span></Button>
      </div>
      <div class="shop-toolbar">
        <div class="category-list" aria-label="Filter by category">
          <Button
            v-for="category in categories"
            :key="category"
            variant="ghost"
            size="sm"
            :class="['category-button', { 'category-active': activeCategory === category }]"
            :aria-pressed="activeCategory === category"
            @click="activeCategory = category"
          >
            {{ category }}
          </Button>
        </div>
        <span class="results-count"
          >SHOWING {{ filteredSkins.length.toString().padStart(2, '0') }} ITEMS</span
        >
      </div>

      <div v-if="filteredSkins.length" class="product-grid">
        <Card
          v-for="(skin, index) in filteredSkins"
          :key="skin.id"
          as="article"
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
            <Button
              variant="ghost"
              size="icon"
              :class="['favorite-button', { 'is-favorite': favorites.includes(skin.id) }]"
              :aria-label="
                favorites.includes(skin.id) ? 'Remove from favorites' : 'Add to favorites'
              "
              :aria-pressed="favorites.includes(skin.id)"
              @click="toggleFavorite(skin.id)"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M20.8 8.8c0 4.1-8.8 10-8.8 10s-8.8-5.9-8.8-10a4.8 4.8 0 0 1 8.8-2.6 4.8 4.8 0 0 1 8.8 2.6Z"
                />
              </svg>
            </Button>
            <span class="product-game">{{ skin.game }} <span>•</span> {{ skin.category }}</span>
          </div>
          <CardContent class="product-info">
            <div>
              <CardTitle>{{ skin.name }}</CardTitle>
              <span class="product-condition">DIGITAL ITEM <i>·</i> IN STOCK</span>
            </div>
            <div class="product-buy">
              <div class="price">
                <strong>${{ skin.price.toFixed(2) }}</strong
                ><del v-if="skin.oldPrice">${{ skin.oldPrice.toFixed(2) }}</del>
              </div>
              <Button
                variant="outline"
                size="icon"
                class="add-button"
                :aria-label="`Add ${skin.name} to cart`"
                @click="addToCart(skin.id)"
              >
                +
              </Button>
            </div>
          </CardContent>
        </Card>
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
        <h2>GEAR UP.<br >GO FOR THE CLUTCH.</h2>
      </div>
      <Button variant="secondary" class="button-dark" to="/shop"
        >Find your skin <span>↗</span></Button
      >
      <span class="banner-star">✳</span>
    </section>

    <SiteFooter />
  </main>
</template>
