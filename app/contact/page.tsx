"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "Contact Us" }]} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 mt-8">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Get in Touch</h1>
          <p className="mt-4 text-gray-500">Have a question? We&apos;d love to hear from you.</p>

          <div className="mt-8 space-y-6">
            {[
              { icon: Mail, label: "Email", value: "hello@dress.com" },
              { icon: Phone, label: "Phone", value: "+91 98765 43210" },
              { icon: MapPin, label: "Address", value: "Mumbai, Maharashtra, India" },
              { icon: Clock, label: "Hours", value: "Mon - Sat: 9AM - 6PM" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{item.label}</p>
                    <p className="font-medium">{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          {submitted ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-2xl">✓</span>
              </div>
              <h2 className="text-xl font-bold mb-2">Message Sent!</h2>
              <p className="text-gray-500">We&apos;ll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input id="firstName" label="First Name" required />
                <Input id="lastName" label="Last Name" required />
              </div>
              <Input id="email" label="Email" type="email" required />
              <Input id="subject" label="Subject" required />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
              <Button type="submit">Send Message</Button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
