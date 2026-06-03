'use client';
import { useParams } from 'next/navigation';
import { useProducts } from '@/context/ProductContext';
import { useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../../components/ui/button';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { products, loading } = useProducts();
  const product = products.find(p => p.id === Number(id));
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!product) return <div className="text-center py-12">Product not found</div>;

  // استخدام product.imageUrl بدلاً من product.images
  const images = product.imageUrl || [];

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid md:grid-cols-2 gap-8">
        {/* قسم الصور - يعمل مع مصفوفة imageUrl */}
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-xl bg-gray-100">
            <div className="embla" ref={emblaRef}>
              <div className="embla__container flex">
                {images.map((img, idx) => (
                  <div key={idx} className="embla__slide min-w-0 flex-[0_0_100%]">
                    <img 
                      src={img.url} 
                      alt={`${product.name} - ${idx+1}`} 
                      className="w-full h-[400px] object-cover rounded-xl" 
                    />
                  </div>
                ))}
              </div>
            </div>
            {images.length > 1 && (
              <>
                <Button variant="outline" size="icon" className="absolute left-2 top-1/2 -translate-y-1/2" onClick={scrollPrev}>
                  <ChevronLeft />
                </Button>
                <Button variant="outline" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2" onClick={scrollNext}>
                  <ChevronRight />
                </Button>
              </>
            )}
          </div>
          {/* الصور المصغرة - تعمل مع imageUrl */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img.url}
                  alt={`thumb ${idx}`}
                  className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 ${idx === selectedIndex ? 'border-primary' : 'border-transparent'}`}
                  onClick={() => {
                    setSelectedIndex(idx);
                    emblaApi?.scrollTo(idx);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* معلومات المنتج */}
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-muted-foreground capitalize mt-1">{product.category}</p>
          <p className="text-3xl font-bold text-primary mt-4">${product.price.toFixed(2)}</p>
          <div className="mt-6 prose max-w-none">
            <h3 className="font-semibold">Description:</h3>
            <p>{product.description}</p>
          </div>
          <Button className="mt-8 w-full md:w-auto">Add to Cart</Button>
        </div>
      </div>
    </div>
  );
}