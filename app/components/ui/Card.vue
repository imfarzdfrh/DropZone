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
      'rounded-lg border border-border bg-[#151915] shadow-lg shadow-black/20',
      'transition-[transform,border-color,box-shadow] duration-300',
      {
        'hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl hover:shadow-black/30': hover,
      },
    ]"
  >
    <slot />
  </div>
</template>
