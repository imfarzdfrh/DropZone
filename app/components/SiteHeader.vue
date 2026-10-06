<script setup lang="ts">
const route = useRoute();
const searchQuery = ref('');
const mobileMenuOpen = ref(false);
const profileMenuOpen = ref(false);
const profileArea = ref<HTMLElement | null>(null);
const { count } = useCart();
const account = useAccount();
const accountName = computed(
  () => account.displayName.value || account.user.value?.username || 'Player',
);

function closeProfileMenu(event: PointerEvent) {
  if (profileArea.value && !profileArea.value.contains(event.target as Node))
    profileMenuOpen.value = false;
}

onMounted(() => document.addEventListener('pointerdown', closeProfileMenu));
onBeforeUnmount(() => document.removeEventListener('pointerdown', closeProfileMenu));

async function logOut() {
  profileMenuOpen.value = false;
  mobileMenuOpen.value = false;
  // Leave protected routes before clearing the session so their guard does not race this redirect.
  await navigateTo('/');
  account.signOut();
}

async function searchShop() {
  mobileMenuOpen.value = false;
  await navigateTo({
    path: '/shop',
    query: searchQuery.value ? { search: searchQuery.value } : {},
  });
}
</script>

<template>
  <div class="announcement">
    <span class="announcement-dot" />
    <span>THE DROP IS LIVE</span>
    <span class="announcement-divider">/</span>
    <span>Get 10% off your first loadout with <strong>FIRSTDROP</strong></span>
    <span class="announcement-arrow">↗</span>
  </div>
  <header
    class="site-header"
    @keydown.esc="
      mobileMenuOpen = false;
      profileMenuOpen = false;
    "
  >
    <NuxtLink class="wordmark" to="/" aria-label="Dropzone home">
      <span class="wordmark-mark">D</span>
      <span>DROPZONE<span class="wordmark-period">.</span></span>
    </NuxtLink>
    <nav class="desktop-nav" aria-label="Main navigation">
      <NuxtLink
        :class="['nav-link', { 'nav-link-active': route.path === '/shop' }]"
        to="/shop"
        @click="mobileMenuOpen = false"
        >Shop</NuxtLink
      >
      <NuxtLink
        class="nav-link"
        :to="{ path: '/shop', query: { category: 'Knives' } }"
        @click="mobileMenuOpen = false"
        >Knives</NuxtLink
      >
      <NuxtLink
        :class="['nav-link', { 'nav-link-active': route.path === '/how-it-works' }]"
        to="/how-it-works"
        @click="mobileMenuOpen = false"
        >How it works</NuxtLink
      >
    </nav>
    <div class="header-actions">
      <form class="search-box" role="search" @submit.prevent="searchShop">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4 4" />
        </svg>
        <Input v-model="searchQuery" aria-label="Search skins" placeholder="Search skins..." />
        <kbd>/</kbd>
      </form>
      <Button
        v-if="!account.isAuthenticated.value"
        variant="ghost"
        class="header-account"
        to="/login"
        >Sign in</Button
      >
      <div v-else ref="profileArea" class="header-profile-area">
        <Button
          variant="ghost"
          size="sm"
          class="header-profile-trigger"
          type="button"
          :aria-expanded="profileMenuOpen"
          aria-haspopup="menu"
          @click="profileMenuOpen = !profileMenuOpen"
        >
          <UserAvatar :avatar="account.user.value?.avatar ?? null" :name="accountName" size="sm" />
          <span class="header-profile-details">
            <span class="header-profile-name">{{ account.user.value?.username }}</span>
            <span class="header-wallet-balance"
              >${{ account.user.value?.walletBalance.toFixed(2) }}</span
            >
          </span>
          <span class="header-profile-chevron" aria-hidden="true">⌄</span>
        </Button>
        <Transition name="profile-menu">
          <nav
            v-if="profileMenuOpen"
            class="profile-dropdown"
            aria-label="Profile menu"
            role="menu"
          >
            <div class="profile-dropdown-heading">
              <UserAvatar
                :avatar="account.user.value?.avatar ?? null"
                :name="accountName"
                size="md"
              />
              <span
                ><strong>{{ accountName }}</strong
                ><small
                  >${{ account.user.value?.walletBalance.toFixed(2) }} wallet balance</small
                ></span
              >
            </div>
            <NuxtLink to="/account" role="menuitem" @click="profileMenuOpen = false"
              >Profile <span>↗</span></NuxtLink
            >
            <NuxtLink to="/account/profile" role="menuitem" @click="profileMenuOpen = false"
              >Edit Profile <span>↗</span></NuxtLink
            >
            <NuxtLink to="/account/wallet" role="menuitem" @click="profileMenuOpen = false"
              >Wallet <span>↗</span></NuxtLink
            >
            <NuxtLink to="/account/orders" role="menuitem" @click="profileMenuOpen = false"
              >Orders <span>↗</span></NuxtLink
            >
            <NuxtLink to="/account/wishlist" role="menuitem" @click="profileMenuOpen = false"
              >Wishlist <span>↗</span></NuxtLink
            >
            <NuxtLink to="/account/settings" role="menuitem" @click="profileMenuOpen = false"
              >Settings <span>↗</span></NuxtLink
            >
            <Button variant="danger" size="sm" type="button" role="menuitem" @click="logOut"
              >Log out <span>↗</span></Button
            >
          </nav>
        </Transition>
      </div>
      <Button variant="ghost" class="cart-button" to="/cart" aria-label="Shopping cart">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 4h2l2.1 10.1a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 1.9-1.4L21 8H6" />
          <circle cx="10" cy="20" r="1" />
          <circle cx="18" cy="20" r="1" />
        </svg>
        <span>Cart</span><b>{{ count }}</b>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        class="mobile-menu-toggle"
        type="button"
        :aria-expanded="mobileMenuOpen"
        aria-controls="mobile-menu"
        :aria-label="mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'"
        @click="mobileMenuOpen = !mobileMenuOpen"
      >
        <svg v-if="!mobileMenuOpen" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
        <svg v-else viewBox="0 0 24 24" aria-hidden="true">
          <path d="m6 6 12 12M18 6 6 18" />
        </svg>
      </Button>
    </div>
    <div v-show="mobileMenuOpen" id="mobile-menu" class="mobile-menu-panel">
      <nav class="mobile-nav" aria-label="Mobile navigation">
        <NuxtLink to="/shop" @click="mobileMenuOpen = false">Shop</NuxtLink>
        <NuxtLink
          :to="{ path: '/shop', query: { category: 'Knives' } }"
          @click="mobileMenuOpen = false"
          >Knives</NuxtLink
        >
        <NuxtLink to="/how-it-works" @click="mobileMenuOpen = false">How it works</NuxtLink>
        <NuxtLink v-if="account.isAuthenticated.value" to="/account" @click="mobileMenuOpen = false"
          >{{ accountName }} · ${{ account.user.value?.walletBalance.toFixed(2) }}</NuxtLink
        >
        <NuxtLink v-else to="/login" @click="mobileMenuOpen = false">Sign in</NuxtLink>
      </nav>
      <form class="mobile-search-box" role="search" @submit.prevent="searchShop">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4 4" />
        </svg>
        <Input
          v-model="searchQuery"
          type="search"
          aria-label="Search skins"
          placeholder="Search skins..."
        />
        <Button variant="ghost" size="icon" type="submit" aria-label="Search">↗</Button>
      </form>
    </div>
  </header>
</template>
