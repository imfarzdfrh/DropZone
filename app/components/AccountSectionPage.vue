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
    <Card as="section" class="account-panel account-placeholder-panel">
      <CardHeader class="account-section-heading">
        <div>
          <span class="account-overline">{{ overline }}</span>
          <h2>{{ title }}</h2>
        </div>
        <span v-if="count" class="transaction-count">{{ count }}</span>
      </CardHeader>
      <p>{{ description }}</p>
      <Button variant="ghost" class="account-placeholder-link" :to="actionTo"
        >{{ actionLabel }} <span>↗</span></Button
      >
      <span class="account-placeholder-note"
        >DEMO ACCOUNT · CONNECTED DATA IS NOT AVAILABLE YET</span
      >
    </Card>
  </AccountShell>
</template>
