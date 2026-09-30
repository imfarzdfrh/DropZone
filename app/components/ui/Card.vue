<script setup lang="ts">
interface Props {
  hover?: boolean;
}

withDefaults(defineProps<Props>(), {
  hover: false,
});
</script>

<template>
  <div
    :class="[
      'rounded-2xl border border-border bg-background shadow-soft',
      'transition-all duration-300',
      {
        'hover:-translate-y-1 hover:shadow-medium': hover,
      },
    ]"
  >
    <slot />
  </div>
</template>
