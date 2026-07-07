"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUS } from "@/lib/constants";
import OrderTimeline from "@/components/shared/OrderTimeline";

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/account/login");
        return;
      }
      try {
        const { default: api } = await import("@/lib/api");
        const { data } = await api.get(`/orders/my/${resolvedParams.id}`);
        setOrder(data.data.order);
      } catch {
        setOrder(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router, resolvedParams.id]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" /></div>;

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Order not found</h1>
        <Link href="/account/dashboard/orders" className="text-sm text-gray-500 hover:text-black mt-2 block">← Back to Orders</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/account/dashboard/orders" className="text-sm text-gray-500 hover:text-black mb-4 block">← Back to Orders</Link>
      <h1 className="text-3xl font-bold">Order #{order.orderNumber}</h1>

      <div className="mt-6 bg-white border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            order.status === "delivered" ? "bg-green-100 text-green-700" :
            order.status === "cancelled" ? "bg-red-100 text-red-700" :
            "bg-yellow-100 text-yellow-700"
          }`}>
            {ORDER_STATUS[order.status as keyof typeof ORDER_STATUS] || order.status}
          </span>
          <span className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</span>
        </div>

        <OrderTimeline currentStatus={order.status} />
      </div>

      <div className="mt-6 bg-white border rounded-xl p-6">
        <h2 className="font-semibold mb-4">Order Items</h2>
        <div className="space-y-4">
          {order.items?.map((item: any, i: number) => (
            <div key={i} className="flex items-center gap-4">
              <img
                src={item.product?.images?.[0]?.url || "/placeholder.svg"}
                alt={item.product?.name || "Product"}
                className="w-16 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <p className="font-medium text-sm">{item.product?.name || "Product"}</p>
                {item.variant?.size && <p className="text-xs text-gray-500">Size: {item.variant.size}</p>}
              </div>
              <div className="text-right">
                <p className="font-medium">{formatPrice(item.price)}</p>
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 bg-white border rounded-xl p-6">
        <h2 className="font-semibold mb-4">Order Summary</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span className="text-green-600">{order.shippingCharge === 0 ? "Free" : formatPrice(order.shippingCharge)}</span></div>
          {order.discount > 0 && <div className="flex justify-between"><span className="text-gray-500">Discount</span><span className="text-green-600">-{formatPrice(order.discount)}</span></div>}
          <div className="border-t pt-2 flex justify-between font-bold text-base"><span>Total</span><span>{formatPrice(order.total)}</span></div>
        </div>
      </div>

      {order.shippingAddress && (
        <div className="mt-6 bg-white border rounded-xl p-6">
          <h2 className="font-semibold mb-4">Shipping Address</h2>
          <div className="text-sm text-gray-600">
            <p>{order.shippingAddress.name}</p>
            <p>{order.shippingAddress.address}, {order.shippingAddress.city}</p>
            <p>{order.shippingAddress.state} - {order.shippingAddress.zip}</p>
            <p>{order.shippingAddress.phone}</p>
          </div>
        </div>
      )}
    </div>
  );
}
