"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItem {
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
  allowMultiple?: boolean;
}

export default function Accordion({ items, className, allowMultiple = false }: AccordionProps) {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const toggle = (index: number) => {
    if (allowMultiple) {
      setOpenIndexes((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      );
    } else {
      setOpenIndexes((prev) => (prev.includes(index) ? [] : [index]));
    }
  };

  return (
    <div className={cn("divide-y divide-gray-200", className)}>
      {items.map((item, index) => {
        const isOpen = openIndexes.includes(index);
        return (
          <div key={index}>
            <button
              onClick={() => toggle(index)}
              className="flex items-center justify-between w-full py-4 text-left transition-colors hover:text-gray-600"
            >
              <span className="font-medium">{item.title}</span>
              <ChevronDown
                size={18}
                className={cn("transition-transform duration-300", isOpen && "rotate-180")}
              />
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pb-4 text-gray-600 leading-relaxed">{item.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
