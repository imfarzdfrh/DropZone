<script setup lang="ts">
useSeoMeta({ title: 'Settings | Dropzone', description: 'Manage your Dropzone account settings.' });
</script>

<template>
  <AccountSectionPage
    overline="PLAYER PREFERENCES"
    title="Account settings"
    description="Manage the profile details attached to this local demo account. Authentication and security settings require a connected account service."
    action-label="Edit profile"
    action-to="/account/profile"
  />
</template>
