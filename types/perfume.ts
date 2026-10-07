export type ProductCategory = 'importados' | 'arabes' | 'lab8' | 'brands';
export type GenderCategory = 'masculino' | 'feminino' | 'unissex';

export type OlfactoryFamily = 
  | 'Amadeirado'
  | 'Oriental'
  | 'Gourmand'
  | 'Cítrico'
  | 'Floral'
  | 'Aromático'
  | 'Especiado'
  | 'Frutado Chipre'
  | 'Amadeirado Chipre';

export interface ProductSizeOption {
  size: string; // e.g., '2ml', '5ml', '10ml', '50ml', '100ml'
  price: number;
  originalPrice?: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  type?: string; // e.g. 'Eau de Parfum', 'Eau de Toilette'
  image?: string; // Direct product image URL (e.g. '/products/dior-sauvage.jpg')
  subcategories?: string[]; // e.g. 'lancamentos', 'mais-vendidos', 'nicho'
  concentration: string; // e.g. 'Extrait de Parfum', 'Eau de Parfum', 'Eau de Toilette'
  rating: number;
  reviewsCount: number;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  images: string[];
  description: string;
  olfactoryFamily: OlfactoryFamily;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  occasion: string;
  longevity: string; // Fixação
  sillage: string; // Projeção
  gender: GenderCategory;
  availableSizes: ProductSizeOption[];
  isNew?: boolean;
  isBestSeller?: boolean;
  isSpecialOffer?: boolean;
  isDecant?: boolean;
  badge?: string;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  quantity: number;
  unitPrice: number;
}

export type PageView = 
  | 'home'
  | 'brands'
  | 'ofertas'
  | 'importados'
  | 'arabes'
  | 'lab8'
  | 'feedbacks'
  | 'checkout';
