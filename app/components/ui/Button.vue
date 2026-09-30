<script setup lang="ts">
import { computed } from 'vue';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface Props {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  block?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  block: false,
});

const buttonClasses = computed(() => [
  'group relative isolate inline-flex items-center justify-center gap-2 overflow-hidden',
  'font-medium whitespace-nowrap rounded-lg',
  'border transition-all duration-300',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
  'disabled:pointer-events-none disabled:opacity-50',

  {
    'border-primary text-primary': props.variant === 'primary',

    'border-border text-foreground': props.variant === 'secondary' || props.variant === 'outline',

    'border-border text-foreground': props.variant === 'ghost',

    'border-danger text-danger': props.variant === 'danger',
  },

  {
    'h-9 px-3 text-sm': props.size === 'sm',
    'h-10 px-4 text-sm': props.size === 'md',
    'h-12 px-6 text-base': props.size === 'lg',
  },

  {
    'w-full': props.block,
  },
]);

const liquidClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-primary';

    case 'secondary':
      return 'bg-foreground';

    case 'outline':
      return 'bg-foreground';

    case 'ghost':
      return 'bg-foreground';

    case 'danger':
      return 'bg-danger';

    default:
      return 'bg-primary';
  }
});

const isDisabled = computed(() => props.disabled || props.loading);
</script>

<template>
  <button :class="buttonClasses" :disabled="isDisabled" type="button">
    <!-- Liquid -->
    <span
      :class="[
        'absolute inset-y-0 left-0 z-0 w-full origin-left scale-x-0',
        'transition-transform duration-500 ease-out',
        'group-hover:scale-x-100',
        liquidClasses,
      ]"
      aria-hidden="true"
    />

    <!-- Content -->
    <span
      class="relative z-10 flex items-center gap-2 transition-colors duration-300 group-hover:text-white"
    >
      <span
        v-if="loading"
        class="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        aria-hidden="true"
      />

      <slot />
    </span>
  </button>
</template>
