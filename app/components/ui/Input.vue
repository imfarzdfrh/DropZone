<script setup lang="ts">
type InputSize = 'sm' | 'md' | 'lg';

interface Props {
  modelValue?: string | number;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  size?: InputSize;
  modelModifiers?: { trim?: boolean };
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  placeholder: '',
  disabled: false,
  error: false,
  size: 'md',
  modelModifiers: () => ({}),
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;

  if (props.type !== 'file')
    emit('update:modelValue', props.modelModifiers.trim ? target.value.trim() : target.value);
};
const element = ref<HTMLInputElement | null>(null);
defineExpose({
  click: () => element.value?.click(),
  clear: () => {
    if (element.value) element.value.value = '';
  },
});
</script>

<template>
  <input
    ref="element"
    :value="type === 'file' ? undefined : modelValue"
    :type="type"
    :placeholder="placeholder"
    :disabled="disabled"
    :class="[
      'w-full rounded-sm border border-border bg-surface text-foreground',
      'placeholder:text-muted/75',
      'transition-[border-color,box-shadow,background-color] duration-200',
      'outline-none',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20',

      {
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
  >
</template>
