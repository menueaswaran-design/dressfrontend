"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Share2, Truck, RotateCcw, Shield } from "lucide-react";
import api from "@/lib/api";
import { formatPrice, getDiscountPercentage, getImageUrl } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { useUIStore } from "@/store/ui";
import Button from "@/components/ui/Button";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Accordion from "@/components/ui/Accordion";
import ProductCard from "@/components/product/ProductCard";
import ImageZoom from "@/components/product/ImageZoom";
import { Skeleton } from "@/components/ui/Skeleton";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const user = useAuthStore((s) => s.user);
  const setLoginOpen = useUIStore((s) => s.setLoginOpen);
  const addToCart = useCartStore((s) => s.addItem);
  const { isInWishlist, addItem, removeItem } = useWishlistStore();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products/slug/${slug}`);
        const found = data.data?.product;
        setProduct(found);
        if (found) {
          const categoryId = typeof found.category === "object" ? found.category?._id : found.category;
          const { data: relData } = await api.get(`/products?category=${categoryId || ""}&limit=4`);
          setRelated((relData.data || []).filter((p: any) => p._id !== found._id));
        }
      } catch {
        // fallback
      }
      setLoading(false);
    };
    fetch();
  }, [slug]);

  const availableSizes = useMemo(() => {
    if (!product?.variants?.length) return [];
    const unique = new Map();
    product.variants.forEach((v: any) => {
      if (v.size && !unique.has(v.size)) unique.set(v.size, v);
    });
    return Array.from(unique.values());
  }, [product?.variants]);

  const selectedVariant = useMemo(() => {
    if (!selectedSize || !product?.variants?.length) return null;
    return product.variants.find((v: any) => v.size === selectedSize) || null;
  }, [selectedSize, product?.variants]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <Skeleton className="aspect-[3/4] w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link href="/shop" className="mt-4 inline-block text-sm underline">Back to shop</Link>
      </div>
    );
  }

  const images = product.images?.length ? product.images : [{ url: "/placeholder.svg", type: "front" }];

  const displayPrice = selectedVariant?.price ?? product.sellingPrice;
  const displayMrp = product.mrp;
  const discount = getDiscountPercentage(displayMrp, displayPrice);

  const handleAddToCart = async () => {
    if (!user) { setLoginOpen(true); return; }
    await addToCart({
      _id: product._id,
      name: product.name,
      price: displayPrice,
      quantity,
      size: selectedSize,
      color: "",
      image: getImageUrl(product.images),
      stock: selectedVariant?.stock ?? product.stock,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = async () => {
    if (!user) { setLoginOpen(true); return; }
    await addToCart({
      _id: product._id,
      name: product.name,
      price: displayPrice,
      quantity,
      size: selectedSize,
      color: "",
      image: getImageUrl(product.images),
      stock: selectedVariant?.stock ?? product.stock,
    });
    router.push("/checkout");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "Shop", href: "/shop" }, { label: product.name }]} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mt-4">
        <div className="space-y-3">
          <ImageZoom
            key={selectedImage}
            src={images[selectedImage]?.url || images[0]?.url}
            alt={product.name}
            discount={discount}
          />
          {images.length > 1 && (
            <div className="flex gap-2 overflow-auto pb-2">
              {images.map((img: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`shrink-0 w-16 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === i ? "border-black" : "border-transparent"
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="sticky top-24">
            <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>

            <div className="flex items-center gap-3 mt-4">
              <span className="text-2xl font-bold">{formatPrice(displayPrice)}</span>
              {displayMrp > displayPrice && (
                <>
                  <span className="text-gray-400 line-through">{formatPrice(displayMrp)}</span>
                  <span className="text-sm text-green-600 font-medium">-{discount}% OFF</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
              <span className="text-green-600 font-medium">In Stock</span>
              <span>|</span>
              <span>{selectedVariant?.stock ?? product.stock} units</span>
            </div>

            <p className="mt-6 text-gray-600 leading-relaxed">
              {product.description || "Premium quality fabric with a modern fit. Designed for comfort and style."}
            </p>

            <div className="mt-8">
              <p className="text-xs tracking-widest uppercase font-medium mb-3">
                Select Size <span className="text-red-500">*</span>
              </p>
              {availableSizes.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((v: any) => {
                    const outOfStock = v.stock !== undefined && v.stock <= 0;
                    return (
                      <button
                        key={v.size}
                        onClick={() => !outOfStock && setSelectedSize(v.size)}
                        disabled={outOfStock}
                        className={`w-12 h-12 rounded-full border text-sm font-medium transition-all ${
                          selectedSize === v.size
                            ? "bg-black text-white border-black"
                            : outOfStock
                            ? "border-gray-200 text-gray-300 line-through cursor-not-allowed"
                            : "border-gray-300 text-gray-600 hover:border-black"
                        }`}
                      >
                        {v.size}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No sizes available</p>
              )}
            </div>

            <div className="flex items-center gap-4 mt-8">
              <div className="flex items-center border rounded-full">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2.5 hover:bg-gray-100 transition-colors"
                >
                  -
                </button>
                <span className="px-5 py-2.5 text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2.5 hover:bg-gray-100 transition-colors"
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
                aria-label="Toggle wishlist"
              >
                <Heart size={20} className={isInWishlist(product._id) ? "fill-white" : ""} />
              </button>

              <button
                onClick={() => navigator.share?.({ title: product.name, url: window.location.href })}
                className="p-3 rounded-full border border-gray-300 hover:border-black transition-colors"
                aria-label="Share"
              >
                <Share2 size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-3 mt-8">
              <Button
                size="lg"
                fullWidth
                onClick={handleAddToCart}
                disabled={!selectedSize}
              >
                {addedToCart ? "Added to Cart!" : selectedSize ? "Add to Cart" : "Select a Size"}
              </Button>
              <Button variant="outline" size="lg" fullWidth disabled={!selectedSize} onClick={handleBuyNow}>
                Buy Now
              </Button>
            </div>

            <div className="flex items-center gap-6 mt-8 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <Truck size={16} />
                Free shipping
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw size={16} />
                30-day returns
              </div>
              <div className="flex items-center gap-2">
                <Shield size={16} />
                Secure checkout
              </div>
            </div>

            <div className="mt-8 border-t pt-6">
              <Accordion
                items={[
                  {
                    title: "Product Details",
                    content: (
                      <div className="space-y-2 text-sm">
                        {product.material && <p><strong>Material:</strong> {product.material}</p>}
                        {product.fabric && <p><strong>Fabric:</strong> {product.fabric}</p>}
                        {product.brand && <p><strong>Brand:</strong> {product.brand}</p>}
                        <p><strong>SKU:</strong> {product.sku}</p>
                      </div>
                    ),
                  },
                  {
                    title: "Shipping Information",
                    content: (
                      <div className="text-sm space-y-2">
                        <p>Free shipping on orders above ₹999.</p>
                        <p>Estimated delivery: 3-7 business days.</p>
                        <p>Express shipping available at checkout.</p>
                      </div>
                    ),
                  },
                  {
                    title: "Return Policy",
                    content: (
                      <div className="text-sm space-y-2">
                        <p>30-day return policy from the date of delivery.</p>
                        <p>Items must be unworn with tags attached.</p>
                        <p>Refunds processed within 7-10 business days.</p>
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16 md:mt-24">
          <h2 className="text-xl md:text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map((p, i) => (
              <ProductCard key={p._id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
