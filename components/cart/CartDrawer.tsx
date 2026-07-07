"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, getTotal } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md z-50 bg-white shadow-xl flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <ShoppingBag size={20} />
                Cart ({items.length})
              </h2>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <ShoppingBag size={48} />
                  <p className="mt-4 text-sm">Your cart is empty</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={`${item._id}-${item.size}-${item.color}`} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-20 h-24 object-cover rounded-md"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{item.name}</h3>
                      {(item.size || item.color) && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {item.size && `Size: ${item.size}`}
                          {item.size && item.color && " | "}
                          {item.color && `Color: ${item.color}`}
                        </p>
                      )}
                      <p className="text-sm font-medium mt-1">{formatPrice(item.price)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item._id, item.size, item.color, item.quantity - 1)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.size, item.color, item.quantity + 1)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item._id, item.size, item.color)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">{formatPrice(getTotal())}</span>
                </div>
                <p className="text-xs text-gray-400">Shipping & taxes calculated at checkout</p>
                <Link href="/checkout" onClick={() => setIsOpen(false)}>
                  <Button fullWidth size="lg">
                    Checkout
                  </Button>
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center text-sm text-gray-500 hover:text-black transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
