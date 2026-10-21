"use client";
import Link from "next/link";
const C={bg:"#060B28",card:"#0E1533",text:"#fff",sub:"#94A3B8",muted:"#64748B"};
const LINK:React.CSSProperties={textDecoration:"none",color:"#fff"};
export default function SubscriptionPage(){
  const plans=[
    {id:"free",name:"Free",price:"₹0",per:"FOREVER",color:"#64748B",features:["10 AI Analyses / month","50 Saved Tenders","Basic Search","Email Notifications"],current:true},
    {id:"starter",name:"Starter",price:"₹499",per:"/MONTH",color:"#3B82F6",features:["50 AI Analyses","500 Saved","WhatsApp Alerts","Competitor Info","Deadline Reminders"],popular:false},
    {id:"pro",name:"Professional",price:"₹1,499",per:"/MONTH",color:"#A855F7",features:["Unlimited AI","Unlimited Saved","API Access","3 Team Members","Contract Tracking"],popular:true},
    {id:"business",name:"Business",price:"₹4,999",per:"/MONTH",color:"#10B981",features:["5 Companies","API 100K calls","10 Team Members","Custom Reports","Priority Support"]},
  ];
  return(
    <div style={{background:C.bg,minHeight:"100vh",paddingBottom:100,color:C.text,fontFamily:"system-ui,-apple-system,sans-serif"}}>
      <div style={{background:"linear-gradient(135deg,#DB2777 0%,#EC4899 100%)",padding:"18px 18px 24px",borderBottomLeftRadius:28,borderBottomRightRadius:28}}>
        <Link href="/profile" style={{...LINK,fontSize:11,fontWeight:800,color:"rgba(255,255,255,0.85)",letterSpacing:1}}>← PROFILE</Link>
        <div style={{display:"flex",alignItems:"center",gap:10,marginTop:12}}>
          <div style={{width:48,height:48,borderRadius:14,background:"rgba(255,255,255,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>💳</div>
          <div><h1 style={{fontSize:24,fontWeight:900,margin:0}}>Subscription</h1><p style={{fontSize:12,color:"rgba(255,255,255,0.85)",margin:"4px 0 0",fontWeight:600}}>Upgrade to unlock more</p></div>
        </div>
      </div>
      <div style={{padding:"16px 18px 20px",display:"flex",flexDirection:"column",gap:12}}>
        {plans.map(p=>(
          <div key={p.id} style={{background:C.card,border:`2px solid ${p.current?p.color:p.popular?p.color:"rgba(99,102,241,0.2)"}`,borderRadius:18,padding:18,position:"relative"}}>
            {p.popular&&(<div style={{position:"absolute",top:-12,left:"50%",transform:"translateX(-50%)",background:"linear-gradient(135deg,#6366F1,#A855F7)",color:"#fff",fontSize:9,fontWeight:900,letterSpacing:1,padding:"4px 12px",borderRadius:10}}>MOST POPULAR</div>)}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div style={{fontSize:18,fontWeight:900,color:p.color}}>{p.name}</div>
              <div style={{textAlign:"right"}}><span style={{fontSize:24,fontWeight:900,color:"#fff"}}>{p.price}</span><div style={{fontSize:9,color:C.muted,fontWeight:700}}>{p.per}</div></div>
            </div>
            <div style={{borderTop:"1px solid rgba(99,102,241,0.15)",paddingTop:12,marginBottom:14}}>
              {p.features.map((f,i)=>(
                <div key={i} style={{display:"flex",gap:8,fontSize:12,color:"#E2E8F0",padding:"6px 0"}}>
                  <span style={{color:p.color}}>✓</span>{f}
                </div>
              ))}
            </div>
            <button style={{width:"100%",padding:12,borderRadius:12,background:p.current?"rgba(100,116,139,0.2)":`linear-gradient(135deg,${p.color},${p.color}dd)`,border:"none",color:"#fff",fontSize:12,fontWeight:900,cursor:"pointer",fontFamily:"inherit",opacity:p.current?0.7:1}}>
              {p.current?"CURRENT PLAN":`Upgrade to ${p.name}`}
            </button>
          </div>
        ))}
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
