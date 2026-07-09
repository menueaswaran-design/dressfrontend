"use client";

import { useRef, useState, useCallback } from "react";

interface ImageZoomProps {
  src: string;
  alt: string;
  discount?: number;
}

const ZOOM = 3;
const LENS_SIZE = 110;
const PREVIEW_W = 320;
const PREVIEW_H = 340;

export default function ImageZoom({ src, alt, discount }: ImageZoomProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [pct, setPct] = useState({ x: 50, y: 50 });
  const [previewPos, setPreviewPos] = useState({ left: 0, top: 0 });

  const calcPreviewPos = useCallback((clientX: number, clientY: number) => {
    let left = clientX + 24;
    let top = clientY - PREVIEW_H / 2;
    if (left + PREVIEW_W > window.innerWidth) left = clientX - PREVIEW_W - 24;
    top = Math.max(16, Math.min(top, window.innerHeight - PREVIEW_H - 16));
    return { left, top };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPct({
      x: Math.min(100, Math.max(0, x)),
      y: Math.min(100, Math.max(0, y)),
    });
    setPreviewPos(calcPreviewPos(e.clientX, e.clientY));
  }, [calcPreviewPos]);

  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    setIsHovered(true);
    setPreviewPos(calcPreviewPos(e.clientX, e.clientY));
  }, [calcPreviewPos]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="relative aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden cursor-crosshair select-none"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        <img src={src} alt={alt} className="w-full h-full object-cover pointer-events-none" />
        {discount && discount > 0 && (
          <span className="absolute top-4 left-4 bg-black text-white text-xs px-3 py-1.5 rounded-full font-medium pointer-events-none z-10">
            -{discount}%
          </span>
        )}
        {isHovered && (
          <div
            className="absolute border-2 border-white rounded-full shadow pointer-events-none z-20"
            style={{
              left: `calc(${pct.x}% - ${LENS_SIZE / 2}px)`,
              top: `calc(${pct.y}% - ${LENS_SIZE / 2}px)`,
              width: LENS_SIZE,
              height: LENS_SIZE,
              boxShadow: "0 0 0 9999px rgba(0,0,0,0.35)",
            }}
          />
        )}
      </div>

      {isHovered && (
        <div
          className="fixed z-50 border border-gray-200 rounded-lg overflow-hidden shadow-2xl pointer-events-none bg-white"
          style={{
            left: previewPos.left,
            top: previewPos.top,
            width: PREVIEW_W,
            height: PREVIEW_H,
          }}
        >
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url(${src})`,
              backgroundSize: `${ZOOM * 100}%`,
              backgroundPosition: `${pct.x}% ${pct.y}%`,
              backgroundRepeat: "no-repeat",
            }}
          />
        </div>
      )}
    </div>
  );
}
