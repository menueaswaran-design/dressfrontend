"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import api from "@/lib/api";
import ProductCard from "@/components/product/ProductCard";

export default function LimitedEdition() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get("/products", { params: { label: "limited_edition", limit: 10 } });
        setProducts(data.data || []);
      } catch {}
      setLoading(false);
    };
    fetch();
  }, []);

  if (!loading && products.length === 0) return null;

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-amber-50/50 to-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles size={18} className="text-amber-600" />
            <span className="text-xs tracking-[0.2em] uppercase text-amber-600 font-semibold">Exclusive</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight">Limited Edition</h2>
          <p className="mt-2 text-sm text-gray-500">Drop now — once it&apos;s gone, it&apos;s gone</p>
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
