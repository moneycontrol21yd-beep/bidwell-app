"use client";
import Link from "next/link";
const C={bg:"#060B28",card:"#0E1533",text:"#fff",sub:"#94A3B8",muted:"#64748B"};
const LINK:React.CSSProperties={textDecoration:"none",color:"#fff"};
export default function WatchPage(){
  const items=[
    {id:1,t:"Security Services - AIIMS Delhi",d:"AIIMS Delhi",v:"₹2.8 Cr",dl:"25 Oct 2026",match:95,watching:true},
    {id:2,t:"Road Construction - NHAI Phase 4",d:"NHAI",v:"₹12.5 Cr",dl:"28 Oct 2026",match:78,watching:true},
    {id:3,t:"Housekeeping - Railway Board",d:"Railway Board",v:"₹1.2 Cr",dl:"30 Oct 2026",match:88,watching:true},
  ];
  return(
    <div style={{background:C.bg,minHeight:"100vh",paddingBottom:100,color:C.text,fontFamily:"system-ui,-apple-system,sans-serif"}}>
      <div style={{position:"sticky",top:0,zIndex:20,background:"rgba(6,11,40,0.96)",backdropFilter:"blur(12px)",borderBottom:"1px solid rgba(99,102,241,0.15)",padding:"14px 18px 12px"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <Link href="/dashboard" style={{...LINK,fontSize:20}}>←</Link>
          <div style={{flex:1}}>
            <div style={{fontSize:17,fontWeight:900}}>Watching</div>
            <div style={{fontSize:10,color:C.muted,marginTop:3}}>{items.length} tenders tracked</div>
          </div>
          <span style={{fontSize:22}}>👁️</span>
        </div>
      </div>
      <div style={{padding:"16px 18px"}}>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {items.map(x=>(
            <Link key={x.id} href="/tenders" style={{...LINK,display:"block"}}>
              <div style={{background:C.card,border:"1px solid rgba(99,102,241,0.2)",borderRadius:16,padding:14}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                  <span style={{padding:"3px 9px",borderRadius:12,background:"rgba(16,185,129,0.15)",color:"#10B981",border:"1px solid rgba(16,185,129,0.4)",fontSize:10,fontWeight:900}}>{x.match}% match</span>
                  <span style={{fontSize:10,color:C.muted,fontWeight:700}}>👁️ Watching</span>
                </div>
                <div style={{fontSize:13.5,fontWeight:800,color:"#fff",lineHeight:1.35,marginBottom:6}}>{x.t}</div>
                <div style={{fontSize:10.5,color:C.sub,marginBottom:8}}>🏛️ {x.d}</div>
                <div style={{display:"flex",justifyContent:"space-between",paddingTop:10,borderTop:"1px solid rgba(99,102,241,0.15)"}}>
                  <div><div style={{fontSize:9,color:C.muted,fontWeight:800,textTransform:"uppercase"}}>Value</div><div style={{fontSize:12,fontWeight:900,color:"#60A5FA",marginTop:2}}>{x.v}</div></div>
                  <div style={{textAlign:"right"}}><div style={{fontSize:9,color:C.muted,fontWeight:800,textTransform:"uppercase"}}>Deadline</div><div style={{fontSize:11,fontWeight:900,color:"#10B981",marginTop:2}}>{x.dl}</div></div>
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
