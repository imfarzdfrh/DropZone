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
      'w-full rounded-lg border bg-background text-foreground',
      'placeholder:text-muted',
      'transition-all duration-200',
      'outline-none',
      'disabled:cursor-not-allowed disabled:opacity-50',

      'focus:ring-2',

      {
        'border-border focus:border-primary focus:ring-primary/20': !error,
        'border-danger focus:border-danger focus:ring-danger/20': error,
      },

      {
        'h-9 px-3 text-sm': size === 'sm',
        'h-10 px-4 text-sm': size === 'md',
        'h-12 px-4 text-base': size === 'lg',
      },
    ]"
    @input="handleInput"
  />
</template>
