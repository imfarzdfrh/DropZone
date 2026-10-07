export interface Product {
  id: number;
  name: string;
  category: string;
  subcategory: string;
  kind: 'physical' | 'digital';
  price: number;
  image: string;
  summary: string;
  platform: string;
  featured?: boolean;
  demoPopular?: boolean;
  legacyCategory?: string;
}
