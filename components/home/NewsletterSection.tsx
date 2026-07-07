"use client";

import { motion } from "framer-motion";
import NewsletterForm from "@/components/shared/NewsletterForm";

export default function NewsletterSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800/30 via-transparent to-transparent" />
      <div className="max-w-2xl mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-xs tracking-[0.2em] uppercase text-gray-500 font-medium">Newsletter</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mt-3">Stay in the Loop</h2>
          <p className="mt-3 text-sm text-gray-400 max-w-sm mx-auto">
            Be the first to know about new arrivals, exclusive drops, and special offers.
          </p>
          <div className="mt-8 max-w-md mx-auto">
            <NewsletterForm />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
