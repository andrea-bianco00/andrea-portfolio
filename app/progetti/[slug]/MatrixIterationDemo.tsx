"use client";
import {useState} from "react";
type M = [[number,number],[number,number]];
const observed: (number|null)[][] = [[5,4],[2,null]];
const original: M = [[0,0],[0,0]];
function svdShrink(a:M, threshold:number, rankOnly:boolean):{matrix:M,singular:number[]} {
  const [x,y]=a[0], [z,w]=a[1];
  const p=x*x+z*z,q=x*y+z*w,s=y*y+w*w;
  const disc=Math.sqrt(Math.max(0,(p-s)*(p-s)+4*q*q));
  const eig=[Math.max(0,(p+s+disc)/2),Math.max(0,(p+s-disc)/2)];
  const out:M=[[0,0],[0,0]];
  eig.forEach((lambda,i)=>{
    const sigma=Math.sqrt(lambda);
    if(sigma<1e-10)return;
    let v0=q,v1=lambda-p;
    if(Math.abs(v0)+Math.abs(v1)<1e-10){v0=lambda===p?1:0;v1=lambda===p?0:1;}
    const norm=Math.hypot(v0,v1);v0/=norm;v1/=norm;
    const av0=x*v0+y*v1,av1=z*v0+w*v1;
    const newSigma=rankOnly?(i===0?sigma:0):Math.max(0,sigma-threshold);
    const scale=newSigma/sigma;
    out[0][0]+=scale*av0*v0;out[0][1]+=scale*av0*v1;
    out[1][0]+=scale*av1*v0;out[1][1]+=scale*av1*v1;
  });
  return {matrix:out,singular:eig.map(Math.sqrt)};
}
function next(x:M, method:"svp"|"svt"):M {
  const z:M=[[...x[0]],[...x[1]]] as M;
  for(let i=0;i<2;i++)for(let j=0;j<2;j++)if(observed[i][j]!==null)z[i][j]+=(observed[i][j] as number)-x[i][j];
  return svdShrink(z,method==="svt"?0.8:0,method==="svp").matrix;
}
const fmt=(x:number)=>x.toFixed(2).replace(".",",");
export default function MatrixIterationDemo(){
  const [method,setMethod]=useState<"svp"|"svt">("svp");
  const [history,setHistory]=useState<M[]>([original]);
  const x=history[history.length-1];
  const error=Math.sqrt(((x[0][0]-5)**2+(x[0][1]-4)**2+(x[1][0]-2)**2)/3);
  const corrected:M=[[5,4],[2,x[1][1]]];
  const before=svdShrink(corrected,0,false).singular;
  const reset=(m:"svp"|"svt")=>{setMethod(m);setHistory([original]);};
  const grid=(m:(number|null)[][],highlight:boolean)=><div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(68px,1fr))",gap:8,maxWidth:240}}>{m.flatMap((row,i)=>row.map((v,j)=><div key={i+"-"+j} style={{minHeight:64,display:"grid",placeItems:"center",border:"1px solid "+(highlight&&observed[i][j]===null?"#ed852e":"#64432c"),background:highlight&&observed[i][j]===null?"#3c250f":"#21160f",borderRadius:9,fontVariantNumeric:"tabular-nums",fontWeight:700,color:"#ffe2c5"}}>{v===null?"?":fmt(v)}</div>))}</div>;
  return <section style={{marginTop:28,padding:"clamp(16px,3vw,26px)",border:"1px solid var(--line)",borderRadius:16,background:"#100c09"}}>
    <div style={{fontSize:11,color:"var(--orange)",fontWeight:700,letterSpacing:".1em"}}>LABORATORIO INTERATTIVO</div>
    <h4 style={{fontSize:21,margin:"10px 0"}}>Un aggiornamento alla volta</h4>
    <p style={{fontSize:13,lineHeight:1.7,color:"var(--muted)"}}>Qui i numeri sono calcolati nel browser su una matrice sintetica 2×2. Non sono i risultati di MovieLens. Puoi confrontare SVP (rango 1) e SVT (soglia 0,8): a ogni clic viene applicato davvero un aggiornamento.</p>
    <div role="group" aria-label="Metodo per la simulazione" style={{display:"flex",gap:8,margin:"16px 0",flexWrap:"wrap"}}>
      {(["svp","svt"] as const).map(m=><button key={m} type="button" aria-pressed={method===m} onClick={()=>reset(m)} style={{cursor:"pointer",borderRadius:99,padding:"9px 16px",background:method===m?"var(--orange)":"#291b12",color:method===m?"#170b03":"var(--paper)",border:"1px solid var(--line)",fontWeight:700}}>{m.toUpperCase()}</button>)}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:24,margin:"24px 0"}}>
      <div><strong style={{fontSize:13}}>Voti osservati</strong><div style={{marginTop:12}}>{grid(observed,false)}</div><p style={{fontSize:12,color:"var(--muted)"}}>Il punto interrogativo non entra nel calcolo degli errori.</p></div>
      <div><strong style={{fontSize:13}}>Stima dopo {history.length-1} aggiornamenti</strong><div style={{marginTop:12}}>{grid(x,true)}</div><p style={{fontSize:12,color:"var(--muted)"}}>La cella arancione è il voto da stimare.</p></div>
    </div>
    <div style={{display:"flex",flexWrap:"wrap",alignItems:"center",gap:12,marginBottom:18}}>
      <button type="button" disabled={history.length>=21} onClick={()=>setHistory(h=>[...h,next(h[h.length-1],method)])} style={{cursor:"pointer",padding:"11px 16px",borderRadius:9,border:0,background:"var(--orange)",color:"#1a0a00",fontWeight:750,opacity:history.length>=21?.5:1}}>Iterazione successiva →</button>
      <button type="button" onClick={()=>setHistory([original])} style={{cursor:"pointer",padding:"11px 16px",borderRadius:9,border:"1px solid var(--line)",background:"transparent",color:"var(--paper)"}}>Ricomincia</button>
      <span style={{fontSize:12,color:"var(--muted)"}}>Errore RMSE sui 3 voti noti: <strong style={{color:"var(--paper)"}}>{fmt(error)}</strong></span>
    </div>
    <div style={{fontSize:13,lineHeight:1.8,color:"var(--muted)",borderTop:"1px solid var(--line)",paddingTop:14}}>
      <strong style={{color:"var(--paper)"}}>Cosa succede al prossimo passo?</strong>
      <p style={{margin:"6px 0"}}>1. Nelle tre celle note sostituiamo la stima con il voto osservato (passo = 1). La quarta resta invariata.</p>
      <p style={{margin:"6px 0"}}>2. La matrice corretta ha valori singolari circa {fmt(before[0])} e {fmt(before[1])}.</p>
      <p style={{margin:"6px 0"}}>3. {method==="svp"?"SVP conserva solo la componente singolare maggiore: il rango torna a 1.":"SVT sottrae 0,8 a ogni valore singolare, senza scendere sotto zero, e ricostruisce la matrice."}</p>
    </div>
    <p style={{fontSize:11,lineHeight:1.7,color:"var(--muted)",margin:"15px 0 0"}}>Dimostrazione numerica ridotta: stessa logica di aggiornamento e decomposizione SVD dei due metodi del progetto, ma dimensioni e parametri scelti per essere leggibili. L'RMSE mostrato è sul piccolo esempio osservato, non sulla validation del progetto.</p>
  </section>;
}
