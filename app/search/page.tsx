"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import api from "@/lib/api";
import ProductGrid from "@/components/product/ProductGrid";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get("q") || "";
  const [query, setQuery] = useState(q);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setQuery(q);
    if (q) {
      setLoading(true);
      api
        .get(`/products?search=${q}&limit=20`)
        .then(({ data }) => setResults(data.data || []))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    } else {
      setResults([]);
    }
  }, [q]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative max-w-xl">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black transition-all"
          />
        </div>
      </form>

      {q && (
        <p className="text-sm text-gray-500 mb-6">
          Search results for &ldquo;{q}&rdquo; ({results.length} results)
        </p>
      )}

      <ProductGrid products={results} loading={loading} />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}
