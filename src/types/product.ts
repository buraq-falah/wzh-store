export interface ProductImage {
  id: number;
  url: string;
}

export interface Product {
  id: number;
  documentId: string;
  name: string;
  price: number;
  description: string;
  category: string;
  imageUrl: ProductImage[];   // array of image objects with id and url
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