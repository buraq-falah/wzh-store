import { supabase } from './supabaseClient';
import { Product } from '@/types/product';

// Helper to get the admin token (the same 'true' string from localStorage)
const getAdminToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_auth');
};

// GET – still uses Supabase directly (public read)
export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('id', { ascending: true });
  if (error) {
    console.error('Supabase error:', error);
    return [];
  }
  return (data || []).map(row => ({
    id: row.id,
    documentId: row.document_id,
    name: row.name,
    price: row.price,
    description: row.description,
    category: row.category,
    imageUrl: row.image_url || [],
    details: row.details || {}
  }));
};

// POST – uses API route with admin token
export const addProduct = async (product: Omit<Product, 'id' | 'documentId'>): Promise<Product> => {
  const res = await fetch('/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAdminToken()}`
    },
    body: JSON.stringify(product)
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
    category: data.category,
    imageUrl: data.image_url || [],
    details: data.details || {}
  };
};

export const updateProduct = async (documentId: string, updatedData: Partial<Product>): Promise<Product> => {
  const res = await fetch('/api/products', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAdminToken()}`
    },
    body: JSON.stringify({ documentId, ...updatedData })
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
    category: data.category,
    imageUrl: data.image_url || [],
    details: data.details || {}
  };
};

export const deleteProduct = async (documentId: string): Promise<void> => {
  const res = await fetch(`/api/products?documentId=${documentId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getAdminToken()}`
    }
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to delete product');
  }
};