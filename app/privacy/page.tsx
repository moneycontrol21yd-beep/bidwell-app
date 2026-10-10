"use client";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";

export default function Privacy() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      <div className="bg-white dark:bg-gray-900 px-5 pt-5 pb-4 border-b border-gray-200 dark:border-gray-800">
        <Link href="/profile" className="text-blue-600 text-xs font-bold tracking-wide">← PROFILE</Link>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-2 tracking-tight">🔒 Privacy & Security</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Your data, your control</p>
      </div>

      <div className="p-5 space-y-4">
        <div className="bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-900/40 p-5 rounded-2xl">
          <h2 className="font-bold text-gray-900 dark:text-white text-sm mb-3 flex items-center">
            <span className="mr-2">🛡️</span> Data Protection
          </h2>
          <ul className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
            <li className="flex items-start"><span className="text-green-600 mr-2">✓</span> End-to-end encryption (TLS 1.3)</li>
            <li className="flex items-start"><span className="text-green-600 mr-2">✓</span> AES-256 encrypted storage at rest</li>
            <li className="flex items-start"><span className="text-green-600 mr-2">✓</span> Row-Level Security — complete company isolation</li>
            <li className="flex items-start"><span className="text-green-600 mr-2">✓</span> Private document storage with signed URLs</li>
            <li className="flex items-start"><span className="text-green-600 mr-2">✓</span> Daily automated backups</li>
            <li className="flex items-start"><span className="text-green-600 mr-2">✓</span> Data stored in India</li>
          </ul>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 p-5 rounded-2xl">
          <h2 className="font-bold text-gray-900 dark:text-white text-sm mb-3 flex items-center">
            <span className="mr-2">🔐</span> Authentication
          </h2>
          <ul className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
            <li className="flex items-start"><span className="text-blue-600 mr-2">✓</span> Email verification for signups</li>
            <li className="flex items-start"><span className="text-blue-600 mr-2">✓</span> Password encryption (bcrypt)</li>
            <li className="flex items-start"><span className="text-blue-600 mr-2">✓</span> Session expiry & auto-logout</li>
            <li className="flex items-start"><span className="text-blue-600 mr-2">✓</span> Logout from all devices</li>
            <li className="flex items-start"><span className="text-blue-600 mr-2">✓</span> Password change anytime</li>
          </ul>
        </div>

        <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 p-5 rounded-2xl">
          <h2 className="font-bold text-gray-900 dark:text-white text-sm mb-3 flex items-center">
            <span className="mr-2">🤖</span> AI Security
          </h2>
          <ul className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
            <li className="flex items-start"><span className="text-purple-600 mr-2">✓</span> Human review required for AI decisions</li>
            <li className="flex items-start"><span className="text-purple-600 mr-2">✓</span> AI provides analysis, not guarantees</li>
            <li className="flex items-start"><span className="text-purple-600 mr-2">✓</span> Source references (page, section)</li>
            <li className="flex items-start"><span className="text-purple-600 mr-2">✓</span> No AI training on your data</li>
            <li className="flex items-start"><span className="text-purple-600 mr-2">✓</span> Zero data retention with AI providers</li>
          </ul>
        </div>

        <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/40 p-5 rounded-2xl">
          <h2 className="font-bold text-gray-900 dark:text-white text-sm mb-3 flex items-center">
            <span className="mr-2">📋</span> Your Rights (DPDP Act 2023)
          </h2>
          <ul className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
            <li className="flex items-start"><span className="text-orange-600 mr-2">✓</span> Download your data anytime</li>
            <li className="flex items-start"><span className="text-orange-600 mr-2">✓</span> Export in CSV format</li>
            <li className="flex items-start"><span className="text-orange-600 mr-2">✓</span> Delete account permanently</li>
            <li className="flex items-start"><span className="text-orange-600 mr-2">✓</span> View complete audit log</li>
            <li className="flex items-start"><span className="text-orange-600 mr-2">✓</span> Right to be forgotten</li>
          </ul>
          <Link href="/settings">
            <button className="w-full mt-4 bg-orange-600 text-white font-bold py-3 rounded-xl text-xs tracking-wide">
              MANAGE MY DATA →
            </button>
          </Link>
        </div>

        <div className="bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/40 p-5 rounded-2xl">
          <h2 className="font-bold text-gray-900 dark:text-white text-sm mb-3 flex items-center">
            <span className="mr-2">🚨</span> Report a Security Issue
          </h2>
          <p className="text-xs text-gray-700 dark:text-gray-300 mb-3">
            Found a security concern? Report it immediately.
          </p>
          <a href="mailto:security@bidwell.app" className="text-xs text-red-600 dark:text-red-400 font-bold">security@bidwell.app</a>
        </div>

        <p className="text-center text-[10px] text-gray-400 dark:text-gray-500 mt-6 uppercase tracking-wider">
          Last updated: 4 October 2026
        </p>
      </div>
      <BottomNav />
    </main>
  );
}
