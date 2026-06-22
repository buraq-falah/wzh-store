"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useProducts } from "@/context/ProductContext";
import { ProductCard } from "../../components/ProductCard";
import { ProductFilterNav } from "../../components/ProductFilterNav";
import { Input } from "../../components/ui/input";

export default function ShopPage() {
  const { products, loading } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((product) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;

    return (
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-background">
      {/* FILTER + SEARCH */}
      <section className="sticky top-0 z-10 bg-background/80 backdrop-blur ">
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
                  className="h-11 pl-11 pr-4 rounded-2xl bg-muted/30 focus-visible:ring-1 focus-visible:ring-primary/40 border-none shadow-2xs"
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
              {searchQuery ? `Results for “${searchQuery}”` : "Featured Collection"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Curated pieces designed for everyday wear.
            </p>
          </div>

          {/* Mobile-only mini count */}
          {/* <div className="rounded-2xl border bg-background px-4 py-2 text-sm text-muted-foreground lg:hidden">
            {filteredProducts.length} items
          </div> */}
        </div>
      </section>

      {/* CONTENT */}
      <section className="container mx-auto px-4 pb-14">
        {loading ? (
          <div className="min-h-[50vh] flex items-center justify-center">
            <div className="text-muted-foreground">
              Loading collection...
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center">
            <h3 className="text-lg font-medium">No matching products</h3>
            <p className="mt-2 text-muted-foreground">
              Try a different search term or clear filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:shadow-sm"
              >
                <ProductCard product={product} isAdmin={false} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}