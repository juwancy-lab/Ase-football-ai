"use client";
import { useState } from "react";

const LEAGUES = [
  "Premier League","La Liga","Serie A","Bundesliga","Ligue 1",
  "Eredivisie","Primeira Liga","Championship","MLS","Saudi Pro League",
  "Nigerian NPFL","Champions League","Europa League","Liga MX",
  "Brazilian Serie A","Argentine Primera","Scottish Premiership",
  "Turkish Super Lig","J-League","K-League"
];

const CATEGORIES = [
  {id:"multigoals",label:"🎯 Multigoals (Featured)"},
  {id:"main",label:"⚽ Main (1X2, Double Chance, Handicap)"},
  {id:"goals",label:"🥅 Goals (Over/Under, BTTS, Clean Sheet)"},
  {id:"half",label:"⏱ Half (1st / 2nd Half)"},
  {id:"bookings",label:"🟨 Bookings (Cards)"},
  {id:"corners",label:"🚩 Corners"},
  {id:"combo",label:"🔗 Combo (Combined Markets)"},
  {id:"teams",label:"📊 Teams (Shots, Fouls)"},
  {id:"match",label:"🏟 Match (Specials)"},
];

function Badge({confidence}){
  const [bg,color,text]=confidence>=80?["#22c55e22","#22c55e","STRONG"]:confidence>=65?["#eab30822","#eab308","GOOD"]:confidence>=50?["#f9731622","#f97316","FAIR"]:["#ef444422","#ef4444","RISKY"];
  return <span style={{fontSize:9,fontWeight:700,color,background:bg,padding:"2px 6px",borderRadius:4,letterSpacing:1}}>{text}</span>;
}

function PredCard({p,showRank}){
  const barColor=p.confidence>=80?"#22c55e":p.confidence>=65?"#eab308":p.confidence>=50?"#f97316":"#ef4444";
  const [open,setOpen]=useState(false);
  return(
    <div style={{background:showRank?"#0a1628":"#0d1520",border:`1px solid ${showRank?"#1a3a5c":"#192838"}`,borderRadius:10,marginBottom:8,borderLeft:`3px solid ${barColor}`,overflow:"hidden"}}>
      <div onClick={()=>setOpen(!open)} style={{padding:14,cursor:"pointer"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div style={{flex:1,paddingRight:10}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
              {showRank&&p.rank&&<div style={{width:22,height:22,borderRadius:6,background:p.rank===1?"#22c55e":p.rank===2?"#eab308":p.rank===3?"#f97316":"#506878",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"#080e16",flexShrink:0}}>{p.rank}</div>}
              <div><div style={{fontSize:10,color:"#607890",textTransform:"uppercase",letterSpacing:0.5}}>{p.market} {p.category&&<span style={{color:"#0ea5e9"}}>• {p.category}</span>}</div></div>
            </div>
            <div style={{fontSize:16,fontWeight:700,color:"#e4edf5"}}>{p.pick}</div>
          </div>
          <div style={{textAlign:"right",flexShrink:0}}>
            <div style={{fontSize:22,fontWeight:800,color:barColor,fontFamily:"monospace",lineHeight:1}}>{p.confidence}%</div>
            <div style={{marginTop:4}}><Badge confidence={p.confidence}/></div>
          </div>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8}}>
          {p.odds_hint&&<div style={{fontSize:12,fontWeight:700,color:"#22c55e",background:"#22c55e10",padding:"3px 10px",borderRadius:5,fontFamily:"monospace"}}>{p.odds_hint}</div>}
          <div style={{fontSize:10,color:"#506878"}}>{open?"▲ Hide reasoning":"▼ View reasoning"}</div>
        </div>
      </div>
      {open&&(
        <div style={{padding:"0 14px 14px",borderTop:"1px solid #192838"}}>
          <div style={{paddingTop:12}}>
            <div style={{fontSize:11,fontWeight:600,color:"#7a9ab0",marginBottom:6,textTransform:"uppercase",letterSpacing:0.5}}>Why this prediction</div>
            <div style={{fontSize:13,color:"#9ab4c8",lineHeight:1.6}}>{p.reasoning}</div>
            {p.key_factors&&p.key_factors.length>0&&(
              <div style={{marginTop:10}}>
                <div style={{fontSize:10,fontWeight:600,color:"#607890",marginBottom:5,textTransform:"uppercase",letterSpacing:0.5}}>Key factors</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                  {p.key_factors.map((f,i)=><span key={i} style={{fontSize:10,padding:"3px 8px",borderRadius:4,background:"#0a1a2e",border:"1px solid #1a3a5c",color:"#7a9ab0"}}>{f}</span>)}
                </div>
              </div>
            )}
            <div style={{marginTop:10}}>
              <div style={{fontSize:10,color:"#607890",marginBottom:4}}>Confidence</div>
              <div style={{height:6,background:"#192838",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${p.confidence}%`,background:barColor,borderRadius:3}}/></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Spinner({text,sub}){
  return(
    <div style={{textAlign:"center",padding:"30px 0"}}>
      <div style={{display:"inline-block",width:30,height:30,border:"3px solid #192838",borderTopColor:"#22c55e",borderRadius:"50%",animation:"sp .8s linear infinite"}}/>
      <style>{`@keyframes sp{to{transform:rotate(360deg)}}`}</style>
      <div style={{fontSize:13,color:"#7a9ab0",marginTop:10}}>{text}</div>
      {sub&&<div style={{fontSize:10,color:"#506878",marginTop:3}}>{sub}</div>}
