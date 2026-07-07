"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await new Promise((r) => setTimeout(r, 1000));
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        className="flex-1 px-4 py-2.5 bg-white/10 border border-gray-700 rounded-full text-sm text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors"
      />
      <Button type="submit" variant="secondary" size="sm" loading={status === "loading"}>
        Subscribe
      </Button>
    </form>
  );
}
