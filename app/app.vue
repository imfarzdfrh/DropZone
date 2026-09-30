<script setup lang="ts">
const username = ref('');
</script>

<template>
  <main class="min-h-screen bg-background text-foreground">
    <div class="container-page section">
      <div class="mx-auto max-w-md">
        <label class="mb-2 block text-sm font-medium"> Username </label>

        <Input size="sm" placeholder="Small" />

        <Input placeholder="Medium" />

        <Input size="lg" placeholder="Large" />

        <Input error placeholder="Invalid value" />

        <p class="mt-2 text-sm text-muted">Value: {{ username }}</p>
      </div>

      <FormField label="Email" hint="We'll never share your email." required>
        <Input type="email" placeholder="you@example.com" />
      </FormField>
    </div>
  </main>
</template>
