"use client";
import {useCallback,useEffect,useRef,useState} from "react";
import {W,H,STEP,initial,update,type Game} from "../lib/geometry-core";

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
 const [seconds,setSeconds]=useState(0),[best,setBest]=useState(0),[nearMisses,setNearMisses]=useState(0);
 const [bestLoaded,setBestLoaded]=useState(false);
 useEffect(()=>{try{const stored=Number(window.localStorage.getItem("geometry-survivor:best:v1"));if(Number.isFinite(stored)&&stored>=0&&stored<=86400)setBest(stored)}catch{}setBestLoaded(true)},[]);
 useEffect(()=>{if(!bestLoaded||best<=0)return;try{const old=Number(window.localStorage.getItem("geometry-survivor:best:v1"))||0;if(best>old)window.localStorage.setItem("geometry-survivor:best:v1",String(best))}catch{}},[best,bestLoaded]);
 const reset=useCallback(()=>{game.current=initial();keys.current.clear();touch.current=null;last.current=0;accum.current=0;setSeconds(0);setNearMisses(0);setStatus("playing");running.current=true},[]);
 useEffect(()=>{
  const down=(e:KeyboardEvent)=>{
   const el=document.activeElement;
   if(el instanceof HTMLElement&&(el.isContentEditable||["INPUT","TEXTAREA","SELECT","BUTTON"].includes(el.tagName)))return;
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
    if(touch.current){ax=touch.current.x-g.x;ay=touch.current.y-g.y;if(Math.hypot(ax,ay)<18){ax=0;ay=0}}
    accum.current+=dt;
    let ticks=0;
    while(accum.current>=STEP&&ticks<8&&!g.dead){update(g,STEP,ax,ay);accum.current-=STEP;ticks++}
    if(ticks===8)accum.current=0;
    const whole=Math.floor(g.t);
    setSeconds(old=>old===whole?old:whole);
    setNearMisses(old=>old===g.nearCount?old:g.nearCount);
    if(g.dead){running.current=false;setStatus("dead");setBest(old=>Math.max(old,g.t))}
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
  const c=canvas.current;if(!c)return;
  const r=c.getBoundingClientRect();
  touch.current={x:(e.clientX-r.left)/r.width*W,y:(e.clientY-r.top)/r.height*H};
 };
 return <section className="geometry-game" aria-label="Geometry Survivor, gioco geometrico interattivo">
  <div className="geometry-game-top"><span>GEOMETRY SURVIVOR</span><span>PLAY MODE · NO AI YET</span></div>
  <div className="geometry-game-stage">
   <canvas ref={canvas} width={W} height={H} onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);pointer(e)}} onPointerMove={e=>{if(e.buttons)pointer(e)}} onPointerUp={()=>touch.current=null} onPointerCancel={()=>touch.current=null} aria-label="Arena di Geometry Survivor. Usa frecce, WASD o trascina sullo schermo."/>
   <div className="geometry-game-score"><span>{seconds}s</span><small>BEST {best.toFixed(1)}s · NEAR MISS {nearMisses}</small><div className="geometry-game-progress"><i style={{width:((seconds%20)/20*100)+"%"}}/></div></div>
   {status==="ready"&&<div className="geometry-game-overlay"><strong>SURVIVE.</strong><p>Schiva le forme. Resisti più a lungo che puoi.</p><button type="button" onClick={reset}>▶ INIZIA A GIOCARE</button><small>WASD / FRECCE · TRASCINA SU MOBILE</small></div>}
   {status==="paused"&&<div className="geometry-game-overlay"><strong>PAUSA</strong><button type="button" onClick={()=>{running.current=true;last.current=0;accum.current=0;setStatus("playing")}}>▶ RIPRENDI</button></div>}
   {status==="dead"&&<div className="geometry-game-restart"><button type="button" onClick={reset}>↻ RIGIOCA</button></div>}
  </div>
  <div className="geometry-game-bottom"><span>EVITA GLI OSTACOLI · RECORD SALVATO SU QUESTO DISPOSITIVO</span><div><button type="button" onClick={()=>{if(status==="playing"){running.current=false;setStatus("paused")}else if(status==="paused"){running.current=true;last.current=0;setStatus("playing")}else reset()}}>{status==="playing"?"Ⅱ PAUSA":status==="paused"?"▶ RIPRENDI":"↻ START"}</button><button type="button" onClick={reset}>↻ RESET</button></div></div>
 </section>;
}
