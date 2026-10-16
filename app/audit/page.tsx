"use client";
import Link from "next/link";
const C={bg:"#060B28",card:"#0E1533",text:"#fff",sub:"#94A3B8",muted:"#64748B"};
const LINK:React.CSSProperties={textDecoration:"none",color:"#fff"};
export default function AuditPage(){
  const logs=[
    {id:1,action:"Bid Submitted",detail:"AIIMS Delhi Security",time:"2 hours ago",icon:"✍️",color:"#3B82F6"},
    {id:2,action:"Document Uploaded",detail:"ISO 9001:2015",time:"5 hours ago",icon:"📄",color:"#10B981"},
    {id:3,action:"Contract Signed",detail:"DMRC Security ₹4.8 Cr",time:"1 day ago",icon:"📝",color:"#A855F7"},
    {id:4,action:"Login",detail:"From Chrome, Indore",time:"2 days ago",icon:"🔐",color:"#F59E0B"},
    {id:5,action:"Profile Updated",detail:"Added GST number",time:"3 days ago",icon:"⚙️",color:"#6366F1"},
    {id:6,action:"Password Changed",detail:"Security update",time:"5 days ago",icon:"🔑",color:"#EC4899"},
  ];
  return(
    <div style={{background:C.bg,minHeight:"100vh",paddingBottom:100,color:C.text,fontFamily:"system-ui,-apple-system,sans-serif"}}>
      <div style={{position:"sticky",top:0,zIndex:20,background:"rgba(6,11,40,0.96)",backdropFilter:"blur(12px)",borderBottom:"1px solid rgba(99,102,241,0.15)",padding:"14px 18px 12px"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <Link href="/profile" style={{...LINK,fontSize:20}}>←</Link>
          <div style={{flex:1}}>
            <div style={{fontSize:17,fontWeight:900}}>Audit Log</div>
            <div style={{fontSize:10,color:C.muted,marginTop:3}}>Activity history</div>
          </div>
          <span style={{fontSize:22}}>🛡️</span>
        </div>
      </div>
      <div style={{padding:"16px 18px"}}>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {logs.map(l=>(
            <div key={l.id} style={{background:C.card,border:"1px solid rgba(99,102,241,0.2)",borderRadius:14,padding:14,display:"flex",gap:12}}>
              <div style={{width:40,height:40,borderRadius:12,background:`${l.color}22`,border:`1px solid ${l.color}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{l.icon}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:800,color:"#fff",marginBottom:3}}>{l.action}</div>
                <div style={{fontSize:11,color:C.sub,marginBottom:5}}>{l.detail}</div>
                <div style={{fontSize:9.5,color:C.muted,fontWeight:600}}>{l.time}</div>
              </div>
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
