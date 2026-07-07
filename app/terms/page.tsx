"use client";

import { motion } from "framer-motion";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "Terms & Conditions" }]} />
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Terms & Conditions</h1>
        <div className="prose prose-sm max-w-none text-gray-600 space-y-4">
          <p>By using the DRESS website, you agree to these terms and conditions. Please read them carefully.</p>
          <h3 className="text-black font-semibold text-lg">Account Registration</h3>
          <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>
          <h3 className="text-black font-semibold text-lg">Pricing and Availability</h3>
          <p>All prices are listed in INR and include applicable taxes. We reserve the right to modify prices and product availability at any time.</p>
          <h3 className="text-black font-semibold text-lg">Order Acceptance</h3>
          <p>We reserve the right to refuse or cancel any order for reasons including product availability, pricing errors, or suspected fraud.</p>
          <h3 className="text-black font-semibold text-lg">Intellectual Property</h3>
          <p>All content on this website including images, text, and designs are the property of DRESS and may not be reproduced without permission.</p>
          <h3 className="text-black font-semibold text-lg">Limitation of Liability</h3>
          <p>DRESS shall not be liable for any indirect, incidental, or consequential damages arising from the use of this website or products purchased.</p>
        </div>
      </motion.div>
    </div>
  );
}
