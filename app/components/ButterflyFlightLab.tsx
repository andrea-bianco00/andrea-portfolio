"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Gate = [number, number, number];
type Frame = { step:number; action:number|null; x:number; y:number; vy:number; wind:number; passed:number; gates:Gate[]; crashed?:boolean };
type Episode = { scenario:string; seed:number; crashed:boolean; steps:number; passed:number; frames:Frame[] };
type Replay = { source:string; checkpoint:string; episodes:Episode[] };
const STAGES = ["wide","normal","dense","windy","storm","narrow_ood","dense_ood","wind_ood","combined_ood"];
const NAMES:Record<string,string> = {wide:"01 · Prime ali",normal:"02 · Ostacoli",dense:"03 · Precisione",windy:"04 · Vento",storm:"05 · Tempesta",narrow_ood:"Test · Aperture strette",dense_ood:"Test · Ostacoli fitti",wind_ood:"Test · Vento forte",combined_ood:"Test · Sfida combinata"};

function butterfly(ctx:CanvasRenderingContext2D,x:number,y:number,size:number,t:number){
  ctx.save();ctx.translate(x,y);
  const flap=.62+.38*Math.abs(Math.sin(t*.18));
  ctx.shadowColor="#ff7b20";ctx.shadowBlur=19;
  for(const side of [-1,1]){
    ctx.save();ctx.scale(side*flap,1);
    ctx.fillStyle="#ff7a1a";
    ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(4,-size*.72,size*.88,-size*.9,size*.88,-size*.38);ctx.bezierCurveTo(size*.9,-size*.1,size*.32,size*.16,0,0);ctx.fill();
    ctx.fillStyle="#ffb15d";ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(size*.6,-size*.03,size*.76,size*.45,size*.45,size*.59);ctx.bezierCurveTo(size*.08,size*.73,size*.02,size*.18,0,0);ctx.fill();
    ctx.strokeStyle="rgba(255,223,171,.85)";ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(size*.65,-size*.49);ctx.moveTo(0,0);ctx.lineTo(size*.48,size*.4);ctx.stroke();
    ctx.restore();
  }
  ctx.shadowBlur=8;ctx.fillStyle="#ffe0a7";ctx.beginPath();ctx.ellipse(0,0,2.5,size*.42,0,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle="#ffb86b";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,-size*.3);ctx.quadraticCurveTo(-6,-size*.75,-10,-size*.73);ctx.moveTo(0,-size*.3);ctx.quadraticCurveTo(6,-size*.75,10,-size*.73);ctx.stroke();ctx.restore();
}

