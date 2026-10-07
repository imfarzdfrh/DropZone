<script setup lang="ts">
const props = defineProps<{ open: boolean; title: string }>();
const emit = defineEmits<{ close: [] }>();
const dialog = ref<HTMLDialogElement | null>(null);
const titleId = useId();
let previousOverflow = '';
function syncOpen(open: boolean) {
  if (!dialog.value) return;
  if (open && !dialog.value.open) {
    previousOverflow = document.body.style.overflow;
    dialog.value.showModal();
    document.body.style.overflow = 'hidden';
  } else if (!open && dialog.value.open) {
    dialog.value.close();
    document.body.style.overflow = previousOverflow;
  }
}
watch(() => props.open, syncOpen);
onMounted(() => syncOpen(props.open));
onBeforeUnmount(() => {
  if (dialog.value?.open) document.body.style.overflow = previousOverflow;
});
</script>
<template>
  <dialog
    ref="dialog"
    class="ui-drawer"
    :aria-labelledby="titleId"
    @cancel.prevent="emit('close')"
    @click="$event.target === dialog && emit('close')"
  >
    <div class="drawer-panel">
      <div class="drawer-heading">
        <h2 :id="titleId">{{ title }}</h2>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Close categories"
          autofocus
          @click="emit('close')"
          ><StoreIcon name="close"
        /></Button>
      </div>
      <slot />
    </div>
  </dialog>
</template>
