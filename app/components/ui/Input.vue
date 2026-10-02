<script setup lang="ts">
type InputSize = 'sm' | 'md' | 'lg';

interface Props {
  modelValue?: string | number;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  size?: InputSize;
}

withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  placeholder: '',
  disabled: false,
  error: false,
  size: 'md',
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;

  emit('update:modelValue', target.value);
};
</script>

<template>
  <input
    :value="modelValue"
    :type="type"
    :placeholder="placeholder"
    :disabled="disabled"
    :class="[
      'w-full rounded-md border border-border bg-[#171b17] text-foreground',
      'placeholder:text-muted/75',
      'transition-[border-color,box-shadow,background-color] duration-200',
      'outline-none',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20',

      {
        'border-primary focus-visible:border-primary focus-visible:ring-primary/20': !error,
        'border-red-400 focus-visible:border-red-400 focus-visible:ring-red-400/20': error,
      },

      {
        'min-h-10 px-3 text-sm': size === 'sm',
        'min-h-11 px-4 text-sm': size === 'md',
        'min-h-12 px-4 text-base': size === 'lg',
      },
    ]"
    :aria-invalid="error ? 'true' : undefined"
    @input="handleInput"
  />
</template>
