"use client";
import {useEffect,useRef,useState} from "react";
import ButterflyFlightLab from "./ButterflyFlightLab";

type Gate=[number,number,number];
type Frame={step:number;x:number;y:number;passed:number;gates:Gate[];crashed?:boolean};
type Episode={seed:number;crashed:boolean;passed:number;steps:number;frames:Frame[]};
type Checkpoint={label:string;file:string;training_steps_approx:number|null;episodes:Episode[]};
type Learning={source:string;scenario:string;checkpoints:Checkpoint[]};
const URL="https://raw.githubusercontent.com/andrea-bianco00/butterfly-rl/main/data/replays/learning-v5-1729.json";
const LABELS:Record<string,string>={Untrained:"Senza addestramento",Wide:"Prime ali",Normal:"Ostacoli",Dense:"Precisione",Windy:"Vento",Storm:"Tempesta",Best:"Modello selezionato"};
function drawButterfly(ctx:CanvasRenderingContext2D,x:number,y:number,t:number){
  ctx.save();ctx.translate(x,y);
  const f=.65+.3*Math.abs(Math.sin(t*.28));
  ctx.fillStyle="#ff8b28";ctx.shadowColor="#ff8b28";ctx.shadowBlur=8;
  for(const side of [-1,1]){
    ctx.save();ctx.scale(side*f,1);ctx.beginPath();ctx.moveTo(0,0);
    ctx.bezierCurveTo(3,-9,14,-10,12,-2);ctx.quadraticCurveTo(10,2,0,0);ctx.fill();
    ctx.fillStyle="#ffb75f";ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(12,1,8,8);ctx.quadraticCurveTo(3,10,0,0);ctx.fill();ctx.restore();
  }
  ctx.shadowBlur=0;ctx.fillStyle="#fff0b8";ctx.fillRect(-1,-5,2,10);ctx.restore();
}
function paint(ctx:CanvasRenderingContext2D,ep:Episode|undefined,t:number,row:number){
  const W=720,L=130,offset=row*L;
  ctx.save();ctx.beginPath();ctx.rect(0,offset,W,L);ctx.clip();
  const bg=ctx.createLinearGradient(0,offset,0,offset+L);bg.addColorStop(0,"#0b090c");bg.addColorStop(1,"#301810");
  ctx.fillStyle=bg;ctx.fillRect(0,offset,W,L);
  for(let i=0;i<25;i++){ctx.fillStyle=i%3?"#663a26":"#d47d36";ctx.fillRect((i*131+row*41)%W,offset+(i*47)%110,2,2)}
  ctx.fillStyle="#281813";ctx.beginPath();ctx.moveTo(0,offset+L);
  for(let x=0;x<=W;x+=12)ctx.lineTo(x,offset+L-22-9*Math.sin(x*.013+row));
  ctx.lineTo(W,offset+L);ctx.fill();
  if(ep?.frames?.length){
    const index=Math.min(t,ep.frames.length-1),f=ep.frames[index];
    const scale=L/4,px=155,toX=(x:number)=>px+(x-f.x)*scale,toY=(y:number)=>offset+L-y*scale;
    for(const [gx,gc,gh] of f.gates){
      const x=toX(gx),w=.38*scale,top=toY(gc+gh),bottom=toY(gc-gh);
      if(x< -w||x>W+w)continue;
      ctx.fillStyle="#19161a";ctx.fillRect(x-w/2,offset,w,Math.max(0,top-offset));ctx.fillRect(x-w/2,bottom,w,Math.max(0,offset+L-bottom));
      ctx.fillStyle="#62402b";ctx.fillRect(x-w/2,Math.max(offset,top-4),w,4);ctx.fillRect(x-w/2,bottom,w,4);
    }
    const trail=ep.frames.slice(Math.max(0,index-12),index+1);
    trail.forEach((v,i)=>{ctx.fillStyle="rgba(255,133,41,"+(i/trail.length*.35)+")";ctx.fillRect(toX(v.x),toY(v.y),2,2)});
    drawButterfly(ctx,px,toY(f.y),t);
    ctx.font="bold 12px monospace";ctx.fillStyle="#ffb879";ctx.textAlign="left";
    ctx.fillText("TENTATIVO "+(row+1),14,offset+19);
    ctx.textAlign="right";ctx.fillText(String(f.passed)+" OSTACOLI",W-13,offset+19);
    if(index===ep.frames.length-1){
      ctx.textAlign="center";ctx.font="bold 13px monospace";ctx.fillStyle="#ffe0b2";
      ctx.fillText(ep.crashed?"COLLISIONE":"LIMITE DEL TEST",W/2,offset+L/2);
    }
  }
  ctx.restore();
  if(row<2){ctx.fillStyle="#724029";ctx.fillRect(0,offset+L-1,W,1)}
}
export default function ButterflyLearningTimelapse(){
  const [data,setData]=useState<Learning|null>(null);
  const [stage,setStage]=useState(0);
  const [tick,setTick]=useState(0);
  const [playing,setPlaying]=useState(true);
  const [auto,setAuto]=useState(true);
  const canvas=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{let live=true;fetch(URL,{cache:"no-store"}).then(r=>{if(!r.ok)throw Error("not published");return r.json()}).then((d:Learning)=>{
    if(!live)return;
    if(!Array.isArray(d.checkpoints)||d.checkpoints.length!==7||d.checkpoints.some(c=>!Array.isArray(c.episodes)||c.episodes.length<3||c.episodes.some(e=>!Array.isArray(e.frames)||!e.frames.length)))throw Error("invalid replay");
    setData(d);
  }).catch(()=>{if(live)setData(null)});return()=>{live=false}},[]);
  const cp=data?.checkpoints[stage];
  useEffect(()=>{if(!playing||!data)return;const timer=window.setInterval(()=>setTick(t=>{
    if(t>=199){if(auto)setStage(s=>(s+1)%data.checkpoints.length);return 0}
    return t+2;
  }),40);return()=>window.clearInterval(timer)},[playing,auto,data]);
  useEffect(()=>{
    const c=canvas.current;if(!c||!cp)return;
    const ctx=c.getContext("2d");if(!ctx)return;
    c.width=720;c.height=390;ctx.imageSmoothingEnabled=false;
    for(let i=0;i<3;i++)paint(ctx,cp.episodes[i],tick,i);
  },[cp,tick]);
  if(!data)return <ButterflyFlightLab/>;
  return <section className="butterfly-learning" aria-label="Timelapse autentico dei checkpoint PPO">
    <div className="butterfly-learning-head"><span>LEARNING TO FLY</span><span>{stage+1} / {data.checkpoints.length}</span></div>
    <div className="butterfly-learning-screen"><canvas ref={canvas} aria-label="Tre episodi reali e indipendenti per il checkpoint corrente"/></div>
    <div className="butterfly-learning-track" aria-label="Checkpoint dell'addestramento">
      {data.checkpoints.map((item,i)=><button key={item.file} type="button" className={i===stage?"active":""} title={LABELS[item.label]||item.label} onClick={()=>{setStage(i);setTick(0);setAuto(false)}} aria-label={"Mostra checkpoint "+(LABELS[item.label]||item.label)}/>)}
    </div>
    <div className="butterfly-learning-bottom">
      <div><strong>{LABELS[cp?.label||""]||cp?.label}</strong><small>{cp?.training_steps_approx===null?"Checkpoint migliore (selezionato su validazione)":cp?.training_steps_approx===0?"Policy non addestrata":(cp?.training_steps_approx||0).toLocaleString("it-IT")+" passi circa"} · 3 replay autentici</small></div>
      <div className="butterfly-learning-buttons">
        <button type="button" onClick={()=>setPlaying(p=>!p)} aria-label={playing?"Pausa":"Riprendi"}>{playing?"Ⅱ":"▶"}</button>
        <button type="button" onClick={()=>{setStage(0);setTick(0);setAuto(true);setPlaying(true)}} aria-label="Riproduci tutta la progressione">↻</button>
      </div>
    </div>
    <a href="https://github.com/andrea-bianco00/butterfly-rl" target="_blank" rel="noopener noreferrer" className="butterfly-game-code">PPO v5 · traiettorie verificabili ↗</a>
  </section>;
}
