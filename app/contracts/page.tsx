"use client";
import Link from "next/link";
const C = { bg: "#060B28", card: "#0E1533", text: "#fff", sub: "#94A3B8", muted: "#64748B" };
const LINK: React.CSSProperties = { textDecoration: "none", color: "#fff" };
export default function ContractsPage() {
  const contracts = [
    { id:1, title:"Security Services — AIIMS Delhi", value:"₹2.8 Cr", status:"Active", progress:65, start:"01 Jul 2026", end:"30 Jun 2027", client:"AIIMS Delhi", color:"#10B981" },
    { id:2, title:"Housekeeping — Railway Board", value:"₹1.2 Cr", status:"Active", progress:40, start:"15 Aug 2026", end:"14 Aug 2027", client:"Railway Board", color:"#10B981" },
    { id:3, title:"Security — Delhi Metro", value:"₹4.8 Cr", status:"Awarded", progress:5, start:"01 Nov 2026", end:"31 Oct 2027", client:"DMRC", color:"#3B82F6" },
    { id:4, title:"Facility Mgmt — PWD", value:"₹2.5 Cr", status:"Completed", progress:100, start:"01 Jan 2025", end:"31 Dec 2025", client:"PWD UP", color:"#A855F7" },
  ];
  const stats = { total: contracts.length, active: contracts.filter(c=>c.status==="Active").length, value: "₹11.3 Cr", completed: 1 };
  return (
    <div style={{background:C.bg,minHeight:"100vh",paddingBottom:100,color:C.text,fontFamily:"system-ui,-apple-system,sans-serif"}}>
      <div style={{position:"sticky",top:0,zIndex:20,background:"rgba(6,11,40,0.96)",backdropFilter:"blur(12px)",borderBottom:"1px solid rgba(99,102,241,0.15)",padding:"14px 18px 12px"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <Link href="/dashboard" style={{...LINK,fontSize:20,opacity:0.9}}>←</Link>
          <div style={{flex:1}}>
            <div style={{fontSize:17,fontWeight:900,lineHeight:1.1}}>Contracts</div>
            <div style={{fontSize:10,color:C.muted,marginTop:3}}>{stats.total} contracts • {stats.active} active</div>
          </div>
        </div>
      </div>
      <div style={{padding:"16px 18px 0"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
          <div style={{background:C.card,border:"1px solid rgba(99,102,241,0.2)",borderRadius:14,padding:12,textAlign:"center"}}>
            <div style={{fontSize:9,color:C.muted,fontWeight:900,textTransform:"uppercase",letterSpacing:0.6}}>Active</div>
            <div style={{fontSize:20,fontWeight:900,color:"#10B981",marginTop:4}}>{stats.active}</div>
          </div>
          <div style={{background:C.card,border:"1px solid rgba(99,102,241,0.2)",borderRadius:14,padding:12,textAlign:"center"}}>
            <div style={{fontSize:9,color:C.muted,fontWeight:900,textTransform:"uppercase",letterSpacing:0.6}}>Completed</div>
            <div style={{fontSize:20,fontWeight:900,color:"#A855F7",marginTop:4}}>{stats.completed}</div>
          </div>
          <div style={{background:C.card,border:"1px solid rgba(99,102,241,0.2)",borderRadius:14,padding:12,textAlign:"center"}}>
            <div style={{fontSize:9,color:C.muted,fontWeight:900,textTransform:"uppercase",letterSpacing:0.6}}>Total Value</div>
            <div style={{fontSize:13,fontWeight:900,color:"#60A5FA",marginTop:6}}>{stats.value}</div>
          </div>
        </div>
      </div>
      <div style={{padding:"16px 18px 20px"}}>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {contracts.map(c=>(
            <Link key={c.id} href="/contracts" style={{...LINK,display:"block"}}>
              <div style={{background:C.card,border:"1px solid rgba(99,102,241,0.2)",borderRadius:16,padding:14}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                  <span style={{padding:"3px 9px",borderRadius:8,fontSize:9.5,fontWeight:900,background:`${c.color}22`,color:c.color,border:`1px solid ${c.color}40`}}>{c.status.toUpperCase()}</span>
                  <span style={{fontSize:12,fontWeight:900,color:"#60A5FA"}}>{c.value}</span>
                </div>
                <div style={{fontSize:13.5,fontWeight:800,color:"#fff",lineHeight:1.35,marginBottom:6}}>{c.title}</div>
                <div style={{fontSize:10.5,color:C.sub,marginBottom:10}}>🏛️ {c.client}</div>
                <div style={{marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:9,color:C.muted,fontWeight:800,textTransform:"uppercase"}}>Progress</span>
                    <span style={{fontSize:10,fontWeight:900,color:c.color}}>{c.progress}%</span>
                  </div>
                  <div style={{height:5,background:"rgba(99,102,241,0.15)",borderRadius:3,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${c.progress}%`,background:c.color,borderRadius:3}} />
                  </div>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",paddingTop:10,borderTop:"1px solid rgba(99,102,241,0.15)"}}>
                  <div>
                    <div style={{fontSize:9,color:C.muted,fontWeight:800,textTransform:"uppercase"}}>Start</div>
                    <div style={{fontSize:11,fontWeight:700,color:"#E2E8F0",marginTop:2}}>{c.start}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:9,color:C.muted,fontWeight:800,textTransform:"uppercase"}}>End</div>
                    <div style={{fontSize:11,fontWeight:700,color:"#E2E8F0",marginTop:2}}>{c.end}</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:30,background:"rgba(10,14,39,0.98)",backdropFilter:"blur(12px)",borderTop:"1px solid rgba(99,102,241,0.18)",display:"flex",alignItems:"center",justifyContent:"space-around",padding:"10px 0 14px"}}>
        {[{icon:"🏠",l:"Home",href:"/dashboard"},{icon:"📄",l:"Tenders",href:"/tenders"},{icon:"🧠",l:"Brain",href:"/brain",center:true},{icon:"✍️",l:"Bids",href:"/bids"},{icon:"📁",l:"Contracts",href:"/contracts",on:true}].map(n=>(
          <Link key={n.l} href={n.href} style={{...LINK,display:"flex",flexDirection:"column",alignItems:"center",position:"relative",marginTop:n.center?-28:0,minWidth:55}}>
            {n.center?(<div style={{width:60,height:60,borderRadius:"50%",background:"linear-gradient(135deg,#6366F1 0%,#A855F7 100%)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,boxShadow:"0 10px 30px rgba(139,92,246,0.55)",border:`4px solid ${C.bg}`}}>🧠</div>):(<span style={{fontSize:22,opacity:n.on?1:0.55}}>{n.icon}</span>)}
            <span style={{fontSize:10,fontWeight:900,color:n.on?"#818CF8":C.muted,marginTop:n.center?4:5}}>{n.l}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
