<script setup lang="ts">
interface Props {
  hover?: boolean;
  as?: 'div' | 'article' | 'section' | 'aside';
}

withDefaults(defineProps<Props>(), {
  hover: false,
  as: 'div',
});
</script>

<template>
  <component
    :is="as"
    :class="[
      'rounded-sm border border-border bg-surface shadow-lg shadow-black/20',
      'transition-[transform,border-color,box-shadow] duration-300',
      {
        'hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl hover:shadow-black/30': hover,
      },
    ]"
  >
    <slot />
  </component>
</template>
