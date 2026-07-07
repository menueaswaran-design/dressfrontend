"use client";

import ProductCard from "./ProductCard";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";

interface ProductGridProps {
  products: any[];
  loading?: boolean;
}

export default function ProductGrid({ products, loading }: ProductGridProps) {
  if (loading) return <ProductGridSkeleton />;

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 text-lg">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product, index) => (
        <ProductCard key={product._id} product={product} index={index} />
      ))}
    </div>
  );
}
