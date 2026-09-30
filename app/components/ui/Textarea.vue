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
      'w-full rounded-lg border bg-background text-foreground',
      'placeholder:text-muted',
      'outline-none',
      'transition-all duration-200',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'focus:ring-2',

      {
        'border-border focus:border-primary focus:ring-primary/20': !error,
        'border-danger focus:border-danger focus:ring-danger/20': error,
        'resize-y': resize,
        'resize-none': !resize,
      },

      {
        'px-3 py-2 text-sm': size === 'sm',
        'px-4 py-3 text-sm': size === 'md',
        'px-4 py-3 text-base': size === 'lg',
      },
    ]"
    @input="handleInput"
  />
</template>
