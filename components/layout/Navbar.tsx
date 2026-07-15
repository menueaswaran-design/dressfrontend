"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, ShoppingBag, User, Menu, X, LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { useUIStore } from "@/store/ui";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

const fallbackLinks = [
  { label: "Home", href: "/" },
  { label: "Men", href: "/shop?gender=men" },
  { label: "Women", href: "/shop?gender=women" },
  { label: "Oversized", href: "/shop?category=oversized" },
];

export default function Navbar() {
  const [navLinks, setNavLinks] = useState<{ label: string; href: string }[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const cartCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const setSearchOpen = useUIStore((s) => s.setSearchOpen);
  const setLoginOpen = useUIStore((s) => s.setLoginOpen);
  const setCartOpen = useCartStore((s) => s.setIsOpen);
  const isMobileMenuOpen = useUIStore((s) => s.isMobileMenuOpen);
  const setMobileMenuOpen = useUIStore((s) => s.setMobileMenuOpen);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    const fetchNav = async () => {
      try {
        const { data } = await api.get("/navigation/header");
        const items = data?.data?.navigation?.items || [];
        const links = items
          .filter((item: any) => item.isActive && item.label)
          .map((item: any) => ({
            label: item.label,
            href: item.url || `/shop?category=${item.referenceId || ""}`,
          }));
        setNavLinks(links.length > 0 ? links : fallbackLinks);
      } catch {
        setNavLinks(fallbackLinks);
      }
    };
    fetchNav();
  }, []);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);
      if (isDesktop && currentScrollY > 80 && currentScrollY > lastScrollY) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDesktop]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [pathname, setMobileMenuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
          isDesktop && hidden ? "-translate-y-full" : "translate-y-0",
          scrolled
            ? "bg-green-100/95 backdrop-blur-md shadow-sm"
            : "bg-green-100"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 items-center h-16 md:h-20">
            <div className="flex items-center justify-self-start">
              <button
                className="md:hidden p-2 -ml-2"
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
              <button
                className="md:hidden p-2"
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
              >
                <Search size={20} />
              </button>
              <nav className="hidden md:flex items-center space-x-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-sm tracking-wider uppercase transition-colors hover:text-gray-500",
                      pathname === link.href && "font-semibold"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <Link href="/" className="flex justify-center">
              <img src="/lo.png" alt="DRESS" className="h-12 md:h-16 w-auto" />
            </Link>

            <div className="flex items-center justify-end space-x-3 md:space-x-5">
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden md:block p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
              {user ? (
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Account"
                  >
                    <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-xs font-medium">
                      {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
                    </div>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                      <Link
                        href="/account/dashboard"
                        className="block px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        My Account
                      </Link>
                      <button
                        onClick={async () => {
                          setUserMenuOpen(false);
                          await signOut(auth);
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 text-red-500"
                      >
                        <LogOut size={14} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setLoginOpen(true)}
                  className="hidden md:block p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Account"
                >
                  <User size={20} />
                </button>
              )}
              <Link
                href="/wishlist"
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Wishlist"
              >
                <Heart size={20} />
                {mounted && wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag size={20} />
                {mounted && cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-16 z-30 bg-white"
          >
            <nav className="flex flex-col p-6 space-y-6">
              <Link href="/account/dashboard" className="flex items-center space-x-3 text-lg font-medium">
                <User size={20} />
                <span>My Account</span>
              </Link>
              <div className="border-t pt-6 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block text-base tracking-wider uppercase font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
