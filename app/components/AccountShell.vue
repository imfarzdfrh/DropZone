<script setup lang="ts">
const route = useRoute();
const account = useAccount();

onMounted(() => {
  if (!account.isAuthenticated.value) void navigateTo('/login');
});

const links = [
  { label: 'Overview', to: '/account', icon: '◫' },
  { label: 'Profile', to: '/account/profile', icon: '◎' },
  { label: 'Wallet', to: '/account/wallet', icon: '◈' },
  { label: 'Orders', to: '/account/orders', icon: '▤' },
  { label: 'Wishlist', to: '/account/wishlist', icon: '♡' },
  { label: 'Settings', to: '/account/settings', icon: '⚙' },
];
</script>

<template>
  <main class="storefront account-storefront">
    <SiteHeader />
    <section class="account-page">
      <div class="account-heading">
        <span class="eyebrow"><span /> PLAYER HQ / DEMO ACCOUNT</span>
        <h1>Your <em>account.</em></h1>
        <p>One place for your profile, wallet, and loadout history.</p>
      </div>
      <div class="account-layout">
        <aside class="account-sidebar">
          <div class="account-identity">
            <UserAvatar
              :avatar="account.user.value?.avatar ?? null"
              :name="account.displayName.value || account.user.value?.username || 'Player'"
              size="lg"
            />
            <div>
              <strong>{{ account.displayName.value || account.user.value?.username }}</strong
              ><span>@{{ account.user.value?.username }}</span>
            </div>
          </div>
          <nav aria-label="Account navigation">
            <NuxtLink
              v-for="link in links"
              :key="link.to"
              :to="link.to"
              :class="{ 'account-nav-active': route.path === link.to }"
            >
              <span aria-hidden="true">{{ link.icon }}</span
              >{{ link.label
              }}<b v-if="link.to === '/account/wallet'"
                >${{ account.user.value?.walletBalance.toFixed(2) }}</b
              >
            </NuxtLink>
          </nav>
          <div class="account-sidebar-note">
            <span>DEMO MODE</span>
            <p>Profile and wallet data are stored locally in this browser.</p>
          </div>
        </aside>
        <div class="account-content"><slot /></div>
      </div>
    </section>
    <SiteFooter />
  </main>
</template>