export default function ButterflyFlightLab(){
  const canvas=useRef<HTMLCanvasElement>(null);
  const [data,setData]=useState<Replay|null>(null);
  const [error,setError]=useState(false);
  const [scenario,setScenario]=useState("wide");
  const [episodeIndex,setEpisodeIndex]=useState(0);
  const [playing,setPlaying]=useState(true);
  const [step,setStep]=useState(0);
  const [speed,setSpeed]=useState(1);
  const [replayUrl,setReplayUrl]=useState("/butterfly/flights.json");
  useEffect(()=>{
    let alive=true;
    fetch(replayUrl,{cache:"no-store"}).then(async r=>{if(!r.ok)throw Error("No replay");return r.json()}).then((v:Replay)=>{
      if(!alive)return;
      if(!Array.isArray(v.episodes)||!v.episodes.every(e=>Array.isArray(e.frames)))throw Error("Invalid replay");
      setData(v);setError(false);
    }).catch(()=>{if(alive){setError(true);setData(null)}});
    return()=>{alive=false};
  },[replayUrl]);
  const episodes=useMemo(()=>data?.episodes.filter(e=>e.scenario===scenario)||[],[data,scenario]);
  const ep=episodes[episodeIndex]||episodes[0];
  const current=ep?.frames[Math.min(step,ep.frames.length-1)];
  useEffect(()=>{setStep(0);setEpisodeIndex(0)},[scenario,data]);
  useEffect(()=>{
    if(!playing||!ep)return;
    const interval=window.setInterval(()=>setStep(s=>s>=ep.frames.length-1?0:s+1),40/speed);
    return()=>window.clearInterval(interval);
  },[playing,ep,speed]);
  useEffect(()=>{
    const c=canvas.current;if(!c)return;
    const ctx=c.getContext("2d");if(!ctx)return;
    const dpr=Math.min(window.devicePixelRatio||1,2);
    const W=720,H=390;c.width=W*dpr;c.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.clearRect(0,0,W,H);
    // Warm midnight pixel-art landscape, matching the portfolio palette.
    const bg=ctx.createLinearGradient(0,0,0,H);
    bg.addColorStop(0,"#090609");bg.addColorStop(.68,"#21110e");bg.addColorStop(1,"#3b1b10");
    ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
    for(let i=0;i<48;i++){
      const sx=(i*137+39)%W,sy=(i*83+17)%(H-90);
      ctx.fillStyle=i%4===0?"#f99b4b":"#774229";ctx.fillRect(sx,sy,i%6===0?3:2,2);
    }
    ctx.fillStyle="#261713";ctx.beginPath();ctx.moveTo(0,H-55);
    for(let x=0;x<=W;x+=8)ctx.lineTo(x,H-100-22*Math.sin(x*.012)-11*Math.sin(x*.031));
    ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.fill();
    ctx.fillStyle="#3a2017";ctx.beginPath();ctx.moveTo(0,H-38);
    for(let x=0;x<=W;x+=8)ctx.lineTo(x,H-70-13*Math.sin(x*.02+2));
    ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.fill();
    ctx.fillStyle="#5e321b";ctx.fillRect(0,H-18,W,18);
    ctx.fillStyle="#ff8a31";ctx.fillRect(0,H-20,W,2);
    if(!ep||!current){
      ctx.textAlign="center";ctx.fillStyle="#ffa65a";ctx.font="600 17px monospace";ctx.fillText("AWAITING REAL PPO FLIGHT DATA",W/2,H*.78);
      butterfly(ctx,W*.5,H*.42,51,0);
      ctx.fillStyle="#a38b7b";ctx.font="13px monospace";ctx.fillText("Visual preview · no trained policy loaded",W/2,H*.87);
      return;
    }
    const scale=H/4,px=W*.25,origin=current.x;
    const toX=(x:number)=>px+(x-origin)*scale;
    const toY=(y:number)=>H-y*scale;
    ctx.fillStyle="#2d1b17";ctx.fillRect(0,0,W,7);
    ctx.fillStyle="#a85b2b";ctx.fillRect(0,7,W,2);
    for(const [gx,gc,gh] of current.gates){
      const x=toX(gx),width=.38*scale;
      if(x<-width||x>W+width)continue;
      const top=toY(gc+gh),bottom=toY(gc-gh);
      ctx.fillStyle="#19171b";ctx.fillRect(x-width/2,0,width,top);ctx.fillRect(x-width/2,bottom,width,H-bottom);
      ctx.fillStyle="#49332a";ctx.fillRect(x-width/2,Math.max(0,top-9),width,9);ctx.fillRect(x-width/2,bottom,width,9);
      ctx.strokeStyle="rgba(240,128,48,.5)";ctx.strokeRect(x-width/2,0,width,top);ctx.strokeRect(x-width/2,bottom,width,H-bottom);
    }
    const trail=ep.frames.slice(Math.max(0,step-32),step+1);
    trail.forEach((f,i)=>{const a=i/trail.length;ctx.fillStyle="rgba(255,128,37,"+(a*.32)+")";ctx.beginPath();ctx.arc(toX(f.x),toY(f.y),1+a*3,0,Math.PI*2);ctx.fill()});
    butterfly(ctx,px,toY(current.y),22,step);
    if(current.crashed){ctx.fillStyle="#ffb391";ctx.font="bold 18px monospace";ctx.textAlign="center";ctx.fillText("COLLISION",W/2,42)}
  },[current,ep,step]);
  const available=Array.from(new Set(data?.episodes.map(e=>e.scenario)||[]));
  return <section className="butterfly-lab" aria-label="Esperimento di apprendimento per rinforzo">
    <div className="butterfly-lab-top"><div><span className="butterfly-lab-kicker">BUTTERFLY RL</span><h2>Learning <em>to fly.</em></h2><p>Una farfalla, un ambiente, una rete neurale. Il volo si impara per tentativi: qui riproduciamo solo decisioni realmente registrate dal modello PPO.</p></div><div className="butterfly-lab-status"><span className={"butterfly-lab-dot "+(data?"ready":"")}/>{data?"REPLAY VERIFICABILE":"IN ATTESA DEI DATI"}</div></div>
    <div className="butterfly-lab-screen"><canvas ref={canvas} aria-label={data?"Riproduzione di una traiettoria PPO registrata":"Anteprima grafica della farfalla, senza risultati di addestramento"}/><div className="butterfly-lab-screen-label">BUTTERFLY RL <span>SIMULATION V5 · PPO</span></div></div>
    {data&&ep?<div className="butterfly-lab-controls">
      <label>Scenario<select value={scenario} onChange={e=>setScenario(e.target.value)}>{available.map(s=><option value={s} key={s}>{NAMES[s]||s}</option>)}</select></label>
      <label>Episodio<select value={episodeIndex} onChange={e=>{setEpisodeIndex(Number(e.target.value));setStep(0)}}>{episodes.map((e,i)=><option key={i} value={i}>Seed {e.seed} · {e.passed} ostacoli · {e.crashed?"collisione":"fine episodio"}</option>)}</select></label>
      <button type="button" onClick={()=>setPlaying(p=>!p)}>{playing?"Ⅱ Pausa":"▶ Riprendi"}</button>
      <button type="button" onClick={()=>{setStep(0);setPlaying(true)}}>↺ Replay</button>
      <button type="button" onClick={()=>setSpeed(s=>s===1?2:s===2?4:1)}>{speed}×</button>
      <input type="range" min={0} max={Math.max(0,ep.frames.length-1)} value={step} onChange={e=>{setStep(Number(e.target.value));setPlaying(false)}} aria-label="Scorri il replay"/>
    </div>:<div className="butterfly-lab-wait"><strong>Il laboratorio è pronto. Aspettiamo le traiettorie vere.</strong><span>La farfalla visibile sopra è soltanto un'anteprima grafica, non una dimostrazione di apprendimento.</span></div>}
    <div className="butterfly-lab-footer"><span>{ep&&current?`STEP ${current.step} · OSTACOLI SUPERATI ${current.passed} · VENTO ${current.wind.toFixed(2)}`:"NO METRICS UNTIL TRAINING COMPLETES"}</span><a href="https://github.com/andrea-bianco00/butterfly-rl" target="_blank" rel="noopener noreferrer">CODICE E METODO ↗</a></div>
    <p className="butterfly-lab-disclaimer">PPO controlla la portanza in un simulatore 2D semplificato, non la fisica aerodinamica reale. Le ali animate sono una rappresentazione artistica; posizione, azione, ostacoli e collisioni provengono dai replay registrati.</p>
  </section>;
}
