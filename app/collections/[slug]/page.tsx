"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import api from "@/lib/api";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ProductGrid from "@/components/product/ProductGrid";
import { Skeleton } from "@/components/ui/Skeleton";

export default function CollectionPage() {
  const { slug } = useParams<{ slug: string }>();
  const [collection, setCollection] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/collections/slug/${slug}`);
        setCollection(data.data?.collection);
      } catch {
        // fallback
      }
      setLoading(false);
    };
    if (slug) fetch();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Skeleton className="h-8 w-64 mb-8" />
        <Skeleton className="h-48 w-full rounded-xl mb-8" />
        <ProductGrid products={[]} loading={true} />
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Collection not found</h1>
        <Link href="/shop" className="mt-4 inline-block text-sm underline">Back to shop</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "Collections", href: "/collections" }, { label: collection.name }]} />

      <div className="relative rounded-xl overflow-hidden bg-gray-100 mt-4 mb-8">
        {collection.banner ? (
          <img src={collection.banner} alt={collection.name} className="w-full object-contain max-h-[400px] mx-auto" />
        ) : (
          <div className="w-full h-48 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700">
            <div className="text-center text-white">
              <h1 className="text-3xl md:text-4xl font-bold">{collection.name}</h1>
              {collection.description && <p className="mt-2 text-white/80">{collection.description}</p>}
            </div>
          </div>
        )}
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">{collection.name}</h1>
        {collection.description && <p className="text-gray-500 mt-1">{collection.description}</p>}
        <p className="text-sm text-gray-400 mt-1">{collection.products?.length || 0} products</p>
      </div>

      <ProductGrid products={collection.products || []} />
    </div>
  );
}
