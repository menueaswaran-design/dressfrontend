"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "About Us" }]} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center mt-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
            Our Story
          </h1>
          <p className="mt-6 text-gray-500 leading-relaxed">
            DRESS was founded with a simple vision: to create premium fashion that empowers 
            individuals to express their unique style with confidence. We believe that great 
            design should be accessible to everyone.
          </p>
          <p className="mt-4 text-gray-500 leading-relaxed">
            Every piece in our collection is thoughtfully designed, using the finest materials 
            and meticulous craftsmanship. From oversized tees to tailored joggers, each item 
            reflects our commitment to quality and modern aesthetics.
          </p>
          <div className="mt-8">
            <Link href="/shop">
              <Button size="lg">Explore Collection</Button>
            </Link>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="aspect-[4/5] bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl overflow-hidden"
        >
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-8xl font-bold text-gray-400">D</span>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 text-center">
        {[
          { number: "500+", label: "Products" },
          { number: "50K+", label: "Happy Customers" },
          { number: "10+", label: "Cities" },
          { number: "4.8", label: "Average Rating" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <p className="text-3xl md:text-4xl font-bold">{stat.number}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
