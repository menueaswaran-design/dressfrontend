"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import api from "@/lib/api";
import ProductCard from "@/components/product/ProductCard";

export default function BestSellers() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get("/products", { params: { label: "bestseller", limit: 10 } });
        setProducts(data.data || []);
      } catch {}
      setLoading(false);
    };
    fetch();
  }, []);

  if (!loading && products.length === 0) return null;

  return (
    <section className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight">Best Sellers</h2>
            <p className="mt-2 text-sm text-gray-500">Most loved styles by our customers</p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1 text-sm font-medium tracking-wider uppercase hover:text-gray-500 transition-colors"
          >
            View All
            <ChevronRight size={16} />
          </Link>
        </motion.div>
        <div
          className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product, i) => (
            <div key={product._id} className="min-w-[calc(50vw-10px)] md:min-w-[200px] snap-start">
              <ProductCard product={product} index={i} />
            </div>
          ))}
          {loading && Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="min-w-[calc(50vw-10px)] md:min-w-[200px] space-y-3">
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
