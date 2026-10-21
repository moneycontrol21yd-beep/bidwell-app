"use client";
import Link from "next/link";
const C={bg:"#060B28",card:"#0E1533",text:"#fff",sub:"#94A3B8",muted:"#64748B"};
const LINK:React.CSSProperties={textDecoration:"none",color:"#fff"};
export default function HelpPage(){
  const faqs=[
    {q:"How do I search for tenders?",a:"Use the search bar on Tenders page. Filter by category, state, and value."},
    {q:"Is BidWell free?",a:"Yes! Core features are free forever. Premium features available in paid plans."},
    {q:"How do I save a tender?",a:"Tap the star icon on any tender card to save it to your Watchlist."},
    {q:"What is Brain Analysis?",a:"AI-powered market intelligence from 25+ lakh tenders with competitor & price insights."},
    {q:"How do I upload documents?",a:"Go to Document Vault, tap +, choose Camera/PDF/Gallery."},
    {q:"How to contact support?",a:"Email support@bidwell.app or use in-app chat."},
  ];
  return(
    <div style={{background:C.bg,minHeight:"100vh",paddingBottom:100,color:C.text,fontFamily:"system-ui,-apple-system,sans-serif"}}>
      <div style={{background:"linear-gradient(135deg,#7C3AED 0%,#A855F7 100%)",padding:"18px 18px 24px",borderBottomLeftRadius:28,borderBottomRightRadius:28}}>
        <Link href="/profile" style={{...LINK,fontSize:11,fontWeight:800,color:"rgba(255,255,255,0.85)",letterSpacing:1}}>← PROFILE</Link>
        <div style={{display:"flex",alignItems:"center",gap:10,marginTop:12}}>
          <div style={{width:48,height:48,borderRadius:14,background:"rgba(255,255,255,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>❓</div>
          <div><h1 style={{fontSize:24,fontWeight:900,margin:0}}>Help & Support</h1><p style={{fontSize:12,color:"rgba(255,255,255,0.85)",margin:"4px 0 0",fontWeight:600}}>We're here to help</p></div>
        </div>
      </div>
      <div style={{padding:"16px 18px 0"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
          {[{i:"💬",l:"Live Chat",h:"/assistant"},{i:"📧",l:"Email Us",h:"#"},{i:"🎥",l:"Video Tutorials",h:"#"},{i:"📞",l:"Call Support",h:"#"}].map(x=>(
            <Link key={x.l} href={x.h} style={{...LINK,display:"flex",alignItems:"center",gap:10,padding:14,borderRadius:14,background:C.card,border:"1px solid rgba(99,102,241,0.2)"}}>
              <div style={{fontSize:20}}>{x.i}</div>
              <div style={{fontSize:12,fontWeight:800}}>{x.l}</div>
            </Link>
          ))}
        </div>
        <div style={{fontSize:10,fontWeight:900,letterSpacing:1.2,color:C.muted,textTransform:"uppercase",marginBottom:10}}>Frequently Asked</div>
        <div style={{background:C.card,border:"1px solid rgba(99,102,241,0.2)",borderRadius:16,overflow:"hidden"}}>
          {faqs.map((f,i)=>(
            <details key={i} style={{borderBottom:i<faqs.length-1?"1px solid rgba(99,102,241,0.12)":"none"}}>
              <summary style={{padding:"14px 16px",fontSize:13,fontWeight:800,color:"#fff",cursor:"pointer",listStyle:"none"}}>{f.q}</summary>
              <div style={{padding:"0 16px 14px",fontSize:11.5,color:C.sub,lineHeight:1.5}}>{f.a}</div>
            </details>
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
