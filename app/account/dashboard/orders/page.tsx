"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Package, ChevronRight } from "lucide-react";
import api from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUS } from "@/lib/constants";
import Button from "@/components/ui/Button";

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/account/login");
        return;
      }
      try {
        const { data } = await api.get("/orders/my/all?limit=10");
        setOrders(data.data || []);
      } catch {
        setOrders([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/account/dashboard" className="text-sm text-gray-500 hover:text-black mb-2 block">← Back to Dashboard</Link>
        <h1 className="text-3xl font-bold">My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Package size={48} className="text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-6">Start shopping to see your orders here.</p>
          <Link href="/shop"><Button>Shop Now</Button></Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <Link
              key={order._id}
              href={`/account/dashboard/orders/${order._id}`}
              className="block p-4 bg-white border rounded-xl hover:border-black transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Order #{order.orderNumber}</p>
                  <p className="text-sm text-gray-500 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                  <p className="text-sm mt-1">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      order.status === "delivered" ? "bg-green-100 text-green-700" :
                      order.status === "cancelled" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {ORDER_STATUS[order.status as keyof typeof ORDER_STATUS] || order.status}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatPrice(order.total)}</p>
                  <p className="text-xs text-gray-400 mt-1">{order.items?.length || 0} items</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
