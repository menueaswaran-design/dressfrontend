"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Eye } from "lucide-react";
import { formatPrice, getDiscountPercentage, getImageUrl, getHoverImage } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { useWishlistStore } from "@/store/wishlist";
import { useUIStore } from "@/store/ui";

interface ProductCardProps {
  product: any;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const user = useAuthStore((s) => s.user);
  const { isInWishlist, addItem, removeItem } = useWishlistStore();
  const setQuickViewOpen = useUIStore((s) => s.setQuickViewOpen);
  const setLoginOpen = useUIStore((s) => s.setLoginOpen);
  const image = getImageUrl(product.images);
  const hoverImage = getHoverImage(product.images);
  const discount = getDiscountPercentage(product.mrp, product.sellingPrice);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
          />
          {hoverImage && (
            <img
              src={hoverImage}
              alt={product.name}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            />
          )}
          {discount > 0 && (
            <span className="absolute top-3 left-3 bg-black text-white text-[10px] px-2.5 py-1 rounded-full font-semibold tracking-wider uppercase shadow-lg">
              -{discount}%
            </span>
          )}
          {product.labels?.includes("new") && (
            <span className="absolute top-3 right-3 bg-white text-black text-[10px] px-2.5 py-1 rounded-full font-semibold tracking-wider uppercase shadow-lg">
              New
            </span>
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!user) { setLoginOpen(true); return; }
              const item = {
                _id: product._id,
                name: product.name,
                price: product.sellingPrice,
                image,
                slug: product.slug,
              };
              if (isInWishlist(product._id)) {
                removeItem(product._id);
              } else {
                addItem(item);
              }
            }}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 shadow-lg"
            aria-label={isInWishlist(product._id) ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              size={16}
              className={isInWishlist(product._id) ? "fill-black text-black" : "text-black"}
            />
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setQuickViewOpen(true, product);
            }}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 px-5 py-2.5 bg-white/95 backdrop-blur-sm rounded-full text-xs font-semibold tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white shadow-lg flex items-center gap-1.5"
          >
            <Eye size={14} />
            Quick View
          </button>

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300" />
        </div>
      </Link>

      <Link href={`/product/${product.slug}`} className="block px-3 pb-3 pt-2">
        <h3 className="text-sm font-medium truncate group-hover:text-gray-600 transition-colors">{product.name}</h3>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-sm font-bold">{formatPrice(product.sellingPrice)}</span>
          {product.mrp > product.sellingPrice && (
            <span className="text-xs text-gray-400 line-through">{formatPrice(product.mrp)}</span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
