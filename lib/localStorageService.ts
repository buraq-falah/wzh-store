import { Product } from '@/types/product';

const STORAGE_KEY = 'wzh_products';

export const getProducts = (): Product[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

export const saveProducts = (products: Product[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

export const addProduct = (product: Omit<Product, 'id' | 'documentId'>): Product => {
  const products = getProducts();
  const newProduct: Product = {
    ...product,
    id: Date.now(),
    documentId: `local_${Date.now()}`,
    imageUrl: product.imageUrl || [],
  };
  products.push(newProduct);
  saveProducts(products);
  return newProduct;
};

export const updateProduct = (documentId: string, updatedData: Partial<Product>): Product | null => {
  const products = getProducts();
  const index = products.findIndex(p => p.documentId === documentId);
  if (index === -1) return null;
  const updated = { ...products[index], ...updatedData };
  products[index] = updated;
  saveProducts(products);
  return updated;
};

export const deleteProduct = (documentId: string): boolean => {
  const products = getProducts();
  const filtered = products.filter(p => p.documentId !== documentId);
  if (filtered.length === products.length) return false;
  saveProducts(filtered);
  return true;
};