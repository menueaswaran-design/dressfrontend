"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader2 } from "lucide-react";
import { useUIStore } from "@/store/ui";
import api from "@/lib/api";
import { formatPrice, getImageUrl } from "@/lib/utils";

export default function SearchDrawer() {
  const isOpen = useUIStore((s) => s.isSearchOpen);
  const setOpen = useUIStore((s) => s.setSearchOpen);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products?search=${query}&limit=5`);
        setResults(data.data || []);
      } catch {
        setResults([]);
      }
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg"
          >
            <div className="max-w-3xl mx-auto p-4">
              <div className="flex items-center gap-3 border-b pb-4">
                <Search size={20} className="text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 text-lg outline-none bg-transparent"
                />
                <button onClick={() => setOpen(false)} className="p-1 hover:bg-gray-100 rounded-full">
                  <X size={20} />
                </button>
              </div>
              {loading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 size={24} className="animate-spin text-gray-400" />
                </div>
              )}
              {results.length > 0 && (
                <div className="py-4 space-y-3">
                  {results.map((product: any) => (
                    <Link
                      key={product._id}
                      href={`/product/${product.slug}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <img
                        src={getImageUrl(product.images)}
                        alt={product.name}
                        className="w-14 h-14 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-sm text-gray-500">{formatPrice(product.sellingPrice)}</p>
                      </div>
                    </Link>
                  ))}
                  <Link
                    href={`/search?q=${query}`}
                    onClick={() => setOpen(false)}
                    className="block text-center text-sm text-gray-500 hover:text-black py-2 transition-colors"
                  >
                    View all results
                  </Link>
                </div>
              )}
              {query && !loading && results.length === 0 && (
                <p className="text-center text-gray-400 py-8 text-sm">No products found</p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
