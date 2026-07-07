"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { MapPin, Plus, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";

export default function AddressesPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/account/login");
        return;
      }
      setAddresses([]);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/account/dashboard" className="text-sm text-gray-500 hover:text-black mb-2 block">← Back to Dashboard</Link>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Saved Addresses</h1>
          <Button size="sm">+ Add New</Button>
        </div>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-16">
          <MapPin size={48} className="text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No addresses saved</h2>
          <p className="text-gray-500 mb-6">Add an address for faster checkout.</p>
          <Button>Add New Address</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr, i) => (
            <div key={i} className="p-4 bg-white border rounded-xl">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{addr.name}</p>
                  <p className="text-sm text-gray-500 mt-1">{addr.address}, {addr.city}</p>
                  <p className="text-sm text-gray-500">{addr.state} - {addr.zip}</p>
                  <p className="text-sm text-gray-500">{addr.phone}</p>
                </div>
                <button className="text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
