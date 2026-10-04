"use client";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";

export default function Privacy() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      <div className="bg-white dark:bg-gray-800 p-5 border-b border-gray-200 dark:border-gray-700">
        <Link href="/profile" className="text-blue-600 text-sm">← Profile</Link>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-3">🔒 Privacy & Security</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Aapka data, aapka control</p>
      </div>

      <div className="p-5 space-y-4">
        <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-2xl">
          <h2 className="font-bold text-gray-900 dark:text-white text-sm mb-2">✅ Data Protection</h2>
          <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300">
            <li>• End-to-end encryption (TLS 1.3)</li>
            <li>• AES-256 encrypted storage at rest</li>
            <li>• Row-level security (RLS) — Company isolation</li>
            <li>• Private document storage with signed URLs</li>
            <li>• Daily automated backups</li>
            <li>• Data localization (India — Mumbai region)</li>
          </ul>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-2xl">
          <h2 className="font-bold text-gray-900 dark:text-white text-sm mb-2">🔐 Authentication</h2>
          <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300">
            <li>• Email verification for all signups</li>
            <li>• Password encryption (bcrypt)</li>
            <li>• Session expiry & auto-logout</li>
            <li>• Logout from all devices</li>
            <li>• 2FA/MFA coming soon</li>
          </ul>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-2xl">
          <h2 className="font-bold text-gray-900 dark:text-white text-sm mb-2">🤖 AI Security</h2>
          <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300">
            <li>• AI decisions पर insaani review mandatory</li>
            <li>• AI kabhi guarantee nahi deta — sirf analysis</li>
            <li>• Source references (Page, Section)</li>
            <li>• No AI training on your data</li>
            <li>• Zero data retention with AI providers</li>
          </ul>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 p-5 rounded-2xl">
          <h2 className="font-bold text-gray-900 dark:text-white text-sm mb-2">📋 Your Rights</h2>
          <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300">
            <li>• Download your data anytime</li>
            <li>• Delete account permanently</li>
            <li>• Export documents</li>
            <li>• View audit log</li>
            <li>• Right to be forgotten (DPDP Act 2023)</li>
          </ul>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded-2xl">
          <h2 className="font-bold text-gray-900 dark:text-white text-sm mb-2">🚨 Report Security Issue</h2>
          <p className="text-xs text-gray-700 dark:text-gray-300 mb-2">Koi security concern hai? Turant report karo.</p>
          <a href="mailto:security@bidwell.app" className="text-xs text-red-600 font-bold">security@bidwell.app</a>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 p-5 rounded-2xl">
          <h2 className="font-bold text-gray-900 dark:text-white text-sm mb-2">📄 Legal</h2>
          <div className="space-y-2">
            <a href="#" className="block text-xs text-blue-600 font-semibold">Terms of Service →</a>
            <a href="#" className="block text-xs text-blue-600 font-semibold">Privacy Policy →</a>
            <a href="#" className="block text-xs text-blue-600 font-semibold">DPDP Compliance →</a>
            <a href="#" className="block text-xs text-blue-600 font-semibold">Cookie Policy →</a>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">Last updated: 3 October 2026</p>
      </div>
      <BottomNav />
    </main>
  );
}
