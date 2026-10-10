"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/lib/supabase";
import { signOut } from "@/lib/auth";
import { useLang } from "@/lib/language";
import { Logo } from "@/components/Logo";
import { BuildingIcon, FileTextIcon, SettingsIcon, CreditCardIcon, UsersIcon, BellIcon, EyeIcon, LockIcon, HelpCircleIcon, LogOutIcon, ChevronRightIcon } from "@/components/icons";

export default function Profile() {
  const router = useRouter();
  const { t } = useLang();
  const [user, setUser] = useState<any>(null);

  useEffect(() => { supabase.auth.getUser().then(({ data }) => setUser(data.user)); }, []);

  const handleLogout = async () => {
    if (!confirm("Logout karna hai?")) return;
    await signOut();
    router.push("/login");
  };

  const menu = [
    { Icon: BuildingIcon, label: "Company Profile", href: "/company", color: "blue" },
    { Icon: FileTextIcon, label: "Document Vault", href: "/documents", color: "indigo" },
    { Icon: SettingsIcon, label: t("settings"), href: "/settings", color: "gray" },
    { Icon: CreditCardIcon, label: "Subscription", href: "/subscription", color: "purple" },
    { Icon: UsersIcon, label: "Team Members", href: "/team", color: "cyan" },
    { Icon: BellIcon, label: "Notifications", href: "/notifications", color: "orange" },
    { Icon: EyeIcon, label: "BidWell Watch", href: "/watch", color: "pink" },
    { Icon: HelpCircleIcon, label: "Support Tickets", href: "/support", color: "teal" },
    { Icon: LockIcon, label: "Audit Log", href: "/audit", color: "slate" },
  ];

  const legal = [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Refund Policy", href: "/refund" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Privacy & Security", href: "/privacy" },
  ];

  const colorMap: any = {
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600",
    indigo: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600",
    gray: "bg-gray-100 dark:bg-gray-800 text-gray-600",
    purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600",
    cyan: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600",
    orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-600",
    pink: "bg-pink-100 dark:bg-pink-900/30 text-pink-600",
    slate: "bg-slate-100 dark:bg-slate-900/30 text-slate-600",
    teal: "bg-teal-100 dark:bg-teal-900/30 text-teal-600",
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white px-5 pt-6 pb-24 rounded-b-[2rem] relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex items-center">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mr-4 border-2 border-white/30 bg-white/10 backdrop-blur-md">
            <span className="text-3xl font-bold text-white">{user?.user_metadata?.full_name?.[0]?.toUpperCase() || "U"}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold tracking-tight truncate">{user?.user_metadata?.full_name || "User"}</h1>
            <p className="text-blue-100/80 text-xs truncate mt-0.5">{user?.email || ""}</p>
            <span className="inline-flex items-center text-[10px] bg-gradient-to-r from-yellow-400 to-amber-500 text-yellow-900 px-2.5 py-1 rounded-full font-bold mt-2 tracking-wide uppercase">★ Free Plan</span>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-14 relative z-20">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          {menu.map((m, i) => (
            <Link key={i} href={m.href}>
              <div className={`flex items-center px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 ${i !== menu.length - 1 ? "border-b border-gray-100 dark:border-gray-800" : ""}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mr-3 ${colorMap[m.color]}`}>
                  <m.Icon size={18} />
                </div>
                <p className="flex-1 text-sm font-semibold text-gray-900 dark:text-white">{m.label}</p>
                <ChevronRightIcon size={16} className="text-gray-400" />
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden mt-4">
          {legal.map((l, i) => (
            <Link key={i} href={l.href}>
              <div className={`flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 ${i !== legal.length - 1 ? "border-b border-gray-100 dark:border-gray-800" : ""}`}>
                <p className="flex-1 text-xs font-medium text-gray-700 dark:text-gray-300">{l.label}</p>
                <ChevronRightIcon size={14} className="text-gray-400" />
              </div>
            </Link>
          ))}
        </div>

        <button onClick={handleLogout} className="w-full mt-4 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center px-4 py-3.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center mr-3 bg-red-100 dark:bg-red-900/30">
            <LogOutIcon size={18} className="text-red-600" />
          </div>
          <p className="flex-1 text-left text-sm font-semibold text-red-600">{t("logout")}</p>
        </button>

        <div className="flex flex-col items-center mt-8">
          <Logo size="sm" />
          <p className="text-center text-[10px] text-gray-400 mt-3 tracking-wider uppercase font-semibold">BidWell v1.0 · Made in India 🇮🇳</p>
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
