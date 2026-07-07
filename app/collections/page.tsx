"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import api from "@/lib/api";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { Skeleton } from "@/components/ui/Skeleton";

export default function CollectionsPage() {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get("/collections", { params: { limit: 50, isActive: true } });
        setCollections(data.data || []);
      } catch {}
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/5] rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "Collections" }]} />

      <div className="mt-4 mb-8">
        <h1 className="text-3xl font-bold">Collections</h1>
        <p className="text-gray-500 mt-1">Explore our curated collections</p>
      </div>

      {collections.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">No collections available</p>
        </div>
      ) : (
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
                  <img src={col.banner} alt={col.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <span className="text-gray-400 text-sm">No image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                  <h3 className="text-white font-semibold text-sm md:text-lg">{col.name}</h3>
                  {col.description && <p className="text-white/80 text-xs mt-1 line-clamp-1">{col.description}</p>}
                  <span className="inline-flex items-center gap-1 text-white/90 text-xs font-medium mt-2 group-hover:underline">
                    Shop Now <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
