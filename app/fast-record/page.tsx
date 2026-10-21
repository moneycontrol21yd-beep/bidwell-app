"use client";
import { useState } from "react";
import Link from "next/link";
const C = { bg: "#060B28", card: "#0E1533", text: "#fff", sub: "#94A3B8", muted: "#64748B" };
const LINK: React.CSSProperties = { textDecoration: "none", color: "#fff" };
export default function FastRecordPage() {
  const [tab, setTab] = useState<"today"|"week"|"month">("today");
  const tenders = [
    { id:1, title:"Security Services - AIIMS Delhi", dept:"AIIMS Delhi", value:"₹2.8 Cr", deadline:"23 Oct 2026", days:7, match:95, source:"CPPP" },
    { id:2, title:"Road Construction - NHAI Phase 4", dept:"NHAI", value:"₹12.5 Cr", deadline:"25 Oct 2026", days:9, match:78, source:"NHAI" },
    { id:3, title:"Housekeeping - Railway Board", dept:"Railway Board", value:"₹1.2 Cr", deadline:"28 Oct 2026", days:12, match:88, source:"IREPS" },
    { id:4, title:"CCTV Installation - Delhi Metro", dept:"DMRC", value:"₹4.8 Cr", deadline:"20 Oct 2026", days:4, match:92, source:"CPPP" },
    { id:5, title:"Manpower Supply - FCI Godown", dept:"FCI", value:"₹0.8 Cr", deadline:"30 Oct 2026", days:14, match:85, source:"FCI" },
  ];
  const filtered = tenders.filter(t => {
    if (tab === "today") return t.days <= 7;
    if (tab === "week") return t.days <= 15;
    return true;
  });
  const matchColor = (s:number) => s>=80?"#10B981":s>=60?"#F59E0B":"#EF4444";
  return (
    <div style={{background:C.bg,minHeight:"100vh",paddingBottom:100,color:C.text,fontFamily:"system-ui,-apple-system,sans-serif"}}>
      <div style={{background:"linear-gradient(135deg,#D97706 0%,#F59E0B 100%)",padding:"18px 18px 24px",borderBottomLeftRadius:28,borderBottomRightRadius:28,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-40,right:-40,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,0.2)",filter:"blur(50px)"}} />
        <div style={{position:"relative"}}>
          <Link href="/dashboard" style={{...LINK,fontSize:11,fontWeight:800,color:"rgba(255,255,255,0.85)",letterSpacing:1}}>← DASHBOARD</Link>
          <div style={{display:"flex",alignItems:"center",gap:10,marginTop:12}}>
            <div style={{width:48,height:48,borderRadius:14,background:"rgba(255,255,255,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,backdropFilter:"blur(10px)"}}>⚡</div>
            <div>
              <h1 style={{fontSize:24,fontWeight:900,margin:0,lineHeight:1.1}}>Fast Record</h1>
              <p style={{fontSize:12,color:"rgba(255,255,255,0.85)",margin:"4px 0 0",fontWeight:600}}>High priority & closing soon</p>
            </div>
          </div>
        </div>
      </div>
      <div style={{padding:"16px 18px 0"}}>
        <div style={{display:"flex",background:C.card,borderRadius:14,padding:4,border:"1px solid rgba(99,102,241,0.2)"}}>
          {[{id:"today",l:"Today"},{id:"week",l:"This Week"},{id:"month",l:"This Month"}].map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id as any)}
              style={{flex:1,padding:"10px 6px",borderRadius:10,background:tab===t.id?"linear-gradient(135deg,#D97706,#F59E0B)":"transparent",color:tab===t.id?"#fff":C.sub,border:"none",fontSize:11.5,fontWeight:900,cursor:"pointer",fontFamily:"inherit"}}>
              {t.l}
            </button>
          ))}
        </div>
      </div>
      <div style={{padding:"16px 18px 20px"}}>
        <div style={{fontSize:11,color:C.muted,fontWeight:700,marginBottom:12}}>
          <span style={{color:"#FBBF24"}}>{filtered.length}</span> urgent tenders
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {filtered.map(t=>(
            <Link key={t.id} href="/tenders" style={{...LINK,display:"block"}}>
              <div style={{background:C.card,border:"1px solid rgba(239,68,68,0.3)",borderRadius:16,padding:14,position:"relative"}}>
                <div style={{position:"absolute",top:-1,right:-1,background:"#EF4444",color:"#fff",fontSize:9,fontWeight:900,letterSpacing:0.6,padding:"4px 10px",borderTopRightRadius:15,borderBottomLeftRadius:10}}>
                  {t.days}d LEFT
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                  <span style={{fontSize:9,fontWeight:900,letterSpacing:0.8,padding:"3px 8px",borderRadius:6,background:"rgba(59,130,246,0.15)",color:"#93C5FD",border:"1px solid rgba(59,130,246,0.3)"}}>{t.source}</span>
                  <span style={{padding:"3px 9px",borderRadius:12,background:`${matchColor(t.match)}22`,border:`1px solid ${matchColor(t.match)}55`,fontSize:10,fontWeight:900,color:matchColor(t.match)}}>{t.match}% match</span>
                </div>
                <div style={{fontSize:13.5,fontWeight:800,color:"#fff",lineHeight:1.35,marginBottom:8}}>{t.title}</div>
                <div style={{fontSize:10.5,color:C.sub,marginBottom:10}}>🏛️ {t.dept}</div>
                <div style={{display:"flex",justifyContent:"space-between",paddingTop:10,borderTop:"1px solid rgba(99,102,241,0.15)"}}>
                  <div>
                    <div style={{fontSize:9,color:C.muted,fontWeight:800,textTransform:"uppercase",letterSpacing:0.6}}>Value</div>
                    <div style={{fontSize:12.5,fontWeight:900,color:"#60A5FA",marginTop:2}}>{t.value}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:9,color:C.muted,fontWeight:800,textTransform:"uppercase",letterSpacing:0.6}}>Deadline</div>
                    <div style={{fontSize:12,fontWeight:900,color:"#EF4444",marginTop:2}}>{t.deadline}</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
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
