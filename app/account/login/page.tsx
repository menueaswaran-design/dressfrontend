"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/account/dashboard");
    } catch (err: any) {
      setError(err.code === "auth/user-not-found" ? "No account found with this email" : "Invalid email or password");
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
      setError("Google login failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">Welcome Back</h1>
        <p className="text-gray-500 text-center mb-8 text-sm">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input id="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" fullWidth size="lg" loading={loading}>Sign In</Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t" /></div>
          <div className="relative flex justify-center text-xs"><span className="bg-white px-2 text-gray-500">OR</span></div>
        </div>

        <Button variant="outline" fullWidth size="lg" onClick={handleGoogle} loading={loading}>
          Continue with Google
        </Button>

        <div className="mt-6 text-center text-sm space-y-2">
          <Link href="/account/forgot-password" className="text-gray-500 hover:text-black block">Forgot password?</Link>
          <p className="text-gray-500">
            Don&apos;t have an account?{" "}
            <Link href="/account/register" className="text-black font-medium hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
