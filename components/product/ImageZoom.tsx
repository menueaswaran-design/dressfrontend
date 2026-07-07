"use client";

import { useRef, useState, useCallback } from "react";

interface ImageZoomProps {
  src: string;
  alt: string;
  discount?: number;
}

const ZOOM = 2.5;

export default function ImageZoom({ src, alt, discount }: ImageZoomProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [pct, setPct] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPos({ x, y });
    setPct({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  }, []);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="relative aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden cursor-crosshair select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
      >
        <img src={src} alt={alt} className="w-full h-full object-cover" />
        {discount && discount > 0 && (
          <span className="absolute top-4 left-4 bg-black text-white text-xs px-3 py-1.5 rounded-full font-medium pointer-events-none z-10">
            -{discount}%
          </span>
        )}
        {isHovered && (
          <div
            className="absolute border-2 border-white rounded-full shadow pointer-events-none"
            style={{
              left: pos.x - 50,
              top: pos.y - 50,
              width: 100,
              height: 100,
              boxShadow: "0 0 0 9999px rgba(0,0,0,0.3)",
            }}
          />
        )}
      </div>

      {isHovered && (
        <div className="absolute top-2 right-2 w-40 h-40 md:w-48 md:h-48 border-2 border-white rounded-lg overflow-hidden shadow-2xl z-30 pointer-events-none">
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            style={{
              transform: `scale(${ZOOM})`,
              transformOrigin: `${pct.x}% ${pct.y}%`,
            }}
          />
        </div>
      )}
    </div>
  );
}
