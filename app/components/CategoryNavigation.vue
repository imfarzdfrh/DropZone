<script setup lang="ts">
import { storeCategories, categoryRoute } from '~/data/categories';
withDefaults(defineProps<{ mode?: 'sidebar' | 'mega' }>(), { mode: 'sidebar' });
const emit = defineEmits<{ select: [] }>();
const route = useRoute();
const expanded = ref<string[]>([]);
watch(
  () => route.query.category,
  (id) => {
    if (typeof id === 'string' && !expanded.value.includes(id)) expanded.value.push(id);
  },
  { immediate: true },
);
function toggle(id: string) {
  expanded.value = expanded.value.includes(id)
    ? expanded.value.filter((item) => item !== id)
    : [...expanded.value, id];
}
const uid = useId();
</script>
<template>
  <nav
    :class="['category-navigation', `category-navigation-${mode}`]"
    :aria-label="mode === 'mega' ? 'Product category menu' : 'Product category sidebar'"
  >
    <NuxtLink
      v-if="mode === 'sidebar'"
      class="category-all"
      to="/shop"
      :aria-current="route.path === '/shop' && !route.query.category ? 'page' : 'false'"
      @click="emit('select')"
      ><StoreIcon name="grid" /> All products <StoreIcon name="right" :size="18"
    /></NuxtLink>
    <div
      v-for="category in storeCategories"
      :key="category.id"
      class="category-group"
      :class="{ 'category-group-active': route.query.category === category.id }"
    >
      <div class="category-group-heading">
        <NuxtLink
          :to="categoryRoute(category.id)"
          :aria-current="
            route.query.category === category.id && !route.query.subcategory ? 'page' : 'false'
          "
          @click="emit('select')"
          ><StoreIcon :name="category.icon" /><span>{{ category.label }}</span></NuxtLink
        >
        <Button
          v-if="mode === 'sidebar'"
          variant="ghost"
          size="icon"
          :aria-label="`${expanded.includes(category.id) ? 'Collapse' : 'Expand'} ${category.label}`"
          :aria-expanded="expanded.includes(category.id)"
          :aria-controls="`${uid}-${category.id}`"
          @click="toggle(category.id)"
          ><StoreIcon
            name="chevron"
            :size="18"
            :class="{ rotated: expanded.includes(category.id) }"
        /></Button>
      </div>
      <div
        v-show="mode === 'mega' || expanded.includes(category.id)"
        :id="`${uid}-${category.id}`"
        class="category-children"
      >
        <NuxtLink
          v-for="child in category.children"
          :key="child.id"
          :to="categoryRoute(category.id, child.id)"
          :aria-current="
            route.query.category === category.id && route.query.subcategory === child.id
              ? 'page'
              : 'false'
          "
          @click="emit('select')"
          >{{ child.label }}</NuxtLink
        >
      </div>
    </div>
  </nav>
</template>
