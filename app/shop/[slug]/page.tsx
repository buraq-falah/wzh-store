'use client';
import { useParams } from 'next/navigation';
import { useState } from "react";
import { Search } from "lucide-react";
import { useProducts } from "@/context/ProductContext";
import { ProductCard } from "../../../components/ProductCard";
import { ProductFilterNav } from "../../../components/ProductFilterNav";
import { Input } from "../../../components/ui/input";

export default function CategoryPage() {
  const { slug } = useParams();
  const { products, loading } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Convert slug to a string (handle undefined or array)
  const categorySlug = typeof slug === 'string' ? slug : (Array.isArray(slug) ? slug[0] : '');

  // Filter by category (product.categories array includes the slug)
  const categoryProducts = products.filter(p => 
    p.categories && p.categories.includes(categorySlug)
  );
  
  // Apply search filter (name or description)
  const filteredProducts = categoryProducts.filter((product) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
  });

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductFilterNav />
      <div className="mt-4">
        <h1 className="text-2xl font-bold capitalize">{categorySlug}</h1>
        {/* Search bar */}
        <div className="relative max-w-md mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search styles, fabrics, descriptions..."
            className="pl-10"
          />
        </div>
        <div className="mt-4">
          <span className="text-sm text-muted-foreground">
            {filteredProducts.length} items
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-4">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {filteredProducts.length === 0 && (
          <p className="text-center text-muted-foreground mt-8">
            No products found in this category.
          </p>
        )}
      </div>
    </div>
  );
}