"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Minus, Plus, X, ShoppingBag, ArrowLeft, Tag, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import api from "@/lib/api";
import Button from "@/components/ui/Button";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [discount, setDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const { data } = await api.post("/coupons/validate", { code: couponCode, cartTotal: getTotal() });
      setAppliedCoupon(data.data.coupon);
      setDiscount(data.data.discount);
    } catch (err: any) {
      setCouponError(err?.response?.data?.message || "Invalid coupon code");
      setAppliedCoupon(null);
      setDiscount(0);
    }
    setCouponLoading(false);
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponError("");
  };

  const totalAfterDiscount = getTotal() - discount;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <Breadcrumb items={[{ label: "Cart" }]} />
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ShoppingBag size={64} className="text-gray-300 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Your Cart is Empty</h1>
          <p className="text-gray-500 mb-6">Looks like you haven&apos;t added anything yet.</p>
          <Link href="/shop">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "Cart" }]} />

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-bold tracking-tight mb-8"
      >
        Shopping Cart ({items.length})
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <motion.div
              key={`${item._id}-${item.size}-${item.color}`}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex gap-4 p-4 bg-white border rounded-xl"
            >
              <Link href={`/product/${item.slug || item._id}`} className="shrink-0">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-24 h-28 md:w-28 md:h-32 object-cover rounded-lg"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <Link href={`/product/${item.slug || item._id}`}>
                      <h3 className="font-medium truncate">{item.name}</h3>
                    </Link>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {item.size && `Size: ${item.size}`}
                      {item.size && item.color && " | "}
                      {item.color && `Color: ${item.color}`}
                    </p>
                    <p className="text-sm font-semibold mt-1">{formatPrice(item.price)}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item._id, item.size, item.color)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex items-center border rounded-full">
                    <button
                      onClick={() => updateQuantity(item._id, item.size, item.color, item.quantity - 1)}
                      className="px-3 py-1.5 hover:bg-gray-100 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-3 py-1.5 text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.size, item.color, item.quantity + 1)}
                      className="px-3 py-1.5 hover:bg-gray-100 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <p className="text-sm font-semibold ml-auto">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}

          <Link href="/shop" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors mt-4">
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            <div className="border-b pb-4 mb-4">
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Tag size={14} className="text-green-600" />
                    <span className="font-medium text-green-700">{appliedCoupon.code}</span>
                    <span className="text-green-600">(-{formatPrice(discount)})</span>
                  </div>
                  <button onClick={handleRemoveCoupon} className="text-xs text-red-500 hover:underline">Remove</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Coupon code"
                    className="flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-black"
                    onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                  />
                  <Button onClick={handleApplyCoupon} disabled={couponLoading || !couponCode.trim()} size="sm">
                    {couponLoading ? <Loader2 size={14} className="animate-spin" /> : "Apply"}
                  </Button>
                </div>
              )}
              {couponError && <p className="text-red-500 text-xs mt-2">{couponError}</p>}
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">{formatPrice(getTotal())}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-base">
                <span className="font-semibold">Total</span>
                <span className="font-bold">{formatPrice(totalAfterDiscount)}</span>
              </div>
            </div>

            <Link href="/checkout" className="block mt-6">
              <Button fullWidth size="lg">
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
