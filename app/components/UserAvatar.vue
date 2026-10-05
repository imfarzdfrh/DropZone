<script setup lang="ts">
import { readAvatarBlob } from '~/composables/useAccount';

const props = withDefaults(
  defineProps<{
    avatar: string | null;
    name: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
  }>(),
  { size: 'md' },
);

const source = ref('');
const initials = computed(
  () =>
    props.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase() || 'P',
);

watch(
  () => props.avatar,
  async (id, _previous, onCleanup) => {
    let cancelled = false;
    onCleanup(() => {
      cancelled = true;
    });
    if (source.value) URL.revokeObjectURL(source.value);
    source.value = '';
    if (!id) return;
    try {
      const blob = await readAvatarBlob(id);
      if (blob && !cancelled) source.value = URL.createObjectURL(blob);
    } catch {
      /* Initials remain visible if avatar storage is unavailable. */
    }
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  if (source.value) URL.revokeObjectURL(source.value);
});
</script>

<template>
  <span class="user-avatar" :class="`user-avatar-${size}`" :aria-label="`${name}'s avatar`">
    <img v-if="source" :src="source" alt="" >
    <span v-else aria-hidden="true">{{ initials }}</span>
  </span>
</template>
