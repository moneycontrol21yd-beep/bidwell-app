import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/lib/supabase";

function getDaysLeft(deadline: string | null) {
  if (!deadline) return null;
  const now = new Date();
  const end = new Date(deadline);
  return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export default async function Dashboard() {
  const { data: tenders } = await supabase
    .from("tenders")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: contracts } = await supabase
    .from("contracts")
    .select("*")
    .order("created_at", { ascending: false });

  const allTenders = tenders || [];
  const activeTenders = allTenders.filter((t: any) => t.status === "active");
  const wonTenders = allTenders.filter((t: any) => t.status === "won");
  const allContracts = contracts || [];

  const totalReceivable = allContracts.reduce(
    (sum: number, c: any) => sum + (c.receivable_in_lakh || 0),
    0
  );

  // Upcoming deadlines (active tenders with deadline)
  const upcomingDeadlines = activeTenders
    .filter((t: any) => t.deadline)
    .map((t: any) => ({ ...t, daysLeft: getDaysLeft(t.deadline) }))
    .filter((t: any) => t.daysLeft !== null && t.daysLeft > 0)
    .sort((a: any, b: any) => a.daysLeft - b.daysLeft)
    .slice(0, 3);

  // AI Action Center alerts
  const urgentTenders = activeTenders.filter((t: any) => {
    const d = getDaysLeft(t.deadline);
    return d !== null && d > 0 && d <= 7;
  }).length;

  const overdueTenders = activeTenders.filter((t: any) => {
    const d = getDaysLeft(t.deadline);
    return d !== null && d <= 0;
  }).length;

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6 rounded-b-3xl">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-blue-200 text-sm">Good Morning,</p>
            <h1 className="text-2xl font-bold">Rohit Sharma</h1>
            <p className="text-blue-200 text-xs mt-1">Shivam Security Services</p>
          </div>
          <Link href="/profile">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">👤</div>
          </Link>
        </div>
        <Link href="/upload">
          <div className="bg-white/10 backdrop-blur border border-white/20 p-4 rounded-2xl flex items-center">
            <div className="text-3xl mr-3">🤖</div>
            <div className="flex-1">
              <p className="font-semibold">AI Tender Analysis</p>
              <p className="text-xs text-blue-200">Naya Tender upload karo</p>
            </div>
            <span className="text-blue-200">→</span>
          </div>
        </Link>
      </div>

      {/* Stats */}
      <div className="p-6 -mt-2">
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Link href="/tenders">
            <div className="bg-white p-3 rounded-2xl shadow-sm text-center">
              <p className="text-2xl font-bold text-blue-600">{activeTenders.length}</p>
              <p className="text-xs text-gray-500 mt-1">Active Tenders</p>
            </div>
          </Link>
          <Link href="/contracts">
            <div className="bg-white p-3 rounded-2xl shadow-sm text-center">
              <p className="text-2xl font-bold text-green-600">{wonTenders.length}</p>
              <p className="text-xs text-gray-500 mt-1">Won Contracts</p>
            </div>
          </Link>
          <Link href="/payments">
            <div className="bg-white p-3 rounded-2xl shadow-sm text-center">
              <p className="text-2xl font-bold text-orange-500">
                ₹{totalReceivable > 0 ? (totalReceivable / 100).toFixed(1) : "0"}Cr
              </p>
              <p className="text-xs text-gray-500 mt-1">Receivable</p>
            </div>
          </Link>
        </div>

        {/* AI Action Center */}
        <div className="mb-6">
          <h2 className="font-bold text-gray-900 mb-3 flex items-center">
            🤖 AI Action Center
          </h2>
          <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
            {overdueTenders > 0 && (
              <Link href="/tenders">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  <p className="text-sm text-gray-800 flex-1">
                    <b>{overdueTenders}</b> tender{overdueTenders > 1 ? "s" : ""} expired — review karo
                  </p>
                </div>
              </Link>
            )}
            {urgentTenders > 0 && (
              <Link href="/tenders">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                  <p className="text-sm text-gray-800 flex-1">
                    <b>{urgentTenders}</b> tender{urgentTenders > 1 ? "s" : ""} deadline 7 days me
                  </p>
                </div>
              </Link>
            )}
            {activeTenders.length > 0 && (
              <Link href="/bids">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  <p className="text-sm text-gray-800 flex-1">
                    <b>{activeTenders.length}</b> active tender{activeTenders.length > 1 ? "s" : ""} ready for bidding
                  </p>
                </div>
              </Link>
            )}
            {totalReceivable > 0 && (
              <Link href="/payments">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  <p className="text-sm text-gray-800 flex-1">
                    <b>₹{totalReceivable.toLocaleString("en-IN")} L</b> receivable pending
                  </p>
                </div>
              </Link>
            )}
            {overdueTenders === 0 && urgentTenders === 0 && activeTenders.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-2">
                Abhi koi urgent action nahi hai. 🎉
              </p>
            )}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-gray-900">Upcoming Deadlines</h2>
          <Link href="/tenders" className="text-blue-600 text-sm font-medium">See All</Link>
        </div>

        <div className="space-y-3">
          {upcomingDeadlines.length > 0 ? (
            upcomingDeadlines.map((t: any) => (
              <Link href="/bids" key={t.id}>
                <div
                  className={`bg-white p-4 rounded-2xl shadow-sm border-l-4 ${
                    t.daysLeft <= 3
                      ? "border-red-500"
                      : t.daysLeft <= 7
                      ? "border-orange-500"
                      : "border-blue-500"
                  }`}
                >
                  <div className="flex justify-between">
                    <p className="font-semibold text-gray-900 text-sm flex-1 mr-2">{t.title}</p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-semibold whitespace-nowrap ${
                        t.daysLeft <= 3
                          ? "bg-red-100 text-red-600"
                          : t.daysLeft <= 7
                          ? "bg-orange-100 text-orange-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {t.daysLeft} days
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{t.department}</p>
                  <p className="text-xs text-gray-500">Value: ₹{t.value_in_cr} Cr</p>
                </div>
              </Link>
            ))
          ) : (
            <div className="bg-white p-6 rounded-2xl text-center">
              <p className="text-gray-500 text-sm">Koi upcoming deadline nahi hai.</p>
              <Link href="/upload">
                <button className="mt-3 text-blue-600 font-semibold text-sm">
                  + Naya Tender Upload Karo
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
