"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Tag } from "lucide-react";
import api from "@/lib/api";
import ProductCard from "@/components/product/ProductCard";

export default function SaleOffers() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get("/products", { params: { label: "sale", limit: 10 } });
        setProducts(data.data || []);
      } catch {}
      setLoading(false);
    };
    fetch();
  }, []);

  if (!loading && products.length === 0) return null;

  return (
    <section className="py-12 md:py-20 bg-red-50/30">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Tag size={16} className="text-red-500" />
              <span className="text-xs tracking-[0.2em] uppercase text-red-500 font-semibold">Deals</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight">Sale & Offers</h2>
            <p className="mt-1 text-sm text-gray-500">Best deals on premium styles</p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1 text-sm font-medium tracking-wider uppercase text-red-500 hover:text-red-600 transition-colors"
          >
            Shop Sale
            <Tag size={14} />
          </Link>
        </motion.div>
        <div
          className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product, i) => (
            <div key={product._id} className="min-w-[140px] md:min-w-[200px] snap-start">
              <ProductCard product={product} index={i} />
            </div>
          ))}
          {loading && Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="min-w-[140px] md:min-w-[200px] space-y-3">
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
