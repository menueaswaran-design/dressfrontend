"use client";

import Link from "next/link";
import { Globe, Camera, MessageCircle, Music } from "lucide-react";
import NewsletterForm from "@/components/shared/NewsletterForm";

const footerLinks = {
  shop: [
    { label: "New Arrivals", href: "/shop?label=new" },
    { label: "Men", href: "/shop?gender=men" },
    { label: "Women", href: "/shop?gender=women" },
    { label: "Oversized", href: "/shop" },
    { label: "Hoodies", href: "/shop" },
    { label: "Sale", href: "/shop?label=sale" },
  ],
  help: [
    { label: "Contact Us", href: "/contact" },
    { label: "FAQ", href: "/faq" },
    { label: "Shipping Policy", href: "/shipping-policy" },
    { label: "Return Policy", href: "/return-policy" },
    { label: "Size Guide", href: "/faq" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="lg:col-span-1">
            <Link href="/" className="text-2xl font-bold tracking-tighter">
              DRESS
            </Link>
            <p className="mt-4 text-sm text-gray-400 leading-relaxed max-w-xs">
              Premium fashion for the modern individual. Discover curated collections designed for confidence and style.
            </p>
            <div className="flex items-center space-x-4 mt-6">
              <a href="#" className="hover:text-gray-300 transition-colors" aria-label="Instagram">
                <Camera size={20} />
              </a>
              <a href="#" className="hover:text-gray-300 transition-colors" aria-label="Facebook">
                <Globe size={20} />
              </a>
              <a href="#" className="hover:text-gray-300 transition-colors" aria-label="Twitter">
                <MessageCircle size={20} />
              </a>
              <a href="#" className="hover:text-gray-300 transition-colors" aria-label="Youtube">
                <Music size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xs tracking-widest uppercase font-medium mb-4">Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs tracking-widest uppercase font-medium mb-4">Help</h3>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs tracking-widest uppercase font-medium mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-8">
          <div className="max-w-md">
            <h3 className="text-sm font-medium mb-3">Subscribe to our newsletter</h3>
            <NewsletterForm />
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} DRESS. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-2 md:mt-0">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
