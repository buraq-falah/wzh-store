
'use client';
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { Product } from '@/types/product';
import { 
  getProducts, 
  saveProducts, 
  addProduct as addProductToStorage, 
  updateProduct as updateProductInStorage, 
  deleteProduct as deleteProductFromStorage 
} from '../../lib/localStorageService';
import { toast } from 'sonner';

interface ProductContextType {
  products: Product[];
  loading: boolean;
  addProduct: (product: any) => Promise<void>;
  updateProduct: (documentId: string, product: any) => Promise<void>;
  deleteProduct: (documentId: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const isAddingRef = useRef(false);

  const loadProducts = () => {
    setLoading(true);
    const stored = getProducts();
    setProducts(stored);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const addProduct = async (productData: any) => {
    if (isAddingRef.current) return;
    isAddingRef.current = true;
    try {
      const newProduct = addProductToStorage(productData);
      setProducts(prev => [...prev, newProduct]);
      toast.success('Product added');
    } catch (error) {
      console.error(error);
      toast.error('Failed to add product');
    } finally {
      setTimeout(() => { isAddingRef.current = false; }, 500);
    }
  };

  const updateProduct = async (documentId: string, productData: any) => {
    try {
      const updated = updateProductInStorage(documentId, productData);
      if (updated) {
        setProducts(prev => prev.map(p => p.documentId === documentId ? updated : p));
        toast.success('Product updated');
      } else {
        toast.error('Product not found');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update product');
    }
  };

  const deleteProduct = async (documentId: string) => {
    try {
      const success = deleteProductFromStorage(documentId);
      if (success) {
        setProducts(prev => prev.filter(p => p.documentId !== documentId));
        toast.success('Product deleted');
      } else {
        toast.error('Product not found');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete product');
    }
  };

  return (
    <ProductContext.Provider value={{ products, loading, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProducts must be used within ProductProvider');
  return ctx;
}