"use client";

import { motion } from "framer-motion";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function ReturnPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "Return Policy" }]} />
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Return Policy</h1>
        <div className="prose prose-sm max-w-none text-gray-600 space-y-4">
          <p>We offer a 30-day return policy from the date of delivery. If you&apos;re not satisfied with your purchase, you can initiate a return.</p>
          <h3 className="text-black font-semibold text-lg">Return Conditions</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Items must be unworn and unwashed</li>
            <li>All tags must be attached</li>
            <li>Original packaging must be intact</li>
            <li>Return must be initiated within 30 days of delivery</li>
          </ul>
          <h3 className="text-black font-semibold text-lg">Refund Process</h3>
          <p>Once we receive and inspect the returned item, refunds are processed within 7-10 business days. Refunds are credited to the original payment method.</p>
          <h3 className="text-black font-semibold text-lg">Exchange</h3>
          <p>For size exchanges, please initiate a return and place a new order for the correct size. This ensures faster processing.</p>
          <h3 className="text-black font-semibold text-lg">Non-Returnable Items</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Sale items (final sale)</li>
            <li>Innerwear and lingerie</li>
            <li>Accessories</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
