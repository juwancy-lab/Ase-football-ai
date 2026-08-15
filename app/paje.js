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
  var bg,color,text;
  if(confidence>=80){bg="#22c55e22";color="#22c55e";text="STRONG";}
  else if(confidence>=65){bg="#eab30822";color="#eab308";text="GOOD";}
  else if(confidence>=50){bg="#f9731622";color="#f97316";text="FAIR";}
  else{bg="#ef444422";color="#ef4444";text="RISKY";}
  return <span style={{fontSize:9,fontWeight:700,color:color,background:bg,padding:"2px 6px",borderRadius:4,letterSpacing:1}}>{text}</span>;
}

function PredCard({p,showRank}){
  var barColor=p.confidence>=80?"#22c55e":p.confidence>=65?"#eab308":p.confidence>=50?"#f97316":"#ef4444";
  var openState=useState(false);
  var open=openState[0];
  var setOpen=openState[1];
  return(
    <div style={{background:showRank?"#0a1628":"#0d1520",border:"1px solid "+(showRank?"#1a3a5c":"#192838"),borderRadius:10,marginBottom:8,borderLeft:"3px solid "+barColor,overflow:"hidden"}}>
      <div onClick={function(){setOpen(!open)}} style={{padding:14,cursor:"pointer"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div style={{flex:1,paddingRight:10}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
              {showRank&&p.rank&&<div style={{width:22,height:22,borderRadius:6,background:p.rank===1?"#22c55e":p.rank===2?"#eab308":p.rank===3?"#f97316":"#506878",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"#080e16",flexShrink:0}}>{p.rank}</div>}
              <div><div style={{fontSize:10,color:"#607890",textTransform:"uppercase",letterSpacing:0.5}}>{p.market} {p.category&&<span style={{color:"#0ea5e9"}}>{"• "+p.category}</span>}</div></div>
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
                  {p.key_factors.map(function(f,i){return <span key={i} style={{fontSize:10,padding:"3px 8px",borderRadius:4,background:"#0a1a2e",border:"1px solid #1a3a5c",color:"#7a9ab0"}}>{f}</span>})}
                </div>
              </div>
            )}
            <div style={{marginTop:10}}>
              <div style={{fontSize:10,color:"#607890",marginBottom:4}}>Confidence</div>
              <div style={{height:6,background:"#192838",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:p.confidence+"%",background:barColor,borderRadius:3}}/></div>
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
      <style>{"@keyframes sp{to{transform:rotate(360deg)}}"}</style>
      <div style={{fontSize:13,color:"#7a9ab0",marginTop:10}}>{text}</div>
      {sub&&<div style={{fontSize:10,color:"#506878",marginTop:3}}>{sub}</div>}
    </div>
  );
}

export default function Home(){
  var s=useState;
  var leagueS=s("");var league=leagueS[0];var setLeague=leagueS[1];
  var fixturesS=s(null);var fixtures=fixturesS[0];var setFixtures=fixturesS[1];
  var loadingFixS=s(false);var loadingFix=loadingFixS[0];var setLoadingFix=loadingFixS[1];
  var selectedMatchS=s("");var selectedMatch=selectedMatchS[0];var setSelectedMatch=selectedMatchS[1];
  var showManualS=s(false);var showManual=showManualS[0];var setShowManual=showManualS[1];
  var manualHomeS=s("");var manualHome=manualHomeS[0];var setManualHome=manualHomeS[1];
  var manualAwayS=s("");var manualAway=manualAwayS[0];var setManualAway=manualAwayS[1];
  var homeS=s("");var home=homeS[0];var setHome=homeS[1];
  var awayS=s("");var away=awayS[0];var setAway=awayS[1];
  var matchReadyS=s(false);var matchReady=matchReadyS[0];var setMatchReady=matchReadyS[1];
  var categoryS=s("");var category=categoryS[0];var setCategory=categoryS[1];
  var loadingS=s(false);var loading=loadingS[0];var setLoading=loadingS[1];
  var stepS=s("");var step=stepS[0];var setStep=stepS[1];
  var catPredsS=s(null);var catPreds=catPredsS[0];var setCatPreds=catPredsS[1];
  var topRanksS=s(null);var topRanks=topRanksS[0];var setTopRanks=topRanksS[1];
  var errS=s("");var err=errS[0];var setErr=errS[1];

  var inputStyle={width:"100%",padding:11,fontSize:14,background:"#0d1520",border:"1px solid #192838",borderRadius:8,color:"#e4edf5",boxSizing:"border-box"};

  function fetchFixtures(lg){
    setLoadingFix(true);setFixtures(null);setSelectedMatch("");setMatchReady(false);
    setCatPreds(null);setTopRanks(null);setCategory("");setErr("");
    fetch("/api/fixtures",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({league:lg})})
    .then(function(r){return r.json()})
    .then(function(data){
      if(data.error)throw new Error(data.error);
      setFixtures(data.fixtures||[]);setLoadingFix(false);
    })
    .catch(function(){setFixtures([]);setErr("Could not load fixtures. Enter manually.");setLoadingFix(false);});
  }

  function handleLeague(val){
    setLeague(val);setMatchReady(false);setCatPreds(null);setTopRanks(null);setCategory("");setShowManual(false);
    if(val)fetchFixtures(val);
  }

  function handleMatchSelect(val){
    setSelectedMatch(val);setCatPreds(null);setTopRanks(null);setCategory("");
    if(val!==""){var m=fixtures[parseInt(val)];setHome(m.home);setAway(m.away);setMatchReady(true);}
    else setMatchReady(false);
  }

  function confirmManual(){
    if(manualHome.trim()&&manualAway.trim()){
      setHome(manualHome.trim());setAway(manualAway.trim());
      setMatchReady(true);setCatPreds(null);setTopRanks(null);setCategory("");
    }
  }

  function predict(cat){
    setCategory(cat);setCatPreds(null);setTopRanks(null);setErr("");setLoading(true);
    var steps=["Searching team form & standings...","Analyzing head-to-head data...","Checking injuries & suspensions...","Running prediction model...","Ranking best picks..."];
    var i=0;setStep(steps[0]);
    var iv=setInterval(function(){i++;if(i<steps.length)setStep(steps[i]);},4500);
    fetch("/api/predict",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({home:home,away:away,league:league,category:cat})})
    .then(function(r){return r.json()})
    .then(function(data){
      clearInterval(iv);
      if(data.error)throw new Error(data.error);
      setCatPreds(data.category_predictions||[]);
      setTopRanks(data.top_5_overall||[]);setStep("");setLoading(false);
    })
    .catch(function(e){clearInterval(iv);setErr("Prediction failed: "+(e.message||"Try again."));setStep("");setLoading(false);});
  }

  function fullReset(){
    setLeague("");setFixtures(null);setSelectedMatch("");setShowManual(false);
    setManualHome("");setManualAway("");setHome("");setAway("");
    setMatchReady(false);setCategory("");setCatPreds(null);setTopRanks(null);setErr("");
  }

  var preds=catPreds||[];

  return(
    <div style={{minHeight:"100vh",background:"#080e16",color:"#e4edf5",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"}}>
      <div style={{background:"#0a1320",borderBottom:"1px solid #192838",padding:"14px 16px"}}>
        <div style={{maxWidth:540,margin:"0 auto",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:34,height:34,borderRadius:8,background:"linear-gradient(135deg,#22c55e,#0ea5e9)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>⚽</div>
          <div>
            <div style={{fontSize:18,fontWeight:800,letterSpacing:-0.3}}>{"Ase "}<span style={{color:"#22c55e"}}>Football AI</span></div>
            <div style={{fontSize:9,color:"#506878",letterSpacing:1.5,textTransform:"uppercase"}}>Smart Match Predictor</div>
          </div>
        </div>
      </div>
      <div style={{maxWidth:540,margin:"0 auto",padding:"16px 14px 80px"}}>
        <div style={{marginBottom:14}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
            <div style={{width:20,height:20,borderRadius:"50%",background:league?"#22c55e":"#192838",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:league?"#080e16":"#506878"}}>1</div>
            <span style={{fontSize:12,fontWeight:600,color:"#7a9ab0"}}>Select League</span>
          </div>
          <select value={league} onChange={function(e){handleLeague(e.target.value)}} style={{width:"100%",padding:11,fontSize:14,background:"#0d1520",border:"1px solid #192838",borderRadius:8,color:"#e4edf5",boxSizing:"border-box",WebkitAppearance:"menulist"}}>
            <option value="">Choose a league...</option>
            {LEAGUES.map(function(l){return <option key={l} value={l}>{l}</option>})}
          </select>
        </div>
        {loadingFix&&<Spinner text="Loading fixtures..." sub="Searching for next matchday"/>}
        {fixtures&&!loadingFix&&(
          <div style={{marginBottom:14}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
              <div style={{width:20,height:20,borderRadius:"50%",background:matchReady?"#22c55e":"#192838",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:matchReady?"#080e16":"#506878"}}>2</div>
              <span style={{fontSize:12,fontWeight:600,color:"#7a9ab0"}}>Select Match</span>
            </div>
            {fixtures.length>0?(
              <select value={selectedMatch} onChange={function(e){handleMatchSelect(e.target.value)}} style={{width:"100%",padding:11,fontSize:14,background:"#0d1520",border:"1px solid #192838",borderRadius:8,color:"#e4edf5",boxSizing:"border-box",WebkitAppearance:"menulist"}}>
                <option value="">Choose a match...</option>
                {fixtures.map(function(m,i){return <option key={i} value={String(i)}>{m.home+" vs "+m.away+" — "+m.date+" "+(m.time||"")}</option>})}
              </select>
            ):(
              <div style={{padding:12,background:"#0d1520",borderRadius:8,border:"1px solid #192838",fontSize:12,color:"#607890"}}>No fixtures found. Enter manually below.</div>
            )}
            <button onClick={function(){setShowManual(!showManual);if(!showManual){setMatchReady(false);setCatPreds(null);setTopRanks(null);setCategory("");}}} style={{marginTop:8,padding:"5px 0",fontSize:11,color:"#607890",background:"none",border:"none",cursor:"pointer",textDecoration:"underline"}}>{showManual?"Hide manual entry":"Match not listed? Enter manually"}</button>
            {showManual&&(
              <div style={{marginTop:8}}>
                <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
                  <div style={{flex:1}}><div style={{fontSize:9,color:"#607890",marginBottom:4,fontWeight:600}}>HOME</div><input value={manualHome} onChange={function(e){setManualHome(e.target.value)}} placeholder="Home team" style={inputStyle}/></div>
                  <div style={{padding:"0 2px 12px",fontSize:10,fontWeight:800,color:"#506878"}}>VS</div>
                  <div style={{flex:1}}><div style={{fontSize:9,color:"#607890",marginBottom:4,fontWeight:600}}>AWAY</div><input value={manualAway} onChange={function(e){setManualAway(e.target.value)}} placeholder="Away team" style={inputStyle}/></div>
                </div>
                {manualHome.trim()&&manualAway.trim()&&(<button onClick={confirmManual} style={{marginTop:8,width:"100%",padding:10,fontSize:13,fontWeight:600,background:"#22c55e20",color:"#22c55e",border:"1px solid #22c55e40",borderRadius:8,cursor:"pointer"}}>{"Confirm: "+manualHome.trim()+" vs "+manualAway.trim()}</button>)}
              </div>
            )}
          </div>
        )}
        {matchReady&&(
          <div style={{background:"#0b1d30",borderRadius:10,padding:14,marginBottom:14,border:"1px solid #1a3a5c"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{textAlign:"center",flex:1}}><div style={{fontSize:16,fontWeight:800}}>{home}</div><div style={{fontSize:9,color:"#506878"}}>HOME</div></div>
              <div style={{padding:"4px 12px",borderRadius:14,background:"#22c55e15",border:"1px solid #22c55e30",fontSize:12,fontWeight:700,color:"#22c55e"}}>VS</div>
              <div style={{textAlign:"center",flex:1}}><div style={{fontSize:16,fontWeight:800}}>{away}</div><div style={{fontSize:9,color:"#506878"}}>AWAY</div></div>
            </div>
            <div style={{textAlign:"center",marginTop:6,fontSize:10,color:"#607890"}}>{league}</div>
          </div>
        )}
        {matchReady&&(
          <div style={{marginBottom:14}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
              <div style={{width:20,height:20,borderRadius:"50%",background:category?"#22c55e":"#192838",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:category?"#080e16":"#506878"}}>3</div>
              <span style={{fontSize:12,fontWeight:600,color:"#7a9ab0"}}>Select Prediction Category</span>
            </div>
            <select value={category} onChange={function(e){if(e.target.value)predict(e.target.value)}} disabled={loading} style={{width:"100%",padding:11,fontSize:14,background:"#0d1520",border:"1px solid #192838",borderRadius:8,color:"#e4edf5",boxSizing:"border-box",WebkitAppearance:"menulist",opacity:loading?0.5:1}}>
              <option value="">Choose a category...</option>
              {CATEGORIES.map(function(c){return <option key={c.id} value={c.id}>{c.label}</option>})}
            </select>
          </div>
        )}
        {err&&(<div style={{padding:10,borderRadius:8,marginBottom:12,background:"#ef444418",border:"1px solid #ef444440",color:"#f87171",fontSize:12}}>{err}<button onClick={function(){setErr("");if(category)predict(category)}} style={{display:"block",marginTop:6,fontSize:11,color:"#f87171",background:"none",border:"1px solid #ef444440",borderRadius:5,padding:"4px 10px",cursor:"pointer"}}>Retry</button></div>)}
        {loading&&<Spinner text={step} sub="Takes 15-30 seconds — researching real match data"/>}
        {preds.length>0&&!loading&&(
          <div>
            <div style={{marginBottom:10}}>
              <div style={{fontSize:14,fontWeight:700}}>{(CATEGORIES.find(function(c){return c.id===category})||{}).label}</div>
              <div style={{fontSize:10,color:"#506878"}}>{preds.length+" predictions • Tap any card for reasoning"}</div>
            </div>
            {preds.slice().sort(function(a,b){return b.confidence-a.confidence}).map(function(p,i){return <PredCard key={"c-"+i} p={p} showRank={false}/>})}
          </div>
        )}
        {topRanks&&topRanks.length>0&&!loading&&(
          <div style={{marginTop:20}}>
            <div style={{background:"linear-gradient(135deg,#0a1628,#0d2040)",borderRadius:10,padding:14,marginBottom:10,border:"1px solid #1a3a5c"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:18}}>🏆</span>
                <div><div style={{fontSize:15,fontWeight:800}}>Top 5 Overall Rankings</div><div style={{fontSize:10,color:"#607890"}}>Best picks across ALL categories</div></div>
              </div>
            </div>
            {topRanks.slice().sort(function(a,b){return(a.rank||99)-(b.rank||99)}).map(function(p,i){return <PredCard key={"t-"+i} p={Object.assign({},p,{rank:p.rank||i+1})} showRank={true}/>})}
          </div>
        )}
        {preds.length>0&&!loading&&<div style={{textAlign:"center",marginTop:14,fontSize:11,color:"#506878"}}>↑ Select another category for more predictions</div>}
        {(preds.length>0||(topRanks&&topRanks.length>0))&&!loading&&(
          <div style={{marginTop:14,padding:12,borderRadius:8,background:"#0d1520",border:"1px solid #192838"}}>
            <div style={{fontSize:10,color:"#607890",fontWeight:600,marginBottom:6}}>CONFIDENCE RATINGS</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
              {[["80%+ STRONG","#22c55e"],["65-79% GOOD","#eab308"],["50-64% FAIR","#f97316"],["<50% RISKY","#ef4444"]].map(function(item){return <div key={item[0]} style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:7,height:7,borderRadius:"50%",background:item[1]}}/><span style={{fontSize:9,color:"#506878"}}>{item[0]}</span></div>})}
            </div>
          </div>
        )}
        {matchReady&&!loading&&<button onClick={fullReset} style={{width:"100%",marginTop:14,padding:10,fontSize:12,fontWeight:600,background:"transparent",color:"#506878",border:"1px solid #192838",borderRadius:8,cursor:"pointer"}}>← Start Over</button>}
        <div style={{marginTop:14,padding:12,borderRadius:8,background:"#0d1520",border:"1px solid #192838",fontSize:10,color:"#506878",lineHeight:1.5,textAlign:"center"}}>⚠️ Ase Football AI — statistical analysis only. Not financial advice. Gamble responsibly.</div>
      </div>
    </div>
  );
}
