"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CreditCard, Smartphone, Building, Wallet, Banknote } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { formatPrice } from "@/lib/utils";
import api from "@/lib/api";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Breadcrumb from "@/components/ui/Breadcrumb";

const paymentMethods = [
  { id: "upi", label: "UPI", icon: Smartphone },
  { id: "credit_card", label: "Credit Card", icon: CreditCard },
  { id: "debit_card", label: "Debit Card", icon: CreditCard },
  { id: "wallet", label: "Wallet", icon: Wallet },
  { id: "net_banking", label: "Net Banking", icon: Building },
  { id: "cod", label: "Cash on Delivery", icon: Banknote },
];

export default function CheckoutPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { items, getTotal } = useCartStore();

  useEffect(() => {
    if (!user) router.push("/account/login");
  }, [user, router]);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isPlacing, setIsPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [error, setError] = useState("");
  const [placedOrder, setPlacedOrder] = useState<any>(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const updateField = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handlePlaceOrder = async () => {
    setError("");
    if (!form.name || !form.phone || !form.address || !form.city || !form.state || !form.zip) {
      setError("Please fill in all shipping address fields.");
      return;
    }
    setIsPlacing(true);
    try {
      const { data } = await api.post("/orders/checkout", {
        shippingAddress: form,
        paymentMethod,
      });
      setPlacedOrder(data.data.order);
      setPlaced(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
    }
    setIsPlacing(false);
  };

  if (items.length === 0 && !placed) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Link href="/shop"><Button>Shop Now</Button></Link>
      </div>
    );
  }

  if (placed) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-green-600 text-2xl">✓</span>
          </div>
        </motion.div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-500 mb-2">Order #{placedOrder?.orderNumber}</p>
        <p className="text-gray-500 mb-6">Thank you for your purchase. You will receive an email confirmation shortly.</p>
        <Link href="/account/dashboard/orders"><Button>View Orders</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]} />

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-bold tracking-tight mb-8"
      >
        Checkout
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-white border rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input id="name" label="Full Name" placeholder="John Doe" value={form.name} onChange={updateField("name")} />
              <Input id="phone" label="Phone" placeholder="+91 9876543210" value={form.phone} onChange={updateField("phone")} />
              <div className="md:col-span-2">
                <Input id="address" label="Address" placeholder="123 Main Street" value={form.address} onChange={updateField("address")} />
              </div>
              <Input id="city" label="City" placeholder="Mumbai" value={form.city} onChange={updateField("city")} />
              <Input id="state" label="State" placeholder="Maharashtra" value={form.state} onChange={updateField("state")} />
              <Input id="zip" label="ZIP Code" placeholder="400001" value={form.zip} onChange={updateField("zip")} />
            </div>
          </div>

          <div className="bg-white border rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex items-center gap-2 p-3 border rounded-xl text-sm transition-all ${
                      paymentMethod === method.id
                        ? "border-black bg-black text-white"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{method.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3 max-h-64 overflow-auto">
              {items.map((item) => (
                <div key={`${item._id}-${item.size}`} className="flex items-center gap-3 text-sm">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-12 h-14 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium">{item.name}</p>
                    <p className="text-gray-500 text-xs">
                      {(item.size || item.color) && `${item.color || ''}${item.color && item.size ? ' / ' : ''}${item.size ? `Size: ${item.size}` : ''}`}
                    </p>
                    <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="border-t mt-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span>{formatPrice(getTotal())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-base font-bold">
                <span>Total</span>
                <span>{formatPrice(getTotal())}</span>
              </div>
            </div>
            {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
            <Button fullWidth size="lg" className="mt-6" onClick={handlePlaceOrder} loading={isPlacing}>
              Place Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
