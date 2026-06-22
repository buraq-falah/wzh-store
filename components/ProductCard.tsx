"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/types/product";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
  isAdmin?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ProductCard({
  product,
  isAdmin,
  onEdit,
  onDelete,
}: ProductCardProps) {
  const images = product.imageUrl || []; // now array of strings (direct URLs)
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const currentImage =
    images.length > 0 ? images[currentIndex] : "/placeholder.jpg";

  return (
    <Card className="group relative overflow-hidden rounded-2xl border-0 bg-white shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
      <Link href={`/product/${product.id}`} className="block cursor-pointer">
        <div className="relative aspect-[4/5] sm:aspect-square overflow-hidden bg-gray-100">
          <img
            src={currentImage}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-1.5 text-white opacity-0 transition-all duration-300 group-hover:opacity-100 hover:bg-black/80"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-1 text-white opacity-100 md:opacity-0 md:group-hover:opacity-100"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-1 text-white opacity-100 md:opacity-0 md:group-hover:opacity-100">
                {currentIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>

        <CardHeader className="px-3 py-3 sm:px-6 sm:py-4">
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="line-clamp-1 text-base sm:text-lg font-semibold tracking-tight">
                {product.name}
              </h3>

              <p className="text-sm text-muted-foreground capitalize">
                {product.categories?.join(", ") || "Uncategorized"}
              </p>
            </div>

            {product.details?.totalSales && (
              <div className="shrink-0 flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
                <span>🔥</span>
                <span className="whitespace-nowrap">
                  {product.details.totalSales} sold
                </span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="px-3 pb-3 sm:px-6 sm:pb-4">
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-bold text-primary">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-sm text-muted-foreground">USD</span>
          </div>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {product.description}
          </p>
        </CardContent>
      </Link>

      {isAdmin && (
        <CardFooter className="gap-2 border-t p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="flex-1 hover:bg-gray-100"
          >
            <Edit className="mr-1 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="flex-1 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="mr-1 h-4 w-4" />
            Delete
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
