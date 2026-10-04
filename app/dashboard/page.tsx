import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/lib/supabase";
import { BellIcon, UserIcon, SparklesIcon, AlertIcon, TrendingUpIcon, ClockIcon, EyeIcon } from "@/components/icons";

function getDaysLeft(d: string | null) { if (!d) return null; return Math.ceil((new Date(d).getTime() - Date.now()) / 86400000); }

export default async function Dashboard() {
  const { data: tenders } = await supabase.from("tenders").select("*").order("created_at", { ascending: false });
  const { data: contracts } = await supabase.from("contracts").select("*");
  const { data: invoices } = await supabase.from("invoices").select("*");
  const { data: docs } = await supabase.from("documents").select("*");
  const { data: notifs } = await supabase.from("notifications").select("*").eq("is_read", false);
  const { data: watched } = await supabase.from("tenders").select("*").eq("is_watched", true);
  const { data: company } = await supabase.from("companies").select("*").limit(1).maybeSingle();

  const allTenders = tenders || [];
  const activeTenders = allTenders.filter((t: any) => t.status === "active");
  const wonTenders = allTenders.filter((t: any) => t.status === "won");
  const allContracts = contracts || [];
  const allInv = invoices || [];
  const allDocs = docs || [];
  const unreadNotifs = (notifs || []).length;
  const watchedCount = (watched || []).length;

  const totalReceivable = allContracts.reduce((s: number, c: any) => s + (c.receivable_in_lakh || 0), 0) * 100000;
  const pendingInvoices = allInv.filter((i: any) => i.status !== "paid");
  const pendingAmount = pendingInvoices.reduce((s: number, i: any) => s + (i.amount || 0), 0);

  const urgentTenders = activeTenders.filter((t: any) => { const d = getDaysLeft(t.deadline); return d !== null && d > 0 && d <= 7; });
  const expiringDocs = allDocs.filter((d: any) => {
    if (!d.expiry_date) return false;
    const days = Math.ceil((new Date(d.expiry_date).getTime() - Date.now()) / 86400000);
    return days >= 0 && days <= 30;
  });

  const upcomingDeadlines = activeTenders
    .filter((t: any) => { const d = getDaysLeft(t.deadline); return d !== null && d > 0; })
    .sort((a: any, b: any) => (getDaysLeft(a.deadline) || 999) - (getDaysLeft(b.deadline) || 999))
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white px-5 pt-6 pb-20 rounded-b-[2rem] relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-blue-100/80 text-xs font-medium tracking-wide uppercase">Welcome back</p>
              <h1 className="text-2xl font-bold mt-1 tracking-tight">{company?.contact_person || "Harsh Rai"}</h1>
              <p className="text-blue-100/70 text-xs mt-0.5">{company?.name || "Shivam Security Services"}</p>
            </div>
            <div className="flex gap-2">
              <Link href="/notifications">
                <div className="w-11 h-11 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 relative">
                  <BellIcon size={20} />
                  {unreadNotifs > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-blue-700">{unreadNotifs}</span>
                  )}
                </div>
              </Link>
              <Link href="/profile">
                <div className="w-11 h-11 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                  <UserIcon size={20} />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-14 relative z-20">
        <Link href="/live-tenders">
          <div className="bg-gradient-to-r from-red-500 via-pink-500 to-rose-600 rounded-2xl shadow-xl p-5 flex items-center border border-red-400/20 mb-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mr-4">
              <span className="text-3xl">🔴</span>
            </div>
            <div className="flex-1">
              <p className="font-bold text-white text-base tracking-tight">Live Government Tenders</p>
              <p className="text-xs text-white/90 mt-1">NHAI, BHEL, CPPP — profile ke hisaab se</p>
            </div>
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">→</span>
            </div>
          </div>
        </Link>

        <Link href="/upload">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl shadow-blue-600/10 p-5 flex items-center border border-gray-100 dark:border-gray-800 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-blue-500/30">
              <SparklesIcon size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900 dark:text-white text-sm">BidWell Tender Analysis</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">PDF upload karo — AI 15 sec me analyze karega</p>
            </div>
            <span className="text-gray-500 text-lg">→</span>
          </div>
        </Link>

        <div className="mb-6">
          <h2 className="font-bold text-gray-900 dark:text-white mb-3 text-sm tracking-tight flex items-center">
            <TrendingUpIcon size={16} className="mr-2 text-blue-600" />
            YOUR BUSINESS TODAY
          </h2>
          <div className="space-y-2">
            {urgentTenders.length > 0 && (
              <Link href="/live-tenders">
                <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 p-3.5 rounded-xl flex items-center mb-2">
                  <div className="w-9 h-9 bg-red-500 rounded-lg flex items-center justify-center mr-3">
                    <AlertIcon size={18} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-red-700 dark:text-red-400">Urgent</p>
                    <p className="text-xs text-gray-700 dark:text-gray-300 mt-0.5">{urgentTenders.length} tender deadline 7 days me</p>
                  </div>
                  <span className="text-red-500">→</span>
                </div>
              </Link>
            )}
            {activeTenders.length > 0 && (
              <Link href="/live-tenders">
                <div className="bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-900/50 p-3.5 rounded-xl flex items-center mb-2">
                  <div className="w-9 h-9 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                    <SparklesIcon size={18} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-green-700 dark:text-green-400">New Matches</p>
                    <p className="text-xs text-gray-700 dark:text-gray-300 mt-0.5">{activeTenders.length} active tenders</p>
                  </div>
                  <span className="text-green-500">→</span>
                </div>
              </Link>
            )}
            {pendingAmount > 0 && (
              <Link href="/payments">
                <div className="bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/50 p-3.5 rounded-xl flex items-center mb-2">
                  <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                    <ClockIcon size={18} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-orange-700 dark:text-orange-400">Payment Follow-up</p>
                    <p className="text-xs text-gray-700 dark:text-gray-300 mt-0.5">₹{(pendingAmount / 100000).toFixed(1)}L pending</p>
                  </div>
                  <span className="text-orange-500">→</span>
                </div>
              </Link>
            )}
            {expiringDocs.length > 0 && (
              <Link href="/documents">
                <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 p-3.5 rounded-xl flex items-center mb-2">
                  <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                    <AlertIcon size={18} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-blue-700 dark:text-blue-400">Document Alert</p>
                    <p className="text-xs text-gray-700 dark:text-gray-300 mt-0.5">{expiringDocs.length} doc expire ho rahe</p>
                  </div>
                  <span className="text-blue-500">→</span>
                </div>
              </Link>
            )}
            {watchedCount > 0 && (
              <Link href="/watch">
                <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/50 p-3.5 rounded-xl flex items-center">
                  <div className="w-9 h-9 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                    <EyeIcon size={18} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-purple-700 dark:text-purple-400">BidWell Watch</p>
                    <p className="text-xs text-gray-700 dark:text-gray-300 mt-0.5">{watchedCount} tenders monitor</p>
                  </div>
                  <span className="text-purple-500">→</span>
                </div>
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <Link href="/live-tenders">
            <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
              <p className="text-2xl font-bold text-blue-600">{activeTenders.length}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold uppercase mt-0.5">Active</p>
            </div>
          </Link>
          <Link href="/contracts">
            <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
              <p className="text-2xl font-bold text-green-600">{wonTenders.length}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold uppercase mt-0.5">Won</p>
            </div>
          </Link>
          <Link href="/payments">
            <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
              <p className="text-xl font-bold text-orange-500">₹{(totalReceivable / 10000000).toFixed(1)}Cr</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold uppercase mt-0.5">Receivable</p>
            </div>
          </Link>
        </div>

        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-gray-900 dark:text-white text-sm">UPCOMING DEADLINES</h2>
          <Link href="/live-tenders" className="text-blue-600 text-xs font-bold">SEE ALL</Link>
        </div>

        <div className="space-y-3">
          {upcomingDeadlines.length > 0 ? upcomingDeadlines.map((t: any) => {
            const dl = getDaysLeft(t.deadline);
            return (
              <Link href={`/tenders/${t.id}`} key={t.id}>
                <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 mb-3">
                  <div className="flex justify-between">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm flex-1 mr-2">{t.title}</p>
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${dl && dl <= 3 ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}>{dl}d</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{t.department}</p>
                </div>
              </Link>
            );
          }) : (
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl text-center border border-gray-100 dark:border-gray-800">
              <p className="text-gray-500 text-sm">Koi deadline nahi hai.</p>
              <Link href="/live-tenders"><button className="mt-3 text-blue-600 font-semibold text-sm">+ Live Tenders fetch karo</button></Link>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
