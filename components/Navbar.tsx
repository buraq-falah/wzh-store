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

"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Settings, LogOut, Menu, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { ProductFilterNav } from "./ProductFilterNav";
import { useState, useEffect } from "react";
import { cn } from "../lib/utils";
import { useAuth } from "@/context/AuthContext"; // Make sure this path is correct

// Component that will be rendered when the user is logged in
function AuthenticatedNavbar({ onLogout }: { onLogout: () => void }) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  return (
    <div className="hidden md:flex gap-8 text-sm font-medium">
      <Link
        href="/"
        className={cn(
          "relative pb-1 transition-colors duration-200",
          isActive("/")
            ? "font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:rounded-full"
            : "hover:text-primary",
        )}
        style={isActive("/") ? { color: "hsl(var(--primary))" } : undefined}
      >
        Home
      </Link>

      <Link
        href="/shop"
        className={cn(
          "relative pb-1 transition-colors duration-200",
          isActive("/shop")
            ? "font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:rounded-full"
            : "hover:text-primary",
        )}
        style={
          isActive("/shop") ? { color: "hsl(var(--primary))" } : undefined
        }
      >
        Shop
      </Link>
    </div>
  );
}

// Main Navbar component with all Hooks at the top
export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth(); // Hook called at the top
  const [scrolled, setScrolled] = useState(false); // Hook called at the top
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Hook called at the top

  const isAdmin = pathname === "/admin";
  const isLogin = pathname === "/login";

  // All other Hooks at the top
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Early returns must come AFTER all Hooks have been called
  if (isLogin) return null;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 w-full z-50 transition-all duration-300",
          scrolled
            ? "bg-background/80 backdrop-blur-md shadow-md"
            : "bg-background",
        )}
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <Link
              href="/"
              className="flex items-center gap-2 text-2xl font-bold tracking-tight"
            >
              <span className="bg-gradient-to-r from-[#ee1047] to-[#bc0b31] bg-clip-text text-transparent">
                WZH
              </span>
              <span className="text-lg font-light hidden sm:inline text-muted-foreground">
                | Brand
              </span>
            </Link>
          </div>

          <AuthenticatedNavbar onLogout={handleLogout} />

          <div className="flex items-center gap-3">
            {!isAdmin && pathname !== "/admin" && (
              <Link href="/admin">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Settings className="h-5 w-5" />
                </Button>
              </Link>
            )}
            {isAdmin && (
              <Button
                variant="ghost"
                onClick={handleLogout}
                size="sm"
                className="gap-2"
              >
                <LogOut className="h-4 w-4" /> Exit
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && !isAdmin && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-md pt-24 px-6">
          <nav className="flex flex-col gap-6 text-lg">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "transition-colors",
                pathname === "/" ? "font-semibold" : "hover:text-primary",
              )}
              style={
                pathname === "/" ? { color: "hsl(var(--primary))" } : undefined
              }
            >
              Home
            </Link>
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "transition-colors",
                pathname === "/shop" ? "font-semibold" : "hover:text-primary",
              )}
              style={
                pathname === "/shop" ? { color: "hsl(var(--primary))" } : undefined
              }
            >
              Shop
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}