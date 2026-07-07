"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/account/dashboard");
    } catch (err: any) {
      setError(err.code === "auth/email-already-in-use" ? "Email already registered" : "Registration failed");
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/account/dashboard");
    } catch {
      setError("Google signup failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">Create Account</h1>
        <p className="text-gray-500 text-center mb-8 text-sm">Join us for a premium shopping experience</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input id="name" label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input id="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" fullWidth size="lg" loading={loading}>Create Account</Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t" /></div>
          <div className="relative flex justify-center text-xs"><span className="bg-white px-2 text-gray-500">OR</span></div>
        </div>

        <Button variant="outline" fullWidth size="lg" onClick={handleGoogle} loading={loading}>
          Continue with Google
        </Button>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/account/login" className="text-black font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
