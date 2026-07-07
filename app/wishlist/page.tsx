"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Trash2 } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "Wishlist" }]} />

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">My Wishlist</h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <Heart size={64} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-6">Save items you love and come back to them anytime.</p>
            <Link href="/shop"><Button>Explore Products</Button></Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {items.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="group relative bg-white border rounded-xl overflow-hidden"
              >
                <Link href={`/product/${item.slug}`}>
                  <div className="aspect-[3/4] bg-gray-100">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>
                <button
                  onClick={() => removeItem(item._id)}
                  className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={16} className="text-red-500" />
                </button>
                <div className="p-3">
                  <Link href={`/product/${item.slug}`}>
                    <h3 className="text-sm font-medium truncate">{item.name}</h3>
                  </Link>
                  <p className="text-sm font-semibold mt-1">{formatPrice(item.price)}</p>
                  <Link href={`/product/${item.slug}`}>
                    <Button variant="outline" size="sm" fullWidth className="mt-2">
                      View Details
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
