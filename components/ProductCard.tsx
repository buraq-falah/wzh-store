'use client';
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/types/product';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
  isAdmin?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ProductCard({ product, isAdmin, onEdit, onDelete }: ProductCardProps) {
  const images = product.imageUrl || [];
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

  const currentImage = images.length > 0 ? images[currentIndex].url : '/placeholder.jpg';
  console.log('Product description:', product.description);

  return (
    <Card className="overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] group bg-card border-0 shadow-lg">
      <Link href={`/product/${product.id}`} className="cursor-pointer flex-1">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={currentImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
          {/* أزرار السلايدر – تظهر فقط إذا كان هناك أكثر من صورة */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 w-8 h-8 flex items-center justify-center"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 w-8 h-8 flex items-center justify-center"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              {/* مؤشر رقم الصورة الحالية */}
              <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                {currentIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>
        <CardHeader className="pb-2">
          <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
          <p className="text-sm text-muted-foreground capitalize">{product.category}</p>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</p>
          <p className="text-muted-foreground text-sm line-clamp-2 mt-2">{product.description}</p>
        </CardContent>
      </Link>
      {isAdmin && (
        <CardFooter className="gap-2 pt-2 border-t">
          <Button variant="outline" size="sm" className="flex-1" onClick={onEdit}>Edit</Button>
          <Button variant="destructive" size="sm" className="flex-1" onClick={onDelete}>Delete</Button>
        </CardFooter>
      )}
    </Card>
  );
}