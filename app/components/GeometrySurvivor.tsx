"use client";
import {useCallback,useEffect,useRef,useState} from "react";

const W=720,H=405,PLAYER_R=10,MAX_DT=1/30;
type Enemy={x:number;y:number;vx:number;vy:number;r:number;kind:0|1|2;angle:number};
type Particle={x:number;y:number;vx:number;vy:number;life:number};
type Game={x:number;y:number;vx:number;vy:number;t:number;score:number;enemies:Enemy[];particles:Particle[];spawn:number;seed:number;dead:boolean;trail:{x:number;y:number}[]};
const initial=():Game=>({x:W/2,y:H/2,vx:0,vy:0,t:0,score:0,enemies:[],particles:[],spawn:1.15,seed:271828,dead:false,trail:[]});
function rand(g:Game){g.seed=(Math.imul(g.seed,1664525)+1013904223)>>>0;return g.seed/4294967296}
function spawn(g:Game){
 const kind=Math.floor(rand(g)*3) as 0|1|2,edge=Math.floor(rand(g)*4);
 const x=edge===0?-24:edge===1?W+24:rand(g)*W;
 const y=edge===2?-24:edge===3?H+24:rand(g)*H;
 const dx=g.x-x,dy=g.y-y,aim=Math.atan2(dy,dx);
 // Obstacles target only the player's position at spawn. No homing or surprise turns.
 const spread=(rand(g)-.5)*(kind===2?.26:1.25);
 const a=aim+spread,speed=(kind===1?60:kind===2?112:85)*(1+Math.min(g.t,75)/110);
 const r=kind===1?15:kind===2?12:11;
 g.enemies.push({x,y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,r,kind,angle:rand(g)*6.28});
}
function collide(g:Game,e:Enemy){
 // Conservative bounding circles; same geometry for every obstacle.
 const dx=g.x-e.x,dy=g.y-e.y;
 return dx*dx+dy*dy<(PLAYER_R+e.r-2)**2;
}
function update(g:Game,dt:number,ax:number,ay:number){
 if(g.dead)return;
 g.t+=dt;g.score=Math.floor(g.t*10);
 const norm=Math.hypot(ax,ay)||1,acc=740,drag=Math.exp(-7*dt);
 g.vx=(g.vx+ax/norm*acc*dt)*drag;g.vy=(g.vy+ay/norm*acc*dt)*drag;
 const speed=Math.hypot(g.vx,g.vy),max=255;
 if(speed>max){g.vx*=max/speed;g.vy*=max/speed}
 g.x=Math.max(PLAYER_R+5,Math.min(W-PLAYER_R-5,g.x+g.vx*dt));
 g.y=Math.max(PLAYER_R+5,Math.min(H-PLAYER_R-5,g.y+g.vy*dt));
 if(g.x<=PLAYER_R+5||g.x>=W-PLAYER_R-5)g.vx=0;
 if(g.y<=PLAYER_R+5||g.y>=H-PLAYER_R-5)g.vy=0;
 g.trail.push({x:g.x,y:g.y});if(g.trail.length>13)g.trail.shift();
 g.spawn-=dt;
 if(g.spawn<=0){
  spawn(g);
  // Spawn rate increases smoothly, then caps. One seeded sequence per run.
  const interval=Math.max(.24,1.05-g.t*.010);
  g.spawn+=interval*(.78+rand(g)*.45);
 }
 for(const e of g.enemies){e.x+=e.vx*dt;e.y+=e.vy*dt;e.angle+=dt*(e.kind===1?1.1:2)}
 g.enemies=g.enemies.filter(e=>e.x>-70&&e.x<W+70&&e.y>-70&&e.y<H+70);
 for(const e of g.enemies)if(collide(g,e)){
  g.dead=true;
  for(let i=0;i<38;i++){const a=rand(g)*Math.PI*2,s=30+rand(g)*170;g.particles.push({x:g.x,y:g.y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:.45+rand(g)*.45})}
  break;
 }
}
function draw(ctx:CanvasRenderingContext2D,g:Game,now:number){
 ctx.clearRect(0,0,W,H);
 const bg=ctx.createRadialGradient(W*.5,H*.45,20,W*.5,H*.5,W*.75);
 bg.addColorStop(0,"#26140f");bg.addColorStop(1,"#09090d");
 ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
 ctx.lineWidth=1;ctx.strokeStyle="rgba(241,137,67,.07)";
 for(let x=0;x<W;x+=36){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke()}
 for(let y=0;y<H;y+=36){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()}
 ctx.strokeStyle="rgba(255,137,52,.16)";ctx.strokeRect(.5,.5,W-1,H-1);
 for(const e of g.enemies){
  ctx.save();ctx.translate(e.x,e.y);ctx.rotate(e.angle);
  ctx.shadowBlur=14;ctx.shadowColor="#ed6649";ctx.strokeStyle="#f1785c";ctx.lineWidth=2.5;ctx.fillStyle="rgba(236,94,65,.12)";
  ctx.beginPath();
  if(e.kind===0)ctx.arc(0,0,e.r,0,Math.PI*2);
  else if(e.kind===1)ctx.rect(-e.r,-e.r,e.r*2,e.r*2);
  else {ctx.moveTo(e.r,0);ctx.lineTo(-e.r*.7,-e.r*.85);ctx.lineTo(-e.r*.7,e.r*.85);ctx.closePath()}
  ctx.fill();ctx.stroke();ctx.restore();
 }
 for(let i=0;i<g.trail.length;i++){
  const p=g.trail[i];ctx.beginPath();ctx.fillStyle="rgba(255,145,61,"+(i/g.trail.length*.19)+")";ctx.arc(p.x,p.y,2+i/g.trail.length*6,0,Math.PI*2);ctx.fill();
 }
 if(!g.dead){
  ctx.save();ctx.translate(g.x,g.y);ctx.rotate(Math.atan2(g.vy,g.vx)+Math.PI/2 || 0);
  ctx.shadowBlur=25;ctx.shadowColor="#ff8b30";
  ctx.fillStyle="#ff8b30";ctx.strokeStyle="#ffdfb3";ctx.lineWidth=1.5;
  ctx.beginPath();ctx.moveTo(0,-14);ctx.lineTo(11,10);ctx.lineTo(0,5);ctx.lineTo(-11,10);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
 }
 for(const p of g.particles){ctx.globalAlpha=Math.max(0,p.life);ctx.fillStyle="#ff9c50";ctx.fillRect(p.x-2,p.y-2,4,4)}ctx.globalAlpha=1;
 if(g.dead){
  ctx.fillStyle="rgba(8,6,8,.69)";ctx.fillRect(0,0,W,H);
  ctx.textAlign="center";ctx.fillStyle="#ffe0c0";ctx.font="bold 40px Arial";ctx.fillText("GAME OVER",W/2,H/2-10);
  ctx.font="16px monospace";ctx.fillStyle="#f6a66e";ctx.fillText((g.t).toFixed(1)+" SECONDİ",W/2,H/2+24);
 }
 // Subtle visual pulse, not a gameplay or AI effect.
 void now;
}
export default function GeometrySurvivor(){
 const canvas=useRef<HTMLCanvasElement>(null),game=useRef<Game>(initial()),keys=useRef(new Set<string>());
 const touch=useRef<{x:number;y:number}|null>(null),last=useRef(0),raf=useRef(0),running=useRef(false);
 const [status,setStatus]=useState<"ready"|"playing"|"paused"|"dead">("ready");
 const [seconds,setSeconds]=useState(0),[best,setBest]=useState(0);
 const reset=useCallback(()=>{game.current=initial();keys.current.clear();touch.current=null;last.current=0;setSeconds(0);setStatus("playing");running.current=true},[]);
 useEffect(()=>{
  const down=(e:KeyboardEvent)=>{if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key)&&document.activeElement?.tagName!=="INPUT")e.preventDefault();keys.current.add(e.key.toLowerCase());if(e.key===" "&&game.current.dead)reset()};
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
   const dt=last.current?Math.min(MAX_DT,(time-last.current)/1000):0;last.current=time;
   const g=game.current;
   if(running.current&&!g.dead){
    const k=keys.current;let ax=Number(k.has("d")||k.has("arrowright"))-Number(k.has("a")||k.has("arrowleft"));
    let ay=Number(k.has("s")||k.has("arrowdown"))-Number(k.has("w")||k.has("arrowup"));
    if(touch.current){ax=touch.current.x-g.x;ay=touch.current.y-g.y;if(Math.hypot(ax,ay)<18){ax=0;ay=0}}
    // Substeps prevent high-speed objects tunnelling through collisions.
    const steps=Math.max(1,Math.ceil(dt/(1/120)));
    for(let i=0;i<steps;i++)update(g,dt/steps,ax,ay);
    const whole=Math.floor(g.t);
    setSeconds(old=>old===whole?old:whole);
    if(g.dead){running.current=false;setStatus("dead");setBest(old=>Math.max(old,g.t))}
   }
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
   <div className="geometry-game-score"><span>{seconds}s</span><small>BEST {best.toFixed(1)}s</small></div>
   {status==="ready"&&<div className="geometry-game-overlay"><strong>SURVIVE.</strong><p>Schiva le forme. Resisti più a lungo che puoi.</p><button type="button" onClick={reset}>▶ INIZIA A GIOCARE</button><small>WASD / FRECCE · TRASCINA SU MOBILE</small></div>}
   {status==="paused"&&<div className="geometry-game-overlay"><strong>PAUSA</strong><button type="button" onClick={()=>{running.current=true;last.current=0;setStatus("playing")}}>▶ RIPRENDI</button></div>}
   {status==="dead"&&<div className="geometry-game-restart"><button type="button" onClick={reset}>↻ RIGIOCA</button></div>}
  </div>
  <div className="geometry-game-bottom"><span>EVITA GLI OSTACOLI · LA DIFFICOLTÀ AUMENTA</span><div><button type="button" onClick={()=>{if(status==="playing"){running.current=false;setStatus("paused")}else if(status==="paused"){running.current=true;last.current=0;setStatus("playing")}else reset()}}>{status==="playing"?"Ⅱ PAUSA":status==="paused"?"▶ RIPRENDI":"↻ START"}</button><button type="button" onClick={reset}>↻ RESET</button></div></div>
 </section>;
}
