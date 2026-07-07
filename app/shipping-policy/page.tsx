"use client";

import { motion } from "framer-motion";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "Shipping Policy" }]} />
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Shipping Policy</h1>
        <div className="prose prose-sm max-w-none text-gray-600 space-y-4">
          <p>We offer free shipping on all orders above ₹999. Orders below this amount are charged a flat shipping fee of ₹99.</p>
          <h3 className="text-black font-semibold text-lg">Delivery Timeline</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Metro Cities: 2-4 business days</li>
            <li>Tier 2 Cities: 3-5 business days</li>
            <li>Remote Areas: 5-7 business days</li>
          </ul>
          <h3 className="text-black font-semibold text-lg">Order Processing</h3>
          <p>Orders are processed within 24 hours of placement. Orders placed on weekends or public holidays are processed on the next business day.</p>
          <h3 className="text-black font-semibold text-lg">Tracking</h3>
          <p>Once your order is shipped, you will receive a tracking number via email and SMS. You can track your order status in real-time.</p>
          <h3 className="text-black font-semibold text-lg">Shipping Partners</h3>
          <p>We partner with trusted courier services including Delhivery, Blue Dart, and India Post for reliable delivery.</p>
        </div>
      </motion.div>
    </div>
  );
}
