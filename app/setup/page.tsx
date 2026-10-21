import Link from 'next/link';

export default function CompanySetup() {
  return (
    <main className="min-h-screen bg-white p-6 flex flex-col">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Company Setup</h1>
        <p className="text-gray-500 text-sm mt-1">Tell us about your company</p>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-10 px-2">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">1</div>
          <span className="text-xs text-blue-600 font-semibold mt-1">Company</span>
        </div>
        <div className="flex-1 h-1 bg-gray-200 mx-2"></div>
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold">2</div>
          <span className="text-xs text-gray-400 mt-1">Details</span>
        </div>
        <div className="flex-1 h-1 bg-gray-200 mx-2"></div>
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold">3</div>
          <span className="text-xs text-gray-400 mt-1">Verify</span>
        </div>
        <div className="flex-1 h-1 bg-gray-200 mx-2"></div>
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold">4</div>
          <span className="text-xs text-gray-400 mt-1">Done</span>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-5 w-full max-w-sm mx-auto flex-1">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Company Name</label>
          <input type="text" placeholder="Shivam Security Services Pvt. Ltd." className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Business Type</label>
          <select className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition text-gray-700">
            <option>Security & Manpower</option>
            <option>Construction & Civil</option>
            <option>IT & Software</option>
            <option>Housekeeping & Facility</option>
            <option>Electrical & Plumbing</option>
            <option>Other</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">GST Number</label>
          <input type="text" placeholder="27AABCS1234F1Z5" className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Year of Establishment</label>
          <input type="text" placeholder="2019" className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition" />
        </div>
      </div>

      {/* Button */}
      <div className="w-full max-w-sm mx-auto mt-8">
        <Link href="/dashboard">
          <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 transition duration-300">
            Next
          </button>
        </Link>
      </div>

    </main>
  );
}
