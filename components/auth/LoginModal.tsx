"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useUIStore } from "@/store/ui";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface LoginModalProps {
  message?: string;
  onSuccess?: () => void;
}

export default function LoginModal({ message, onSuccess }: LoginModalProps) {
  const isOpen = useUIStore((s) => s.isLoginOpen);
  const setOpen = useUIStore((s) => s.setLoginOpen);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setOpen(false);
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
      setOpen(false);
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || "Google login failed");
    }
    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={() => setOpen(false)} size="sm">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Welcome</h2>
        {message && <p className="text-sm text-gray-500">{message}</p>}
      </div>

      <form onSubmit={handleEmailLogin} className="space-y-4">
        <Input
          id="login-email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          id="login-password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" fullWidth loading={loading}>
          Login
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-2 text-gray-500">OR</span>
        </div>
      </div>

      <Button variant="outline" fullWidth onClick={handleGoogleLogin} loading={loading}>
        Continue with Google
      </Button>

      <div className="mt-6 text-center text-sm">
        <button
          onClick={() => {
            setOpen(false);
            router.push("/account/forgot-password");
          }}
          className="text-gray-500 hover:text-black transition-colors"
        >
          Forgot password?
        </button>
      </div>

      <div className="mt-4 text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <button
          onClick={() => {
            setOpen(false);
            router.push("/account/register");
          }}
          className="text-black font-medium hover:underline"
        >
          Sign up
        </button>
      </div>
    </Modal>
  );
}
