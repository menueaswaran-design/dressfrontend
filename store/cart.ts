import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./auth";
import * as cartApi from "@/lib/cart";

export interface CartItem {
  _id: string;
  product?: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
  stock: number;
  slug?: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  loading: boolean;
  initialized: boolean;
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (id: string, size: string, color: string) => Promise<void>;
  updateQuantity: (id: string, size: string, color: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotal: () => number;
  getItemCount: () => number;
  setIsOpen: (open: boolean) => void;
  initFromServer: () => Promise<void>;
  mergeLocalCart: () => Promise<void>;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      loading: false,
      initialized: false,

      addItem: async (item) => {
        const user = useAuthStore.getState().user;
        if (user) {
          try {
            const cart = await cartApi.addToCart(
              item.product || item._id,
              item.quantity,
              item.size,
              item.color
            );
            set({ items: cart.map(mapCartItem) });
            return;
          } catch {}
        }
        const items = get().items;
        const existing = items.find(
          (i) => i._id === item._id && i.size === item.size && i.color === item.color
        );
        if (existing) {
          set({
            items: items.map((i) =>
              i._id === item._id && i.size === item.size && i.color === item.color
                ? { ...i, quantity: Math.min(i.quantity + item.quantity, item.stock) }
                : i
            ),
          });
        } else {
          set({ items: [...items, item] });
        }
      },

      removeItem: async (id, size, color) => {
        const user = useAuthStore.getState().user;
        if (user) {
          const item = get().items.find((i) => i.product === id || i._id === id);
          if (item?._id) {
            try {
              const cart = await cartApi.removeFromCart(item._id);
              set({ items: cart.map(mapCartItem) });
              return;
            } catch {}
          }
        }
        set({ items: get().items.filter((i) => !(i.product === id && i.size === size && i.color === color)) });
      },

      updateQuantity: async (id, size, color, quantity) => {
        const user = useAuthStore.getState().user;
        if (user) {
          const item = get().items.find((i) => i.product === id || i._id === id);
          if (item?._id) {
            try {
              const cart = await cartApi.updateCartItem(item._id, quantity);
              set({ items: cart.map(mapCartItem) });
              return;
            } catch {}
          }
        }
        set({
          items: get().items.map((i) =>
            i.product === id && i.size === size && i.color === color
              ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) }
              : i
          ),
        });
      },

      clearCart: async () => {
        const user = useAuthStore.getState().user;
        if (user) {
          try {
            await cartApi.clearCart();
          } catch {}
        }
        set({ items: [] });
      },

      getTotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      setIsOpen: (open) => set({ isOpen: open }),

      initFromServer: async () => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        set({ loading: true });
        try {
          const cart = await cartApi.fetchCart();
          set({ items: cart.map(mapCartItem), initialized: true });
        } catch {
          set({ initialized: true });
        }
        set({ loading: false });
      },

      mergeLocalCart: async () => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        const localItems = get().items;
        if (localItems.length === 0) {
          await get().initFromServer();
          return;
        }
        set({ loading: true });
        try {
          for (const item of localItems) {
            await cartApi.addToCart(item.product || item._id, item.quantity, item.size, item.color);
          }
          const cart = await cartApi.fetchCart();
          set({ items: cart.map(mapCartItem) });
        } catch {}
        set({ loading: false });
      },
    }),
    { name: "cart-storage" }
  )
);

function mapCartItem(item: any): CartItem {
  return {
    _id: item._id || item.product?._id || "",
    product: item.product?._id || item.product || "",
    name: item.name || item.product?.name || "",
    price: item.price || item.product?.sellingPrice || 0,
    quantity: item.quantity || 1,
    size: item.size || "",
    color: item.color || "",
    image: item.image || item.product?.images?.[0]?.url || "",
    stock: item.stock || item.product?.stock || 99,
    slug: item.slug || item.product?.slug || "",
  };
}
