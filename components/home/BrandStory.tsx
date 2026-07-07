"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

export default function BrandStory() {
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
            <div className="w-full h-full bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center relative">
              <span className="text-white/10 text-9xl font-bold tracking-tighter select-none">D</span>
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="text-xs tracking-[0.2em] uppercase text-gray-400 font-medium">Our Story</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight mt-3">
              Designed for the <br />
              <span className="text-gray-300">Modern Individual</span>
            </h2>
            <p className="mt-6 text-gray-500 leading-relaxed max-w-md">
              At DRESS, we believe fashion is more than clothing — it&apos;s a statement of confidence. 
              Every piece is crafted with premium materials and meticulous attention to detail, 
              ensuring you look and feel your best.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <Link href="/shop">
                <Button size="lg">Explore Collection</Button>
              </Link>
              <Link href="/about" className="text-sm font-medium tracking-wider uppercase hover:text-gray-500 transition-colors">
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
