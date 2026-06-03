'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('strapi_jwt');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return <>{children}</>;
}