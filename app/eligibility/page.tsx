"use client";
import { useState } from "react";
import Link from "next/link";
const C = { bg: "#060B28", card: "#0E1533", text: "#fff", sub: "#94A3B8", muted: "#64748B" };
const LINK: React.CSSProperties = { textDecoration: "none", color: "#fff" };
export default function EligibilityPage() {
  const [tenderId, setTenderId] = useState("");
  const [checked, setChecked] = useState(false);
  const [result, setResult] = useState<"eligible"|"not-eligible"|null>(null);
  const criteria = [
    { name: "Turnover Requirement", required: "₹5 Cr", user: "₹5 Cr", status: "match", detail: "Met ✓" },
    { name: "Prior Experience", required: "3 years", user: "7 years", status: "match", detail: "Exceeded ✓" },
    { name: "Similar Projects", required: "5 projects", user: "17 projects", status: "match", detail: "Met ✓" },
    { name: "Technical Staff", required: "5+ staff", user: "12 staff", status: "match", detail: "Met ✓" },
    { name: "GST Registration", required: "Valid", user: "27ABCDE1234F1Z5", status: "match", detail: "Valid ✓" },
    { name: "ISO Certificate", required: "ISO 9001", user: "ISO 9001:2015", status: "match", detail: "Valid ✓" },
    { name: "PSARA License", required: "Mandatory", user: "PSARA/MH/2024/1234", status: "match", detail: "Valid ✓" },
    { name: "Bank Guarantee", required: "₹50 Lakh", user: "Available", status: "match", detail: "Met ✓" },
  ];
  const handleCheck = () => {
    if (!tenderId.trim()) return;
    setTimeout(() => {
      setChecked(true);
      setResult("eligible");
    }, 1500);
  };
  return (
    <div style={{background:C.bg,minHeight:"100vh",paddingBottom:100,color:C.text,fontFamily:"system-ui,-apple-system,sans-serif"}}>
      <div style={{background:"linear-gradient(135deg,#059669 0%,#10B981 100%)",padding:"18px 18px 24px",borderBottomLeftRadius:28,borderBottomRightRadius:28,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-40,right:-40,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,0.2)",filter:"blur(50px)"}} />
        <div style={{position:"relative"}}>
          <Link href="/dashboard" style={{...LINK,fontSize:11,fontWeight:800,color:"rgba(255,255,255,0.85)",letterSpacing:1}}>← DASHBOARD</Link>
          <div style={{display:"flex",alignItems:"center",gap:10,marginTop:12}}>
            <div style={{width:48,height:48,borderRadius:14,background:"rgba(255,255,255,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,backdropFilter:"blur(10px)"}}>🛡️</div>
            <div>
              <h1 style={{fontSize:24,fontWeight:900,margin:0,lineHeight:1.1}}>Eligibility Check</h1>
              <p style={{fontSize:12,color:"rgba(255,255,255,0.85)",margin:"4px 0 0",fontWeight:600}}>Know if you're eligible in seconds</p>
            </div>
          </div>
        </div>
      </div>
      <div style={{padding:"16px 18px 0"}}>
        <div style={{background:C.card,border:"1px solid rgba(99,102,241,0.25)",borderRadius:16,padding:16}}>
          <div style={{fontSize:10,fontWeight:900,letterSpacing:1.2,color:C.muted,textTransform:"uppercase",marginBottom:8}}>Enter Tender ID</div>
          <input value={tenderId} onChange={(e)=>setTenderId(e.target.value)} placeholder="e.g. CPPP-2026-991" style={{width:"100%",padding:"13px 14px",borderRadius:12,background:"rgba(10,14,39,0.7)",border:"1px solid rgba(99,102,241,0.3)",color:"#fff",fontSize:13,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}} />
          <button onClick={handleCheck} disabled={!tenderId.trim()}
            style={{width:"100%",marginTop:12,padding:"13px",borderRadius:12,background:tenderId.trim()?"linear-gradient(135deg,#059669,#10B981)":"rgba(99,102,241,0.3)",border:"none",color:"#fff",fontSize:13,fontWeight:900,cursor:tenderId.trim()?"pointer":"default",fontFamily:"inherit",boxShadow:tenderId.trim()?"0 6px 20px rgba(16,185,129,0.4)":"none"}}>
            Check Eligibility
          </button>
        </div>
      </div>
      {checked && result === "eligible" && (
        <div style={{padding:"16px 18px 20px"}}>
          <div style={{background:"linear-gradient(135deg,#059669 0%,#10B981 100%)",borderRadius:18,padding:20,textAlign:"center",marginBottom:16,boxShadow:"0 10px 30px rgba(16,185,129,0.35)"}}>
            <div style={{fontSize:52,marginBottom:8}}>✅</div>
            <div style={{fontSize:20,fontWeight:900,color:"#fff",marginBottom:4}}>Eligible</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.9)",fontWeight:600}}>You are eligible for this tender</div>
          </div>
          <div style={{background:C.card,border:"1px solid rgba(99,102,241,0.2)",borderRadius:16,padding:16}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
              <span style={{fontSize:16}}>📋</span>
              <span style={{fontSize:12,fontWeight:900,color:"#E2E8F0",letterSpacing:0.5}}>ELIGIBILITY MATCH</span>
            </div>
            {criteria.map((c,i)=>(
              <div key={i} style={{padding:"10px 0",borderBottom:i<criteria.length-1?"1px solid rgba(99,102,241,0.12)":"none",display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12,color:"#E2E8F0",fontWeight:700,display:"flex",alignItems:"center",gap:6}}>
                    <span style={{color:"#10B981",fontSize:14}}>✓</span>
                    {c.name}
                  </div>
                  <div style={{fontSize:10,color:C.muted,marginTop:3,paddingLeft:20}}>Required: {c.required}</div>
                </div>
                <div style={{fontSize:10.5,color:"#10B981",fontWeight:900,textAlign:"right"}}>{c.detail}</div>
              </div>
            ))}
          </div>
          <div style={{marginTop:16,background:"rgba(245,158,11,0.1)",border:"1px solid rgba(245,158,11,0.35)",borderRadius:14,padding:14}}>
            <div style={{fontSize:11,fontWeight:900,color:"#FBBF24",marginBottom:8}}>💡 How to Improve?</div>
            <div style={{fontSize:11,color:"#FCD34D",lineHeight:1.6,fontWeight:600}}>
              All criteria met. You can proceed with bid preparation. Ensure all documents are uploaded in Document Vault.
            </div>
          </div>
        </div>
      )}
      {!checked && (
        <div style={{padding:"20px 18px"}}>
          <div style={{background:C.card,border:"1px solid rgba(99,102,241,0.2)",borderRadius:16,padding:16}}>
            <div style={{fontSize:10,fontWeight:900,letterSpacing:1.2,color:C.muted,textTransform:"uppercase",marginBottom:10}}>How It Works</div>
            {[
              {icon:"1️⃣",t:"Enter Tender ID",d:"Paste the tender ID or browse from tenders list"},
              {icon:"2️⃣",t:"Auto Check",d:"AI compares your profile with tender requirements"},
              {icon:"3️⃣",t:"Get Result",d:"See eligibility score & missing items"},
              {icon:"4️⃣",t:"Take Action",d:"Fix gaps or proceed with bid preparation"},
            ].map((s,i)=>(
              <div key={i} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:i<3?"1px solid rgba(99,102,241,0.12)":"none"}}>
                <div style={{fontSize:20,flexShrink:0}}>{s.icon}</div>
                <div>
                  <div style={{fontSize:12.5,fontWeight:800,color:"#fff",marginBottom:3}}>{s.t}</div>
                  <div style={{fontSize:10.5,color:C.sub,lineHeight:1.4}}>{s.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:30,background:"rgba(10,14,39,0.98)",backdropFilter:"blur(12px)",borderTop:"1px solid rgba(99,102,241,0.18)",display:"flex",alignItems:"center",justifyContent:"space-around",padding:"10px 0 14px"}}>
        {[{icon:"🏠",l:"Home",href:"/dashboard"},{icon:"📄",l:"Tenders",href:"/tenders"},{icon:"🧠",l:"Brain",href:"/brain",center:true},{icon:"✍️",l:"Bids",href:"/bids"},{icon:"⋯",l:"More",href:"/profile",on:true}].map(n=>(
          <Link key={n.l} href={n.href} style={{...LINK,display:"flex",flexDirection:"column",alignItems:"center",position:"relative",marginTop:n.center?-28:0,minWidth:55}}>
            {n.center?(<div style={{width:60,height:60,borderRadius:"50%",background:"linear-gradient(135deg,#6366F1 0%,#A855F7 100%)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,boxShadow:"0 10px 30px rgba(139,92,246,0.55)",border:`4px solid ${C.bg}`}}>🧠</div>):(<span style={{fontSize:22,opacity:n.on?1:0.55}}>{n.icon}</span>)}
            <span style={{fontSize:10,fontWeight:900,color:n.on?"#818CF8":C.muted,marginTop:n.center?4:5}}>{n.l}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
