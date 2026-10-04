import Link from "next/link";

export default function Cookies() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 pb-24">
      <div className="bg-white dark:bg-gray-900 px-5 pt-5 pb-4 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <Link href="/profile" className="text-blue-600 text-xs font-bold tracking-wide">← PROFILE</Link>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-2 tracking-tight">Cookie Policy</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Last updated: 4 October 2026</p>
      </div>

      <div className="p-5 space-y-5 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        <section>
          <h2 className="font-bold text-gray-900 dark:text-white mb-2">1. What Are Cookies?</h2>
          <p>Cookies are small text files stored on your device when you visit BidWell. They help us remember your preferences, keep you logged in, and improve your experience.</p>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 dark:text-white mb-2">2. Cookies We Use</h2>
          <div className="space-y-3 mt-2">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Essential Cookies</p>
              <p className="text-xs mt-1">Required for login, session management, and security. Cannot be disabled.</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Preference Cookies</p>
              <p className="text-xs mt-1">Remember your language, theme (dark/light), and other settings.</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Analytics Cookies</p>
              <p className="text-xs mt-1">Help us understand how you use BidWell so we can improve features. Anonymized only.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 dark:text-white mb-2">3. Third-Party Cookies</h2>
          <p>We use limited third-party cookies from:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1.5">
            <li>Supabase (authentication)</li>
            <li>Vercel (hosting & analytics)</li>
            <li>Razorpay (payment processing)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 dark:text-white mb-2">4. Managing Cookies</h2>
          <p>You can control cookies through your browser settings. Disabling essential cookies may impact the functionality of BidWell.</p>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 dark:text-white mb-2">5. Contact</h2>
          <p>Email us at <span className="font-semibold text-blue-600">privacy@bidwell.app</span> for any cookie-related questions.</p>
        </section>
      </div>
    </main>
  );
}
