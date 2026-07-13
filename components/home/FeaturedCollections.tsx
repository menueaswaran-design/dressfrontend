"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import api from "@/lib/api";

export default function FeaturedCollections() {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get("/collections", { params: { limit: 6, isActive: true } });
        setCollections(data.data || []);
      } catch {
        // fallback
      }
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading || collections.length === 0) return null;

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Featured Collections</h2>
            <p className="text-gray-500 mt-2">Curated styles for every occasion</p>
          </div>
          <Link
            href="/shop"
            className="flex items-center gap-1 text-sm font-medium hover:underline"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {collections.map((col, i) => (
            <motion.div
              key={col._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <Link href={`/collections/${col.slug}`} className="group block relative rounded-xl overflow-hidden bg-gray-100 aspect-[4/5]">
                {col.banner ? (
                  <img
                    src={col.banner}
                    alt={col.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <span className="text-gray-400 text-sm">No image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                  <h3 className="text-white font-semibold text-sm md:text-lg">{col.name}</h3>
                  {col.description && (
                    <p className="text-white/80 text-xs mt-1 line-clamp-1">{col.description}</p>
                  )}
                  <span className="inline-flex items-center gap-1 text-white/90 text-xs font-medium mt-2 group-hover:underline">
                    Shop Now <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
