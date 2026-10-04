import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 pb-24">
      <div className="bg-white dark:bg-gray-900 px-5 pt-5 pb-4 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <Link href="/profile" className="text-blue-600 text-xs font-bold tracking-wide">← PROFILE</Link>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-2 tracking-tight">Privacy Policy</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Last updated: 4 October 2026</p>
      </div>

      <div className="p-5 space-y-5 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        <section>
          <h2 className="font-bold text-gray-900 dark:text-white mb-2">1. Introduction</h2>
          <p>BidWell ("we", "our", "us") is an AI-powered Contract Operating System for contractors, operated from India. This Privacy Policy explains how we collect, use, store, and protect your personal and business information when you use our mobile application and web platform (collectively, the "Service").</p>
          <p className="mt-2">By using BidWell, you agree to the practices described in this Privacy Policy. If you do not agree, please discontinue use of the Service.</p>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 dark:text-white mb-2">2. Information We Collect</h2>
          <p><span className="font-semibold text-gray-900 dark:text-white">a) Account Information:</span> Name, email address, phone number, password (encrypted).</p>
          <p className="mt-2"><span className="font-semibold text-gray-900 dark:text-white">b) Company Information:</span> Company name, business type, GST number, PAN, MSME/Udyam number, registration number, address, turnover, experience, employee count, services offered, certifications, and contact details.</p>
          <p className="mt-2"><span className="font-semibold text-gray-900 dark:text-white">c) Documents:</span> GST certificate, PAN card, licences (PSARA, Labour, ISO, etc.), experience certificates, bank statements, work orders, and other tender-related documents you upload.</p>
          <p className="mt-2"><span className="font-semibold text-gray-900 dark:text-white">d) Tender Data:</span> Tender PDFs you upload for AI analysis, extracted tender information, bid records, contract details, invoices, and payment records.</p>
          <p className="mt-2"><span className="font-semibold text-gray-900 dark:text-white">e) Usage Data:</span> Device information, IP address, browser type, pages visited, features used, and timestamps.</p>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 dark:text-white mb-2">3. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>To provide AI-based tender analysis, eligibility checking, and bid assistance</li>
            <li>To manage your contracts, invoices, and payment tracking</li>
            <li>To send notifications about deadlines, document expiry, and payment reminders</li>
            <li>To improve our Service, train internal models (only with anonymized data), and fix issues</li>
            <li>To comply with legal and regulatory obligations in India</li>
            <li>To prevent fraud, unauthorized access, and security threats</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 dark:text-white mb-2">4. AI Processing & Third-Party Services</h2>
          <p>We use Google Gemini AI (and may use other AI providers) to analyze tenders. When you upload a PDF, its content is securely transmitted to our AI provider for analysis. We do not permit AI providers to train their models on your data. AI processing follows "zero data retention" agreements.</p>
          <p className="mt-2">We use Supabase (PostgreSQL) for secure database storage. All data is encrypted in transit (TLS 1.3) and at rest (AES-256). Data is stored in the Mumbai (India) region.</p>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 dark:text-white mb-2">5. Data Sharing</h2>
          <p>We do NOT sell your personal or business data. We share data only with:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1.5">
            <li>AI providers (Google Gemini) — for tender analysis only</li>
            <li>Cloud infrastructure (Supabase, Vercel) — for hosting and storage</li>
            <li>Payment gateway (Razorpay) — for subscription billing</li>
            <li>Legal authorities — if required by Indian law</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 dark:text-white mb-2">6. Data Security</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>End-to-end encryption (TLS 1.3)</li>
            <li>AES-256 encryption at rest</li>
            <li>Row-Level Security (RLS) — complete isolation between companies</li>
            <li>Private document storage with signed URLs</li>
            <li>Daily automated backups</li>
            <li>Password hashing (bcrypt)</li>
            <li>Audit logs of all user activities</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 dark:text-white mb-2">7. Your Rights (DPDP Act 2023)</h2>
          <p>Under India's Digital Personal Data Protection Act, 2023, you have the right to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1.5">
            <li>Access your data at any time</li>
            <li>Correct inaccurate data</li>
            <li>Delete your account and data permanently</li>
            <li>Export your data in portable format</li>
            <li>Withdraw consent</li>
            <li>File a grievance with our Data Protection Officer</li>
          </ul>
          <p className="mt-2">To exercise any of these rights, email us at <span className="font-semibold text-blue-600">privacy@bidwell.app</span>.</p>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 dark:text-white mb-2">8. Data Retention</h2>
          <p>We retain your data as long as your account is active. When you delete your account, all your data (documents, tenders, contracts, invoices) is permanently deleted within 30 days, except where retention is required by law.</p>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 dark:text-white mb-2">9. Children's Privacy</h2>
          <p>BidWell is not intended for users under 18. We do not knowingly collect data from children.</p>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 dark:text-white mb-2">10. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. Material changes will be notified via email or in-app notification at least 30 days before they take effect.</p>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 dark:text-white mb-2">11. Contact Us</h2>
          <p>For privacy-related queries:</p>
          <p className="mt-2">
            <span className="font-semibold">Email:</span> privacy@bidwell.app<br />
            <span className="font-semibold">Grievance Officer:</span> grievance@bidwell.app<br />
            <span className="font-semibold">Location:</span> Mumbai, Maharashtra, India
          </p>
        </section>
      </div>
    </main>
  );
}
