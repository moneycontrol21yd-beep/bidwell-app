"use client";
import Link from "next/link";
import { useState } from "react";
const C={bg:"#060B28",card:"#0E1533",text:"#fff",sub:"#94A3B8",muted:"#64748B"};
const LINK:React.CSSProperties={textDecoration:"none",color:"#fff"};
export default function DeleteAccountPage(){
  const [confirm,setConfirm]=useState("");
  const [show,setShow]=useState(false);
  const canDelete=confirm==="DELETE";
  return(
    <div style={{background:C.bg,minHeight:"100vh",color:C.text,fontFamily:"system-ui,-apple-system,sans-serif"}}>
      <div style={{background:"linear-gradient(135deg,#DC2626 0%,#EF4444 100%)",padding:"18px 18px 24px",borderBottomLeftRadius:28,borderBottomRightRadius:28}}>
        <Link href="/settings" style={{...LINK,fontSize:11,fontWeight:800,color:"rgba(255,255,255,0.85)",letterSpacing:1}}>← SETTINGS</Link>
        <div style={{display:"flex",alignItems:"center",gap:10,marginTop:12}}>
          <div style={{width:48,height:48,borderRadius:14,background:"rgba(255,255,255,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>🗑️</div>
          <div><h1 style={{fontSize:22,fontWeight:900,margin:0}}>Delete Account</h1><p style={{fontSize:11.5,color:"rgba(255,255,255,0.85)",margin:"4px 0 0",fontWeight:600}}>This action cannot be undone</p></div>
        </div>
      </div>
      <div style={{padding:"20px 18px"}}>
        <div style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.35)",borderRadius:16,padding:16,marginBottom:16}}>
          <div style={{fontSize:14,fontWeight:900,color:"#F87171",marginBottom:8}}>⚠️ Warning</div>
          <div style={{fontSize:12,color:"#FCA5A5",lineHeight:1.6}}>
            Deleting your account will permanently remove:
            <ul style={{margin:"8px 0 0 20px",padding:0}}>
              <li>All saved tenders & watchlist</li>
              <li>Your bids and contracts</li>
              <li>Uploaded documents</li>
              <li>Company profile & brain data</li>
            </ul>
          </div>
        </div>
        <div style={{background:C.card,border:"1px solid rgba(99,102,241,0.2)",borderRadius:16,padding:16}}>
          <div style={{fontSize:10,fontWeight:900,letterSpacing:1,color:C.muted,textTransform:"uppercase",marginBottom:8}}>Type DELETE to confirm</div>
          <input value={confirm} onChange={(e)=>setConfirm(e.target.value)} placeholder="DELETE" style={{width:"100%",padding:"13px 14px",borderRadius:12,background:"rgba(10,14,39,0.7)",border:"1px solid rgba(239,68,68,0.4)",color:"#fff",fontSize:14,fontWeight:700,fontFamily:"inherit",outline:"none",boxSizing:"border-box",textAlign:"center",letterSpacing:2}} />
          <button onClick={()=>setShow(true)} disabled={!canDelete}
            style={{width:"100%",marginTop:14,padding:14,borderRadius:12,background:canDelete?"linear-gradient(135deg,#DC2626,#EF4444)":"rgba(100,116,139,0.3)",border:"none",color:"#fff",fontSize:13,fontWeight:900,cursor:canDelete?"pointer":"not-allowed",fontFamily:"inherit"}}>
            Permanently Delete Account
          </button>
        </div>
      </div>
      {show&&(
        <div onClick={()=>setShow(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",backdropFilter:"blur(8px)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div onClick={(e)=>e.stopPropagation()} style={{width:"100%",maxWidth:340,background:C.card,borderRadius:20,padding:24,textAlign:"center",border:"1px solid rgba(239,68,68,0.3)"}}>
            <div style={{fontSize:44,marginBottom:8}}>🚨</div>
            <div style={{fontSize:16,fontWeight:900,marginBottom:8}}>Final Confirmation</div>
            <div style={{fontSize:12,color:C.sub,marginBottom:20,lineHeight:1.5}}>Are you sure you want to delete your account? This cannot be undone.</div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setShow(false)} style={{flex:1,padding:12,borderRadius:12,background:"rgba(148,163,184,0.15)",border:"1px solid rgba(148,163,184,0.3)",color:"#fff",fontSize:12,fontWeight:900,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
              <button style={{flex:1,padding:12,borderRadius:12,background:"linear-gradient(135deg,#DC2626,#EF4444)",border:"none",color:"#fff",fontSize:12,fontWeight:900,cursor:"pointer",fontFamily:"inherit"}}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
