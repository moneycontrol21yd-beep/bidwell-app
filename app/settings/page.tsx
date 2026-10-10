"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/theme";
import { useLang, LANGUAGES } from "@/lib/language";
import { signOutAllDevices } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export default function Settings() {
  const router = useRouter();
  const { theme, toggle } = useTheme();
  const { lang, change, t, currentLanguage } = useLang();
  const [exporting, setExporting] = useState(false);

  const handleLogoutAll = async () => {
    if (!confirm("Saare devices se logout karna hai?")) return;
    await signOutAllDevices();
    router.push("/login");
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const res = await fetch("/api/export-data", { method: "POST" });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `bidwell-export-${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        alert("Export fail ho gaya");
      }
    } catch (e: any) {
      alert("Error: " + e.message);
    }
    setExporting(false);
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 p-6 pb-24">
      <Link href="/profile" className="text-blue-600 text-xs font-bold tracking-wide">← {t("profile")}</Link>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-4 mb-6 tracking-tight">{t("settings")}</h1>

      <div className="space-y-4">
        <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-900 dark:text-white text-sm">{t("theme")}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{theme === "dark" ? "Dark" : "Light"}</p>
            </div>
            <button onClick={toggle} className={`w-14 h-8 rounded-full ${theme === "dark" ? "bg-blue-600" : "bg-gray-300"} relative`}>
              <span className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${theme === "dark" ? "left-7" : "left-1"}`}></span>
            </button>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
          <p className="font-bold text-gray-900 dark:text-white text-sm mb-1">{t("language")}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Selected: <span className="font-bold text-blue-600">{currentLanguage?.name}</span></p>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {LANGUAGES.map((l) => (
              <button key={l.code} onClick={() => change(l.code)} className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-bold transition ${lang === l.code ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"}`}>
                <span>{l.name}</span>
                {lang === l.code && <span>✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Account Section */}
        <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase mt-6 mb-2">ACCOUNT</p>

        <Link href="/settings/change-password">
          <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between mb-3">
            <div>
              <p className="font-bold text-gray-900 dark:text-white text-sm">🔑 Change Password</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Set new password</p>
            </div>
            <span className="text-gray-400">›</span>
          </div>
        </Link>

        <button onClick={handleExport} disabled={exporting} className="w-full bg-gray-50 dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between mb-3 text-left disabled:opacity-60">
          <div>
            <p className="font-bold text-gray-900 dark:text-white text-sm">📥 Export My Data</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{exporting ? "Exporting..." : "Tenders, contracts, invoices CSV"}</p>
          </div>
          <span className="text-gray-400">›</span>
        </button>

        <button onClick={handleLogoutAll} className="w-full bg-gray-50 dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between mb-3 text-left">
          <div>
            <p className="font-bold text-gray-900 dark:text-white text-sm">🚪 Logout All Devices</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Saare devices se logout</p>
          </div>
          <span className="text-gray-400">›</span>
        </button>

        <Link href="/settings/delete-account">
          <div className="bg-red-50 dark:bg-red-950/30 p-5 rounded-2xl border border-red-200 dark:border-red-800 flex items-center justify-between mb-3">
            <div>
              <p className="font-bold text-red-700 dark:text-red-400 text-sm">🗑️ Delete Account</p>
              <p className="text-xs text-red-600 dark:text-red-500 mt-1">Permanently saara data delete</p>
            </div>
            <span className="text-red-400">›</span>
          </div>
        </Link>

        <Link href="/audit">
          <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between mb-3">
            <div>
              <p className="font-bold text-gray-900 dark:text-white text-sm">🔒 {t("auditLog")}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Activity history</p>
            </div>
            <span className="text-gray-400">›</span>
          </div>
        </Link>

        <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
          <p className="font-bold text-gray-900 dark:text-white text-sm mb-1">📱 BidWell v1.0</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Made in India 🇮🇳 · 13 Languages</p>
        </div>
      </div>
    </main>
  );
}
