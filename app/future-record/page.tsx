"use client";
import { useState } from "react";
import Link from "next/link";
const C = { bg: "#060B28", card: "#0E1533", text: "#fff", sub: "#94A3B8", muted: "#64748B" };
const LINK: React.CSSProperties = { textDecoration: "none", color: "#fff" };
export default function FutureRecordPage() {
  const [tab, setTab] = useState<"all"|"central"|"state">("all");
  const future = [
    { id:1, title:"Delhi Metro Phase 4 Extension", dept:"DMRC", value:"₹12,000 Cr", timeline:"2026-2028", category:"Infrastructure", match:85 },
    { id:2, title:"Smart City Development (Varanasi)", dept:"UP Govt", value:"₹3,500 Cr", timeline:"2026-2028", category:"Urban Development", match:78 },
    { id:3, title:"Green Energy Project (Solar)", dept:"MNRE", value:"₹8,000 Cr", timeline:"2026-2030", category:"Renewable Energy", match:72 },
    { id:4, title:"AI & Digital Services", dept:"MeitY", value:"₹2,000 Cr", timeline:"2026-2027", category:"IT Services", match:65 },
    { id:5, title:"Rural Infrastructure (PMGSY)", dept:"MoRD", value:"₹5,500 Cr", timeline:"2026-2029", category:"Rural Development", match:80 },
  ];
  const filtered = future.filter(f => {
    if (tab === "central") return f.dept.includes("DMRC") || f.dept === "MNRE" || f.dept === "MeitY" || f.dept === "MoRD";
    if (tab === "state") return f.dept.includes("UP");
    return true;
  });
  return (
    <div style={{background:C.bg,minHeight:"100vh",paddingBottom:100,color:C.text,fontFamily:"system-ui,-apple-system,sans-serif"}}>
      <div style={{background:"linear-gradient(135deg,#DB2777 0%,#EC4899 100%)",padding:"18px 18px 24px",borderBottomLeftRadius:28,borderBottomRightRadius:28,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-40,right:-40,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,0.2)",filter:"blur(50px)"}} />
        <div style={{position:"relative"}}>
          <Link href="/dashboard" style={{...LINK,fontSize:11,fontWeight:800,color:"rgba(255,255,255,0.85)",letterSpacing:1}}>← DASHBOARD</Link>
          <div style={{display:"flex",alignItems:"center",gap:10,marginTop:12}}>
            <div style={{width:48,height:48,borderRadius:14,background:"rgba(255,255,255,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,backdropFilter:"blur(10px)"}}>📅</div>
            <div>
              <h1 style={{fontSize:24,fontWeight:900,margin:0,lineHeight:1.1}}>Future Record</h1>
              <p style={{fontSize:12,color:"rgba(255,255,255,0.85)",margin:"4px 0 0",fontWeight:600}}>Upcoming tenders & forecasts</p>
            </div>
          </div>
        </div>
      </div>
      <div style={{padding:"16px 18px 0"}}>
        <div style={{display:"flex",background:C.card,borderRadius:14,padding:4,border:"1px solid rgba(99,102,241,0.2)"}}>
          {[{id:"all",l:"All"},{id:"central",l:"Central"},{id:"state",l:"State"}].map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id as any)}
              style={{flex:1,padding:"10px 6px",borderRadius:10,background:tab===t.id?"linear-gradient(135deg,#DB2777,#EC4899)":"transparent",color:tab===t.id?"#fff":C.sub,border:"none",fontSize:11.5,fontWeight:900,cursor:"pointer",fontFamily:"inherit"}}>
              {t.l}
            </button>
          ))}
        </div>
      </div>
      <div style={{padding:"16px 18px 20px"}}>
        <div style={{background:"rgba(139,92,246,0.15)",border:"1px solid rgba(139,92,246,0.35)",borderRadius:14,padding:12,marginBottom:16,display:"flex",gap:10}}>
          <span style={{fontSize:16}}>🔮</span>
          <div style={{fontSize:11,color:"#C4B5FD",lineHeight:1.5,fontWeight:600}}>
            AI Prediction: High probability based on budget, past trends & projects
          </div>
        </div>
        <div style={{fontSize:11,color:C.muted,fontWeight:700,marginBottom:12}}>
          <span style={{color:"#F472B6"}}>{filtered.length}</span> upcoming projects
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {filtered.map(f=>(
            <div key={f.id} style={{background:C.card,border:"1px solid rgba(219,39,119,0.3)",borderRadius:16,padding:14}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                <span style={{fontSize:9,fontWeight:900,letterSpacing:0.8,padding:"3px 8px",borderRadius:6,background:"rgba(219,39,119,0.15)",color:"#F472B6",border:"1px solid rgba(219,39,119,0.3)"}}>FORECAST</span>
                <span style={{padding:"3px 9px",borderRadius:12,background:"rgba(139,92,246,0.15)",border:"1px solid rgba(139,92,246,0.4)",fontSize:10,fontWeight:900,color:"#C4B5FD"}}>🔮 AI Predict</span>
              </div>
              <div style={{fontSize:13.5,fontWeight:800,color:"#fff",lineHeight:1.35,marginBottom:6}}>{f.title}</div>
              <div style={{fontSize:10.5,color:C.sub,marginBottom:10}}>🏛️ {f.dept} • {f.category}</div>
              <div style={{display:"flex",justifyContent:"space-between",paddingTop:10,borderTop:"1px solid rgba(99,102,241,0.15)"}}>
                <div>
                  <div style={{fontSize:9,color:C.muted,fontWeight:800,textTransform:"uppercase",letterSpacing:0.6}}>Est. Value</div>
                  <div style={{fontSize:12.5,fontWeight:900,color:"#60A5FA",marginTop:2}}>{f.value}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:9,color:C.muted,fontWeight:800,textTransform:"uppercase",letterSpacing:0.6}}>Timeline</div>
                  <div style={{fontSize:12,fontWeight:900,color:"#F472B6",marginTop:2}}>{f.timeline}</div>
                </div>
              </div>
              <button style={{width:"100%",marginTop:12,padding:"9px",borderRadius:10,background:"rgba(219,39,119,0.15)",border:"1px solid rgba(219,39,119,0.35)",color:"#F472B6",fontSize:11,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>
                View Details →
              </button>
            </div>
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
