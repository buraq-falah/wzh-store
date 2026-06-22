// "use client";
// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { Settings, LogOut, Menu, X } from "lucide-react";
// import { Button } from "../components/ui/button";
// import { useState, useEffect } from "react";
// import { cn } from "../lib/utils";

// export function Navbar() {
//   const pathname = usePathname();
//   const router = useRouter();
//   const isAdmin = pathname === "/admin";
//   const isLogin = pathname === "/login";
//   const [scrolled, setScrolled] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 20);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   if (isLogin) return null;

//   const handleLogout = () => {
//     localStorage.removeItem("strapi_jwt");
//     router.push("/");
//   };

//   const isActive = (href: string) => pathname === href;

//   return (
//     <>
//       <header
//         className={cn(
//           "sticky top-0 w-full z-50 transition-all duration-300",
//           scrolled
//             ? "bg-background/80 backdrop-blur-md shadow-md text-gray-300 text-shadow-sm"
//             : "bg-background",
//         )}
//       >
//         <div className="container mx-auto px-6 py-4 flex items-center">
//           {/* Left - Logo (flex-1) */}
//           <div className="flex-1 flex justify-start">
//             <Link
//               href="/"
//               className="flex items-center gap-2 text-2xl font-bold tracking-tight"
//             >
//               <span className="bg-gradient-to-r from-[#6B2D3D] to-[#8B3A4B] bg-clip-text text-transparent">
//                 WZH
//               </span>
//               <span className="text-lg font-light hidden sm:inline text-muted-foreground">
//                 | PHOENIX
//               </span>
//             </Link>
//           </div>

//           {/* Center - Desktop Navigation (flex-1) */}
//           <div className="flex-1 flex justify-center">
//             <div className="hidden md:flex gap-8 text-sm font-medium">
//               {!isAdmin && (
//                 <>
//                   <Link
//                     href="/"
//                     className={cn(
//                       "relative pb-1 transition-colors duration-200",
//                       isActive("/")
//                         ? "font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:rounded-full"
//                         : "hover:text-primary",
//                     )}
//                     style={
//                       isActive("/") ? { color: "hsl(var(--primary))" } : undefined
//                     }
//                   >
//                     Home
//                   </Link>

//                   <Link
//                     href="/shop"
//                     className={cn(
//                       "relative pb-1 transition-colors duration-200",
//                       isActive("/shop")
//                         ? "font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:rounded-full"
//                         : "hover:text-primary",
//                     )}
//                     style={
//                       isActive("/shop")
//                         ? { color: "hsl(var(--primary))" }
//                         : undefined
//                     }
//                   >
//                     Shop
//                   </Link>
//                 </>
//               )}
//             </div>
//           </div>

//           {/* Right - Buttons (flex-1) */}
//           <div className="flex-1 flex justify-end items-center gap-3">
//             {isAdmin && (
//               <Button
//                 variant="ghost"
//                 onClick={handleLogout}
//                 size="sm"
//                 className="gap-2"
//               >
//                 <LogOut className="h-4 w-4" /> Exit
//               </Button>
//             )}
//             <Button
//               variant="ghost"
//               size="icon"
//               className="md:hidden rounded-full"
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             >
//               {mobileMenuOpen ? <X /> : <Menu />}
//             </Button>
//           </div>
//         </div>
//       </header>

//       {/* Mobile menu */}
//       {mobileMenuOpen && !isAdmin && (
//         <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-md pt-24 px-6">
//           <nav className="flex flex-col gap-6 text-lg">
//             <Link
//               href="/"
//               onClick={() => setMobileMenuOpen(false)}
//               className={cn(
//                 "transition-colors",
//                 isActive("/") ? "font-semibold" : "hover:text-primary",
//               )}
//               style={
//                 isActive("/") ? { color: "hsl(var(--primary))" } : undefined
//               }
//             >
//               Home
//             </Link>
//             <Link
//               href="/shop"
//               onClick={() => setMobileMenuOpen(false)}
//               className={cn(
//                 "transition-colors",
//                 isActive("/shop") ? "font-semibold" : "hover:text-primary",
//               )}
//               style={
//                 isActive("/shop") ? { color: "hsl(var(--primary))" } : undefined
//               }
//             >
//               Shop
//             </Link>
//           </nav>
//         </div>
//       )}
//     </>
//   );
// }

'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Settings, LogOut, Menu, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const isAdmin = pathname === '/admin';
  const isLogin = pathname === '/login';
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLogin) return null;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <header
        className={cn(
          'fixed top-0 w-full z-50 transition-all duration-300',
          scrolled
            ? 'bg-black/60 backdrop-blur-md shadow-lg'   // darker on scroll
            : 'bg-black/30 backdrop-blur-sm'             // lighter transparent
        )}
      >
        <div className="container mx-auto px-6 py-4 flex items-center">
          {/* Left: Logo */}
          <div className="flex-1 flex justify-start">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent drop-shadow-lg">
                WZH
              </span>
              <span className="text-lg font-light hidden sm:inline text-white/70 drop-shadow-lg">
                | PHOENIX
              </span>
            </Link>
          </div>

          {/* Center: Navigation */}
          <div className="flex-1 flex justify-center">
            <div className="hidden md:flex gap-8 text-sm font-medium">
              {!isAdmin && (
                <>
                  <Link
                    href="/"
                    className={cn(
                      'relative pb-1 transition-colors duration-200 text-white/90 hover:text-white',
                      isActive('/') &&
                        'after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-red-600 after:rounded-full'
                    )}
                    // style={isActive('/') ? { color: '#EF1111' } : undefined}
                  >
                    Home
                  </Link>
                  <Link
                    href="/shop"
                    className={cn(
                      'relative pb-1 transition-colors duration-200 text-white/90 hover:text-white',
                      isActive('/shop') &&
                        'after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-red-600 after:rounded-full'
                    )}
                    // style={isActive('/shop') ? { color: '#EF4444' } : undefined}
                  >
                    Shop
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right: Buttons */}
          <div className="flex-1 flex justify-end items-center gap-3">
            {!isAdmin && pathname !== '/admin' && (
              <Link href="/admin">
                <Button variant="ghost" size="icon" className="rounded-full text-white/70 hover:text-white hover:bg-white/10">
                  <Settings className="h-5 w-5" />
                </Button>
              </Link>
            )}
            {isAdmin && (
              <Button
                variant="ghost"
                onClick={handleLogout}
                size="sm"
                className="gap-2 text-white/70 hover:text-white hover:bg-white/10"
              >
                <LogOut className="h-4 w-4" /> Exit
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full text-white/70 hover:text-white hover:bg-white/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && !isAdmin && (
        <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md pt-24 px-6">
          <nav className="flex flex-col gap-6 text-lg text-white">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                'transition-colors',
                isActive('/') ? 'text-red-500' : 'hover:text-red-500'
              )}
            >
              Home
            </Link>
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                'transition-colors',
                isActive('/shop') ? 'text-red-500' : 'hover:text-red-500'
              )}
            >
              Shop
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}