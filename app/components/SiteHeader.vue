<script setup lang="ts">
const route = useRoute();
const search = ref(String(route.query.search || ''));
const megaOpen = ref(false);
const drawerOpen = ref(false);
const profileOpen = ref(false);
const area = ref<HTMLElement | null>(null);
const menuTrigger = ref<{ focus: () => void } | null>(null);
const cart = useCart();
const account = useAccount();
function close() {
  megaOpen.value = false;
  drawerOpen.value = false;
  profileOpen.value = false;
}
function outside(event: PointerEvent) {
  if (!area.value?.contains(event.target as Node)) close();
}
function escape() {
  if (megaOpen.value) {
    megaOpen.value = false;
    menuTrigger.value?.focus();
  }
  profileOpen.value = false;
}
function resize() {
  if (window.innerWidth >= 1100) drawerOpen.value = false;
  else megaOpen.value = false;
}
onMounted(() => {
  document.addEventListener('pointerdown', outside);
  window.addEventListener('resize', resize);
});
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', outside);
  window.removeEventListener('resize', resize);
});
watch(
  () => route.fullPath,
  () => {
    close();
    search.value = String(route.query.search || '');
  },
);
async function searchShop() {
  close();
  await navigateTo({
    path: '/shop',
    query: search.value.trim() ? { search: search.value.trim() } : {},
  });
}
async function logout() {
  close();
  await navigateTo('/');
  account.signOut();
}
</script>
<template>
  <header ref="area" class="dz-header" @keydown.esc="escape">
    <div class="dz-header-main">
      <NuxtLink class="dz-logo" to="/" aria-label="Dropzone home"
        ><span class="dz-logo-mark">D<span /></span>DROPZONE<span class="dz-logo-dot"
          >.</span
        ></NuxtLink
      >
      <form class="dz-search" role="search" @submit.prevent="searchShop">
        <Input
          v-model="search"
          type="search"
          aria-label="Search products"
          placeholder="Search games, gear & more…"
        /><Button variant="ghost" size="icon" type="submit" aria-label="Search"
          ><StoreIcon name="search"
        /></Button>
      </form>
      <div class="dz-header-actions">
        <Button v-if="!account.isAuthenticated.value" variant="ghost" to="/login" class="dz-signin"
          ><StoreIcon name="user" /><span>Sign in</span></Button
        >
        <div v-else class="dz-profile">
          <Button
            variant="ghost"
            class="header-profile-trigger"
            :aria-expanded="profileOpen"
            aria-controls="account-menu"
            @click="
              profileOpen = !profileOpen;
              megaOpen = false;
            "
            ><UserAvatar
              :avatar="account.user.value?.avatar ?? null"
              :name="account.displayName.value || 'Player'"
              size="sm" /><span class="dz-account-summary"
              ><b>{{ account.user.value?.username }}</b
              ><bdi>${{ account.user.value?.walletBalance.toFixed(2) }}</bdi></span
            ><StoreIcon name="chevron" :size="16"
          /></Button>
          <nav
            v-if="profileOpen"
            id="account-menu"
            class="dz-profile-menu"
            aria-label="Account menu"
          >
            <NuxtLink to="/account">Account overview</NuxtLink
            ><NuxtLink to="/account/profile">Edit profile</NuxtLink
            ><NuxtLink to="/account/wallet">Wallet</NuxtLink
            ><NuxtLink to="/account/orders">Orders</NuxtLink
            ><NuxtLink to="/account/wishlist">Wishlist</NuxtLink
            ><NuxtLink to="/account/settings">Settings</NuxtLink
            ><Button variant="danger" @click="logout"
              ><StoreIcon name="logout" :size="18" /> Log out</Button
            >
          </nav>
        </div>
        <Button variant="ghost" to="/cart" aria-label="Shopping cart" class="dz-cart"
          ><StoreIcon name="cart" /><span class="dz-cart-label">Cart</span
          ><b>{{ cart.count.value }}</b></Button
        >
      </div>
    </div>
    <div class="dz-header-nav">
      <Button
        ref="menuTrigger"
        variant="ghost"
        class="dz-desktop-categories"
        :aria-expanded="megaOpen"
        aria-controls="category-mega"
        @click="
          megaOpen = !megaOpen;
          profileOpen = false;
        "
        ><StoreIcon name="grid" :size="20" />Product categories<StoreIcon name="chevron" :size="16"
      /></Button>
      <Button
        variant="ghost"
        class="dz-mobile-categories"
        :aria-expanded="drawerOpen"
        @click="drawerOpen = true"
        ><StoreIcon name="menu" />Categories</Button
      >
      <nav aria-label="Main navigation">
        <NuxtLink to="/shop" :aria-current="route.path === '/shop' ? 'page' : undefined"
          >Shop all</NuxtLink
        ><NuxtLink
          to="/shop?collection=featured"
          :aria-current="route.query.collection === 'featured' ? 'page' : 'false'"
          >Featured</NuxtLink
        ><NuxtLink to="/support">Support</NuxtLink>
      </nav>
      <span class="dz-header-note">YOUR GAME. YOUR SETUP.</span>
    </div>
    <div v-if="megaOpen" id="category-mega" class="dz-mega">
      <div class="dz-mega-title">
        <strong>Find your next upgrade</strong
        ><NuxtLink to="/shop">Explore all products <StoreIcon name="arrow" :size="18" /></NuxtLink>
      </div>
      <CategoryNavigation mode="mega" @select="close" />
    </div>
    <Drawer :open="drawerOpen" title="Product categories" @close="drawerOpen = false"
      ><CategoryNavigation @select="close"
    /></Drawer>
  </header>
</template>
