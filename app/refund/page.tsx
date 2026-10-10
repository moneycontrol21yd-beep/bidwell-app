import Link from "next/link";

export default function Refund() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 pb-24">
      <div className="bg-white dark:bg-gray-900 px-5 pt-5 pb-4 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <Link href="/profile" className="text-blue-600 text-xs font-bold tracking-wide">← PROFILE</Link>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-2 tracking-tight">Refund Policy</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Last updated: 4 October 2026</p>
      </div>

      <div className="p-5 space-y-5 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        <section>
          <h2 className="font-bold text-gray-900 dark:text-white mb-2">1. Free Plan</h2>
          <p>The Free plan is free forever. No charges, no refunds needed.</p>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 dark:text-white mb-2">2. Paid Subscriptions</h2>
          <p>BidWell offers monthly and annual paid plans. All payments are processed via Razorpay.</p>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 dark:text-white mb-2">3. Cancellation</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>You can cancel your subscription anytime from your profile → Subscription</li>
            <li>Cancellation takes effect at the end of your current billing cycle</li>
            <li>You continue to have access until the period ends</li>
            <li>No further charges after cancellation</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 dark:text-white mb-2">4. Refund Eligibility</h2>
          <p>Refunds are available in the following cases:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1.5">
            <li><span className="font-semibold">Within 7 days</span> of first purchase — 100% refund if you haven't used more than 3 AI analyses</li>
            <li><span className="font-semibold">Duplicate charge</span> — full refund</li>
            <li><span className="font-semibold">Technical failure</span> preventing use of the Service for 48+ hours — prorated refund</li>
            <li><span className="font-semibold">Unauthorized charge</span> — full refund after verification</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 dark:text-white mb-2">5. Non-Refundable Cases</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>More than 7 days after purchase</li>
            <li>Heavy usage (more than 3 AI analyses) in the first 7 days</li>
            <li>Change of mind after using the Service</li>
            <li>Annual plans after 15 days of activation</li>
            <li>Violation of Terms of Service</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 dark:text-white mb-2">6. How to Request a Refund</h2>
          <p>Email us at <span className="font-semibold text-blue-600">billing@bidwell.app</span> with:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1.5">
            <li>Your registered email address</li>
            <li>Invoice / transaction ID</li>
            <li>Reason for refund request</li>
          </ul>
          <p className="mt-2">We process refunds within 7-10 business days. Money is credited back to the original payment method.</p>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 dark:text-white mb-2">7. Chargebacks</h2>
          <p>If you initiate a chargeback without contacting us first, your account may be suspended until the issue is resolved.</p>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 dark:text-white mb-2">8. Contact</h2>
          <p>
            <span className="font-semibold">Email:</span> billing@bidwell.app<br />
            <span className="font-semibold">Location:</span> India
          </p>
        </section>
      </div>
    </main>
  );
}
