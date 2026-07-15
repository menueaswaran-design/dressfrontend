"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import api from "@/lib/api";
import Button from "@/components/ui/Button";

export default function HeroBanner() {
  const [banners, setBanners] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { data } = await api.get("/homepage/sections/hero_banner");
        const activeBanners = (data.data?.section?.heroBanners || []).filter((b: any) => b.isActive);
        setBanners(activeBanners);
      } catch {
        setBanners([
          {
            heading: "Wear Confidence",
            subHeading: "Premium fashion for the modern individual",
            buttonText: "Shop Now",
            buttonLink: "/shop",
            desktopImage: "",
            mobileImage: "",
          },
        ]);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => setCurrent((prev) => (prev + 1) % banners.length), 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return null;

  const banner = banners[current];

  return (
    <section className="relative h-[80vh] md:h-screen min-h-[500px] overflow-hidden bg-gray-100">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {banner.desktopImage ? (
            <>
              <img
                src={banner.desktopImage}
                alt={banner.heading || "Hero banner"}
                className="hidden md:block w-full h-full object-cover"
              />
              <img
                src={banner.mobileImage || banner.desktopImage}
                alt={banner.heading || "Hero banner"}
                className="md:hidden w-full h-full object-cover"
              />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-black/30" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white max-w-2xl px-4">
          <motion.h1
            key={`h1-${current}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-tight font-playfair"
          >
            {banner.heading || "Wear Confidence"}
          </motion.h1>
          <motion.p
            key={`p-${current}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-4 md:mt-6 text-sm md:text-lg text-gray-200 tracking-wide max-w-md mx-auto font-playfair"
          >
            {banner.subHeading || "Premium fashion for the modern individual"}
          </motion.p>
          <motion.div
            key={`btn-${current}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-8"
          >
            <Link href={banner.buttonLink || "/shop"}>
              <Button
                variant="secondary"
                size="lg"
                className="text-black bg-white hover:bg-white/90"
              >
                {banner.buttonText || "Shop Now"}
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {banners.length > 1 && (
        <>
          <button
            onClick={() => setCurrent((prev) => (prev - 1 + banners.length) % banners.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => setCurrent((prev) => (prev + 1) % banners.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors"
          >
            <ChevronRight size={24} />
          </button>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_: any, i: number) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === current ? "bg-white w-6" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
