"use client";
import Link from "next/link";
const C = { bg: "#060B28", card: "#0E1533", text: "#fff", sub: "#94A3B8", muted: "#64748B" };
const LINK: React.CSSProperties = { textDecoration: "none", color: "#fff" };
export default function PaymentsPage() {
  const invoices = [
    { id:1, no:"INV-1042", title:"AIIMS Security Sep 2026", amount:"₹16,40,000", status:"Pending", due:"30 Oct 2026", days:5 },
    { id:2, no:"INV-1041", title:"Railway Housekeeping Sep", amount:"₹6,20,000", status:"Submitted", due:"25 Oct 2026", days:2 },
    { id:3, no:"INV-1040", title:"PWD Facility Mgmt Q3", amount:"₹8,75,000", status:"Paid", due:"15 Sep 2026", days:-30 },
    { id:4, no:"INV-1039", title:"DMRC Security Advance", amount:"₹7,60,000", status:"Paid", due:"01 Sep 2026", days:-45 },
  ];
  const statusColor = (s:string) => s==="Paid"?"#10B981":s==="Submitted"?"#3B82F6":s==="Pending"?"#F59E0B":"#EF4444";
  const total = "₹1,92,50,000";
  const received = "₹80,00,000";
  const pending = "₹1,12,50,000";
  const overdue = "₹35,10,000";
  return (
    <div style={{background:C.bg,minHeight:"100vh",paddingBottom:100,color:C.text,fontFamily:"system-ui,-apple-system,sans-serif"}}>
      <div style={{background:"linear-gradient(135deg,#059669 0%,#10B981 100%)",padding:"18px 18px 24px",borderBottomLeftRadius:28,borderBottomRightRadius:28,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-40,right:-40,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,0.2)",filter:"blur(50px)"}} />
        <div style={{position:"relative"}}>
          <Link href="/dashboard" style={{...LINK,fontSize:11,fontWeight:800,color:"rgba(255,255,255,0.85)",letterSpacing:1}}>← DASHBOARD</Link>
          <div style={{display:"flex",alignItems:"center",gap:10,marginTop:12,marginBottom:16}}>
            <div style={{width:48,height:48,borderRadius:14,background:"rgba(255,255,255,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>💰</div>
            <div>
              <h1 style={{fontSize:22,fontWeight:900,margin:0,lineHeight:1.1}}>Payments</h1>
              <p style={{fontSize:11.5,color:"rgba(255,255,255,0.85)",margin:"4px 0 0",fontWeight:600}}>Receivables & Invoices</p>
            </div>
          </div>
          <div style={{background:"rgba(255,255,255,0.15)",backdropFilter:"blur(10px)",borderRadius:14,padding:14}}>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.85)",fontWeight:800,textTransform:"uppercase",letterSpacing:1}}>Total Receivable</div>
            <div style={{fontSize:26,fontWeight:900,color:"#fff",marginTop:4}}>{total}</div>
          </div>
        </div>
      </div>
      <div style={{padding:"16px 18px 0"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
          <div style={{background:C.card,border:"1px solid rgba(99,102,241,0.2)",borderRadius:14,padding:12,textAlign:"center"}}>
            <div style={{fontSize:9,color:C.muted,fontWeight:900,textTransform:"uppercase",letterSpacing:0.6}}>Received</div>
            <div style={{fontSize:14,fontWeight:900,color:"#10B981",marginTop:4}}>{received}</div>
          </div>
          <div style={{background:C.card,border:"1px solid rgba(99,102,241,0.2)",borderRadius:14,padding:12,textAlign:"center"}}>
            <div style={{fontSize:9,color:C.muted,fontWeight:900,textTransform:"uppercase",letterSpacing:0.6}}>Pending</div>
            <div style={{fontSize:14,fontWeight:900,color:"#F59E0B",marginTop:4}}>{pending}</div>
          </div>
          <div style={{background:C.card,border:"1px solid rgba(99,102,241,0.2)",borderRadius:14,padding:12,textAlign:"center"}}>
            <div style={{fontSize:9,color:C.muted,fontWeight:900,textTransform:"uppercase",letterSpacing:0.6}}>Overdue</div>
            <div style={{fontSize:14,fontWeight:900,color:"#EF4444",marginTop:4}}>{overdue}</div>
          </div>
        </div>
      </div>
      <div style={{padding:"16px 18px 20px"}}>
        <div style={{fontSize:10,fontWeight:900,letterSpacing:1.2,color:C.muted,textTransform:"uppercase",marginBottom:10}}>Recent Invoices</div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {invoices.map(inv=>(
            <div key={inv.id} style={{background:C.card,border:"1px solid rgba(99,102,241,0.2)",borderRadius:16,padding:14}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <span style={{fontSize:10,fontWeight:800,color:"#A5B4FC"}}>{inv.no}</span>
                <span style={{padding:"3px 9px",borderRadius:8,fontSize:9.5,fontWeight:900,background:`${statusColor(inv.status)}22`,color:statusColor(inv.status),border:`1px solid ${statusColor(inv.status)}40`}}>{inv.status.toUpperCase()}</span>
              </div>
              <div style={{fontSize:13,fontWeight:800,color:"#fff",marginBottom:8}}>{inv.title}</div>
              <div style={{display:"flex",justifyContent:"space-between",paddingTop:10,borderTop:"1px solid rgba(99,102,241,0.15)"}}>
                <div>
                  <div style={{fontSize:9,color:C.muted,fontWeight:800,textTransform:"uppercase"}}>Amount</div>
                  <div style={{fontSize:13,fontWeight:900,color:"#10B981",marginTop:2}}>{inv.amount}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:9,color:C.muted,fontWeight:800,textTransform:"uppercase"}}>Due</div>
                  <div style={{fontSize:11,fontWeight:800,color:inv.days>0?"#F59E0B":"#10B981",marginTop:2}}>{inv.due}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:30,background:"rgba(10,14,39,0.98)",backdropFilter:"blur(12px)",borderTop:"1px solid rgba(99,102,241,0.18)",display:"flex",alignItems:"center",justifyContent:"space-around",padding:"10px 0 14px"}}>
        {[{icon:"🏠",l:"Home",href:"/dashboard"},{icon:"📄",l:"Tenders",href:"/tenders"},{icon:"🧠",l:"Brain",href:"/brain",center:true},{icon:"✍️",l:"Bids",href:"/bids"},{icon:"💰",l:"Payments",href:"/payments",on:true}].map(n=>(
          <Link key={n.l} href={n.href} style={{...LINK,display:"flex",flexDirection:"column",alignItems:"center",position:"relative",marginTop:n.center?-28:0,minWidth:55}}>
            {n.center?(<div style={{width:60,height:60,borderRadius:"50%",background:"linear-gradient(135deg,#6366F1 0%,#A855F7 100%)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,boxShadow:"0 10px 30px rgba(139,92,246,0.55)",border:`4px solid ${C.bg}`}}>🧠</div>):(<span style={{fontSize:22,opacity:n.on?1:0.55}}>{n.icon}</span>)}
            <span style={{fontSize:10,fontWeight:900,color:n.on?"#818CF8":C.muted,marginTop:n.center?4:5}}>{n.l}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
