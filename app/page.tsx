import Link from 'next/link';

export default function Splash() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-600 flex flex-col items-center justify-center p-6 text-white">
      
      {/* Logo */}
      <div className="bg-white p-6 rounded-3xl shadow-2xl mb-8">
        <span className="text-6xl font-bold text-blue-900">B</span>
      </div>

      {/* Title */}
      <h1 className="text-5xl font-bold mb-3">BidWell</h1>
      <p className="text-blue-200 text-xl mb-12">From Tender to Payment.</p>

      {/* Tagline */}
      <div className="text-center mb-16">
        <p className="text-2xl font-semibold mb-2">Win More Contracts.</p>
        <p className="text-2xl font-semibold mb-2">Manage Smarter.</p>
        <p className="text-2xl font-semibold">Get Paid Faster.</p>
      </div>

      {/* Button */}
      <Link href="/login" className="w-full max-w-xs">
        <button className="w-full bg-white text-blue-900 font-bold py-5 rounded-full text-xl shadow-lg hover:bg-gray-100 transition duration-300">
          Get Started →
        </button>
      </Link>

    </main>
  );
}
