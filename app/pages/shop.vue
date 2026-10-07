<script setup lang="ts">
import { products } from '~/data/catalog';
import { resolveCategory, categoryRoute } from '~/data/categories';
import { filterProducts } from '~/utils/catalog';
const route = useRoute();
const router = useRouter();
const getQuery = (key: string) =>
  typeof route.query[key] === 'string' ? (route.query[key] as string) : '';
const selected = computed(() => resolveCategory(getQuery('category'), getQuery('subcategory')));
const legacyCategory = computed(() =>
  ['Rifles', 'Knives', 'Pistols', 'Gloves'].includes(getQuery('category'))
    ? getQuery('category')
    : '',
);
const title = computed(
  () =>
    selected.value.subcategory?.label ||
    selected.value.category?.label ||
    legacyCategory.value ||
    (getQuery('collection') === 'featured'
      ? 'Featured products'
      : getQuery('collection') === 'popular'
        ? 'Bestsellers — demo selection'
        : 'The gaming store'),
);
// Merge in-flight filter edits so quick consecutive selections cannot overwrite each other.
let pendingFilters: Record<string, string | undefined> = {};
let filterChange = 0;
function update(key: string, value: string) {
  pendingFilters[key] = value || undefined;
  const change = ++filterChange;
  void router
    .replace({ path: '/shop', query: { ...route.query, ...pendingFilters } })
    .finally(() => {
      if (change === filterChange) pendingFilters = {};
    });
}
const sortBy = computed({
  get: () => getQuery('sort') || 'featured',
  set: (value: string) => update('sort', value),
});
const kind = computed({
  get: () => getQuery('kind'),
  set: (value: string) => update('kind', value),
});
const platform = computed({
  get: () => getQuery('platform'),
  set: (value: string) => update('platform', value),
});
const budget = computed({
  get: () => getQuery('budget'),
  set: (value: string) => update('budget', value),
});
const visibleProducts = computed(() =>
  filterProducts(products, {
    category: selected.value.category?.id || legacyCategory.value,
    subcategory: selected.value.subcategory?.id,
    search: getQuery('search'),
    kind: kind.value,
    platform: platform.value,
    budget: budget.value,
    sort: sortBy.value,
    collection: getQuery('collection'),
  }),
);
const hasFilters = computed(
  () => !!(getQuery('search') || kind.value || platform.value || budget.value),
);
function clearFilters() {
  void router.replace({
    path: '/shop',
    query: { category: selected.value.category?.id, subcategory: selected.value.subcategory?.id },
  });
}
useSeoMeta({
  title: () => `${title.value} | Dropzone`,
  description: 'Browse games, accounts, digital essentials, gaming gear and complete setups.',
});
</script>
<template>
  <div class="storefront dz-store">
    <SiteHeader />
    <main>
      <StoreLayout>
        <nav class="dz-breadcrumb" aria-label="Breadcrumb">
          <NuxtLink to="/">Home</NuxtLink><StoreIcon name="next" :size="14" /><NuxtLink to="/shop"
            >Shop</NuxtLink
          ><template v-if="selected.category"
            ><StoreIcon name="next" :size="14" /><NuxtLink
              :to="categoryRoute(selected.category.id)"
              >{{ selected.category.label }}</NuxtLink
            ></template
          ><template v-if="selected.subcategory"
            ><StoreIcon name="next" :size="14" /><span aria-current="page">{{
              selected.subcategory.label
            }}</span></template
          >
        </nav>
        <section class="dz-catalog-heading">
          <span class="section-kicker">GEAR UP FOR WHAT'S NEXT</span>
          <h1>{{ title }}</h1>
          <p>
            {{
              selected.category?.description ||
              'Games, gear and digital essentials. All in your corner.'
            }}
          </p>
          <div v-if="selected.category" class="dz-subcategory-chips">
            <NuxtLink
              :to="categoryRoute(selected.category.id)"
              :class="{ active: !selected.subcategory }"
              >All {{ selected.category.label.toLowerCase() }}</NuxtLink
            ><NuxtLink
              v-for="child in selected.category.children"
              :key="child.id"
              :to="categoryRoute(selected.category.id, child.id)"
              :class="{ active: selected.subcategory?.id === child.id }"
              >{{ child.label }}</NuxtLink
            >
          </div>
        </section>
        <div class="dz-catalog-toolbar">
          <span aria-live="polite"
            ><strong>{{ visibleProducts.length }}</strong> products<span v-if="getQuery('search')">
              for “{{ getQuery('search') }}”</span
            ></span
          ><FormField label="Sort by" input-id="catalog-sort"
            ><Select
              id="catalog-sort"
              v-model="sortBy"
              placeholder=""
              :options="[
                { label: 'Featured', value: 'featured' },
                { label: 'Price: low to high', value: 'price-low' },
                { label: 'Price: high to low', value: 'price-high' },
                { label: 'Name: A–Z', value: 'name' },
              ]"
          /></FormField>
        </div>
        <Card class="dz-filters"
          ><StoreIcon name="filter" /><FormField label="Product type" input-id="filter-kind"
            ><Select
              id="filter-kind"
              v-model="kind"
              placeholder=""
              :options="[
                { label: 'All types', value: '' },
                { label: 'Physical', value: 'physical' },
                { label: 'Digital', value: 'digital' },
              ]" /></FormField
          ><FormField label="Platform" input-id="filter-platform"
            ><Select
              id="filter-platform"
              v-model="platform"
              placeholder=""
              :options="[
                { label: 'All platforms', value: '' },
                ...['PC', 'Console', 'Steam', 'FACEIT', 'Setup', 'CS2', 'VALORANT'].map(
                  (value) => ({ label: value, value }),
                ),
              ]" /></FormField
          ><FormField label="Price range" input-id="filter-budget"
            ><Select
              id="filter-budget"
              v-model="budget"
              placeholder=""
              :options="[
                { label: 'Any price', value: '' },
                { label: 'Under $50', value: '50' },
                { label: 'Under $100', value: '100' },
                { label: 'Under $500', value: '500' },
              ]" /></FormField
          ><Button v-if="hasFilters" variant="ghost" @click="clearFilters"
            >Clear filters<StoreIcon name="close" :size="16" /></Button
        ></Card>
        <p class="dz-demo-note">
          Demo catalog · Illustrative products and prices · Checkout is not connected.
        </p>
        <div v-if="visibleProducts.length" class="dz-product-grid catalog-grid">
          <ProductCard v-for="product in visibleProducts" :key="product.id" :product="product" />
        </div>
        <Card v-else class="dz-empty"
          ><StoreIcon name="search" :size="36" />
          <h2>No products found</h2>
          <p>Try another search, category or price range.</p>
          <Button variant="outline" @click="clearFilters">Reset filters</Button
          ><Button variant="ghost" to="/shop">Browse all products</Button></Card
        >
      </StoreLayout>
    </main>
    <SiteFooter />
  </div>
</template>
