"use client";

import { motion } from "framer-motion";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "Privacy Policy" }]} />
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Privacy Policy</h1>
        <div className="prose prose-sm max-w-none text-gray-600 space-y-4">
          <p>Your privacy is important to us. This policy outlines how we collect, use, and protect your personal information.</p>
          <h3 className="text-black font-semibold text-lg">Information We Collect</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Name, email address, phone number</li>
            <li>Shipping and billing address</li>
            <li>Payment information (processed securely by our payment partners)</li>
            <li>Order history and preferences</li>
          </ul>
          <h3 className="text-black font-semibold text-lg">How We Use Your Information</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Process and fulfill your orders</li>
            <li>Send order updates and shipping notifications</li>
            <li>Provide customer support</li>
            <li>Send promotional offers (with your consent)</li>
          </ul>
          <h3 className="text-black font-semibold text-lg">Data Security</h3>
          <p>We implement industry-standard security measures to protect your data. Your payment information is encrypted and never stored on our servers.</p>
          <h3 className="text-black font-semibold text-lg">Contact</h3>
          <p>For privacy-related inquiries, please contact us at privacy@dress.com.</p>
        </div>
      </motion.div>
    </div>
  );
}
