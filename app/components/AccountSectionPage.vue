<script setup lang="ts">
defineProps<{
  overline: string;
  title: string;
  description: string;
  actionLabel: string;
  actionTo: string;
  count?: string;
}>();
</script>

<template>
  <AccountShell>
    <section class="account-panel account-placeholder-panel">
      <div class="account-section-heading">
        <div>
          <span class="account-overline">{{ overline }}</span>
          <h2>{{ title }}</h2>
        </div>
        <span v-if="count" class="transaction-count">{{ count }}</span>
      </div>
      <p>{{ description }}</p>
      <NuxtLink class="account-placeholder-link" :to="actionTo"
        >{{ actionLabel }} <span>↗</span></NuxtLink
      >
      <span class="account-placeholder-note"
        >DEMO ACCOUNT · CONNECTED DATA IS NOT AVAILABLE YET</span
      >
    </section>
  </AccountShell>
</template>
