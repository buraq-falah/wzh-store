'use client';

import { useRouter, usePathname } from 'next/navigation';
import { cn } from '../lib/utils';

const categories = [
  { label: 'All', value: 'all' },
  { label: 'Men', value: 'Men' },
  { label: 'Women', value: 'Women' },
  { label: 'Accessories', value: 'Accessories' },
  { label: 'Hats', value: 'Hats' },
  { label: 'Sports', value: 'Sports' },
];

export function ProductFilterNav() {
  const router = useRouter();
  const pathname = usePathname();

  const currentCategory =
    pathname === '/shop' ? 'all' : pathname.split('/').pop() || 'all';

  const handleFilter = (category: string) => {
    if (category === 'all') router.push('/shop');
    else router.push(`/shop/${category}`);
  };

  return (
    <div className="my-3">
      {/* scrollable on mobile */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-2">
        {categories.map((cat) => {
          const active = currentCategory === cat.value;

          return (
            <button
              key={cat.value}
              type="button"
              onClick={() => handleFilter(cat.value)}
              className={cn(
                "whitespace-nowrap rounded-full px-4 py-2 text-sm transition-all",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/30 text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}