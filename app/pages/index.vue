<script setup lang="ts">
import { products } from '~/data/catalog';
import { storeCategories, categoryRoute } from '~/data/categories';
const featured = products.filter((product) => product.featured);
const popular = products.filter((product) => product.demoPopular);
useSeoMeta({
  title: 'Dropzone — Your game. Your setup.',
  description:
    'Explore gaming gear, digital essentials, games, PCs and more in the Dropzone demo store.',
});
</script>
<template>
  <div class="storefront dz-store">
    <SiteHeader />
    <main>
      <StoreLayout>
        <section class="dz-hero">
          <div class="dz-hero-copy">
            <span class="section-kicker"
              ><span class="accent-dash" /> THE NEXT LEVEL STARTS HERE</span
            >
            <h1>Your game.<br >Your rules.<br ><em>Your setup.</em></h1>
            <p>
              From your first login to your final upgrade.<br >Find the games, gear and essentials
              that make it yours.
            </p>
            <div class="dz-hero-actions">
              <Button size="lg" to="/shop">Explore the store <StoreIcon name="arrow" /></Button
              ><Button variant="ghost" to="/shop?category=digital"
                >Go digital <StoreIcon name="right" :size="18"
              /></Button>
            </div>
            <div class="dz-hero-foot">
              <span>01 / THE SETUP COLLECTION</span><span>PLAY YOUR WAY</span>
            </div>
          </div>
          <div class="dz-hero-art">
            <img
              src="/images/catalog/setup.svg"
              alt="Illustration of a gaming monitor, desktop, keyboard and headset in a warm amber setup"
              width="700"
              height="620"
              fetchpriority="high"
            >
            <div class="dz-art-label">
              <span>BUILD YOUR BATTLESTATION</span
              ><strong>Made for your<br >next great game.</strong>
            </div>
          </div>
        </section>
        <div class="dz-service-strip">
          <div>
            <StoreIcon name="gamepad" /><span
              ><strong>Every way to play</strong><small>PC, console & digital</small></span
            >
          </div>
          <div>
            <StoreIcon name="headphones" /><span
              ><strong>Complete your setup</strong><small>Gear, furniture & more</small></span
            >
          </div>
          <div>
            <StoreIcon name="help" /><span
              ><strong>Find your fit</strong
              ><small><NuxtLink to="/support">Explore the help centre</NuxtLink></small></span
            >
          </div>
        </div>
        <section class="dz-section">
          <div class="dz-section-heading">
            <div>
              <span class="section-kicker">PICK YOUR NEXT UPGRADE</span>
              <h2>One store. Every side of gaming.</h2>
            </div>
          </div>
          <div class="dz-category-tiles">
            <NuxtLink
              v-for="category in storeCategories"
              :key="category.id"
              :to="categoryRoute(category.id)"
              ><StoreIcon :name="category.icon" :size="28" /><strong>{{ category.label }}</strong
              ><StoreIcon name="arrow" :size="18"
            /></NuxtLink>
          </div>
        </section>
        <section class="dz-section">
          <div class="dz-section-heading">
            <div>
              <span class="section-kicker">THE EDIT</span>
              <h2>Upgrade your everyday.</h2>
            </div>
            <Button variant="ghost" to="/shop?collection=featured"
              >All featured <StoreIcon name="arrow" :size="18"
            /></Button>
          </div>
          <p class="dz-demo-note">
            Explore our sample catalog. Products, illustrations and prices are for demonstration.
          </p>
          <div class="dz-product-grid home-products">
            <ProductCard v-for="product in featured" :key="product.id" :product="product" />
          </div>
        </section>
        <section class="dz-digital-banner">
          <div>
            <span class="section-kicker">LESS WAITING. MORE PLAYING.</span>
            <h2>Your next adventure,<br >one top-up away.</h2>
            <p>Wallet credit, game subscriptions and digital editions.</p>
            <Button variant="secondary" to="/shop?category=digital"
              >Explore digital essentials <StoreIcon name="arrow"
            /></Button>
          </div>
          <img
            src="/images/catalog/wallet.svg"
            alt="Illustrative digital wallet card"
            width="480"
            height="360"
            loading="lazy"
          >
        </section>
        <section class="dz-section">
          <div class="dz-section-heading">
            <div>
              <span class="section-kicker">DISCOVER MORE</span>
              <h2>Bestsellers <span class="dz-demo-badge">Demo selection</span></h2>
            </div>
            <Button variant="ghost" to="/shop?collection=popular"
              >View selection <StoreIcon name="arrow" :size="18"
            /></Button>
          </div>
          <p class="dz-demo-note">
            A curated preview of this section. No sales ranking or customer ratings are claimed.
          </p>
          <div class="dz-product-grid home-products">
            <ProductCard v-for="product in popular" :key="product.id" :product="product" />
          </div>
        </section>
      </StoreLayout>
    </main>
    <SiteFooter />
  </div>
</template>
