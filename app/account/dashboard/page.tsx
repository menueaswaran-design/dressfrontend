"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuthStore } from "@/store/auth";
import {
  User, Package, Heart, MapPin, LogOut, ChevronRight,
} from "lucide-react";

const menuItems = [
  { label: "My Orders", href: "/account/dashboard/orders", icon: Package },
  { label: "Wishlist", href: "/account/dashboard/wishlist", icon: Heart },
  { label: "Saved Addresses", href: "/account/dashboard/addresses", icon: MapPin },
  { label: "Profile", href: "/account/dashboard/profile", icon: User },
  { label: "Change Password", href: "/account/dashboard/change-password", icon: User },
];

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/account/login");
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" /></div>;
  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Account</h1>
        <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between p-4 bg-white border rounded-xl hover:border-black transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                  <Icon size={20} />
                </div>
                <span className="font-medium">{item.label}</span>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </Link>
          );
        })}
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 transition-colors"
      >
        <LogOut size={16} />
        Sign Out
      </button>
    </div>
  );
}
