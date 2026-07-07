"use client";

import { useState } from "react";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ChangePasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch {
      setError("Failed to send reset email");
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link href="/account/dashboard" className="text-sm text-gray-500 hover:text-black mb-4 block">← Back to Dashboard</Link>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-green-600 text-2xl">✓</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Reset Email Sent</h1>
          <p className="text-gray-500">Check your inbox for the password reset link.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/account/dashboard" className="text-sm text-gray-500 hover:text-black mb-4 block">← Back to Dashboard</Link>
      <h1 className="text-3xl font-bold mb-8">Change Password</h1>
      <p className="text-sm text-gray-500 mb-6">Enter your email to receive a password reset link.</p>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <Input id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" loading={loading}>Send Reset Link</Button>
      </form>
    </div>
  );
}
