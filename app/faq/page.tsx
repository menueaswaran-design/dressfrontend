"use client";

import { motion } from "framer-motion";
import Accordion from "@/components/ui/Accordion";
import Breadcrumb from "@/components/ui/Breadcrumb";

const faqs = [
  {
    title: "What payment methods do you accept?",
    content: "We accept UPI, Credit Card, Debit Card, Wallet, Net Banking, and Cash on Delivery (COD).",
  },
  {
    title: "How long does shipping take?",
    content: "Standard shipping takes 3-7 business days within India. Express shipping is available at checkout for 1-2 day delivery.",
  },
  {
    title: "What is your return policy?",
    content: "We offer a 30-day return policy from the date of delivery. Items must be unworn with tags attached. Refunds are processed within 7-10 business days.",
  },
  {
    title: "Do you offer free shipping?",
    content: "Yes! We offer free shipping on all orders above ₹999. For orders below this amount, a nominal shipping fee applies.",
  },
  {
    title: "How can I track my order?",
    content: "Once your order is shipped, you will receive a tracking link via email and SMS. You can also track your order from your account dashboard.",
  },
  {
    title: "Can I cancel my order?",
    content: "Orders can be cancelled within 24 hours of placing. Once shipped, cancellations are not possible, but you can initiate a return after delivery.",
  },
  {
    title: "How do I find my size?",
    content: "Refer to our size guide on each product page. If you need further assistance, feel free to contact our support team.",
  },
  {
    title: "Do you ship internationally?",
    content: "Currently we ship within India only. We are working on expanding to international markets soon.",
  },
];

export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "FAQ" }]} />

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">FAQ</h1>
        <p className="text-gray-500 mb-8">Frequently asked questions</p>
        <Accordion items={faqs} />
      </motion.div>
    </div>
  );
}
