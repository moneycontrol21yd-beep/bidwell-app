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
