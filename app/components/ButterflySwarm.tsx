"use client";
import {useEffect,useRef,useState} from "react";
import ButterflyLearningTimelapse from "./ButterflyLearningTimelapse";
type Gate=[number,number,number];
type Alive=[number,number,number];
type Frame={step:number;x:number;gates:Gate[];alive:Alive[]};
type Outcome={id:number;steps:number;passed:number;crashed:boolean};
type Stage={label:string;model:string;training_steps_approx:number|null;frames:Frame[];outcomes:Outcome[]};
type Swarm={source:string;count:number;scenario:string;course_seed:number;checkpoints:Stage[]};
const URL="https://raw.githubusercontent.com/andrea-bianco00/butterfly-rl/main/data/replays/early-v6-1729.json";
const MILESTONES=[0,8000,12000,16000,18000,20000,22000,24000,26000,28000,30000,100000];
function scene(ctx:CanvasRenderingContext2D,frame:Frame,step:number){
 const W=720,H=390,scale=H/4,px=180;
 const xCoord=(x:number)=>px+(x-frame.x)*scale;
 const yCoord=(y:number)=>H-y*scale;
 const bg=ctx.createLinearGradient(0,0,0,H);
 bg.addColorStop(0,"#09090d");bg.addColorStop(.7,"#21120f");bg.addColorStop(1,"#3d1b11");
 ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
 for(let i=0;i<52;i++){ctx.fillStyle=i%5===0?"#ff9b47":"#78432c";ctx.fillRect((i*127+31)%W,(i*67+9)%(H-45),i%6===0?3:2,2)}
 ctx.fillStyle="#281713";ctx.beginPath();ctx.moveTo(0,H);
 for(let x=0;x<=W;x+=8)ctx.lineTo(x,H-72-18*Math.sin(x*.013));
 ctx.lineTo(W,H);ctx.fill();
 ctx.fillStyle="#412116";ctx.beginPath();ctx.moveTo(0,H);
 for(let x=0;x<=W;x+=8)ctx.lineTo(x,H-35-12*Math.sin(x*.019+1.7));
 ctx.lineTo(W,H);ctx.fill();
 for(const [gx,gc,gh] of frame.gates){
   const x=xCoord(gx),w=.38*scale,top=yCoord(gc+gh),bottom=yCoord(gc-gh);
   if(x< -w||x>W+w)continue;
   ctx.fillStyle="#151419";ctx.fillRect(x-w/2,0,w,Math.max(0,top));ctx.fillRect(x-w/2,bottom,w,Math.max(0,H-bottom));
   ctx.fillStyle="#5c3828";ctx.fillRect(x-w/2,Math.max(0,top-8),w,8);ctx.fillRect(x-w/2,bottom,w,8);
   ctx.strokeStyle="rgba(255,135,55,.3)";ctx.strokeRect(x-w/2,0,w,Math.max(0,top));ctx.strokeRect(x-w/2,bottom,w,Math.max(0,H-bottom));
 }
 // Every butterfly has the simulator's true horizontal coordinate. No cosmetic
 // horizontal staggering, and no fake survivors.
 for(const [id,y] of frame.alive){
   const px2=px,py=yCoord(y),f=.5+.48*Math.abs(Math.sin(step*.24+id*.41));
   ctx.save();ctx.translate(px2,py);ctx.globalAlpha=.38+((id%5)/5)*.42;
   ctx.shadowColor="#ff8b2d";ctx.shadowBlur=6;
   for(const side of [-1,1]){
     ctx.save();ctx.scale(side*f,1);ctx.fillStyle=id%3===0?"#ffd08a":"#ff8b30";
     ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(5,-9,11,-7);ctx.quadraticCurveTo(15,-1,0,0);ctx.fill();
     ctx.fillStyle="#f46b21";ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(12,3,7,9);ctx.quadraticCurveTo(2,10,0,0);ctx.fill();ctx.restore();
   }
   ctx.fillStyle="#fff1d0";ctx.fillRect(-1,-4,2,8);ctx.restore();
 }
}
export default function ButterflySwarm(){
 const [data,setData]=useState<Swarm|null>(null);
 const [stage,setStage]=useState(0),[tick,setTick]=useState(0);
 const [clock,setClock]=useState(0);
 const [playing,setPlaying]=useState(true),[automatic,setAutomatic]=useState(true);
 const canvas=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{let alive=true;fetch(URL,{cache:"no-store"}).then(r=>{if(!r.ok)throw Error("Not published");return r.json()}).then((d:Swarm)=>{
   if(!alive)return;
   if(d.count!==100||d.checkpoints?.length<12||d.checkpoints.some(c=>!c.frames?.length||c.outcomes?.length!==100))throw Error("Invalid swarm");
   setData(d);
 }).catch(()=>{if(alive)setData(null)});return()=>{alive=false}},[]);
 const selected=data?.checkpoints.filter(c=>MILESTONES.includes(c.training_steps_approx??-1))||[];
 const cp=selected[stage],frame=cp?.frames[Math.min(tick,(cp?.frames.length||1)-1)];
 // 60s seamless loop. Milestones are fixed before examining the replay.
 // 0-42s: chronological early-learning checkpoints, including real regressions.
 // 42-60s: the genuine final 100k-step policy. Never interpolate fake agents.
 useEffect(()=>{if(!playing||!data||!automatic)return;
   const timer=window.setInterval(()=>setClock(t=>(t+1)%600),100);
   return()=>window.clearInterval(timer);
 },[playing,data,automatic]);
 useEffect(()=>{if(!automatic||!selected.length)return;
   const n=selected.length,early=n-1;
   const index=clock<420?Math.min(early-1,Math.floor(clock/420*early)):n-1;
   const segmentStart=index===n-1?420:index*420/early;
   const elapsedSeconds=(clock-segmentStart)/10;
   const frames=selected[index].frames;
   // Actual simulator runs at 25 frames/s. Short failures repeat as genuine
   // episodes rather than freezing or manufacturing longer survival.
   const rawStep=Math.floor(elapsedSeconds*(index===n-1?36:25));
   setStage(index);
   setTick(rawStep%frames.length);
 },[clock,automatic,data,selected.length]);
 useEffect(()=>{const c=canvas.current;if(!c||!frame)return;const ctx=c.getContext("2d");if(!ctx)return;
   c.width=720;c.height=390;ctx.imageSmoothingEnabled=false;scene(ctx,frame,tick);
 },[frame,tick]);
 if(!data)return <section className="butterfly-swarm"><div className="butterfly-swarm-screen" style={{padding:"100px 24px",textAlign:"center"}}>Preparazione dei voli PPO autentici...</div></section>;
 return <section className="butterfly-swarm" aria-label="Cento farfalle controllate da PPO in un ambiente condiviso">
   <div className="butterfly-swarm-head"><span>100 FARFALLE · IMPARARE A VOLARE</span><span>{automatic?Math.floor(clock/10)+"/60 s":"REPLAY MANUALE"} · PPO REALE</span></div>
   <div className="butterfly-swarm-screen"><canvas ref={canvas} aria-label="Cento farfalle controllate da PPO: ogni volo proviene da un checkpoint autentico"/><div className="butterfly-swarm-count">{frame?.alive.length??0}<small>/ 100 IN VOLO</small></div></div>
   <div className="butterfly-learning-track">{selected.map((item,i)=><button key={item.model} type="button" className={stage===i?"active":""} title={"PPO · "+item.training_steps_approx+" passi"} onClick={()=>{setStage(i);setTick(0);setAutomatic(false);setPlaying(false)}} aria-label={"Mostra checkpoint a "+item.training_steps_approx+" passi"}/>)}</div>
   <div className="butterfly-learning-bottom"><div><strong>{stage===0?"PRIMI TENTATIVI":stage===selected.length-1?"ULTIMO CHECKPOINT":"TENTATIVO "+(stage+1)}</strong><small>{cp?.training_steps_approx===0?"Non addestrato":cp?.training_steps_approx?.toLocaleString("it-IT")+" passi PPO"} · {cp?.outcomes.filter(o=>o.passed>=12).length}/100 raggiungono 12 ostacoli</small></div>
   <div className="butterfly-learning-buttons"><button type="button" onClick={()=>setPlaying(p=>!p)} aria-label={playing?"Pausa":"Riprendi"}>{playing?"Ⅱ":"▶"}</button><button type="button" onClick={()=>{setStage(0);setTick(0);setClock(0);setAutomatic(true);setPlaying(true)}} aria-label="Ricomincia il timelapse">↻</button></div></div>
   <a className="butterfly-game-code" href="https://github.com/andrea-bianco00/butterfly-rl" target="_blank" rel="noopener noreferrer">Replay PPO verificabili ↗</a>
 </section>;
}
