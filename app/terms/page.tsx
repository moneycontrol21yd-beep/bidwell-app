import Link from "next/link";

export default function Terms() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 pb-24">
      <div className="bg-white dark:bg-gray-900 px-5 pt-5 pb-4 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <Link href="/profile" className="text-blue-600 text-xs font-bold tracking-wide">← PROFILE</Link>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-2 tracking-tight">Terms of Service</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Last updated: 4 October 2026</p>
      </div>

      <div className="p-5 space-y-5 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        <section>
          <h2 className="font-bold text-gray-900 dark:text-white mb-2">1. Acceptance of Terms</h2>
          <p>By accessing or using BidWell ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree, you must not use the Service.</p>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 dark:text-white mb-2">2. Description of Service</h2>
          <p>BidWell is an AI-powered software platform that helps contractors:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1.5">
            <li>Discover tenders and analyze tender documents</li>
            <li>Check eligibility for tenders</li>
            <li>Prepare bids and technical responses</li>
            <li>Manage contracts, workforces, invoices, and payments</li>
            <li>Track deadlines, corrigendums, and compliance</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 dark:text-white mb-2">3. User Accounts</h2>
          <p>You are responsible for:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1.5">
            <li>Maintaining the confidentiality of your login credentials</li>
            <li>All activities that occur under your account</li>
            <li>Ensuring the accuracy of information you provide</li>
            <li>Notifying us immediately of unauthorized access</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 dark:text-white mb-2">4. Acceptable Use</h2>
          <p>You agree NOT to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1.5">
            <li>Upload illegal, harmful, or fraudulent documents</li>
            <li>Use the Service to violate any Indian law</li>
            <li>Attempt to reverse-engineer, hack, or disrupt the Service</li>
            <li>Share your account with unauthorized users</li>
            <li>Use the Service to submit fake bids or fraudulently win tenders</li>
            <li>Copy or resell our AI models or data</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 dark:text-white mb-2">5. AI Disclaimer</h2>
          <p className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900/50 p-4 rounded-xl">
            <span className="font-bold">Important:</span> BidWell uses artificial intelligence to analyze tenders and provide recommendations. AI outputs are <span className="font-bold">advisory only</span>. BidWell does NOT guarantee:
          </p>
          <ul className="list-disc pl-5 mt-3 space-y-1.5">
            <li>Tender eligibility is guaranteed — final decision rests with the tender authority</li>
            <li>Bids will win — winning depends on many factors beyond our control</li>
            <li>AI analysis is 100% accurate — always verify against original tender documents</li>
            <li>Payment will be received on time — payment depends on the client</li>
          </ul>
          <p className="mt-3">Users must verify all critical information (deadlines, EMD, eligibility) from the original tender document before submitting a bid.</p>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 dark:text-white mb-2">6. Subscription & Payments</h2>
          <p>Paid plans are billed monthly or annually. By subscribing, you authorize us to charge your payment method.</p>
          <ul className="list-disc pl-5 mt-2 space-y-1.5">
            <li>All payments are processed via Razorpay (or other authorized gateways)</li>
            <li>Prices are in Indian Rupees (INR) and include applicable taxes</li>
            <li>Subscriptions auto-renew unless cancelled</li>
            <li>You can cancel anytime from your profile</li>
            <li>Refunds are as per our Refund Policy</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 dark:text-white mb-2">7. Intellectual Property</h2>
          <p>You retain full ownership of all documents, tenders, and data you upload. We own the BidWell platform, AI models, design, code, and brand.</p>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 dark:text-white mb-2">8. Limitation of Liability</h2>
          <p>To the maximum extent permitted by Indian law, BidWell is not liable for:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1.5">
            <li>Financial losses resulting from bid decisions</li>
            <li>Lost profits, revenue, or business opportunities</li>
            <li>Delays or failures caused by third parties (AI providers, cloud services)</li>
            <li>Data loss due to factors beyond our reasonable control</li>
          </ul>
          <p className="mt-2">Our total liability shall not exceed the amount you paid us in the last 6 months.</p>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 dark:text-white mb-2">9. Termination</h2>
          <p>We may suspend or terminate your account if you violate these Terms. You may terminate your account anytime from your profile settings.</p>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 dark:text-white mb-2">10. Governing Law</h2>
          <p>These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in India.</p>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 dark:text-white mb-2">11. Contact</h2>
          <p>
            <span className="font-semibold">Email:</span> legal@bidwell.app<br />
            <span className="font-semibold">Location:</span> India, India
          </p>
        </section>
      </div>
    </main>
  );
}
