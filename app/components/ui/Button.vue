<script setup lang="ts">
import { computed } from 'vue';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonType = 'button' | 'submit' | 'reset';

interface Props {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  block?: boolean;
  type?: ButtonType;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  block: false,
  type: 'button',
});

const buttonClasses = computed(() => [
  'group relative isolate inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden',
  'rounded-md border font-semibold whitespace-nowrap transition-all duration-300',
  'hover:-translate-y-0.5 active:translate-y-0',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  'disabled:pointer-events-none disabled:opacity-50',

  {
    'border-primary bg-primary text-primary-foreground shadow-md shadow-primary/10':
      props.variant === 'primary',
    'border-border bg-[#171b17] text-foreground hover:border-primary/50':
      props.variant === 'secondary',
    'border-border bg-transparent text-foreground': props.variant === 'outline',
    'border-transparent bg-transparent text-foreground': props.variant === 'ghost',
    'border-red-500/50 bg-red-500/10 text-red-300': props.variant === 'danger',
    'min-h-10 px-3 text-xs': props.size === 'sm',
    'min-h-11 px-4 text-sm': props.size === 'md',
    'min-h-12 px-6 text-base': props.size === 'lg',
    'w-full': props.block,
  },
]);

const liquidClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-primary-hover';
    case 'secondary':
    case 'ghost':
      return 'bg-primary/10';
    case 'outline':
      return 'bg-primary';
    case 'danger':
      return 'bg-red-500';
    default:
      return 'bg-primary';
  }
});

const contentClasses = computed(() => [
  'relative z-10 flex items-center gap-2 transition-colors duration-300',
  { 'group-hover:text-primary-foreground': props.variant === 'outline' },
]);

const isDisabled = computed(() => props.disabled || props.loading);
</script>

<template>
  <button
    :class="buttonClasses"
    :disabled="isDisabled"
    :type="type"
    :aria-busy="loading ? 'true' : undefined"
  >
    <!-- Liquid -->
    <span
      :class="[
        'absolute inset-y-0 left-0 z-0 w-full origin-left scale-x-0',
        'transition-transform duration-500 ease-out group-hover:scale-x-100',
        liquidClasses,
      ]"
      aria-hidden="true"
    />

    <!-- Content -->
    <span :class="contentClasses">
      <span
        v-if="loading"
        class="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        aria-hidden="true"
      />

      <slot />
    </span>
  </button>
</template>
