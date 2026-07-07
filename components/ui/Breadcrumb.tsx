"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-1 text-sm text-gray-500 py-4">
      <Link href="/" className="hover:text-black transition-colors">
        <Home size={16} />
      </Link>
      {items.map((item, index) => (
        <span key={index} className="flex items-center space-x-1">
          <ChevronRight size={14} />
          {item.href ? (
            <Link href={item.href} className="hover:text-black transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-black font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
