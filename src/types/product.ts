export interface ProductImage {
  id: number;
  url: string;
}

export interface ProductDetails {
  fit?: string;
  fabric?: string;
  neckline?: string;
  sleeve?: string;
  pattern?: string;
  style?: string[];
  season?: string;
  audience?: string[];
  scenarios?: string[];
  logistics?: string;
  brandCopy?: string;
  // sales stats
  totalSales?: number;
  storeTotalSales?: number;
  colors?: string[];    // قائمة الألوان المتاحة
  sizes?: string[];     // قائمة المقاسات المتاحة
  // any other custom fields
  [key: string]: any;
}

export interface Product {
  id: number;
  documentId: string;
  name: string;
  price: number;
  description: string;   // short description (plain text)
  category: string;
  imageUrl: string[];
  details?: ProductDetails;  // new JSON field
}
// Strapi response format
export interface StrapiProduct {
  id: number;
  attributes: {
    name: string;
    price: number;
    imageUrl: string[];
    category: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
}