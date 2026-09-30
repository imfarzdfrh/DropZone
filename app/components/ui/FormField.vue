<script setup lang="ts">
interface Props {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

withDefaults(defineProps<Props>(), {
  label: '',
  error: '',
  hint: '',
  required: false,
});
</script>

<template>
  <div class="w-full">
    <Label v-if="label" :required="required">
      {{ label }}
    </Label>

    <slot />

    <p v-if="error" class="mt-2 text-sm text-danger">
      {{ error }}
    </p>

    <p v-else-if="hint" class="mt-2 text-sm text-muted">
      {{ hint }}
    </p>
  </div>
</template>
