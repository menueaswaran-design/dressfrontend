"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import api from "@/lib/api";
import ProductCard from "@/components/product/ProductCard";

export default function TrendingProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get("/products?sort=-createdAt&limit=8");
        setProducts(data.data || []);
      } catch {
        // fallback
      }
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight">Trending Now</h2>
            <p className="mt-2 text-sm text-gray-500">Most popular styles this season</p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1 text-sm font-medium tracking-wider uppercase hover:text-gray-500 transition-colors"
          >
            View All
            <ChevronRight size={16} />
          </Link>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, i) => (
            <ProductCard key={product._id} product={product} index={i} showAddToCart showWishlist={false} />
          ))}
          {loading && Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-[3/4] bg-gray-200 rounded-xl animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
