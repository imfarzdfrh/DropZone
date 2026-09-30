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
      'h-10 w-full rounded-lg border bg-background px-4 text-sm text-foreground',
      'outline-none transition-all duration-200',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'focus:ring-2',

      {
        'border-border focus:border-primary focus:ring-primary/20': !error,
        'border-danger focus:border-danger focus:ring-danger/20': error,
      },
    ]"
    @change="handleChange"
  >
    <option value="" disabled>
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
