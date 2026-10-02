<script setup lang="ts">
const account = useAccount();
const user = computed(() => account.user.value);

useSeoMeta({
  title: 'Player HQ | Dropzone',
  description: 'Your Dropzone player profile and account overview.',
});
</script>

<template>
  <AccountShell>
    <div v-if="user" class="account-overview">
      <section class="account-welcome account-panel">
        <div class="account-welcome-profile">
          <UserAvatar
            :avatar="user.avatar"
            :name="account.displayName.value || user.username"
            size="xl"
          />
          <div>
            <span class="account-overline">PLAYER PROFILE</span>
            <h2>{{ account.displayName.value || user.username }}</h2>
            <p>
              @{{ user.username }} <i /> Member since
              {{
                new Date(user.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric',
                })
              }}
            </p>
          </div>
        </div>
        <NuxtLink class="account-edit-link" to="/account/profile"
          >Edit profile <span>↗</span></NuxtLink
        >
      </section>

      <section class="account-stat-grid" aria-label="Account statistics">
        <article class="account-stat">
          <span>WALLET BALANCE</span><strong>${{ user.walletBalance.toFixed(2) }}</strong
          ><NuxtLink to="/account/wallet">View wallet ↗</NuxtLink>
        </article>
        <article class="account-stat">
          <span>ORDERS</span
          ><strong>{{ account.orderCount.value.toString().padStart(2, '0') }}</strong
          ><NuxtLink to="/account/orders">Order history ↗</NuxtLink>
        </article>
        <article class="account-stat">
          <span>WISHLIST</span
          ><strong>{{ account.wishlistCount.value.toString().padStart(2, '0') }}</strong
          ><NuxtLink to="/account/wishlist">Saved items ↗</NuxtLink>
        </article>
      </section>

      <section class="account-panel account-info-panel">
        <div class="account-section-heading">
          <div>
            <span class="account-overline">ACCOUNT DETAILS</span>
            <h2>Player information</h2>
          </div>
          <NuxtLink to="/account/profile">Edit details ↗</NuxtLink>
        </div>
        <dl class="profile-details">
          <div>
            <dt>Username</dt>
            <dd>{{ user.username }}</dd>
          </div>
          <div>
            <dt>Full name</dt>
            <dd>{{ account.displayName.value || 'Not added yet' }}</dd>
          </div>
          <div>
            <dt>Email address</dt>
            <dd>{{ user.email }}</dd>
          </div>
          <div>
            <dt>Phone number</dt>
            <dd>{{ user.phone || 'Not added yet' }}</dd>
          </div>
          <div class="profile-details-wide">
            <dt>About me</dt>
            <dd>{{ user.bio || 'Add a little about yourself to your profile.' }}</dd>
          </div>
        </dl>
      </section>
      <p class="account-demo-disclaimer">
        DEMO ACCOUNT
        <span
          >Profile preferences are saved in this browser. This is not a secure sign-in
          session.</span
        >
      </p>
    </div>
  </AccountShell>
</template>
