// 'use client';

// import { useState } from 'react';
// import { useProducts } from '@/context/ProductContext';
// import { ProductFormModal } from '../../components/ProductFormModal';
// import { DeleteConfirmDialog } from '../../components/DeleteConfirmDialog';
// import { Button } from '../../components/ui/button';
// import { Plus } from 'lucide-react';
// import { ProductCard } from '../../components/ProductCard';
// import { Product } from '@/types/product';

// export default function AdminPage() {
//   const { products, loading, addProduct, updateProduct, deleteProduct, storeTotalSales } = useProducts();
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [productToDelete, setProductToDelete] = useState<Product | null>(null);

//   const handleEdit = (product: Product) => {
//     setEditingProduct(product);
//     setModalOpen(true);
//   };

//   const handleAdd = () => {
//     setEditingProduct(null);
//     setModalOpen(true);
//   };

//   const handleSave = async (productData: any) => {
//     if (editingProduct) {
//       await updateProduct(editingProduct.documentId, productData);
//     } else {
//       await addProduct(productData);
//     }
//   };

//   const handleDeleteClick = (product: Product) => {
//     setProductToDelete(product);
//     setDeleteDialogOpen(true);
//   };

//   const confirmDelete = async () => {
//     if (productToDelete) {
//       await deleteProduct(productToDelete.documentId);
//       setDeleteDialogOpen(false);
//       setProductToDelete(null);
//     }
//   };

//   if (loading) return <div className="container mx-auto py-8 text-center">Loading...</div>;

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-8">
//         <div>
//           <h1 className="text-3xl font-bold">Product Management</h1>
//           <p className="text-muted-foreground">Add, edit, or remove products</p>
//         </div>
//         <Button onClick={handleAdd} className="gap-2"><Plus className="h-4 w-4" /> Add Product</Button>
//       </div>

//       {/* <div className="mb-6 p-4 bg-muted rounded-lg">
//         <p className="text-lg font-semibold">Store Total Sales: ${storeTotalSales.toFixed(2)}</p>
//       </div> */}

//       {products.length === 0 ? (
//         <div className="text-center py-12 border rounded-lg">
//           <p className="text-muted-foreground">No products yet. Click "Add Product" to start.</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {products.map((product) => (
//             <ProductCard
//               key={product.id}
//               product={product}
//               isAdmin
//               onEdit={() => handleEdit(product)}
//               onDelete={() => handleDeleteClick(product)}
//             />
//           ))}
//         </div>
//       )}

//       <ProductFormModal open={modalOpen} onOpenChange={setModalOpen} product={editingProduct} onSave={handleSave} />
//       <DeleteConfirmDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} onConfirm={confirmDelete} productName={productToDelete?.name || ''} />
//     </div>
//   );
// }
"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useProducts } from "@/context/ProductContext";
import { ProductFormModal } from "../../components/ProductFormModal";
import { DeleteConfirmDialog } from "../../components/DeleteConfirmDialog";
import { Button } from "../../components/ui/button";
import { Plus } from "lucide-react";
import { ProductCard } from "../../components/ProductCard";
import { Product } from "@/types/product";

export default function AdminPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { products, loading, addProduct, updateProduct, deleteProduct } =
    useProducts();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const isSavingRef = useRef(false);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleSave = async (productData: any) => {
    if (isSavingRef.current) return;
    isSavingRef.current = true;
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.documentId, productData);
      } else {
        await addProduct(productData);
      }
    } finally {
      setTimeout(() => {
        isSavingRef.current = false;
      }, 500);
    }
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      await deleteProduct(productToDelete.documentId);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  if (loading)
    return (
      <div className="container mx-auto py-8 text-center">
        Loading products...
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Product Management</h1>
          <p className="text-muted-foreground">Add, edit, or remove products</p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">
            No products yet. Click "Add Product" to start.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isAdmin
              onEdit={() => handleEdit(product)}
              onDelete={() => handleDeleteClick(product)}
            />
          ))}
        </div>
      )}

      <ProductFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        product={editingProduct}
        onSave={handleSave}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        productName={productToDelete?.name || ""}
      />
    </div>
  );
}
