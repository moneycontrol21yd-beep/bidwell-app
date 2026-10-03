import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/lib/supabase";

function getDaysLeft(deadline: string | null) {
  if (!deadline) return null;
  return Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
}

export default async function Dashboard() {
  const { data: tenders } = await supabase.from("tenders").select("*").order("created_at", { ascending: false });
  const { data: contracts } = await supabase.from("contracts").select("*");
  const { data: invoices } = await supabase.from("invoices").select("*");

  const allTenders = tenders || [];
  const activeTenders = allTenders.filter((t: any) => t.status === "active");
  const wonTenders = allTenders.filter((t: any) => t.status === "won");
  const allContracts = contracts || [];
  const allInv = invoices || [];

  const totalReceivable = allContracts.reduce((s: number, c: any) => s + (c.receivable_in_lakh || 0), 0) * 100000;
  const pendingInvoices = allInv.filter((i: any) => i.status !== "paid");
  const pendingAmount = pendingInvoices.reduce((s: number, i: any) => s + (i.amount || 0), 0);

  const urgentTenders = activeTenders.filter((t: any) => {
    const d = getDaysLeft(t.deadline);
    return d !== null && d > 0 && d <= 7;
  }).length;

  const expiredCount = activeTenders.filter((t: any) => {
    const d = getDaysLeft(t.deadline);
    return d !== null && d <= 0;
  }).length;

  const upcomingDeadlines = activeTenders
    .filter((t: any) => { const d = getDaysLeft(t.deadline); return d !== null && d > 0; })
    .sort((a: any, b: any) => (getDaysLeft(a.deadline) || 999) - (getDaysLeft(b.deadline) || 999))
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-blue-600 text-white p-6 rounded-b-3xl">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-blue-200 text-sm">Good Morning,</p>
            <h1 className="text-2xl font-bold">Rohit Sharma</h1>
            <p className="text-blue-200 text-xs mt-1">Shivam Security Services</p>
          </div>
          <Link href="/profile"><div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">👤</div></Link>
        </div>
        <Link href="/upload">
          <div className="bg-white/10 backdrop-blur border border-white/20 p-4 rounded-2xl flex items-center">
            <div className="text-3xl mr-3">🤖</div>
            <div className="flex-1"><p className="font-semibold">AI Tender Analysis</p><p className="text-xs text-blue-200">Naya Tender upload karo</p></div>
            <span className="text-blue-200">→</span>
          </div>
        </Link>
      </div>

      <div className="p-6 -mt-2">
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Link href="/tenders"><div className="bg-white p-3 rounded-2xl shadow-sm text-center">
            <p className="text-2xl font-bold text-blue-600">{activeTenders.length}</p><p className="text-xs text-gray-500 mt-1">Active Tenders</p>
          </div></Link>
          <Link href="/contracts"><div className="bg-white p-3 rounded-2xl shadow-sm text-center">
            <p className="text-2xl font-bold text-green-600">{wonTenders.length}</p><p className="text-xs text-gray-500 mt-1">Won Contracts</p>
          </div></Link>
          <Link href="/payments"><div className="bg-white p-3 rounded-2xl shadow-sm text-center">
            <p className="text-2xl font-bold text-orange-500">₹{(totalReceivable / 10000000).toFixed(1)}Cr</p><p className="text-xs text-gray-500 mt-1">Receivable</p>
          </div></Link>
        </div>

        <h2 className="font-bold text-gray-900 mb-3">🤖 AI Action Center</h2>
        <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3 mb-6">
          {pendingAmount > 0 && (
            <Link href="/payments"><div className="flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
              <p className="text-sm text-gray-800 flex-1">₹{(pendingAmount/100000).toFixed(1)}L payment pending</p>
              <span className="text-gray-400 text-xs">→</span>
            </div></Link>
          )}
          {urgentTenders > 0 && (
            <Link href="/tenders"><div className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
              <p className="text-sm text-gray-800 flex-1">{urgentTenders} tender deadline 7 days me</p>
              <span className="text-gray-400 text-xs">→</span>
            </div></Link>
          )}
          {expiredCount > 0 && (
            <Link href="/tenders"><div className="flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
              <p className="text-sm text-gray-800 flex-1">{expiredCount} tender expired — review karo</p>
              <span className="text-gray-400 text-xs">→</span>
            </div></Link>
          )}
          {activeTenders.length > 0 && (
            <Link href="/bids"><div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              <p className="text-sm text-gray-800 flex-1">{activeTenders.length} active tenders ready for bidding</p>
              <span className="text-gray-400 text-xs">→</span>
            </div></Link>
          )}
        </div>

        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-gray-900">Upcoming Deadlines</h2>
          <Link href="/tenders" className="text-blue-600 text-sm font-medium">See All</Link>
        </div>

        <div className="space-y-3">
          {upcomingDeadlines.length > 0 ? upcomingDeadlines.map((t: any) => {
            const dl = getDaysLeft(t.deadline);
            return (
              <Link href={`/tenders/${t.id}`} key={t.id}>
                <div className={`bg-white p-4 rounded-2xl shadow-sm border-l-4 ${dl && dl <= 3 ? "border-red-500" : dl && dl <= 7 ? "border-orange-500" : "border-blue-500"}`}>
                  <div className="flex justify-between">
                    <p className="font-semibold text-gray-900 text-sm flex-1 mr-2">{t.title}</p>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${dl && dl <= 3 ? "bg-red-100 text-red-600" : dl && dl <= 7 ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"}`}>{dl} days</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{t.department}</p>
                  <p className="text-xs text-gray-500">Value: ₹{t.value_in_cr} Cr</p>
                </div>
              </Link>
            );
          }) : (
            <div className="bg-white p-6 rounded-2xl text-center">
              <p className="text-gray-500 text-sm">Koi upcoming deadline nahi hai.</p>
              <Link href="/upload"><button className="mt-3 text-blue-600 font-semibold text-sm">+ Naya Tender Upload Karo</button></Link>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
