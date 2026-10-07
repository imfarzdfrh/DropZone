import type { Product } from '../types/product';

export interface CatalogFilters {
  category?: string;
  subcategory?: string;
  search?: string;
  kind?: string;
  platform?: string;
  budget?: string;
  sort?: string;
  collection?: string;
}
export function filterProducts(products: Product[], filters: CatalogFilters): Product[] {
  const search = (filters.search || '').trim().toLowerCase();
  const result = products.filter((product) => {
    const legacy = ['Rifles', 'Knives', 'Pistols', 'Gloves'].includes(filters.category || '');
    return (
      (!filters.category ||
        (legacy
          ? product.legacyCategory === filters.category
          : product.category === filters.category)) &&
      (!filters.subcategory ||
        product.subcategory === filters.subcategory ||
        (filters.subcategory === 'digital-games' &&
          product.category === 'games' &&
          product.kind === 'digital')) &&
      (!search ||
        `${product.name} ${product.summary} ${product.platform}`.toLowerCase().includes(search)) &&
      (!filters.kind || product.kind === filters.kind) &&
      (!filters.platform || product.platform.split(' / ').includes(filters.platform)) &&
      (!filters.budget || product.price <= Number(filters.budget)) &&
      (filters.collection !== 'featured' || product.featured) &&
      (filters.collection !== 'popular' || product.demoPopular)
    );
  });
  if (filters.sort === 'price-low') result.sort((a, b) => a.price - b.price);
  if (filters.sort === 'price-high') result.sort((a, b) => b.price - a.price);
  if (filters.sort === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
  return result;
}
