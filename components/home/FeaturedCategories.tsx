"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/Skeleton";

const defaultCategories = [
  { name: "Oversized Tees", slug: "oversized-tees", thumbnail: "" },
  { name: "Hoodies", slug: "hoodies", thumbnail: "" },
  { name: "Joggers", slug: "joggers", thumbnail: "" },
  { name: "Summer Collection", slug: "summer-collection", thumbnail: "" },
  { name: "New Arrivals", slug: "new-arrivals", thumbnail: "" },
  { name: "Best Sellers", slug: "best-sellers", thumbnail: "" },
  { name: "Casual Shirts", slug: "casual-shirts", thumbnail: "" },
  { name: "Formal Wear", slug: "formal-wear", thumbnail: "" },
  { name: "Accessories", slug: "accessories", thumbnail: "" },
  { name: "Winter Wear", slug: "winter-wear", thumbnail: "" },
  { name: "Sportswear", slug: "sportswear", thumbnail: "" },
  { name: "Footwear", slug: "footwear", thumbnail: "" },
];

export default function FeaturedCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get("/categories");
        setCategories(data.data?.slice(0, 12) || defaultCategories);
      } catch {
        setCategories(defaultCategories);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="min-w-[65vw] md:min-w-[220px] snap-start">
                <Skeleton className="aspect-square" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

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
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight">Shop by Category</h2>
            <p className="mt-2 text-sm text-gray-500">Explore our curated collections</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="p-2 border rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-2 border rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </motion.div>
        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((cat, i) => (
            <motion.div
              key={cat._id || cat.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="min-w-[65vw] md:min-w-[220px] snap-start"
            >
              <Link
                href={`/category/${cat.slug}`}
                className="group block relative aspect-square overflow-hidden rounded-2xl bg-gray-100 shadow-sm hover:shadow-xl transition-all duration-500"
              >
                {cat.thumbnail || cat.banner ? (
                  <img
                    src={cat.thumbnail || cat.banner}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300">
                    <span className="text-6xl font-bold text-gray-300 uppercase tracking-wider">
                      {cat.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent group-hover:from-black/60 transition-all duration-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-sm md:text-base font-semibold tracking-wider uppercase px-5 py-2.5 bg-black/50 backdrop-blur-md rounded-full border border-white/10 group-hover:bg-black/70 transition-all duration-300">
                    {cat.name}
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
