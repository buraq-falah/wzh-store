import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ProductProvider } from '@/context/ProductContext';
import { Toaster } from '../components/ui/sonner';
import { Navbar } from '../components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LuxeThreads',
  description: 'Premium clothing store',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ProductProvider>
          <Navbar />
          <main>{children}</main>
          <Toaster position="bottom-right" />
        </ProductProvider>
      </body>
    </html>
  );
}