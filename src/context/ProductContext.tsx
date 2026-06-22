// "use client";

// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   useRef,
// } from "react";
// import { strapi, normalizeProduct } from "../../lib/strapi";
// import { Product } from "@/types/product";
// import { toast } from "sonner";

// interface ProductContextType {
//   products: Product[];
//   loading: boolean;
//   addProduct: (product: any) => Promise<void>;
//   updateProduct: (documentId: string, product: any) => Promise<void>;
//   deleteProduct: (documentId: string) => Promise<void>;
//   storeTotalSales?: number; // Optional if you want to track total sales across all products
// }

// const ProductContext = createContext<ProductContextType | undefined>(undefined);

// export function ProductProvider({ children }: { children: React.ReactNode }) {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const isAddingRef = useRef(false);
//   const storeTotalSales = products.reduce((total, product) => {
//     return total + (product.details?.totalSales || 0);
//   }, 0);

//   const fetchProducts = async () => {
//     setLoading(true);
//     try {
//       const res = await strapi.get("/products?populate=imageUrl"); // تأكد من populate
//       const itemsData = res.data.data || res.data;
//       const items = (Array.isArray(itemsData) ? itemsData : []).map(
//         normalizeProduct,
//       );
//       setProducts(items);
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to load products");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const addProduct = async (productData: any) => {
//     if (isAddingRef.current) return;
//     isAddingRef.current = true;

//     try {
//       // أرسل البيانات كما هي (بدون تحويل إضافي)
//       const res = await strapi.post("/products", { data: productData });
//       const newDocumentId = res.data.data.documentId;

//       // أعد جلب المنتج مع الصور
//       const fetchRes = await strapi.get(
//         `/products/${newDocumentId}?populate=imageUrl`,
//       );
//       const newProduct = normalizeProduct(fetchRes.data.data);
//       setProducts((prev) => [...prev, newProduct]);
//       toast.success("Product added successfully");
//     } catch (error: any) {
//       console.error("Add error:", error.response?.data);
//       toast.error(
//         error.response?.data?.error?.message || "Failed to add product",
//       );
//     } finally {
//       setTimeout(() => {
//         isAddingRef.current = false;
//       }, 500);
//     }
//   };

//   const updateProduct = async (documentId: string, productData: any) => {
//     try {
//       await strapi.put(`/products/${documentId}`, { data: productData });
//       const fetchRes = await strapi.get(
//         `/products/${documentId}?populate=imageUrl`,
//       );
//       const updated = normalizeProduct(fetchRes.data.data);
//       setProducts((prev) =>
//         prev.map((p) => (p.documentId === documentId ? updated : p)),
//       );
//       toast.success("Product updated");
//     } catch (error: any) {
//       console.error("Update error:", error.response?.data);
//       toast.error(
//         error.response?.data?.error?.message || "Failed to update product",
//       );
//     }
//   };

//   const deleteProduct = async (documentId: string) => {
//     try {
//       await strapi.delete(`/products/${documentId}`);
//       setProducts((prev) => prev.filter((p) => p.documentId !== documentId));
//       toast.success("Product deleted");
//     } catch (error: any) {
//       console.error("Delete error:", error.response?.data);
//       toast.error("Failed to delete product");
//     }
//   };

//   return (
//     <ProductContext.Provider
//       value={{ products, loading, addProduct, updateProduct, deleteProduct, storeTotalSales }}
//     >
//       {children}
//     </ProductContext.Provider>
//   );
// }

// export function useProducts() {
//   const ctx = useContext(ProductContext);
//   if (!ctx) throw new Error("useProducts must be used within ProductProvider");
//   return ctx;
// }

'use client';
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { Product } from '@/types/product';
import { getProducts, addProduct as addProductToDB, updateProduct as updateProductInDB, deleteProduct as deleteProductFromDB } from '../../lib/productService';
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

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      // Ensure data is always an array
      const items = Array.isArray(data) ? data : [];
      setProducts(items);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products');
      setProducts([]); // fallback to empty array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const addProduct = async (productData: any) => {
    if (isAddingRef.current) return;
    isAddingRef.current = true;
    try {
      const newProduct = await addProductToDB(productData);
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
      const updated = await updateProductInDB(documentId, productData);
      setProducts(prev => prev.map(p => p.documentId === documentId ? updated : p));
      toast.success('Product updated');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update product');
    }
  };

  const deleteProduct = async (documentId: string) => {
    try {
      await deleteProductFromDB(documentId);
      setProducts(prev => prev.filter(p => p.documentId !== documentId));
      toast.success('Product deleted');
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