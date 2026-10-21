#!/bin/bash
cd ~/bidwell

# ============================================
# 1. BOTTOM NAVIGATION COMPONENT
# ============================================
mkdir -p components
cat > components/BottomNav.tsx << 'BIDWELL_END'
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();
  const items = [
    { href: "/dashboard", label: "Home", icon: "🏠" },
    { href: "/tenders", label: "Tenders", icon: "📄" },
    { href: "/bids", label: "Bids", icon: "✅" },
    { href: "/contracts", label: "Work", icon: "🏢" },
    { href: "/payments", label: "Money", icon: "💰" },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3 z-50">
      {items.map((item) => (
        <Link key={item.href} href={item.href} className="flex flex-col items-center">
          <span className="text-xl">{item.icon}</span>
          <span className={`text-xs mt-1 ${pathname === item.href ? "text-blue-600 font-semibold" : "text-gray-500"}`}>
            {item.label}
          </span>
        </Link>
      ))}
    </nav>
  );
}
BIDWELL_END

# ============================================
# 2. DASHBOARD (Home)
# ============================================
mkdir -p app/dashboard
cat > app/dashboard/page.tsx << 'BIDWELL_END'
import Link from "next/link";
import BottomNav from "@/components/BottomNav";

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-blue-600 text-white p-6 rounded-b-3xl">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-blue-200 text-sm">Good Morning,</p>
            <h1 className="text-2xl font-bold">Rohit Sharma</h1>
            <p className="text-blue-200 text-xs mt-1">Shivam Security Services</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">👤</div>
        </div>
        <Link href="/tenders">
          <div className="bg-white/10 backdrop-blur border border-white/20 p-4 rounded-2xl flex items-center">
            <div className="text-3xl mr-3">🤖</div>
            <div className="flex-1">
              <p className="font-semibold">AI Tender Finder</p>
              <p className="text-xs text-blue-200">64 new tenders matching your profile</p>
            </div>
            <span className="text-blue-200">→</span>
          </div>
        </Link>
      </div>

      <div className="p-6 -mt-2">
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white p-3 rounded-2xl shadow-sm text-center">
            <p className="text-2xl font-bold text-blue-600">12</p>
            <p className="text-xs text-gray-500 mt-1">Active Tenders</p>
          </div>
          <div className="bg-white p-3 rounded-2xl shadow-sm text-center">
            <p className="text-2xl font-bold text-green-600">3</p>
            <p className="text-xs text-gray-500 mt-1">Won Contracts</p>
          </div>
          <div className="bg-white p-3 rounded-2xl shadow-sm text-center">
            <p className="text-2xl font-bold text-orange-500">₹18.5L</p>
            <p className="text-xs text-gray-500 mt-1">Pending</p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-gray-900">Upcoming Deadlines</h2>
          <Link href="/tenders" className="text-blue-600 text-sm font-medium">See All</Link>
        </div>

        <div className="space-y-3">
          <div className="bg-white p-4 rounded-2xl shadow-sm border-l-4 border-red-500">
            <div className="flex justify-between">
              <p className="font-semibold text-gray-900 text-sm">Delhi Metro Rail - Security</p>
              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-semibold">3 days</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Bid Ends: 12 Oct 2026</p>
            <p className="text-xs text-gray-500">Value: ₹4.2 Cr</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border-l-4 border-orange-500">
            <div className="flex justify-between">
              <p className="font-semibold text-gray-900 text-sm">UP Jal Nigam - Housekeeping</p>
              <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-semibold">8 days</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Bid Ends: 18 Oct 2026</p>
            <p className="text-xs text-gray-500">Value: ₹1.8 Cr</p>
          </div>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
BIDWELL_END

# ============================================
# 3. TENDER DISCOVERY
# ============================================
mkdir -p app/tenders
cat > app/tenders/page.tsx << 'BIDWELL_END'
import Link from "next/link";
import BottomNav from "@/components/BottomNav";

