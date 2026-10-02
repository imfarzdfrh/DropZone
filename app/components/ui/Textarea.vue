<script setup lang="ts">
type TextareaSize = 'sm' | 'md' | 'lg';

interface Props {
  modelValue?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  rows?: number;
  size?: TextareaSize;
  resize?: boolean;
}

withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '',
  disabled: false,
  error: false,
  rows: 4,
  size: 'md',
  resize: true,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;

  emit('update:modelValue', target.value);
};
</script>

<template>
  <textarea
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :rows="rows"
    :class="[
      'w-full rounded-md border border-border bg-[#171b17] text-foreground',
      'placeholder:text-muted/75',
      'outline-none',
      'transition-[border-color,box-shadow,background-color] duration-200',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20',

      {
        'border-primary focus-visible:border-primary focus-visible:ring-primary/20': !error,
        'border-red-400 focus-visible:border-red-400 focus-visible:ring-red-400/20': error,
        'resize-y': resize,
        'resize-none': !resize,
      },

      {
        'px-3 py-2 text-sm': size === 'sm',
        'px-4 py-3 text-sm': size === 'md',
        'px-4 py-3 text-base': size === 'lg',
      },
    ]"
    :aria-invalid="error ? 'true' : undefined"
    @input="handleInput"
  />
</template>
