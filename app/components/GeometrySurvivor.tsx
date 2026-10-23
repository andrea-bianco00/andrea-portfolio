"use client";
import {useCallback,useEffect,useRef,useState} from "react";
import {W,H,STEP,initial,update,type Game} from "../lib/geometry-core";
import {observeForMpc,mpcAction,MPC_ACTIONS} from "../lib/geometry-mpc";

function draw(ctx:CanvasRenderingContext2D,g:Game,now:number){
 ctx.clearRect(0,0,W,H);
 const bg=ctx.createRadialGradient(W*.5,H*.45,20,W*.5,H*.5,W*.75);
 bg.addColorStop(0,"#26140f");bg.addColorStop(1,"#09090d");
 ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
 const pulse=.5+.5*Math.sin(now*.0007),phase=Math.min(1,g.t/75);
 ctx.lineWidth=1;ctx.strokeStyle="rgba(241,137,67,"+(.045+.025*pulse+.025*phase)+")";
 const drift=(now*.003)%36;
 for(let x=-36+drift;x<W;x+=36){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke()}
 for(let y=-36+drift*.35;y<H;y+=36){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()}
 ctx.strokeStyle="rgba(255,137,52,.16)";ctx.strokeRect(.5,.5,W-1,H-1);
 for(const e of g.enemies){
  ctx.save();ctx.translate(e.x,e.y);ctx.rotate(e.angle);
  ctx.shadowBlur=14;ctx.shadowColor="#ed6649";ctx.strokeStyle="#f1785c";ctx.lineWidth=2.5;ctx.fillStyle="rgba(236,94,65,.12)";
  ctx.beginPath();
  if(e.kind===0)ctx.arc(0,0,e.r*(1+.065*Math.sin(now*.004+e.angle)),0,Math.PI*2);
  else if(e.kind===1)ctx.rect(-e.r,-e.r,e.r*2,e.r*2);
  else {ctx.moveTo(e.r,0);ctx.lineTo(-e.r*.7,-e.r*.85);ctx.lineTo(-e.r*.7,e.r*.85);ctx.closePath()}
  ctx.fill();ctx.stroke();
  if(e.kind===2){ctx.rotate(-e.angle);ctx.strokeStyle="rgba(255,140,96,.23)";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-e.vx*.17,-e.vy*.17);ctx.lineTo(-e.vx*.36,-e.vy*.36);ctx.stroke()}
  ctx.restore();
 }
 for(let i=1;i<g.trail.length;i++){
  const a=g.trail[i-1],b=g.trail[i],f=i/g.trail.length;
  ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
  ctx.strokeStyle="rgba(255,137,48,"+(f*f*.48)+")";ctx.lineWidth=.6+f*9;
  ctx.shadowColor="#ff8b30";ctx.shadowBlur=9*f;ctx.lineCap="round";ctx.stroke();
 }
 ctx.shadowBlur=0;
 for(const ring of g.rings){const f=ring.life/ring.max;ctx.beginPath();ctx.arc(ring.x,ring.y,ring.r+(1-f)*65,0,Math.PI*2);ctx.strokeStyle="rgba(255,172,98,"+(f*.65)+")";ctx.lineWidth=1.5*f;ctx.stroke()}
 if(!g.dead){
  ctx.save();ctx.translate(g.x,g.y);ctx.rotate(Math.atan2(g.vy,g.vx)+Math.PI/2 || 0);
  ctx.shadowBlur=25;ctx.shadowColor="#ff8b30";
  ctx.fillStyle="#ff8b30";ctx.strokeStyle="#ffdfb3";ctx.lineWidth=1.5;
  ctx.beginPath();ctx.moveTo(0,-14);ctx.lineTo(11,10);ctx.lineTo(0,5);ctx.lineTo(-11,10);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
 }
 for(const p of g.particles){ctx.globalAlpha=Math.max(0,p.life);ctx.fillStyle="#ff9c50";ctx.fillRect(p.x-2,p.y-2,4,4)}ctx.globalAlpha=1;
 if(g.dead){
  ctx.fillStyle="rgba(8,6,8,"+Math.min(.77,g.deathAge*1.4)+")";ctx.fillRect(0,0,W,H);
  ctx.globalAlpha=Math.min(1,Math.max(0,(g.deathAge-.32)*3));ctx.textAlign="center";ctx.fillStyle="#ffe0c0";ctx.font="bold 40px Arial";ctx.fillText("GAME OVER",W/2,H/2-10);
  ctx.font="16px monospace";ctx.fillStyle="#f6a66e";ctx.fillText((g.t).toFixed(1)+" SECONDI",W/2,H/2+24);ctx.globalAlpha=1;
 }
 // Subtle visual pulse, not a gameplay or AI effect.
 void now;
}
export default function GeometrySurvivor(){
 const canvas=useRef<HTMLCanvasElement>(null),game=useRef<Game>(initial()),keys=useRef(new Set<string>());
 const touch=useRef<{x:number;y:number}|null>(null),last=useRef(0),raf=useRef(0),running=useRef(false),accum=useRef(0);
 const [status,setStatus]=useState<"ready"|"playing"|"paused"|"dead">("ready");
 const [aiMode,setAiMode]=useState(false),aiModeRef=useRef(false),aiTicks=useRef(0),aiAction=useRef(0);
 const [seconds,setSeconds]=useState(0),[best,setBest]=useState(0),[nearMisses,setNearMisses]=useState(0);
 const [bestLoaded,setBestLoaded]=useState(false);
 const session=useRef<{token:string;seed:number}|null>(null);
 const moves=useRef<number[][]>([]);
 const [nickname,setNickname]=useState("");
 const [publishState,setPublishState]=useState("");
 const [publishing,setPublishing]=useState(false);
 const [published,setPublished]=useState(false);
 const [rankingOpen,setRankingOpen]=useState(false);
 const [ranking,setRanking]=useState<{nickname:string;duration_ms:number;marker:string}[]>([]);
 const [rankingLoading,setRankingLoading]=useState(false);
 const [rankingError,setRankingError]=useState("");
 useEffect(()=>{
  if(!rankingOpen)return;
  const controller=new AbortController();
  setRankingLoading(true);setRankingError("");
  fetch("/api/geometry-leaderboard",{signal:controller.signal})
   .then(async response=>{if(!response.ok)throw new Error("Unavailable");return response.json()})
   .then(data=>{setRanking(Array.isArray(data.scores)?data.scores:[]);setRankingLoading(false)})
   .catch(()=>{if(!controller.signal.aborted){setRankingError("Classifica temporaneamente non disponibile");setRankingLoading(false)}});
  return()=>controller.abort();
 },[rankingOpen]);
 useEffect(()=>{try{const saved=window.localStorage.getItem("geometry-survivor:nickname:v1");if(saved&&/^[A-Za-z0-9_-]{2,20}$/.test(saved))setNickname(saved)}catch{}},[]);
 useEffect(()=>{try{const stored=Number(window.localStorage.getItem("geometry-survivor:best:v1"));if(Number.isFinite(stored)&&stored>=0&&stored<=86400)setBest(stored)}catch{}setBestLoaded(true)},[]);
 useEffect(()=>{if(!bestLoaded||best<=0)return;try{const old=Number(window.localStorage.getItem("geometry-survivor:best:v1"))||0;if(best>old)window.localStorage.setItem("geometry-survivor:best:v1",String(best))}catch{}},[best,bestLoaded]);
 const reset=useCallback(async(mode:"manual"|"ai"="manual")=>{
  running.current=false;aiModeRef.current=mode==="ai";setAiMode(mode==="ai");aiTicks.current=0;aiAction.current=0;
  session.current=null;moves.current=[];setPublishState("");setPublished(false);setSeconds(0);setNearMisses(0);setStatus("ready");
  if(mode==="ai"){
   // AI uses a fresh game, but never creates a leaderboard session or stores a human best.
   game.current=initial(Math.floor(Math.random()*0x100000000));
   keys.current.clear();touch.current=null;last.current=0;accum.current=0;
   setStatus("playing");running.current=true;return;
  }
  try{
   const response=await fetch("/api/geometry-session",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"start"})});
   if(!response.ok)throw Error("unavailable");
   const data=await response.json();
   if(typeof data.seed!=="number"||typeof data.session!=="string")throw Error("invalid");
   session.current={seed:data.seed,token:data.session};game.current=initial(data.seed);
  }catch{
   game.current=initial();setPublishState("Modalità offline: puoi giocare e salvare il record personale, ma la pubblicazione mondiale non è ancora disponibile.");
  }
  keys.current.clear();touch.current=null;last.current=0;accum.current=0;setStatus("playing");running.current=true;
 },[]);
 useEffect(()=>{
  const down=(e:KeyboardEvent)=>{
   const el=document.activeElement;
   if(el instanceof HTMLElement&&(el.isContentEditable||["INPUT","TEXTAREA","SELECT","BUTTON"].includes(el.tagName)))return;
   if(aiModeRef.current)return;
   if(!running.current&&e.key!==" ")return;
   if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key))e.preventDefault();
   keys.current.add(e.key.toLowerCase());if(e.key===" "&&game.current.dead)reset();
  };
  const up=(e:KeyboardEvent)=>keys.current.delete(e.key.toLowerCase());
  window.addEventListener("keydown",down);window.addEventListener("keyup",up);
  const blur=()=>{keys.current.clear();touch.current=null;running.current=false;setStatus(s=>s==="playing"?"paused":s)};
  window.addEventListener("blur",blur);
  return()=>{window.removeEventListener("keydown",down);window.removeEventListener("keyup",up);window.removeEventListener("blur",blur)};
 },[reset]);
 useEffect(()=>{
  const c=canvas.current;if(!c)return;
  const ctx=c.getContext("2d");if(!ctx)return;
  const loop=(time:number)=>{
   const dt=last.current?Math.min(1/15,(time-last.current)/1000):0;last.current=time;
   const g=game.current;
   if(running.current&&!g.dead){
    const k=keys.current;let ax=Number(k.has("d")||k.has("arrowright"))-Number(k.has("a")||k.has("arrowleft"));
    let ay=Number(k.has("s")||k.has("arrowdown"))-Number(k.has("w")||k.has("arrowup"));
    if(!aiModeRef.current&&touch.current){ax=touch.current.x-g.x;ay=touch.current.y-g.y;if(Math.hypot(ax,ay)<18){ax=0;ay=0}}
    accum.current+=dt;
    let ticks=0;
    while(accum.current>=STEP&&ticks<8&&!g.dead){
     if(aiModeRef.current){
      // Replan at 20 Hz, independently of the browser render frame rate.
      if(aiTicks.current%6===0)aiAction.current=mpcAction(observeForMpc(g));
      [ax,ay]=MPC_ACTIONS[aiAction.current];aiTicks.current++;
     }
     const mx=Math.round(ax/(Math.hypot(ax,ay)||1)*1000);
     const my=Math.round(ay/(Math.hypot(ax,ay)||1)*1000);
     if(session.current){
      const previous=moves.current[moves.current.length-1];
      if(previous&&previous[0]===mx&&previous[1]===my)previous[2]++;
      else moves.current.push([mx,my,1]);
     }
     update(g,STEP,mx/1000,my/1000);accum.current-=STEP;ticks++;
    }
    if(ticks===8)accum.current=0;
    const whole=Math.floor(g.t);
    setSeconds(old=>old===whole?old:whole);
    setNearMisses(old=>old===g.nearCount?old:g.nearCount);
    if(g.dead){running.current=false;setStatus("dead");if(!aiModeRef.current)setBest(old=>Math.max(old,g.t))}
   }
   if(g.dead)g.deathAge+=dt;
   for(const ring of g.rings)ring.life-=dt;
   g.rings=g.rings.filter(r=>r.life>0);
   for(const p of g.particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt}
   g.particles=g.particles.filter(p=>p.life>0);
   draw(ctx,g,time);raf.current=requestAnimationFrame(loop);
  };
  raf.current=requestAnimationFrame(loop);return()=>cancelAnimationFrame(raf.current);
 },[]);
 const pointer=(e:React.PointerEvent<HTMLCanvasElement>)=>{
  if(aiModeRef.current)return;
  const c=canvas.current;if(!c)return;
  const r=c.getBoundingClientRect();
  touch.current={x:(e.clientX-r.left)/r.width*W,y:(e.clientY-r.top)/r.height*H};
 };
 return <section className="geometry-game" aria-label="Geometry Survivor, gioco geometrico interattivo">
  <div className="geometry-game-top"><span>GEOMETRY SURVIVOR</span><span>{aiMode?"AI DEMO · FROZEN MPC":"PLAY MODE · HUMAN"}</span></div>
  <div className="geometry-game-stage">
   <canvas ref={canvas} width={W} height={H} onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);pointer(e)}} onPointerMove={e=>{if(e.buttons)pointer(e)}} onPointerUp={()=>touch.current=null} onPointerCancel={()=>touch.current=null} aria-label="Arena di Geometry Survivor. Usa frecce, WASD o trascina sullo schermo."/>
   <div className="geometry-game-score"><span>{seconds}s</span><small>BEST {best.toFixed(1)}s · NEAR MISS {nearMisses}</small><div className="geometry-game-progress"><i style={{width:((seconds%20)/20*100)+"%"}}/></div></div>
   {status==="ready"&&<div className="geometry-game-overlay"><strong>SURVIVE.</strong><p>Schiva le forme. Resisti più a lungo che puoi.</p><button type="button" onClick={()=>void reset("manual")}>INIZIA A GIOCARE</button><button type="button" onClick={()=>void reset("ai")}>GUARDA L’AI GIOCARE</button><small>WASD / FRECCE · TRASCINA SU MOBILE</small></div>}
   {status==="paused"&&<div className="geometry-game-overlay"><strong>PAUSA</strong><button type="button" onClick={()=>{running.current=true;last.current=0;accum.current=0;setStatus("playing")}}>RIPRENDI</button></div>}
   {status==="dead"&&<div className="geometry-game-restart"><button type="button" onClick={()=>void reset(aiModeRef.current?"ai":"manual")}>{aiMode?"RIGUARDA L’AI":"RIGIOCA"}</button></div>}
  </div>
  {rankingOpen&&<div style={{padding:"14px 16px",background:"#120d0c",border:"1px solid rgba(255,139,48,.35)",borderRadius:8,marginTop:8,color:"#f5d4b7"}}>
   <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><strong>CLASSIFICA MONDIALE · TOP 10</strong><button type="button" onClick={()=>setRankingOpen(false)}>✕</button></div>
   {rankingLoading?<p>Caricamento…</p>:rankingError?<p role="status">{rankingError}</p>:ranking.length===0?<p>Nessun punteggio pubblicato. I risultati saranno accettati soltanto dopo la verifica delle partite.</p>:ranking.map((entry,i)=>{
    const duplicate=ranking.some((other,j)=>j!==i&&other.nickname.toLowerCase()===entry.nickname.toLowerCase());
    const marker=Number.parseInt(entry.marker?.slice(0,6)||"0",16);
    const shapes=["circle","diamond","square"] as const;
    const shape=shapes[marker%shapes.length];
    const colors=["#ffb16e","#e9c4a2","#e6a08d","#f7d7a6"];
    return <div key={entry.marker||i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:"1px solid rgba(255,139,48,.14)"}}>
     <span style={{display:"inline-flex",alignItems:"center",gap:7,minWidth:0}}>
      <span>{i+1}. {entry.nickname}</span>
      {duplicate&&<span aria-label="Giocatore distinto con lo stesso nickname" title="Giocatore distinto con lo stesso nickname" style={{width:8,height:8,display:"inline-block",flexShrink:0,background:colors[Math.floor(marker/3)%colors.length],borderRadius:shape==="circle"?"50%":"1px",transform:shape==="diamond"?"rotate(45deg)":undefined,boxShadow:"0 0 6px rgba(255,139,48,.18)"}}/>}
     </span>
     <strong>{(entry.duration_ms/1000).toFixed(1)}s</strong>
    </div>;
   })}
  </div>}
  {status==="dead"&&!aiMode&&published&&<div role="status" style={{marginTop:8,padding:"14px 16px",border:"1px solid rgba(255,139,48,.45)",borderRadius:8,background:"#17100c",color:"#f7cfa9",display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}><strong style={{color:"#ff9a42"}}>✓ RECORD PUBBLICATO</strong><span>Partita verificata. Il tuo risultato è stato registrato nella classifica mondiale.</span></div>}
  {status==="dead"&&!aiMode&&!published&&<form onSubmit={async e=>{
    e.preventDefault();if(!session.current||publishing)return;
    if(!/^[A-Za-z0-9_-]{2,20}$/.test(nickname)){setPublishState("Usa da 2 a 20 caratteri: lettere, numeri, _ oppure -.");return}
    setPublishing(true);setPublishState("Verifica della partita in corso…");
    try{
     let playerId=localStorage.getItem("geometry-survivor:player:v1");
     if(!playerId){playerId=crypto.randomUUID();localStorage.setItem("geometry-survivor:player:v1",playerId)}
     const response=await fetch("/api/geometry-session",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"finish",nickname,playerId,session:session.current.token,moves:moves.current})});
     const result=await response.json();
     if(!response.ok)throw Error(result.error||"Errore di pubblicazione");
     try{localStorage.setItem("geometry-survivor:nickname:v1",nickname)}catch{}
     setPublishState("Record verificato e inviato!");setPublished(true);setRankingOpen(false);setTimeout(()=>setRankingOpen(true),150);
    }catch(error){setPublishState(error instanceof Error?error.message:"Errore di pubblicazione")}
    finally{setPublishing(false)}
   }} style={{marginTop:8,padding:12,border:"1px solid rgba(255,139,48,.3)",borderRadius:8}}>
   <strong style={{display:"block",marginBottom:8}}>PUBBLICA IL TUO RECORD NELLA TOP 10</strong>
   <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
    <input aria-label="Nickname" value={nickname} onChange={e=>setNickname(e.target.value)} placeholder="Nickname (2–20 caratteri)" maxLength={20} style={{minWidth:180,flex:1,background:"#180f0c",color:"#f9d3b2",border:"1px solid #a66b43",padding:9,borderRadius:5}}/>
    <button type="submit" disabled={publishing||!session.current} style={{background:publishing||!session.current?"#6b5344":"#ff8b32",color:"#180d06",fontWeight:900,padding:"10px 16px",border:"1px solid #ffb26d",borderRadius:6,cursor:publishing||!session.current?"not-allowed":"pointer",boxShadow:publishing||!session.current?"none":"0 3px 14px rgba(255,139,50,.22)",transition:"transform .15s,background .15s"}}>{publishing?"VERIFICA…":"PUBBLICA RECORD →"}</button>
   </div>
   {publishState&&<p role="status" style={{marginTop:8,color:"#f5c4a0"}}>{publishState}</p>}
   {!session.current&&<p style={{marginTop:8}}>Pubblicazione temporaneamente disattivata. Il record personale rimane salvato.</p>}
  </form>}
  <div className="geometry-game-bottom"><span>{aiMode?"DEMO AI · SOLO OSSERVAZIONI VISIBILI · NESSUNA CLASSIFICA":"EVITA GLI OSTACOLI · RECORD SALVATO SU QUESTO DISPOSITIVO"}</span><div><button type="button" onClick={()=>{if(status==="playing"){running.current=false;setStatus("paused")}else if(status==="paused"){running.current=true;last.current=0;setStatus("playing")}else void reset(aiModeRef.current?"ai":"manual")}}>{status==="playing"?"PAUSA":status==="paused"?"▶ RIPRENDI":"START"}</button><button type="button" onClick={()=>void reset(aiModeRef.current?"ai":"manual")}>RESET</button><button type="button" onClick={()=>void reset(aiMode?"manual":"ai")}>{aiMode?"GIOCA TU":"GUARDA L’AI GIOCARE"}</button><button type="button" onClick={()=>setRankingOpen(value=>!value)}>TOP 10</button></div></div>
 </section>;
}
