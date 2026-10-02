"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/lib/supabase";

export default function CompanyProfile() {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    business_type: "Security & Manpower",
    gst_number: "",
    pan_number: "",
    msme_number: "",
    turnover_cr: "",
    experience_years: "",
    address: "",
    contact_person: "",
    contact_email: "",
    contact_phone: "",
  });

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("companies").select("*").limit(1).maybeSingle();
      if (data) setForm((prev) => ({ ...prev, ...data }));
      setLoading(false);
    };
    load();
  }, []);

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    const { data: existing } = await supabase.from("companies").select("id").limit(1).maybeSingle();
    let error;
    if (existing?.id) {
      const res = await supabase.from("companies").update(form).eq("id", existing.id);
      error = res.error;
    } else {
      const res = await supabase.from("companies").insert(form);
      error = res.error;
    }
    if (error) {
      alert("Save nahi hua: " + error.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <p className="text-center text-gray-500 text-sm py-10">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white p-5 border-b border-gray-200">
        <Link href="/profile" className="text-blue-600 text-sm">← Profile</Link>
        <h1 className="text-xl font-bold text-gray-900 mt-3">Company Profile</h1>
        <p className="text-xs text-gray-500 mt-1">Ek baar bharo, hamesha kaam aayega</p>
      </div>

      <div className="p-5 space-y-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4 text-sm">🏢 Company Details</h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-gray-600">Company Name</label>
              <input name="name" value={form.name} onChange={handleChange} className="w-full mt-1 px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600">Business Type</label>
              <select name="business_type" value={form.business_type} onChange={handleChange} className="w-full mt-1 px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm">
                <option>Security & Manpower</option>
                <option>Construction & Civil</option>
                <option>IT & Software</option>
                <option>Housekeeping & Facility</option>
                <option>Electrical & Plumbing</option>
                <option>Catering & Food</option>
                <option>Transport & Logistics</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600">Registered Address</label>
              <textarea name="address" value={form.address} onChange={handleChange} rows={2} className="w-full mt-1 px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4 text-sm">📋 Legal Documents</h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-gray-600">GST Number</label>
              <input name="gst_number" value={form.gst_number} onChange={handleChange} className="w-full mt-1 px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600">PAN Number</label>
              <input name="pan_number" value={form.pan_number} onChange={handleChange} className="w-full mt-1 px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600">MSME / Udyam Number</label>
              <input name="msme_number" value={form.msme_number} onChange={handleChange} className="w-full mt-1 px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4 text-sm">💼 Business Capacity</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600">Turnover (₹ Cr)</label>
              <input name="turnover_cr" value={form.turnover_cr} onChange={handleChange} type="number" className="w-full mt-1 px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600">Experience (Yrs)</label>
              <input name="experience_years" value={form.experience_years} onChange={handleChange} type="number" className="w-full mt-1 px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4 text-sm">📞 Contact Person</h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-gray-600">Name</label>
              <input name="contact_person" value={form.contact_person} onChange={handleChange} className="w-full mt-1 px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600">Email</label>
              <input name="contact_email" value={form.contact_email} onChange={handleChange} className="w-full mt-1 px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600">Phone</label>
              <input name="contact_phone" value={form.contact_phone} onChange={handleChange} className="w-full mt-1 px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className={`w-full font-bold py-4 rounded-xl ${
            saved ? "bg-green-600 text-white" : "bg-blue-600 text-white"
          }`}
        >
          {saved ? "✅ Profile Saved!" : "Save Company Profile"}
        </button>
      </div>

      <BottomNav />
    </main>
  );
}
