"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/lib/supabase";
import { BuildingIcon, CheckSquareIcon, TrendingUpIcon, UserIcon } from "@/components/icons";

const STEPS = [
  { num: 1, label: "Company", Icon: BuildingIcon },
  { num: 2, label: "Legal", Icon: CheckSquareIcon },
  { num: 3, label: "Capacity", Icon: TrendingUpIcon },
  { num: 4, label: "Contact", Icon: UserIcon },
];

const BIZ_TYPES = ["Security & Manpower", "Housekeeping & Facility", "Construction & Civil", "IT & Software", "Electrical & Plumbing", "Catering & Food", "Transport & Logistics", "Other"];

export default function CompanySetup() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [existingId, setExistingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "", business_type: "Security & Manpower", address: "",
    gst_number: "", pan_number: "", msme_number: "", registration_no: "",
    turnover_cr: "", experience_years: "", employees_count: "", services: "", certifications: "",
    contact_person: "", contact_email: "", contact_phone: "",
  });

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("companies").select("*").limit(1).maybeSingle();
      if (data) {
        setExistingId(data.id);
        setForm((p) => ({ ...p, ...data }));
      }
      setLoading(false);
    };
    load();
  }, []);

  const update = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async () => {
    const payload: any = { ...form };
    ["turnover_cr", "experience_years", "employees_count"].forEach((k) => {
      if (payload[k] === "" || payload[k] === null) payload[k] = null;
      else payload[k] = parseFloat(payload[k]);
    });

    let error;
    if (existingId) {
      const r = await supabase.from("companies").update(payload).eq("id", existingId);
      error = r.error;
    } else {
      const r = await supabase.from("companies").insert(payload).select().single();
      error = r.error;
      if (r.data) setExistingId(r.data.id);
    }

    if (error) alert("Save no hua: " + error.message);
    else { setSaved(true); setTimeout(() => setSaved(false), 2500); }
  };

  const next = () => { if (step < 4) setStep(step + 1); };
  const prev = () => { if (step > 1) setStep(step - 1); };

  if (loading) return <main className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6"><p className="text-center text-gray-500 text-sm py-10">Loading...</p></main>;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      <div className="bg-white dark:bg-gray-900 px-5 pt-5 pb-4 border-b border-gray-200 dark:border-gray-800">
        <Link href="/profile" className="text-blue-600 text-xs font-bold tracking-wide">← PROFILE</Link>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-2 tracking-tight">Company Setup</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Fill once, use forever</p>
      </div>

      {/* Stepper */}
      <div className="px-5 py-5 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          {STEPS.map((s, i) => {
            const done = step > s.num;
            const active = step === s.num;
            return (
              <div key={s.num} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${done ? "bg-green-500" : active ? "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30" : "bg-gray-100 dark:bg-gray-800"}`}>
                    {done ? (
                      <span className="text-white font-bold text-sm">✓</span>
                    ) : (
                      <s.Icon size={18} className={active ? "text-white" : "text-gray-400"} />
                    )}
                  </div>
                  <p className={`text-[9px] mt-1.5 font-bold tracking-wide uppercase ${done ? "text-green-600" : active ? "text-blue-600" : "text-gray-400"}`}>{s.label}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded-full mb-4 ${step > s.num ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"}`}></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="p-5 space-y-4">
        {step === 1 && (
          <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-1.5">Company Name *</label>
              <input name="name" value={form.name} onChange={update} placeholder="Shivam Security Services Pvt. Ltd." className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-1.5">Business Type *</label>
              <select name="business_type" value={form.business_type} onChange={update} className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white">
                {BIZ_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-1.5">Registered Address</label>
              <textarea name="address" value={form.address} onChange={update} rows={3} className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-1.5">GST Number</label>
              <input name="gst_number" value={form.gst_number || ""} onChange={update} placeholder="27AABCS1234F1Z5" className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-1.5">PAN Number</label>
              <input name="pan_number" value={form.pan_number || ""} onChange={update} placeholder="AABCS1234F" className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-1.5">MSME / Udyam Number</label>
              <input name="msme_number" value={form.msme_number || ""} onChange={update} placeholder="UDYAM-MH-18-0012345" className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-1.5">Company Registration No.</label>
              <input name="registration_no" value={form.registration_no || ""} onChange={update} placeholder="U74999MH2019PTC123456" className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white" />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-1.5">Turnover (₹ Cr)</label>
                <input name="turnover_cr" type="number" value={form.turnover_cr || ""} onChange={update} placeholder="5" className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-1.5">Experience (Yrs)</label>
                <input name="experience_years" type="number" value={form.experience_years || ""} onChange={update} placeholder="7" className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-1.5">Employees Count</label>
              <input name="employees_count" type="number" value={form.employees_count || ""} onChange={update} placeholder="200" className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-1.5">Services (comma separated)</label>
              <textarea name="services" value={form.services || ""} onChange={update} rows={2} placeholder="Security Guards, Housekeeping, Facility Management" className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-1.5">Certifications</label>
              <textarea name="certifications" value={form.certifications || ""} onChange={update} rows={2} placeholder="ISO 9001, PSARA, Labour License" className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white" />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-1.5">Contact Person</label>
              <input name="contact_person" value={form.contact_person || ""} onChange={update} placeholder="Rohit Sharma" className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-1.5">Contact Email</label>
              <input name="contact_email" value={form.contact_email || ""} onChange={update} type="email" placeholder="admin@company.com" className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-1.5">Contact Phone</label>
              <input name="contact_phone" value={form.contact_phone || ""} onChange={update} placeholder="+91 98765 43210" className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white" />
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3">
          {step > 1 && (
            <button onClick={prev} className="flex-1 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold py-4 rounded-2xl text-sm tracking-wide">
              ← BACK
            </button>
          )}
          {step < 4 ? (
            <button onClick={next} className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-2xl text-sm tracking-wide shadow-lg shadow-blue-600/20">
              NEXT →
            </button>
          ) : (
            <button onClick={save} className={`flex-1 font-bold py-4 rounded-2xl text-sm tracking-wide shadow-lg ${saved ? "bg-green-600 text-white shadow-green-600/20" : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-600/20"}`}>
              {saved ? "✓ SAVED" : "SAVE COMPANY"}
            </button>
          )}
        </div>

        {step === 4 && !saved && (
          <Link href="/dashboard">
            <button className="w-full text-center text-blue-600 text-xs font-bold tracking-wide py-2">
              SKIP FOR NOW →
            </button>
          </Link>
        )}
      </div>
      <BottomNav />
    </main>
  );
}
