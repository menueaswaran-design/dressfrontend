import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./auth";
import * as wishlistApi from "@/lib/wishlist";

interface WishlistItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
}

interface WishlistStore {
  items: WishlistItem[];
  loading: boolean;
  initialized: boolean;
  addItem: (item: WishlistItem) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => Promise<void>;
  initFromServer: () => Promise<void>;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      loading: false,
      initialized: false,

      addItem: async (item) => {
        const user = useAuthStore.getState().user;
        if (user) {
          try {
            const wishlist = await wishlistApi.addToWishlist(item._id);
            set({ items: wishlist.map(mapWishlistItem) });
            return;
          } catch {}
        }
        if (!get().items.find((i) => i._id === item._id)) {
          set({ items: [...get().items, item] });
        }
      },

      removeItem: async (id) => {
        const user = useAuthStore.getState().user;
        if (user) {
          try {
            const wishlist = await wishlistApi.removeFromWishlist(id);
            set({ items: wishlist.map(mapWishlistItem) });
            return;
          } catch {}
        }
        set({ items: get().items.filter((i) => i._id !== id) });
      },

      isInWishlist: (id) => get().items.some((i) => i._id === id),

      clearWishlist: async () => {
        const user = useAuthStore.getState().user;
        if (user) {
          for (const item of get().items) {
            try { await wishlistApi.removeFromWishlist(item._id); } catch {}
          }
        }
        set({ items: [] });
      },

      initFromServer: async () => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        set({ loading: true });
        try {
          const wishlist = await wishlistApi.fetchWishlist();
          set({ items: wishlist.map(mapWishlistItem), initialized: true });
        } catch {
          set({ initialized: true });
        }
        set({ loading: false });
      },
    }),
    { name: "wishlist-storage" }
  )
);

function mapWishlistItem(item: any): WishlistItem {
  return {
    _id: item._id || item.product?._id || "",
    name: item.name || item.product?.name || "",
    price: item.price || item.product?.sellingPrice || 0,
    image: item.image || item.product?.images?.[0]?.url || "",
    slug: item.slug || item.product?.slug || "",
  };
}
