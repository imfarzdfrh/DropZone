<script setup lang="ts">
useSeoMeta({ title: 'Orders | Dropzone', description: 'Review your Dropzone order history.' });
</script>

<template>
  <AccountSectionPage
    overline="YOUR PURCHASES"
    title="Order history"
    description="Order records will appear here once the store is connected to its order service. No orders have been placed in this demo."
    action-label="Browse the shop"
    action-to="/shop"
    count="0 ORDERS"
  />
</template>
