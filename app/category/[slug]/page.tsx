"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import api from "@/lib/api";
import ProductGrid from "@/components/product/ProductGrid";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [products, setProducts] = useState<any[]>([]);
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data: catData } = await api.get(`/categories/slug/${slug}`);
        const cat = catData.data?.category || { name: slug.replace(/-/g, " ") };
        setCategory(cat);
        const { data: prodData } = await api.get(`/products?category=${cat._id || ""}&limit=20`);
        setProducts(prodData.data || []);
      } catch {
        setCategory({ name: slug.replace(/-/g, " ") });
      }
      setLoading(false);
    };
    fetch();
  }, [slug]);

  const categoryName = category?.name || slug.replace(/-/g, " ");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "Shop", href: "/shop" }, { label: categoryName }]} />

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight capitalize">{categoryName}</h1>
        {category?.description && <p className="mt-2 text-gray-500">{category.description}</p>}
      </motion.div>

      <ProductGrid products={products} loading={loading} />
    </div>
  );
}
