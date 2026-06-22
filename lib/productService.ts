import { supabase } from './supabaseClient';
import { Product } from '@/types/product';

// Helper to get the admin token (the same 'true' string from localStorage)
const getAdminToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_auth');
};

export const getProducts = async (): Promise<Product[]> => {
  try {
    const res = await fetch('/api/products', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to fetch products');
    }
    const data = await res.json();
    if (!Array.isArray(data)) {
      console.warn('API did not return an array, returning empty');
      return [];
    }
    return data.map((row: any) => ({
      id: row.id,
      documentId: row.document_id,
      name: row.name,
      price: row.price,
      description: row.description,
      categories: row.categories || [],   // ✅ fixed typo
      imageUrl: row.image_url || [],
      details: row.details || {},
    }));
  } catch (error) {
    console.error('Error fetching products from API:', error);
    return [];
  }
};

export const addProduct = async (product: Omit<Product, 'id' | 'documentId'>): Promise<Product> => {
  const res = await fetch('/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAdminToken()}`,
    },
    body: JSON.stringify(product),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to add product');
  }
  const data = await res.json();
  return {
    id: data.id,
    documentId: data.document_id,
    name: data.name,
    price: data.price,
    description: data.description,
    categories: data.categories || [],
    imageUrl: data.image_url || [],
    details: data.details || {},
  };
};

export const updateProduct = async (documentId: string, updatedData: Partial<Product>): Promise<Product> => {
  const res = await fetch('/api/products', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAdminToken()}`,
    },
    body: JSON.stringify({ documentId, ...updatedData }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to update product');
  }
  const data = await res.json();
  return {
    id: data.id,
    documentId: data.document_id,
    name: data.name,
    price: data.price,
    description: data.description,
    categories: data.categories || [],
    imageUrl: data.image_url || [],
    details: data.details || {},
  };
};

export const deleteProduct = async (documentId: string): Promise<void> => {
  const res = await fetch(`/api/products?documentId=${documentId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getAdminToken()}`,
    },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to delete product');
  }
};