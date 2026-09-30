<script setup lang="ts">
interface Props {
  required?: boolean;
}

withDefaults(defineProps<Props>(), {
  required: false,
});
</script>

<template>
  <label class="mb-2 block text-sm font-medium text-foreground">
    <slot />

    <span v-if="required" class="ml-1 text-danger" aria-hidden="true"> * </span>
  </label>
</template>
