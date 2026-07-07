import { create } from "zustand";

interface UIStore {
  isSearchOpen: boolean;
  isLoginOpen: boolean;
  isMobileMenuOpen: boolean;
  isQuickViewOpen: boolean;
  quickViewProduct: any;
  setSearchOpen: (open: boolean) => void;
  setLoginOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setQuickViewOpen: (open: boolean, product?: any) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isSearchOpen: false,
  isLoginOpen: false,
  isMobileMenuOpen: false,
  isQuickViewOpen: false,
  quickViewProduct: null,
  setSearchOpen: (open) => set({ isSearchOpen: open }),
  setLoginOpen: (open) => set({ isLoginOpen: open }),
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  setQuickViewOpen: (open, product) => set({ isQuickViewOpen: open, quickViewProduct: product || null }),
}));
