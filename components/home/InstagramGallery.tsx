"use client";

import { motion } from "framer-motion";
import { Camera } from "lucide-react";

const images = Array.from({ length: 6 }).map((_, i) => ({
  id: i,
  url: "",
  alt: `Instagram ${i + 1}`,
}));

export default function InstagramGallery() {
  return (
    <section className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Camera size={20} />
            <span className="text-sm font-medium tracking-wider uppercase">Follow Us</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight">@dress</h2>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
          {images.map((img, i) => (
            <motion.a
              key={img.id}
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
            >
              <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
              <div className="absolute inset-0 bg-black/40 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="text-white" size={24} />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
