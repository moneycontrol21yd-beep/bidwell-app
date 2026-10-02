import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/lib/supabase";

function getDaysLeft(deadline: string | null) {
  if (!deadline) return null;
  const now = new Date();
  const end = new Date(deadline);
  return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export default async function Tenders() {
  const { data: tenders } = await supabase
    .from("tenders")
    .select("*")
    .order("created_at", { ascending: false });

  const list = tenders || [];

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white p-5 border-b border-gray-200 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-900 mb-3">Tender Discovery</h1>
        <div className="bg-gray-100 rounded-xl px-4 py-3 flex items-center">
          <span className="text-gray-400 mr-2">🔍</span>
          <input type="text" placeholder="Search tenders..." className="bg-transparent w-full outline-none text-sm" />
        </div>
      </div>

      <div className="px-5 pt-4">
        <div className="flex gap-2 mb-4 overflow-x-auto">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-full text-xs font-semibold whitespace-nowrap">
            Recommended ({list.length})
          </button>
          <button className="px-4 py-2 bg-white text-gray-600 rounded-full text-xs font-semibold border border-gray-200 whitespace-nowrap">
            Latest
          </button>
        </div>

        <div className="space-y-3">
          {list.length > 0 ? (
            list.map((t: any) => {
              const daysLeft = getDaysLeft(t.deadline);
              return (
                <div key={t.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-sm leading-tight">
                        {t.title || "Untitled Tender"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{t.department || "Department N/A"}</p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold ml-2 whitespace-nowrap">
                      Match 85%
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                    <div className="flex gap-2">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">🏛️ Tender</span>
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded font-semibold">
                        ₹{t.value_in_cr || 0} Cr
                      </span>
                    </div>
                    {daysLeft !== null && (
                      <span className={`text-xs font-semibold ${
                        daysLeft <= 3 ? "text-red-600" : daysLeft <= 7 ? "text-orange-600" : "text-gray-500"
                      }`}>
                        {daysLeft > 0 ? `${daysLeft} days left` : "Expired"}
                      </span>
                    )}
                  </div>

                  {t.status === "active" && (
                    <Link href={`/eligibility/${t.id}`}>
                      <button className="w-full mt-3 bg-blue-600 text-white font-bold py-2.5 rounded-xl text-xs">
                        🤖 AI Eligibility Check
                      </button>
                    </Link>
                  )}

                  {t.status === "won" && (
                    <div className="mt-3 text-center">
                      <span className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-full font-semibold">
                        ✓ Won — Contract ban gaya
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="bg-white p-8 rounded-2xl text-center">
              <p className="text-gray-500 text-sm">Abhi koi tender nahi hai.</p>
              <Link href="/upload">
                <button className="mt-4 bg-blue-600 text-white font-bold py-3 px-6 rounded-xl text-sm">
                  + Upload Tender
                </button>
              </Link>
            </div>
          )}
        </div>

        <Link href="/upload">
          <button className="w-full mt-5 bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg">
            + Upload New Tender
          </button>
        </Link>
      </div>

      <BottomNav />
    </main>
  );
}
