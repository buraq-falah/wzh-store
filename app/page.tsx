"use client";
import { useProducts } from "@/context/ProductContext";
import { ProductCard } from "../components/ProductCard";
import { Button } from "../components/ui/button";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Footer } from "../components/Footer";

export default function HomePage() {
  const { products, loading } = useProducts();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const videos = ["/videos/hat.mp4", "/videos/tshirt.mp4", "/videos/DIP.mp4"];

  const videoRefs = videos.map(() => useRef<HTMLVideoElement>(null));

  useEffect(() => {
    videoRefs.forEach((ref) => {
      if (ref.current) {
        ref.current.currentTime = 0;
        ref.current.play().catch(() => {});
      }
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
    }, 13000);
    return () => clearInterval(interval);
  }, [videos.length]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );

  return (
    <>
      <section className="relative h-[95vh] min-h-[520px] flex items-center justify-center overflow-hidden bg-black">
        {/* Video background */}
        {videos.map((video, index) => (
          <video
            ref={videoRefs[index]}
            key={index}
            autoPlay
            muted
            playsInline
            loop={true}
            preload="auto"
            className={`absolute inset-0 top-0 left-0 w-full h-full min-w-full min-h-full block object-cover object-center border-none m-0 p-0 will-change-transform transition-opacity duration-1000 ${
              index === currentVideoIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{ transform: "scale(1)" }}
          >
            <source src={video} type="video/quicktime" />
            <source src={video.replace(".mov", ".mp4")} type="video/mp4" />
          </video>
        ))}

        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(19,19,19,0.5),rgba(7,7,7,0.3))] z-10" />
        <div className="relative z-20 text-center px-6 max-w-4xl">
          <div className="inline-flex items-center justify-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm uppercase tracking-[0.35em] text-white/90 backdrop-blur-md mb-6">
            <span>Luxury fashion • Iconic accessories • Bold stories</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white">
            WZH
          </h1>
          <p className="text-lg md:text-2xl mt-5 text-white/80 max-w-2xl mx-auto">
            A premium clothing showcase built to reveal your brand story,
            highlight coveted accessories, and elevate every moment.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
             <Link href="/shop">
              <Button
                size="lg"
                className="rounded-full border cursor-pointer border-white bg-white text-red-500 px-8 shadow-xl hover:bg-red-500 hover:text-white transition-all duration-300"
              >
                Shop the Collection
              </Button>
            </Link>
            <Link href="/shop/Accessories">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-white/20 cursor-pointer text-white hover:bg-white/10 px-8"
              >
                Explore Accessories
              </Button>
            </Link>
           
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-20">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <div className="space-y-6">
            <span className="text-sm uppercase tracking-[0.4em] text-primary">
              Brand Story
            </span>
            <h2 className="text-4xl md:text-5xl font-semibold">
              WZH is where modern luxury redefines everyday dressing.
            </h2>
            <p className="max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              Our curated collections blend the precision of tailoring with
              textured finishes, bold accessories, and a refined aesthetic built
              for the discerning wardrobe. Every piece is designed to make your
              story unmistakably premium.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-xl">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500 mb-3">
                  Craft
                </p>
                <p className="font-semibold text-xl">
                  Seasonless silhouettes with couture details.
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-xl">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500 mb-3">
                  Mood
                </p>
                <p className="font-semibold text-xl">
                  Minimal elegance, polished for nightlife.
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-xl">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500 mb-3">
                  Signature
                </p>
                <p className="font-semibold text-xl">
                  Accessories that complete the luxury look.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-[2rem] overflow-hidden bg-slate-900 text-white shadow-2xl ring-1 ring-white/10">
            <div className="relative w-full aspect-[4/5] sm:aspect-[5/3] lg:aspect-[5/3] overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-[url('/brand_story.jpg')] bg-cover bg-center transition-transform duration-500 hover:scale-105" />
            </div>
            <div className="p-10">
              <span className="text-sm uppercase tracking-[0.4em] text-amber-300">
                WZH by PHOENIX
              </span>
              <h3 className="mt-5 text-3xl font-semibold">
                The emblem of confidence
              </h3>
              <p className="mt-4 text-slate-300">
                Our logo is more than a mark — it is a promise of luxury,
                resilience, and standout style. Every garment and accessory
                carries the same refined energy.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/90">
                  Luxury Design
                </span>
                <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/90">
                  Premium Materials
                </span>
                <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/90">
                  Modern Edge
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <span className="text-sm uppercase tracking-[0.35em] text-primary">
            Our Curations
          </span>
          <h2 className="text-4xl font-light mt-2">Best Sellers</h2>
          <div className="w-20 h-0.5 bg-primary mx-auto mt-4" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} isAdmin={false} />
          ))}
        </div>
        {/* ✅ Show More Button */}
        <div className="text-center mt-12">
          <Link href="/shop">
            <Button
              variant="outline"
              className="rounded-full px-8 border-gray-300 hover:border-primary hover:shadow-xs hover:bg-red-500 hover:text-white transition-all duration-300 cursor-pointer"
            >
              View All Products →
            </Button>
          </Link>
        </div>
      </section>

      <section className="bg-gradient-to-t from-gray-900 to-gray-950 text-white py-20">
        <Footer />
      </section>
    </>
  );
}