"use client";

import { useEffect, useState, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AnnouncementBar from "./AnnouncementBar";
import SearchDrawer from "@/components/shared/SearchDrawer";
import CartDrawer from "@/components/cart/CartDrawer";
import LoginModal from "@/components/auth/LoginModal";
import QuickViewModal from "@/components/product/QuickViewModal";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);
  const mergeLocalCart = useCartStore((s) => s.mergeLocalCart);
  const initWishlist = useWishlistStore((s) => s.initFromServer);
  const prevUserRef = useRef<any>(null);

  useEffect(() => {
    setMounted(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [setUser, setLoading]);

  useEffect(() => {
    const user = useAuthStore.getState().user;
    const prev = prevUserRef.current;
    if (user && user !== prev) {
      mergeLocalCart();
      initWishlist();
    }
    prevUserRef.current = user;
  }, [mergeLocalCart, initWishlist]);

  if (!mounted) {
    return (
      <>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1 pt-16 md:pt-20">{children}</main>
      <Footer />
      <CartDrawer />
      <SearchDrawer />
      <LoginModal />
      <QuickViewModal />
    </>
  );
}
