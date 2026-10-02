"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/lib/supabase";
import { signOut } from "@/lib/auth";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleLogout = async () => {
    if (!confirm("Logout karna hai?")) return;
    await signOut();
    router.push("/login");
  };

  const menu = [
    { icon: "🏢", label: "Company Profile", href: "/company" },
    { icon: "📄", label: "Document Vault", href: "/documents" },
    { icon: "💳", label: "Subscription & Billing", href: "#" },
    { icon: "👥", label: "Team Members", href: "#" },
    { icon: "🔔", label: "Notification Settings", href: "#" },
    { icon: "❓", label: "Help & Support", href: "#" },
    { icon: "🔒", label: "Privacy & Security", href: "#" },
  ];

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-blue-600 text-white p-6 rounded-b-3xl">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl mr-4">👤</div>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{user?.user_metadata?.full_name || "User"}</h1>
            <p className="text-blue-200 text-sm truncate">{user?.email || ""}</p>
            <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full font-bold mt-1 inline-block">★ Free Plan</span>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {menu.map((m, i) => (
            <Link key={i} href={m.href}>
              <div className="w-full p-4 flex items-center justify-between border-b border-gray-100 last:border-0 hover:bg-gray-50">
                <div className="flex items-center">
                  <span className="text-xl mr-3">{m.icon}</span>
                  <p className="text-sm font-medium text-gray-900">{m.label}</p>
                </div>
                <span className="text-gray-400">›</span>
              </div>
            </Link>
          ))}
        </div>

        <button onClick={handleLogout} className="w-full mt-5 p-4 bg-white rounded-2xl shadow-sm flex items-center justify-between text-red-600 font-semibold text-sm">
          <span>Logout</span>
          <span>→</span>
        </button>

        <p className="text-center text-xs text-gray-400 mt-6">BidWell v1.0 · Made in India 🇮🇳</p>
      </div>

      <BottomNav />
    </main>
  );
}
