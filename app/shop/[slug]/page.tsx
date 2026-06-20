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

  // First filter by category
  const categoryProducts = products.filter(p => p.category === slug);
  
  // Then filter by search query (name or description)
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
    <div className="min-h-screen bg-background">
      <section className="sticky top-0 z-10 bg-background/80 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            {/* Filters */}
            <div className="w-full">
              <ProductFilterNav />
            </div>

            {/* Search */}
            <div className="w-full lg:w-[360px]">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search styles, fabrics, descriptions..."
                  className="h-11 pl-11 pr-4 rounded-2xl bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/40"
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {filteredProducts.length}{" "}
                  {filteredProducts.length === 1 ? "item" : "items"}
                </span>
                {searchQuery ? (
                  <button
                    type="button"
                    className="hover:text-foreground transition-colors"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear
                  </button>
                ) : (
                  <span className="hidden sm:inline">Find your fit</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RESULTS HEADER */}
      <section className="container mx-auto px-4 pt-8 pb-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg md:text-xl font-medium tracking-tight">
              {searchQuery ? `Results for “${searchQuery}”` : `${slug} Collection`}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {searchQuery ? "Matching products" : `Explore our ${slug} collection`}
            </p>
          </div>
          <div className="rounded-2xl border bg-background px-4 py-2 text-sm text-muted-foreground lg:hidden">
            {filteredProducts.length} items
          </div>
        </div>
      </section>
                <section className="container mx-auto px-4 pb-14">
      {filteredProducts.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          {searchQuery ? `No products match "${searchQuery}" in ${slug} category.` : `No products in ${slug} category.`}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
      </section>
    </div>
  );
}