export default function Tenders() {
  const tenders = [
    { name: "Delhi Metro Rail Corporation", cat: "Security Services - 200 Guards", val: "₹4.2 Cr", match: "92%", days: "12 days left", gov: true },
    { name: "UP Jal Nigam", cat: "Housekeeping Services", val: "₹1.8 Cr", match: "76%", days: "18 days left", gov: true },
    { name: "NBCFDC Project", cat: "Site Security", val: "₹2.6 Cr", match: "88%", days: "25 days left", gov: false },
  ];

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white p-5 border-b border-gray-200 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-900 mb-3">Tender Discovery</h1>
        <div className="bg-gray-100 rounded-xl px-4 py-3 flex items-center">
          <span className="text-gray-400 mr-2">🔍</span>
          <input type="text" placeholder="Search tenders, keywords..." className="bg-transparent w-full outline-none text-sm" />
        </div>
      </div>

      <div className="px-5 pt-4">
        <div className="flex gap-2 mb-4 overflow-x-auto">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-full text-xs font-semibold whitespace-nowrap">Recommended</button>
          <button className="px-4 py-2 bg-white text-gray-600 rounded-full text-xs font-semibold border border-gray-200 whitespace-nowrap">Latest</button>
          <button className="px-4 py-2 bg-white text-gray-600 rounded-full text-xs font-semibold border border-gray-200 whitespace-nowrap">Saved</button>
        </div>

        <div className="space-y-3">
          {tenders.map((t, i) => (
            <Link href="/bids" key={i}>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{t.cat}</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold ml-2">Match {t.match}</span>
                </div>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                  <div className="flex gap-2">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{t.gov ? "🏛️ Govt" : "🏢 Private"}</span>
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded font-semibold">{t.val}</span>
                  </div>
                  <span className="text-xs text-orange-600 font-semibold">{t.days}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
BIDWELL_END

# ============================================
# 4. DOCUMENT VAULT
# ============================================
mkdir -p app/documents
cat > app/documents/page.tsx << 'BIDWELL_END'
import BottomNav from "@/components/BottomNav";

export default function Documents() {
  const docs = [
    { name: "GST Certificate", date: "Updated 12 Aug 2026", verified: true },
    { name: "PAN Card", date: "Updated 10 Aug 2026", verified: true },
    { name: "MSME/Udyam", date: "Updated 08 Aug 2026", verified: true },
    { name: "Company Registration", date: "Updated 05 Aug 2026", verified: true },
    { name: "EPF & ESIC", date: "Updated 02 Aug 2026", verified: true },
    { name: "ISO 9001 Certificate", date: "Pending Upload", verified: false },
  ];

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white p-5 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900 mb-3">Document Vault</h1>
        <div className="bg-gray-100 rounded-xl px-4 py-3 flex items-center">
          <span className="text-gray-400 mr-2">🔍</span>
          <input type="text" placeholder="Search documents..." className="bg-transparent w-full outline-none text-sm" />
        </div>
      </div>

      <div className="px-5 pt-4">
        <div className="flex gap-2 mb-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-full text-xs font-semibold">Company Docs</button>
          <button className="px-4 py-2 bg-white text-gray-600 rounded-full text-xs font-semibold border border-gray-200">Tender Docs</button>
          <button className="px-4 py-2 bg-white text-gray-600 rounded-full text-xs font-semibold border border-gray-200">Templates</button>
        </div>

        <div className="space-y-2">
          {docs.map((d, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mr-3">📄</div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{d.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{d.date}</p>
                </div>
              </div>
              {d.verified ? (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">✓ Verified</span>
              ) : (
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-semibold">⚠ Pending</span>
              )}
            </div>
          ))}
        </div>

        <button className="w-full mt-5 bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg">
          + Upload Document
        </button>
      </div>

      <BottomNav />
    </main>
  );
}
BIDWELL_END

# ============================================
# 5. BID WORKSPACE
# ============================================
mkdir -p app/bids
cat > app/bids/page.tsx << 'BIDWELL_END'
import BottomNav from "@/components/BottomNav";

export default function Bids() {
  const steps = [
    { name: "Eligibility Check", status: "Completed", done: true },
    { name: "Document Preparation", status: "In Progress", done: false },
    { name: "Technical Response", status: "Pending", done: false },
    { name: "BOQ & Price Analysis", status: "Pending", done: false },
    { name: "Declarations & Forms", status: "Pending", done: false },
    { name: "Final Review", status: "Pending", done: false },
    { name: "Submit on Portal", status: "Pending", done: false },
  ];

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white p-5 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Bid Workspace</h1>
        <p className="text-xs text-gray-500 mt-1">Delhi Metro - Security Services</p>
      </div>

      <div className="p-5">
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl mb-5">
          <p className="text-sm font-semibold text-blue-900">Overall Progress: 14%</p>
          <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: "14%" }}></div>
          </div>
        </div>

        <div className="space-y-2">
          {steps.map((s, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${s.done ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {s.done ? "✓" : i + 1}
                </div>
                <p className="font-medium text-gray-900 text-sm">{s.name}</p>
              </div>
              <span className={`text-xs font-semibold ${s.done ? "text-green-600" : s.status === "In Progress" ? "text-blue-600" : "text-gray-400"}`}>
                {s.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
BIDWELL_END

# ============================================
# 6. CONTRACT DASHBOARD
# ============================================
mkdir -p app/contracts
cat > app/contracts/page.tsx << 'BIDWELL_END'
import BottomNav from "@/components/BottomNav";

export default function Contracts() {
  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white p-5 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Contract Dashboard</h1>
        <p className="text-xs text-gray-500 mt-1">Active Contracts</p>
      </div>

      <div className="p-5">
        <div className="bg-white p-5 rounded-2xl shadow-sm mb-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="font-bold text-gray-900">Delhi Metro - Security</p>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold mt-1 inline-block">Active</span>
            </div>
            <p className="text-xs text-gray-500">14 Nov 2027</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gray-50 p-3 rounded-xl">
              <p className="text-xs text-gray-500">Contract Value</p>
              <p className="font-bold text-gray-900 mt-1">₹4.2 Cr</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl">
              <p className="text-xs text-gray-500">Receivable</p>
              <p className="font-bold text-orange-600 mt-1">₹1.8 Cr</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">32</p>
              <p className="text-xs text-gray-500 mt-1">Tasks Done</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">7</p>
              <p className="text-xs text-gray-500 mt-1">Pending</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">2</p>
              <p className="text-xs text-gray-500 mt-1">Overdue</p>
            </div>
          </div>
        </div>

        <h2 className="font-bold text-gray-900 mb-3">Upcoming Tasks</h2>
        <div className="space-y-2">
          <div className="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-orange-500 mr-3">⚠️</span>
              <p className="text-sm text-gray-900">Monthly Attendance Report</p>
            </div>
            <span className="text-xs text-orange-600 font-semibold">3 days</span>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-blue-500 mr-3">📋</span>
              <p className="text-sm text-gray-900">Employee Document Renewal</p>
            </div>
            <span className="text-xs text-gray-500 font-semibold">7 days</span>
          </div>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
BIDWELL_END

# ============================================
# 7. PAYMENTS
# ============================================
mkdir -p app/payments
cat > app/payments/page.tsx << 'BIDWELL_END'
import BottomNav from "@/components/BottomNav";

export default function Payments() {
  const payments = [
    { id: "INV-1042", date: "28 Sep 2026", amt: "₹16,40,000", status: "Pending", color: "orange" },
    { id: "INV-1041", date: "15 Sep 2026", amt: "₹8,20,000", status: "Submitted", color: "blue" },
    { id: "INV-1040", date: "01 Sep 2026", amt: "₹6,75,000", status: "Paid", color: "green" },
    { id: "INV-1039", date: "20 Aug 2026", amt: "₹6,60,000", status: "Paid", color: "green" },
  ];

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-blue-600 text-white p-6">
        <p className="text-blue-200 text-sm">Total Receivable</p>
        <h1 className="text-4xl font-bold mt-1">₹1,92,50,000</h1>
        <p className="text-blue-200 text-xs mt-2">Across 5 active contracts</p>
      </div>

      <div className="p-5">
        <div className="bg-white p-5 rounded-2xl shadow-sm -mt-10 mb-5">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-xs text-gray-500">Submitted</p>
              <p className="font-bold text-blue-600 mt-1">₹40.2L</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Approved</p>
              <p className="font-bold text-green-600 mt-1">₹48.3L</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Overdue</p>
              <p className="font-bold text-red-600 mt-1">₹35.9L</p>
            </div>
          </div>
        </div>

        <h2 className="font-bold text-gray-900 mb-3">Recent Payments</h2>
        <div className="space-y-2">
          {payments.map((p, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-900 text-sm">{p.id}</p>
                <p className="text-xs text-gray-500 mt-0.5">{p.date}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900 text-sm">{p.amt}</p>
                <span className={`text-xs font-semibold ${
                  p.status === "Paid" ? "text-green-600" : p.status === "Submitted" ? "text-blue-600" : "text-orange-600"
                }`}>{p.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
BIDWELL_END

# ============================================
# 8. AI ASSISTANT
# ============================================
mkdir -p app/assistant
cat > app/assistant/page.tsx << 'BIDWELL_END'
import BottomNav from "@/components/BottomNav";

export default function Assistant() {
  return (
    <main className="min-h-screen bg-gray-50 pb-24 flex flex-col">
      <div className="bg-white p-5 border-b border-gray-200 flex items-center">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl mr-3">🤖</div>
        <div>
          <h1 className="font-bold text-gray-900">BidWell AI Assistant</h1>
          <p className="text-xs text-green-600 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span> Online
          </p>
        </div>
      </div>

      <div className="flex-1 p-5">
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl mb-4 max-w-xs">
          <p className="text-sm text-gray-800">Namaste! Main aapka BidWell assistant hoon. Tender, contract, ya payment ke bare mein kuch bhi puchho.</p>
        </div>

        <div className="bg-white p-4 rounded-2xl mb-4 max-w-xs ml-auto border border-gray-100">
          <p className="text-sm text-gray-800">Mere 2 crore ka urar hai, security tender jeetne ke liye, Delhi mein koi hai?</p>
        </div>

        <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl mb-4 max-w-xs">
          <p className="text-sm text-gray-800 font-medium mb-2">Mujhe 3 tenders mile hain:</p>
          <div className="space-y-2 text-sm">
            <div className="bg-white p-2 rounded">
              <p className="font-semibold text-gray-900">1. DMRC - Security Services</p>
              <p className="text-xs text-gray-500">₹4.2 Cr | 12 Oct 2026</p>
            </div>
            <div className="bg-white p-2 rounded">
              <p className="font-semibold text-gray-900">2. Delhi Govt - Vidyut Services</p>
              <p className="text-xs text-gray-500">₹3.8 Cr | 15 Oct 2026</p>
            </div>
            <div className="bg-white p-2 rounded">
              <p className="font-semibold text-gray-900">3. NBCFDC - Site Security</p>
              <p className="text-xs text-gray-500">₹2.6 Cr | 05 Nov 2026</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <div className="bg-gray-100 rounded-full px-4 py-3 flex items-center">
          <input type="text" placeholder="Type your message..." className="bg-transparent w-full outline-none text-sm" />
          <button className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center">↑</button>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
BIDWELL_END

# ============================================
# 9. PROFILE
# ============================================
mkdir -p app/profile
cat > app/profile/page.tsx << 'BIDWELL_END'
import BottomNav from "@/components/BottomNav";

export default function Profile() {
  const menu = [
    { icon: "🏢", label: "Company Profile" },
    { icon: "📄", label: "Subscription & Billing" },
    { icon: "👥", label: "Team Members" },
    { icon: "🔔", label: "Notification Settings" },
    { icon: "❓", label: "Help & Support" },
    { icon: "🔒", label: "Privacy & Security" },
  ];

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-blue-600 text-white p-6 rounded-b-3xl">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl mr-4">👤</div>
          <div>
            <h1 className="text-xl font-bold">Rohit Sharma</h1>
            <p className="text-blue-200 text-sm">admin@shivamsecurity.in</p>
            <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full font-bold mt-1 inline-block">★ Premium Plan</span>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {menu.map((m, i) => (
            <button key={i} className="w-full p-4 flex items-center justify-between border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
              <div className="flex items-center">
                <span className="text-xl mr-3">{m.icon}</span>
                <p className="text-sm font-medium text-gray-900">{m.label}</p>
              </div>
              <span className="text-gray-400">›</span>
            </button>
          ))}
        </div>

        <button className="w-full mt-5 p-4 bg-white rounded-2xl shadow-sm flex items-center justify-between text-red-600 font-semibold text-sm">
          <span>Logout</span>
          <span>→</span>
        </button>
      </div>

      <BottomNav />
    </main>
  );
}
BIDWELL_END

echo ""
echo "✅ ALL SCREENS CREATED SUCCESSFULLY!"
echo ""
echo "Total files created:"
echo "  ✅ components/BottomNav.tsx"
echo "  ✅ app/dashboard/page.tsx"
echo "  ✅ app/tenders/page.tsx"
echo "  ✅ app/documents/page.tsx"
echo "  ✅ app/bids/page.tsx"
echo "  ✅ app/contracts/page.tsx"
echo "  ✅ app/payments/page.tsx"
echo "  ✅ app/assistant/page.tsx"
echo "  ✅ app/profile/page.tsx"
echo ""
echo "Ab ye command chalao: npm run dev -- --webpack"
