import { Product } from '@/types/product';

const STORAGE_KEY = 'wzh_products';

// 🌟 Default products to seed the store
const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 1,
    documentId: 'default_1',
    name: 'Classic White T-Shirt',
    price: 29.99,
    description: 'Essential white tee, 100% cotton.',
    categories: ['Men'],
    imageUrl: ['https://placehold.co/400x400?text=WZH'],
    details: { colors: ['White', 'Black'], sizes: ['S', 'M', 'L'] }
  },
  {
    id: 2,
    documentId: 'default_2',
    name: 'Slim Fit Denim Jacket',
    price: 89.99,
    description: 'Classic denim jacket with a modern slim fit.',
    categories: ['Unisex'],
    imageUrl: ['https://placehold.co/400x400?text=WZH'],
    details: { colors: ['Blue', 'Black'], sizes: ['M', 'L', 'XL'] }
  },
  {
    id: 3,
    documentId: 'default_3',
    name: 'Athletic Hoodie',
    price: 59.99,
    description: 'Comfortable hoodie for workouts and casual days.',
    categories: ['Women'],
    imageUrl: ['https://placehold.co/400x400?text=WZH'],
    details: { colors: ['Gray', 'Navy'], sizes: ['S', 'M', 'L', 'XL'] }
  }
];

export const getProducts = (): Product[] => {
  if (typeof window === 'undefined') return DEFAULT_PRODUCTS;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    // First visit – seed with defaults
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PRODUCTS));
    return DEFAULT_PRODUCTS;
  }
  try {
    const parsed = JSON.parse(stored);
    return parsed.length ? parsed : DEFAULT_PRODUCTS;
  } catch {
    return DEFAULT_PRODUCTS;
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
