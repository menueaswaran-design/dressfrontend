"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import api from "@/lib/api";

interface BrandStoryData {
  isActive: boolean;
  heading: string;
  subHeading: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  image?: string;
}

export default function BrandStory() {
  const [data, setData] = useState<BrandStoryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: res } = await api.get("/homepage/sections/brand_story");
        const story = res.data?.section?.brandStory;
        if (story?.isActive) {
          setData(story);
        }
      } catch {
        setData(null);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading || !data) return null;

  return (
    <section className="py-12 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="aspect-[4/5] rounded-2xl overflow-hidden shadow-xl"
          >
            {data.image ? (
              <img src={data.image} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center relative">
                <span className="text-white/10 text-9xl font-bold tracking-tighter select-none">D</span>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            )}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="text-xs tracking-[0.2em] uppercase text-gray-400 font-medium">
              {data.subHeading}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight mt-3">
              {data.heading}
            </h2>
            <p className="mt-6 text-gray-500 leading-relaxed max-w-md">
              {data.description}
            </p>
            <div className="mt-8 flex items-center gap-4">
              {data.buttonText && data.buttonLink && (
                <Link href={data.buttonLink}>
                  <Button size="lg">{data.buttonText}</Button>
                </Link>
              )}
              {data.secondaryButtonText && data.secondaryButtonLink && (
                <Link
                  href={data.secondaryButtonLink}
                  className="text-sm font-medium tracking-wider uppercase hover:text-gray-500 transition-colors"
                >
                  {data.secondaryButtonText}
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
