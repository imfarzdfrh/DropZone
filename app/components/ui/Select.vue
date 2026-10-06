<script setup lang="ts">
interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

interface Props {
  modelValue?: string | number;
  options?: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
}

withDefaults(defineProps<Props>(), {
  modelValue: '',
  options: () => [],
  placeholder: 'Select an option',
  disabled: false,
  error: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;

  emit('update:modelValue', target.value);
};
</script>

<template>
  <select
    :value="modelValue"
    :disabled="disabled"
    :class="[
      'min-h-11 w-full rounded-sm border border-border bg-surface px-4 text-sm text-foreground',
      'outline-none transition-[border-color,box-shadow,background-color] duration-200',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20',

      {
        'border-red-400 focus-visible:border-red-400 focus-visible:ring-red-400/20': error,
      },
    ]"
    :aria-invalid="error ? 'true' : undefined"
    @change="handleChange"
  >
    <option v-if="placeholder" value="" disabled>
      {{ placeholder }}
    </option>

    <option
      v-for="option in options"
      :key="option.value"
      :value="option.value"
      :disabled="option.disabled"
    >
      {{ option.label }}
    </option>
  </select>
</template>
