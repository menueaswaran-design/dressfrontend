"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import api from "@/lib/api";
import { SORT_OPTIONS } from "@/lib/constants";
import ProductGrid from "@/components/product/ProductGrid";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Button from "@/components/ui/Button";

function ShopContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("-createdAt");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    gender: searchParams.get("gender") || "",
    label: searchParams.get("label") || "",
    priceMin: "",
    priceMax: "",
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ sort, limit: "20" });
      if (filters.category) params.set("category", filters.category);
      if (filters.gender) params.set("gender", filters.gender);
      if (filters.label) params.set("label", filters.label);
      if (filters.priceMin) params.set("priceMin", filters.priceMin);
      if (filters.priceMax) params.set("priceMax", filters.priceMax);
      const { data } = await api.get(`/products?${params}`);
      setProducts(data.data || []);
    } catch {
      setProducts([]);
    }
    setLoading(false);
  }, [sort, filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setFilters({
      category: searchParams.get("category") || "",
      gender: searchParams.get("gender") || "",
      label: searchParams.get("label") || "",
      priceMin: "",
      priceMax: "",
    });
  }, [searchParams]);

  const clearFilters = () => {
    setFilters({ category: "", gender: "", label: "", priceMin: "", priceMax: "" });
  };

  const hasFilters = Object.values(filters).some((v) => v);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "Shop" }]} />

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Shop</h1>
        <p className="mt-2 text-gray-500">Discover our complete collection</p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="hidden md:block w-56 shrink-0">
          <div className="sticky top-24 space-y-6">
            <div>
              <h3 className="text-xs tracking-widest uppercase font-medium mb-3">Gender</h3>
              <div className="space-y-2">
                {["men", "women", "unisex"].map((g) => (
                  <button
                    key={g}
                    onClick={() => setFilters({ ...filters, gender: filters.gender === g ? "" : g })}
                    className={`block w-full text-left text-sm py-1.5 px-3 rounded-lg transition-colors ${
                      filters.gender === g ? "bg-black text-white" : "hover:bg-gray-100"
                    }`}
                  >
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs tracking-widest uppercase font-medium mb-3">Price</h3>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceMin}
                  onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceMax}
                  onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-black transition-colors flex items-center gap-1"
              >
                <X size={14} /> Clear all filters
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <button
              className="md:hidden flex items-center gap-2 text-sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>
            <div className="flex items-center gap-2">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden mb-6 p-4 bg-gray-50 rounded-xl space-y-4"
            >
              <div>
                <h3 className="text-xs tracking-widest uppercase font-medium mb-2">Gender</h3>
                <div className="flex gap-2">
                  {["men", "women", "unisex"].map((g) => (
                    <button
                      key={g}
                      onClick={() => setFilters({ ...filters, gender: filters.gender === g ? "" : g })}
                      className={`px-4 py-2 rounded-full text-xs font-medium border transition-colors ${
                        filters.gender === g ? "bg-black text-white border-black" : "border-gray-300"
                      }`}
                    >
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              {hasFilters && (
                <button onClick={clearFilters} className="text-sm text-gray-500 hover:text-black">
                  Clear filters
                </button>
              )}
            </motion.div>
          )}

          <ProductGrid products={products} loading={loading} />
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense>
      <ShopContent />
    </Suspense>
  );
}
