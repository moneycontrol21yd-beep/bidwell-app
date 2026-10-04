"use client";
import Link from "next/link";
import { useTheme } from "@/lib/theme";
import { useLang, LANGUAGES } from "@/lib/language";

export default function Settings() {
  const { theme, toggle } = useTheme();
  const { lang, change, t, currentLanguage } = useLang();

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 p-6 pb-24">
      <Link href="/profile" className="text-blue-600 text-xs font-bold tracking-wide">← {t("profile")}</Link>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-4 mb-6 tracking-tight">{t("settings")}</h1>

      <div className="space-y-4">
        {/* Theme */}
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

        {/* Language */}
        <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
          <p className="font-bold text-gray-900 dark:text-white text-sm mb-1">{t("language")}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Selected: <span className="font-bold text-blue-600">{currentLanguage?.name}</span>
          </p>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => change(l.code)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-bold transition ${
                  lang === l.code
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                }`}
              >
                <span>{l.name}</span>
                {lang === l.code && <span>✓</span>}
              </button>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold tracking-wider uppercase mb-1">AI Analysis Output</p>
            <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
              Tender kisi bhi bhasha me ho — analysis aapki selected bhasha me milega.
            </p>
          </div>
        </div>

        <Link href="/audit">
          <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-900 dark:text-white text-sm">🔒 {t("auditLog")}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Activity history</p>
            </div>
            <span className="text-gray-400">›</span>
          </div>
        </Link>

        <Link href="/watch">
          <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-900 dark:text-white text-sm">👁️ {t("bidwellWatch")}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Monitored tenders</p>
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
