// data/products.ts

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
  description?: string;
  category?: string;
}


