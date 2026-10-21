"use client";
import Link from "next/link";
const C={bg:"#060B28",card:"#0E1533",text:"#fff",sub:"#94A3B8",muted:"#64748B"};
const LINK:React.CSSProperties={textDecoration:"none",color:"#fff"};
export default function RefundPage(){
  return(
    <div style={{background:C.bg,minHeight:"100vh",paddingBottom:100,color:C.text,fontFamily:"system-ui,-apple-system,sans-serif"}}>
      <div style={{position:"sticky",top:0,zIndex:20,background:"rgba(6,11,40,0.96)",backdropFilter:"blur(12px)",borderBottom:"1px solid rgba(99,102,241,0.15)",padding:"14px 18px 12px"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <Link href="/profile" style={{...LINK,fontSize:20}}>←</Link>
          <div style={{fontSize:17,fontWeight:900}}>Refund</div>
        </div>
      </div>
      <div style={{padding:"20px 18px"}}>
        <div style={{background:C.card,border:"1px solid rgba(99,102,241,0.2)",borderRadius:16,padding:18}}>
          <div style={{fontSize:13,color:C.sub,lineHeight:1.7}}>
            <p style={{margin:"0 0 12px"}}><strong style={{color:"#fff"}}>Last Updated:</strong> 16 Oct 2026</p>
            <p style={{margin:"0 0 12px"}}>BidWell is committed to protecting your privacy and providing transparent services. This document outlines our policies regarding data collection, usage, and user rights.</p>
            <p style={{margin:"0 0 12px"}}><strong style={{color:"#fff"}}>1. Data Collection</strong><br/>We collect only essential information required for providing tender intelligence services.</p>
            <p style={{margin:"0 0 12px"}}><strong style={{color:"#fff"}}>2. Data Usage</strong><br/>Your data is used solely to improve our service. We do not sell personal information to third parties.</p>
            <p style={{margin:"0 0 12px"}}><strong style={{color:"#fff"}}>3. Security</strong><br/>All data is encrypted at rest and in transit. We use industry-standard security practices.</p>
            <p style={{margin:"0 0 12px"}}><strong style={{color:"#fff"}}>4. Contact</strong><br/>For questions: legal@bidwell.app</p>
          </div>
        </div>
      </div>
    </div>
  );
}
