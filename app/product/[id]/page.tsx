"use client";
import { useParams } from "next/navigation";
import { useProducts } from "@/context/ProductContext";
import { useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  ChevronLeft,
  ChevronRight,
  Package,
  Truck,
  Award,
  Users,
} from "lucide-react";
import { Button } from "../../../components/ui/button";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { products, loading } = useProducts();
  const product = products.find((p) => p.id === Number(id));
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!product)
    return <div className="text-center py-12">Product not found</div>;

  const images = product.imageUrl || [];
  const details = product.details || {};

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  // Helper to render comma-separated arrays
  const renderArray = (arr?: string[]) =>
    arr && arr.length ? arr.join(", ") : null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-xl bg-gray-100">
            <div className="embla" ref={emblaRef}>
              <div className="embla__container flex">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="embla__slide min-w-0 flex-[0_0_100%]"
                  >
                    <img
                      src={img.url}
                      alt={`${product.name} - ${idx + 1}`}
                      className="w-full h-[400px] object-cover rounded-xl"
                    />
                  </div>
                ))}
              </div>
            </div>
            {images.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2"
                  onClick={scrollPrev}
                >
                  <ChevronLeft />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={scrollNext}
                >
                  <ChevronRight />
                </Button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img.url}
                  alt={`thumb ${idx}`}
                  className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 ${idx === selectedIndex ? "border-primary" : "border-transparent"}`}
                  onClick={() => {
                    setSelectedIndex(idx);
                    emblaApi?.scrollTo(idx);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {product.name}
            </h1>
            <p className="text-muted-foreground capitalize mt-1">
              {product.category}
            </p>
            <p className="text-3xl font-bold text-primary mt-4">
              ${product.price.toFixed(2)}
            </p>
          </div>

          {product.details?.totalSales && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
              <span className="font-medium">✅ Sold:</span>{" "}
              {product.details.totalSales} pieces
            </div>
          )}

          {/* Short Description */}
          <div className="prose max-w-none">
            <p className="text-gray-600 dark:text-gray-300">
              {product.description}
            </p>
          </div>

          {/* Specifications Table */}
          {(details.fit ||
            details.fabric ||
            details.neckline ||
            details.sleeve ||
            details.pattern ||
            details.style ||
            details.season ||
            details.audience ||
            details.scenarios) && (
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" /> Specifications
              </h2>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                {details.fit && (
                  <>
                    <dt className="font-medium text-muted-foreground">Fit</dt>
                    <dd>{details.fit}</dd>
                  </>
                )}
                {details.fabric && (
                  <>
                    <dt className="font-medium text-muted-foreground">
                      Fabric
                    </dt>
                    <dd>{details.fabric}</dd>
                  </>
                )}
                {details.neckline && (
                  <>
                    <dt className="font-medium text-muted-foreground">
                      Neckline
                    </dt>
                    <dd>{details.neckline}</dd>
                  </>
                )}
                {details.sleeve && (
                  <>
                    <dt className="font-medium text-muted-foreground">
                      Sleeve
                    </dt>
                    <dd>{details.sleeve}</dd>
                  </>
                )}
                {details.pattern && (
                  <>
                    <dt className="font-medium text-muted-foreground">
                      Pattern
                    </dt>
                    <dd>{details.pattern}</dd>
                  </>
                )}
                {details.style && (
                  <>
                    <dt className="font-medium text-muted-foreground">Style</dt>
                    <dd>{renderArray(details.style)}</dd>
                  </>
                )}
                {details.season && (
                  <>
                    <dt className="font-medium text-muted-foreground">
                      Season
                    </dt>
                    <dd>{details.season}</dd>
                  </>
                )}
                {details.audience && (
                  <>
                    <dt className="font-medium text-muted-foreground">
                      Audience
                    </dt>
                    <dd>{renderArray(details.audience)}</dd>
                  </>
                )}
                {details.scenarios && (
                  <>
                    <dt className="font-medium text-muted-foreground">
                      Best for
                    </dt>
                    <dd>{renderArray(details.scenarios)}</dd>
                  </>
                )}
              </dl>
            </div>
          )}

          {/* Logistics & Aftersales */}
          {details.logistics && (
            <div className="bg-muted/30 rounded-lg p-4 flex items-start gap-3">
              <Truck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">📦 Shipping & Returns</h3>
                <p className="text-sm text-muted-foreground">
                  {details.logistics}
                </p>
              </div>
            </div>
          )}

          {/* Brand Story */}
          {details.brandCopy && (
            <div className="border-l-4 border-primary pl-4 italic text-muted-foreground">
              <p>{details.brandCopy}</p>
            </div>
          )}

          {/* Sales Statistics */}
          {(details.totalSales !== undefined ||
            details.storeTotalSales !== undefined) && (
            <div className="flex gap-6 text-sm text-muted-foreground border-t pt-6">
              {details.totalSales !== undefined && (
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span>Sold: {details.totalSales} units</span>
                </div>
              )}
              {details.storeTotalSales !== undefined && (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Store total: {details.storeTotalSales} sales</span>
                </div>
              )}
            </div>
          )}

          {/* Add to Cart Button */}
          <Button className="mt-4 w-full md:w-auto px-8">Add to Cart</Button>
        </div>
      </div>
    </div>
  );
}
