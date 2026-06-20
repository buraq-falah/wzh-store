// import type { Metadata } from 'next';
// import { Inter } from 'next/font/google';
// import './globals.css';
// import { ProductProvider } from '@/context/ProductContext';
// import { Toaster } from '../components/ui/sonner';
// import { Navbar } from '../components/Navbar';

// const inter = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {
//   title: 'LuxeThreads',
//   description: 'Premium clothing store',
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <ProductProvider>
//           <Navbar />
//           <main>{children}</main>
//           <Toaster position="bottom-right" />
//         </ProductProvider>
//       </body>
//     </html>
//   );
// }

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ProductProvider } from '@/context/ProductContext';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Toaster } from 'sonner';


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WZH | Phoenix Wear',
  description: 'Premium clothing brand inspired by the phoenix',
  icons: {
    icon: '/favicon-new.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ProductProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <Toaster position="bottom-right" />
          </ProductProvider>
        </AuthProvider>
      </body>
    </html>
  );
}