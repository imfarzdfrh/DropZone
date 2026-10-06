<script setup lang="ts">
withDefaults(defineProps<{ modelValue?: boolean; disabled?: boolean }>(), {
  modelValue: false,
  disabled: false,
});
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>();
</script>

<template>
  <input
    type="checkbox"
    class="ui-checkbox"
    :checked="modelValue"
    :disabled="disabled"
    @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
  >
</template>
