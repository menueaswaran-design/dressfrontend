"use client";

import { useState } from "react";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ForgotPasswordPage() {
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
      setError("Failed to send reset email. Please check the email address.");
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-green-600 text-2xl">✓</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Check Your Email</h1>
          <p className="text-gray-500 mb-6 text-sm">We&apos;ve sent a password reset link to {email}</p>
          <Link href="/account/login"><Button>Back to Login</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">Forgot Password</h1>
        <p className="text-gray-500 text-center mb-8 text-sm">Enter your email and we&apos;ll send you a reset link</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" fullWidth size="lg" loading={loading}>Send Reset Link</Button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          Remember your password?{" "}
          <Link href="/account/login" className="text-black font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
