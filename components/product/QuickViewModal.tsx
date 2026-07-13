"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useUIStore } from "@/store/ui";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { formatPrice, getImageUrl } from "@/lib/utils";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import ReadMore from "@/components/ui/ReadMore";

export default function QuickViewModal() {
  const { isQuickViewOpen, setQuickViewOpen, quickViewProduct } = useUIStore();
  const user = useAuthStore((s) => s.user);
  const setLoginOpen = useUIStore((s) => s.setLoginOpen);
  const addToCart = useCartStore((s) => s.addItem);
  const { isInWishlist, addItem, removeItem } = useWishlistStore();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setSelectedSize("");
    setSelectedVariantIdx(0);
    setQuantity(1);
    setAdded(false);
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const allVariants = product.variants || [];
  const currentVariant = allVariants[selectedVariantIdx] || null;
  const availableSizes = currentVariant?.sizes || [];
  const selectedSizeItem = availableSizes.find((s: any) => s.size === selectedSize) || null;
  const displayPrice = selectedSizeItem?.price || product.sellingPrice;
  const discount = product.mrp ? Math.round(((product.mrp - displayPrice) / product.mrp) * 100) : 0;
  const variantImages = currentVariant?.images?.length > 0 ? currentVariant.images : null;
  const mainImage = variantImages?.[0] || product.primaryImage || getImageUrl(product.images);

  const handleAddToCart = () => {
    if (!user) { setLoginOpen(true); return; }
    addToCart({
      _id: product._id,
      name: product.name,
      price: displayPrice,
      quantity,
      size: selectedSize,
      color: "",
      image: mainImage,
      stock: selectedSizeItem?.stock ?? product.stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Modal
      isOpen={isQuickViewOpen}
      onClose={() => setQuickViewOpen(false)}
      size="full"
      className="p-0 overflow-y-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="relative aspect-[3/4] bg-gray-100">
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {variantImages && variantImages.length > 1 && (
            <div className="absolute bottom-3 left-3 right-3 flex gap-1.5 overflow-x-auto">
              {variantImages.map((url: string, i: number) => (
                <button
                  key={i}
                  className="shrink-0 w-10 h-12 rounded-md overflow-hidden border-2 border-white/80 shadow-sm"
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
          {allVariants.length > 1 && (
            <div className="absolute bottom-16 left-3 right-3 flex gap-1.5 overflow-x-auto">
              {allVariants.map((v: any, i: number) => (
                <button
                  key={i}
                  onClick={() => { setSelectedVariantIdx(i); setSelectedSize(""); }}
                  className={`shrink-0 w-10 h-12 rounded-md overflow-hidden border-2 transition-all ${
                    selectedVariantIdx === i ? "border-black" : "border-white/80"
                  } shadow-sm`}
                >
                  <img
                    src={v.images?.[0] || "/placeholder.svg"}
                    alt={v.name || `V${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="p-6 md:p-8 flex flex-col">
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-bold">{product.name}</h2>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-xl font-semibold">{formatPrice(displayPrice)}</span>
              {product.mrp > displayPrice && (
                <>
                  <span className="text-gray-400 line-through">{formatPrice(product.mrp)}</span>
                  <span className="text-sm text-green-600 font-medium">-{discount}% OFF</span>
                </>
              )}
            </div>

            <div className="mt-4">
              <ReadMore text={product.description} fallback="Premium quality fabric with a modern fit." className="text-sm text-gray-500" />
            </div>

            <div className="mt-6">
              <p className="text-xs tracking-widest uppercase font-medium mb-3">Select Size</p>
              <div className="flex flex-wrap gap-2">
                {availableSizes.length > 0 ? availableSizes.map((s: any) => {
                  const outOfStock = s.stock < 1;
                  return (
                    <button
                      key={s.size}
                      onClick={() => !outOfStock && setSelectedSize(s.size)}
                      disabled={outOfStock}
                      className={`w-12 h-12 rounded-full border text-sm font-medium transition-all ${
                        selectedSize === s.size
                          ? "bg-black text-white border-black"
                          : outOfStock
                            ? "border-gray-200 text-gray-300 line-through cursor-not-allowed"
                            : "border-gray-300 text-gray-600 hover:border-black"
                      }`}
                    >
                      {s.size}
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
