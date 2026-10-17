"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import AppNav from "@/components/AppNav";

const C = { bg: "#060B28", card: "#0E1533", text: "#fff", sub: "#94A3B8", muted: "#64748B" };
const LINK: React.CSSProperties = { textDecoration: "none", color: "#fff" };
const INPUT: React.CSSProperties = {
  width: "100%", padding: "12px 14px", borderRadius: 12,
  background: "rgba(10,14,39,0.7)", border: "1px solid rgba(99,102,241,0.3)",
  color: "#fff", fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box",
};
const LABEL: React.CSSProperties = { fontSize: 10, fontWeight: 900, letterSpacing: 1, color: C.muted, textTransform: "uppercase", marginBottom: 6, display: "block" };

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function CompanySetupPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "Shivam Security Services Pvt. Ltd.",
    type: "Security & Manpower",
    address: "Mumbai, Maharashtra",
    gst: "27ABCDE1234F1Z5",
    pan: "ABCDE1234F",
    iso: "ISO 9001:2015",
    psara: "PSARA/MH/2024/1234",
    turnover: "5",
    employees: "200",
    experience: "7",
    email: "contact@shivam.com",
    phone: "+91 9876543210",
  });

  const steps = [
    { id: 1, icon: "🏢", label: "Company" },
    { id: 2, icon: "📋", label: "Legal" },
    { id: 3, icon: "📈", label: "Capacity" },
    { id: 4, icon: "👤", label: "Contact" },
  ];

  const update = (k: string, v: string) => setForm({ ...form, [k]: v });

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else {
      try {
        localStorage.setItem("company", JSON.stringify(form));
      
      // Supabase Sync
      const syncToSupabase = async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            console.log("User not logged in. Saved locally only.");
            return;
          }
          
          await supabase.from("companies").upsert({
            user_id: user.id,
            name: form.name,
            business_type: form.type,
            gst_number: form.gst,
            pan_number: form.pan,
            turnover_cr: parseFloat(form.turnover) || 0,
            experience_years: parseInt(form.experience) || 0,
            contact_email: form.email,
            contact_phone: form.phone,
            address: form.address
          }, { onConflict: 'user_id' });
          
          console.log("Profile synced to Supabase!");
        } catch (err) {
          console.error("Supabase sync failed:", err);
        }
      };
      syncToSupabase();
      } catch {}
      window.location.href = "/dashboard";
    }
  };

  return (
    <div style={{ background: C.bg, minHeight: "100vh", paddingBottom: 100, color: "#fff", fontFamily: "system-ui,-apple-system,sans-serif" }}>

      {/* HEADER */}
      <div style={{ background: "linear-gradient(135deg,#4338CA 0%,#6366F1 100%)", padding: "16px 18px 24px", borderBottomLeftRadius: 28, borderBottomRightRadius: 28, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(139,92,246,0.5)", filter: "blur(50px)" }} />
        <div style={{ position: "relative" }}>
          <Link href="/profile" style={{ ...LINK, fontSize: 11, fontWeight: 800, color: "#C7D2FE", letterSpacing: 1 }}>← PROFILE</Link>
          <h1 style={{ fontSize: 24, fontWeight: 900, margin: "10px 0 0", lineHeight: 1.1 }}>Company Setup</h1>
          <p style={{ fontSize: 12, color: "#C7D2FE", margin: "6px 0 0", fontWeight: 600 }}>Fill once, use forever</p>
        </div>
      </div>

      {/* STEPS */}
      <div style={{ padding: "20px 18px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
          {steps.map((s) => (
            <div key={s.id} style={{ textAlign: "center", opacity: s.id <= step ? 1 : 0.4 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12, margin: "0 auto 6px",
                background: s.id === step ? "linear-gradient(135deg,#6366F1,#A855F7)" : s.id < step ? "linear-gradient(135deg,#059669,#10B981)" : C.card,
                border: `1px solid rgba(99,102,241,0.3)`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                boxShadow: s.id === step ? "0 6px 18px rgba(99,102,241,0.4)" : "none",
              }}>
                {s.id < step ? "✓" : s.icon}
              </div>
              <div style={{ fontSize: 9.5, fontWeight: 800, color: s.id === step ? "#A5B4FC" : C.muted, letterSpacing: 0.3 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FORM */}
      <div style={{ padding: "24px 18px 0" }}>
        <div style={{ background: C.card, border: `1px solid rgba(99,102,241,0.2)`, borderRadius: 18, padding: 18 }}>

          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={LABEL}>Company Name *</label>
                <input style={INPUT} value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Your company name" />
              </div>
              <div>
                <label style={LABEL}>Business Type *</label>
                <select style={{ ...INPUT, appearance: "none" }} value={form.type} onChange={(e) => update("type", e.target.value)}>
                  <option value="Security & Manpower">Security & Manpower</option>
                  <option value="Housekeeping">Housekeeping</option>
                  <option value="Construction">Construction</option>
                  <option value="IT Services">IT Services</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label style={LABEL}>Registered Address</label>
                <textarea style={{ ...INPUT, minHeight: 70, resize: "vertical" }} value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="Full address" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={LABEL}>GST Number</label>
                <input style={INPUT} value={form.gst} onChange={(e) => update("gst", e.target.value)} placeholder="22AAAAA0000A1Z5" />
              </div>
              <div>
                <label style={LABEL}>PAN Number</label>
                <input style={INPUT} value={form.pan} onChange={(e) => update("pan", e.target.value)} placeholder="AAAAA0000A" />
              </div>
              <div>
                <label style={LABEL}>ISO Certificate</label>
                <input style={INPUT} value={form.iso} onChange={(e) => update("iso", e.target.value)} placeholder="ISO 9001:2015" />
              </div>
              <div>
                <label style={LABEL}>PSARA License</label>
                <input style={INPUT} value={form.psara} onChange={(e) => update("psara", e.target.value)} placeholder="PSARA/MH/2024/1234" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={LABEL}>Annual Turnover (₹ Crore)</label>
                <input style={INPUT} type="number" value={form.turnover} onChange={(e) => update("turnover", e.target.value)} placeholder="5" />
              </div>
              <div>
                <label style={LABEL}>Total Employees</label>
                <input style={INPUT} type="number" value={form.employees} onChange={(e) => update("employees", e.target.value)} placeholder="200" />
              </div>
              <div>
                <label style={LABEL}>Years of Experience</label>
                <input style={INPUT} type="number" value={form.experience} onChange={(e) => update("experience", e.target.value)} placeholder="7" />
              </div>
            </div>
          )}

          {step === 4 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={LABEL}>Email</label>
                <input style={INPUT} type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="contact@company.com" />
              </div>
              <div>
                <label style={LABEL}>Phone Number</label>
                <input style={INPUT} value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+91 9876543210" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BUTTONS */}
      <div style={{ padding: "20px 18px 0", display: "flex", gap: 10 }}>
        {step > 1 && (
          <button onClick={() => setStep(step - 1)}
            style={{ flex: 1, padding: "14px", borderRadius: 14, background: C.card, border: `1px solid rgba(99,102,241,0.3)`, color: "#fff", fontSize: 13, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
            ← Back
          </button>
        )}
        <button onClick={handleNext}
          style={{ flex: 2, padding: "14px", borderRadius: 14, background: "linear-gradient(135deg,#6366F1,#A855F7)", border: "none", color: "#fff", fontSize: 13, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 6px 20px rgba(139,92,246,0.4)" }}>
          {step === 4 ? "✓ Save & Continue" : "Next →"}
        </button>
      </div>

      {/* BOTTOM NAV */}
      <AppNav active="more" />
    </div>
  );
}
