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
  const after=next(x,method);
  const step=history.length-1;
  const errorAfter=Math.sqrt(((after[0][0]-5)**2+(after[0][1]-4)**2+(after[1][0]-2)**2)/3);
  const reset=(m:"svp"|"svt")=>{setMethod(m);setHistory([original]);};
  const grid=(m:(number|null)[][],highlight:boolean)=><div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(68px,1fr))",gap:8,maxWidth:240}}>{m.flatMap((row,i)=>row.map((v,j)=><div key={i+"-"+j} style={{minHeight:64,display:"grid",placeItems:"center",border:"1px solid "+(highlight&&observed[i][j]===null?"#ed852e":"#64432c"),background:highlight&&observed[i][j]===null?"#3c250f":"#21160f",borderRadius:9,fontVariantNumeric:"tabular-nums",fontWeight:700,color:"#ffe2c5"}}>{v===null?"?":fmt(v)}</div>))}</div>;
  return <section style={{marginTop:28,padding:"clamp(16px,3vw,26px)",border:"1px solid var(--line)",borderRadius:16,background:"#100c09"}}>
    <div style={{fontSize:11,color:"var(--orange)",fontWeight:700,letterSpacing:".1em"}}>LABORATORIO INTERATTIVO</div>
    <h4 style={{fontSize:21,margin:"10px 0"}}>Un aggiornamento alla volta</h4>
    <p style={{fontSize:13,lineHeight:1.7,color:"var(--muted)"}}>Qui i numeri sono calcolati nel browser su una matrice sintetica 2×2. Non sono i risultati di MovieLens. Puoi confrontare SVP (rango 1) e SVT (soglia 0,8): a ogni clic viene applicato davvero un aggiornamento.</p>
    <p style={{fontSize:13,lineHeight:1.7,color:"var(--paper)",padding:"12px 15px",borderLeft:"3px solid var(--orange)",background:"#21150e"}}><strong>Come usarlo:</strong> scegli SVP o SVT, poi premi «Iterazione successiva». A ogni passo confronta la stima con i tre voti conosciuti. Il quarto voto è nascosto: il modello lo deve stimare senza conoscere il valore vero.</p>
    <div role="group" aria-label="Metodo per la simulazione" style={{display:"flex",gap:8,margin:"16px 0",flexWrap:"wrap"}}>
      {(["svp","svt"] as const).map(m=><button key={m} type="button" aria-pressed={method===m} onClick={()=>reset(m)} style={{cursor:"pointer",borderRadius:99,padding:"9px 16px",background:method===m?"var(--orange)":"#291b12",color:method===m?"#170b03":"var(--paper)",border:"1px solid var(--line)",fontWeight:700}}>{m.toUpperCase()}</button>)}
    </div>
    <p style={{fontSize:12,color:"var(--muted)",margin:"8px 0"}}>{method==="svp"?"SVP: dopo ogni correzione conserva una sola componente singolare (rango 1).":"SVT: dopo ogni correzione riduce ogni valore singolare di 0,8 (soglia)."} Cambiare metodo riavvia la simulazione.</p>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:24,margin:"24px 0"}}>
      <div><strong style={{fontSize:13}}>Voti osservati</strong><div style={{marginTop:12}}>{grid(observed,false)}</div><p style={{fontSize:12,color:"var(--muted)"}}>Il punto interrogativo non entra nel calcolo degli errori.</p></div>
      <div><strong style={{fontSize:13}}>Stima dopo {history.length-1} aggiornamenti</strong><div style={{marginTop:12}}>{grid(x,true)}</div><p style={{fontSize:12,color:"var(--muted)"}}>La cella arancione è il voto da stimare.</p></div>
    </div>
    <div style={{display:"flex",flexWrap:"wrap",alignItems:"center",gap:12,marginBottom:18}}>
      <button type="button" disabled={history.length>=21} onClick={()=>setHistory(h=>[...h,next(h[h.length-1],method)])} style={{cursor:"pointer",padding:"11px 16px",borderRadius:9,border:0,background:"var(--orange)",color:"#1a0a00",fontWeight:750,opacity:history.length>=21?.5:1}}>Iterazione successiva →</button>
      <button type="button" disabled={step===0} onClick={()=>setHistory(h=>h.slice(0,-1))} style={{cursor:step===0?"not-allowed":"pointer",padding:"11px 16px",borderRadius:9,border:"1px solid var(--line)",background:"transparent",color:"var(--paper)",opacity:step===0?.45:1}}>← Passo precedente</button>
      <button type="button" onClick={()=>setHistory([original])} style={{cursor:"pointer",padding:"11px 16px",borderRadius:9,border:"1px solid var(--line)",background:"transparent",color:"var(--paper)"}}>Ricomincia</button>
      <span style={{fontSize:12,color:"var(--muted)"}}>Passo {step}/20 · Errore sui tre voti conosciuti: <strong style={{color:"var(--paper)"}}>{fmt(error)}</strong></span>
    </div>
    <div style={{fontSize:13,lineHeight:1.8,color:"var(--muted)",borderTop:"1px solid var(--line)",paddingTop:14}}>
      <strong style={{color:"var(--paper)"}}>Cosa farà il prossimo clic? Dal passo {step} al passo {step+1}</strong>
      <p style={{margin:"6px 0"}}>1. Calcoliamo la differenza tra voto reale e previsione nelle tre celle note. Con passo pari a 1, correggiamo quelle tre celle fino al valore osservato. La cella sconosciuta resta com’era.</p>
      <div style={{margin:"16px 0",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(175px,1fr))",gap:16}}><div><strong style={{color:"var(--paper)",fontSize:12}}>Matrice dopo la correzione degli errori</strong><div style={{marginTop:10}}>{grid(corrected,true)}</div></div><div><strong style={{color:"var(--paper)",fontSize:12}}>Risultato del prossimo aggiornamento</strong><div style={{marginTop:10}}>{grid(after,true)}</div></div></div>
      <p style={{margin:"6px 0"}}>2. La matrice corretta ha valori singolari {fmt(before[0])} e {fmt(before[1])}. Sono numeri che misurano il peso delle due componenti nella decomposizione SVD.</p>
      <p style={{margin:"6px 0"}}>3. {method==="svp"?"SVP mantiene la componente maggiore ed elimina la seconda. Questo vincola la matrice a rango 1.":"SVT riduce entrambi i valori singolari di 0,8, senza andare sotto zero. Le componenti più piccole possono sparire."}</p>
      <p style={{margin:"8px 0",color:"var(--paper)"}}>Se premi il pulsante, l’errore sui tre voti conosciuti passerà da {fmt(error)} a {fmt(errorAfter)}. {errorAfter>error+1e-8?"In questo passo aumenta: non è garantito che diminuisca a ogni iterazione.":"Questo non misura la qualità della previsione del voto nascosto."}</p>
    </div>
    <p style={{fontSize:12,lineHeight:1.7,color:"var(--muted)",margin:"15px 0 0"}}><strong style={{color:"var(--paper)"}}>Attenzione:</strong> l’RMSE sui voti conosciuti è un errore di addestramento, non un controllo della previsione mancante. Senza conoscere quel quarto voto non possiamo sapere se la stima sia corretta. I valori della matrice possono anche uscire dall’intervallo 0–5: qui non applichiamo limiti artificiali alle previsioni.</p>
    <p style={{fontSize:11,lineHeight:1.7,color:"var(--muted)",margin:"15px 0 0"}}>Dimostrazione numerica ridotta: stessa logica di aggiornamento e decomposizione SVD dei due metodi del progetto, ma dimensioni e parametri scelti per essere leggibili. L'RMSE mostrato è sul piccolo esempio osservato, non sulla validation del progetto.</p>
  </section>;
}
