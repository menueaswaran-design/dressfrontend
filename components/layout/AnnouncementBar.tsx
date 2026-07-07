"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import api from "@/lib/api";

export default function AnnouncementBar() {
  const [message, setMessage] = useState("");
  const [bgColor, setBgColor] = useState("#111111");
  const [textColor, setTextColor] = useState("#ffffff");
  const [isVisible, setIsVisible] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const { data } = await api.get("/homepage/sections/announcement_bar");
        const bar = data.data?.section?.announcementBar;
        if (bar?.isActive) {
          setMessage(bar.message);
          setBgColor(bar.backgroundColor || "#111111");
          setTextColor(bar.textColor || "#ffffff");
          setIsVisible(true);
        }
      } catch {
        // silent
      }
    };
    fetchAnnouncement();
  }, []);

  if (!isVisible || dismissed || !message) return null;

  return (
    <div
      style={{ backgroundColor: bgColor, color: textColor }}
      className="relative text-center text-xs py-2 px-4 font-medium tracking-wider"
    >
      <span>{message}</span>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70"
        aria-label="Dismiss announcement"
      >
        <X size={14} />
      </button>
    </div>
  );
}
