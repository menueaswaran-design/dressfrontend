"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.push("/account/login");
        return;
      }
      setUser(u);
      setName(u.displayName || "");
    });
    return () => unsubscribe();
  }, [router]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateProfile(user, { displayName: name });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {}
    setSaving(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/account/dashboard" className="text-sm text-gray-500 hover:text-black mb-4 block">← Back to Dashboard</Link>
      <h1 className="text-3xl font-bold mb-8">Profile</h1>

      <div className="space-y-4">
        <Input id="name" label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input id="email" label="Email" value={user?.email || ""} disabled />
        <Button onClick={handleSave} loading={saving}>
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
