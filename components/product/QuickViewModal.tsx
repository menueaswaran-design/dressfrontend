"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useUIStore } from "@/store/ui";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { formatPrice, getDiscountPercentage, getImageUrl } from "@/lib/utils";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

export default function QuickViewModal() {
  const { isQuickViewOpen, setQuickViewOpen, quickViewProduct } = useUIStore();
  const user = useAuthStore((s) => s.user);
  const setLoginOpen = useUIStore((s) => s.setLoginOpen);
  const addToCart = useCartStore((s) => s.addItem);
  const { isInWishlist, addItem, removeItem } = useWishlistStore();
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setSelectedSize("");
    setQuantity(1);
    setAdded(false);
    if (quickViewProduct) {
      const sizes: string[] = quickViewProduct.variants?.length > 0
        ? [...new Set(quickViewProduct.variants.filter((v: any) => v.size).map((v: any) => v.size))]
        : [];
      if (sizes.length > 0) setSelectedSize(sizes[0]);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const discount = getDiscountPercentage(product.mrp, product.sellingPrice);
  const availableSizes: string[] = product.variants?.length > 0
    ? [...new Set(product.variants.filter((v: any) => v.size).map((v: any) => v.size))]
    : [];
  const getVariantForSize = (size: string) => product.variants?.find((v: any) => v.size === size);

  const handleAddToCart = () => {
    if (!user) { setLoginOpen(true); return; }
    const variant = getVariantForSize(selectedSize);
    addToCart({
      _id: product._id,
      name: product.name,
      price: variant?.price || product.sellingPrice,
      quantity,
      size: selectedSize,
      color: "",
      image: getImageUrl(product.images),
      stock: variant?.stock ?? product.stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Modal
      isOpen={isQuickViewOpen}
      onClose={() => setQuickViewOpen(false)}
      size="full"
      className="p-0 overflow-hidden"
    >
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="aspect-[3/4] bg-gray-100">
          <img
            src={getImageUrl(product.images)}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6 md:p-8 flex flex-col">
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-bold">{product.name}</h2>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-xl font-semibold">{formatPrice(product.sellingPrice)}</span>
              {product.mrp > product.sellingPrice && (
                <>
                  <span className="text-gray-400 line-through">{formatPrice(product.mrp)}</span>
                  <span className="text-sm text-green-600 font-medium">-{discount}% OFF</span>
                </>
              )}
            </div>

            <p className="text-sm text-gray-500 mt-4 leading-relaxed">
              {product.description || "Premium quality fabric with a modern fit."}
            </p>

            <div className="mt-6">
              <p className="text-xs tracking-widest uppercase font-medium mb-3">Select Size</p>
              <div className="flex flex-wrap gap-2">
                {availableSizes.length > 0 ? availableSizes.map((size: string) => {
                  const variant = getVariantForSize(size);
                  const outOfStock = variant && variant.stock < 1;
                  return (
                    <button
                      key={size}
                      onClick={() => !outOfStock && setSelectedSize(size)}
                      disabled={outOfStock}
                      className={`w-12 h-12 rounded-full border text-sm font-medium transition-all ${
                        selectedSize === size
                          ? "bg-black text-white border-black"
                          : outOfStock
                            ? "border-gray-200 text-gray-300 line-through cursor-not-allowed"
                            : "border-gray-300 text-gray-600 hover:border-black"
                      }`}
                    >
                      {size}
                    </button>
                  );
                }) : (
                  <p className="text-sm text-gray-400">No sizes available</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 mt-6">
              <div className="flex items-center border rounded-full">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-100 transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-2 text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 hover:bg-gray-100 transition-colors"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => {
                  if (!user) { setLoginOpen(true); return; }
                  const item = {
                    _id: product._id,
                    name: product.name,
                    price: product.sellingPrice,
                    image: getImageUrl(product.images),
                    slug: product.slug,
                  };
                  if (isInWishlist(product._id)) removeItem(product._id);
                  else addItem(item);
                }}
                className={`p-3 rounded-full border transition-colors ${
                  isInWishlist(product._id)
                    ? "bg-black text-white border-black"
                    : "border-gray-300 hover:border-black"
                }`}
              >
                <Heart size={18} className={isInWishlist(product._id) ? "fill-white" : ""} />
              </button>
            </div>

            <div className="flex flex-col gap-3 mt-6">
              <Button fullWidth onClick={handleAddToCart} size="lg">
                {added ? "Added!" : "Add to Cart"}
              </Button>
              <Link href={`/product/${product.slug}`} onClick={() => setQuickViewOpen(false)}>
                <Button variant="outline" fullWidth size="lg">
                  View Full Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
