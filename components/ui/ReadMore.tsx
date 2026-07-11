"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ReadMoreProps {
  text: string;
  fallback?: string;
  className?: string;
}

export default function ReadMore({ text, fallback = "", className }: ReadMoreProps) {
  const [expanded, setExpanded] = useState(false);
  const content = text || fallback;

  if (!content) return null;

  return (
    <div>
      <p className={cn("text-gray-600 leading-relaxed", !expanded && "line-clamp-2", className)}>
        {content}
      </p>
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-sm text-blue-600 font-medium mt-1 hover:underline cursor-pointer"
      >
        {expanded ? "Show Less" : "Read More"}
      </button>
    </div>
  );
}
