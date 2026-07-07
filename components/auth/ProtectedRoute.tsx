"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { useUIStore } from "@/store/ui";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const setLoginOpen = useUIStore((s) => s.setLoginOpen);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        setLoginOpen(true);
        router.push("/");
      }
    });
    return () => unsubscribe();
  }, [router, setLoginOpen]);

  return <>{children}</>;
}
