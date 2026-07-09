"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import api from "@/lib/api";

interface PromoBannerData {
  isActive: boolean;
  heading: string;
  subHeading: string;
  buttonText: string;
  buttonLink: string;
  desktopImage?: string;
  mobileImage?: string;
  backgroundColor?: string;
  textColor?: string;
}

export default function PromoBanner() {
  const [data, setData] = useState<PromoBannerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: res } = await api.get("/homepage/sections/promotional_banner");
        const banner = res.data?.section?.promotionalBanner;
        if (banner?.isActive) {
          setData(banner);
        }
      } catch {
        setData(null);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading || !data) return null;

  const hasImage = !!data.desktopImage;

  return (
    <section
      className="py-16 md:py-24 relative overflow-hidden"
      style={{
        background: hasImage
          ? `url(${data.desktopImage}) center/cover no-repeat`
          : `linear-gradient(135deg, ${data.backgroundColor || '#111827'}, #000)`,
      }}
    >
      {hasImage && (
        <div className="absolute inset-0 bg-black/50" />
      )}
      <div
        className="max-w-7xl mx-auto px-4 text-center relative z-10"
        style={{ color: data.textColor || '#ffffff' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-xs tracking-[0.2em] uppercase font-semibold opacity-80">Special Offer</span>
          <h2 className="text-3xl md:text-6xl font-bold tracking-tight mt-4">
            {data.heading}
          </h2>
          {data.subHeading && (
            <p className="mt-4 opacity-80 max-w-lg mx-auto">
              {data.subHeading}
            </p>
          )}
          <div className="mt-8 flex items-center justify-center gap-4">
            {data.buttonText && data.buttonLink && (
              <Link href={data.buttonLink}>
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-white text-black hover:bg-white/90"
                >
                  {data.buttonText} <ArrowRight size={16} />
                </Button>
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
