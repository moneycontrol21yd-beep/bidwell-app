"use client";
import Link from "next/link";
import { useState } from "react";
const C = { bg: "#060B28", card: "#0E1533", text: "#fff", sub: "#94A3B8", muted: "#64748B" };
const LINK: React.CSSProperties = { textDecoration: "none", color: "#fff" };
export default function BidWorkspacePage() {
  const [step, setStep] = useState(1);
  const steps = [
    { id:1, icon:"✅", l:"Eligibility", status:"done" },
    { id:2, icon:"📄", l:"Documents", status:"done" },
    { id:3, icon:"🔧", l:"Technical", status:"active" },
    { id:4, icon:"💰", l:"Financial", status:"pending" },
    { id:5, icon:"📋", l:"Review", status:"pending" },
    { id:6, icon:"📤", l:"Submit", status:"pending" },
  ];
  return (
    <div style={{background:C.bg,minHeight:"100vh",paddingBottom:100,color:C.text,fontFamily:"system-ui,-apple-system,sans-serif"}}>
      <div style={{background:"linear-gradient(135deg,#2563EB 0%,#3B82F6 100%)",padding:"18px 18px 24px",borderBottomLeftRadius:28,borderBottomRightRadius:28,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-40,right:-40,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,0.2)",filter:"blur(50px)"}} />
        <div style={{position:"relative"}}>
          <Link href="/bids" style={{...LINK,fontSize:11,fontWeight:800,color:"rgba(255,255,255,0.85)",letterSpacing:1}}>← MY BIDS</Link>
          <div style={{display:"flex",alignItems:"center",gap:10,marginTop:12}}>
            <div style={{width:48,height:48,borderRadius:14,background:"rgba(255,255,255,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>✍️</div>
            <div>
              <h1 style={{fontSize:20,fontWeight:900,margin:0,lineHeight:1.1}}>Bid Workspace</h1>
              <p style={{fontSize:11.5,color:"rgba(255,255,255,0.85)",margin:"4px 0 0",fontWeight:600}}>Security Services — AIIMS Delhi</p>
            </div>
          </div>
        </div>
      </div>
      <div style={{padding:"16px 18px 0"}}>
        <div style={{background:C.card,border:"1px solid rgba(99,102,241,0.2)",borderRadius:16,padding:16,marginBottom:16}}>
          <div style={{fontSize:10,fontWeight:900,letterSpacing:1.2,color:C.muted,textTransform:"uppercase",marginBottom:12}}>Progress</div>
          {steps.map((s,i)=>(
            <div key={s.id} style={{display:"flex",alignItems:"center",gap:12,padding:"8px 0",borderBottom:i<steps.length-1?"1px solid rgba(99,102,241,0.12)":"none"}}>
              <div style={{width:32,height:32,borderRadius:"50%",background:s.status==="done"?"linear-gradient(135deg,#059669,#10B981)":s.status==="active"?"linear-gradient(135deg,#6366F1,#A855F7)":"rgba(99,102,241,0.15)",border:s.status==="pending"?"1px solid rgba(99,102,241,0.3)":"none",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>
                {s.status==="done"?"✓":s.icon}
              </div>
              <div style={{flex:1,fontSize:12.5,fontWeight:800,color:s.status==="pending"?C.muted:"#fff"}}>{s.l}</div>
              <div style={{fontSize:10,fontWeight:800,color:s.status==="done"?"#10B981":s.status==="active"?"#A5B4FC":C.muted,textTransform:"uppercase"}}>
                {s.status==="done"?"Completed":s.status==="active"?"In Progress":"Pending"}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{padding:"0 18px 20px"}}>
        <div style={{background:C.card,border:"1px solid rgba(99,102,241,0.2)",borderRadius:16,padding:16}}>
          <div style={{fontSize:14,fontWeight:900,color:"#fff",marginBottom:12}}>🔧 Technical Response</div>
          {[
            {i:1,t:"Company Profile",d:"5+ years experience in security services"},
            {i:2,t:"Experience Details",d:"17 similar tenders won successfully"},
            {i:3,t:"Team & Resources",d:"200 trained guards + supervisors available"},
          ].map(x=>(
            <div key={x.i} style={{display:"flex",gap:12,padding:"12px 0",borderBottom:"1px solid rgba(99,102,241,0.12)"}}>
              <div style={{width:26,height:26,borderRadius:"50%",background:"rgba(99,102,241,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,color:"#A5B4FC",flexShrink:0}}>{x.i}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:800,color:"#fff",marginBottom:4}}>{x.t}</div>
                <div style={{fontSize:11,color:C.sub,lineHeight:1.5}}>{x.d}</div>
              </div>
              <button style={{padding:"6px 12px",borderRadius:8,background:"rgba(99,102,241,0.15)",border:"1px solid rgba(99,102,241,0.35)",color:"#A5B4FC",fontSize:10.5,fontWeight:800,cursor:"pointer",fontFamily:"inherit",alignSelf:"flex-start"}}>Edit</button>
            </div>
          ))}
        </div>
      </div>
      <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:30,background:"rgba(10,14,39,0.98)",backdropFilter:"blur(12px)",borderTop:"1px solid rgba(99,102,241,0.18)",padding:"12px 18px 20px"}}>
        <button style={{width:"100%",padding:14,borderRadius:14,background:"linear-gradient(135deg,#2563EB,#3B82F6)",border:"none",color:"#fff",fontSize:13,fontWeight:900,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 6px 20px rgba(59,130,246,0.4)"}}>
          Continue to Financial →
        </button>
      </div>
    </div>
  );
}
