import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

export function getDiscountPercentage(mrp: number, sellingPrice: number): number {
  if (mrp <= 0) return 0;
  return Math.round(((mrp - sellingPrice) / mrp) * 100);
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function truncate(str: string, length = 100): string {
  if (!str) return "";
  if (str.length <= length) return str;
  return str.substring(0, length) + "...";
}

export function getImageUrl(images: { url: string; isPrimary?: boolean }[] = []): string {
  if (images.length === 0) return "/placeholder.svg";
  const primary = images.find((img) => img.isPrimary);
  return primary?.url || images[0]?.url || "/placeholder.svg";
}

export function getHoverImage(images: { url: string; type?: string }[] = []): string | null {
  if (images.length < 2) return null;
  return images[1]?.url || null;
}

export function getCartCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    return cart.reduce((acc: number, item: { quantity: number }) => acc + item.quantity, 0);
  } catch {
    return 0;
  }
}
