"use client";
import {useState} from "react";
type M = [[number,number],[number,number]];
type Method = "mean"|"bias"|"svp"|"svt"|"admira";
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
function next(x:M, method:Method):M {
  if(method==="mean"){
    const mu=(5+4+2)/3;
    return [[mu,mu],[mu,mu]];
  }
  if(method==="bias"){
    const mu=11/3, lambda=1;
    // Coordinate descent on regularized user and item effects.
    // Reconstruct current effects from the stored model state separately below.
    return [[mu,mu],[mu,mu]];
  }
  if(method==="admira"){
    // Small illustrative pursuit: dominant residual atom + current estimate,
    // observed-entry least squares, then rank-one truncation.
    const residual:M=[[5-x[0][0],4-x[0][1]],[2-x[1][0],0]];
    const atom=svdShrink(residual,0,true).matrix;
    const a=[x[0][0],x[0][1],x[1][0]];
    const b=[atom[0][0],atom[0][1],atom[1][0]];
    const y=[5,4,2];
    const aa=a.reduce((s,v)=>s+v*v,0),bb=b.reduce((s,v)=>s+v*v,0);
    const ab=a.reduce((s,v,i)=>s+v*b[i],0);
    const ay=a.reduce((s,v,i)=>s+v*y[i],0),by=b.reduce((s,v,i)=>s+v*y[i],0);
    const det=(aa+1e-8)*(bb+1e-8)-ab*ab;
    const alpha=((bb+1e-8)*ay-ab*by)/det;
    const beta=((aa+1e-8)*by-ab*ay)/det;
    const candidate:M=[[alpha*x[0][0]+beta*atom[0][0],alpha*x[0][1]+beta*atom[0][1]],[alpha*x[1][0]+beta*atom[1][0],alpha*x[1][1]+beta*atom[1][1]]];
    return svdShrink(candidate,0,true).matrix;
  }
  const z:M=[[...x[0]],[...x[1]]] as M;
  for(let i=0;i<2;i++)for(let j=0;j<2;j++)if(observed[i][j]!==null)z[i][j]+=(observed[i][j] as number)-x[i][j];
  return svdShrink(z,method==="svt"?0.8:0,method==="svp").matrix;
}
type BiasState={u:[number,number],v:[number,number]};
const zeroBias:BiasState={u:[0,0],v:[0,0]};
function updateBias(state:BiasState):BiasState {
  const mu=11/3, lambda=1;
  const u:[number,number]=[(5-mu-state.v[0]+4-mu-state.v[1])/(2+lambda),(2-mu-state.v[0])/(1+lambda)];
  const v:[number,number]=[(5-mu-u[0]+2-mu-u[1])/(2+lambda),(4-mu-u[0])/(1+lambda)];
  return {u,v};
}
function biasMatrix(s:BiasState):M {const mu=11/3;return [[mu+s.u[0]+s.v[0],mu+s.u[0]+s.v[1]],[mu+s.u[1]+s.v[0],mu+s.u[1]+s.v[1]]];}
const fmt=(x:number)=>x.toFixed(2).replace(".",",");
export default function MatrixIterationDemo(){
  const [method,setMethod]=useState<Method>("svp");
  const [biasHistory,setBiasHistory]=useState<BiasState[]>([zeroBias]);
  const [history,setHistory]=useState<M[]>([original]);
  const x=method==="bias"?biasMatrix(biasHistory[biasHistory.length-1]):history[history.length-1];
  const error=Math.sqrt(((x[0][0]-5)**2+(x[0][1]-4)**2+(x[1][0]-2)**2)/3);
  const corrected:M=[[5,4],[2,x[1][1]]];
  const before=svdShrink(corrected,0,false).singular;
  const after=method==="bias"?biasMatrix(updateBias(biasHistory[biasHistory.length-1])):next(x,method);
  const step=method==="bias"?biasHistory.length-1:history.length-1;
  const errorAfter=Math.sqrt(((after[0][0]-5)**2+(after[0][1]-4)**2+(after[1][0]-2)**2)/3);
  const reset=(m:Method)=>{setMethod(m);setHistory([original]);setBiasHistory([zeroBias]);};
  const grid=(m:(number|null)[][],highlight:boolean)=><div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(68px,1fr))",gap:8,maxWidth:240}}>{m.flatMap((row,i)=>row.map((v,j)=><div key={i+"-"+j} style={{minHeight:64,display:"grid",placeItems:"center",border:"1px solid "+(highlight&&observed[i][j]===null?"#ed852e":"#64432c"),background:highlight&&observed[i][j]===null?"#3c250f":"#21160f",borderRadius:9,fontVariantNumeric:"tabular-nums",fontWeight:700,color:"#ffe2c5"}}>{v===null?"?":fmt(v)}</div>))}</div>;
  return <section style={{marginTop:28,padding:"clamp(16px,3vw,26px)",border:"1px solid var(--line)",borderRadius:16,background:"#100c09"}}>
    <div style={{fontSize:11,color:"var(--orange)",fontWeight:700,letterSpacing:".1em"}}>LABORATORIO INTERATTIVO</div>
    <h4 style={{fontSize:21,margin:"10px 0"}}>Un aggiornamento alla volta</h4>
    <p style={{fontSize:13,lineHeight:1.7,color:"var(--muted)"}}>Qui i numeri sono calcolati nel browser su una matrice sintetica 2×2. Non sono i risultati di MovieLens. Puoi provare tutti e cinque i metodi: a ogni clic viene calcolato un nuovo aggiornamento. I parametri sono scelti per questo esempio, non quelli ottimizzati su MovieLens.</p>
    <p style={{fontSize:13,lineHeight:1.7,color:"var(--paper)",padding:"12px 15px",borderLeft:"3px solid var(--orange)",background:"#21150e"}}><strong>Come usarlo:</strong> scegli SVP o SVT, poi premi «Iterazione successiva». A ogni passo confronta la stima con i tre voti conosciuti. Il quarto voto è nascosto: il modello lo deve stimare senza conoscere il valore vero.</p>
    <div role="group" aria-label="Metodo per la simulazione" style={{display:"flex",gap:8,margin:"16px 0",flexWrap:"wrap"}}>
      {(["mean","bias","svp","svt","admira"] as const).map(m=><button key={m} type="button" aria-pressed={method===m} onClick={()=>reset(m)} style={{cursor:"pointer",borderRadius:99,padding:"9px 16px",background:method===m?"var(--orange)":"#291b12",color:method===m?"#170b03":"var(--paper)",border:"1px solid var(--line)",fontWeight:700}}>{({mean:"Media globale",bias:"Bias utente–film",svp:"SVP",svt:"SVT",admira:"ADMiRA-inspired"} as const)[m]}</button>)}
    </div>
    <p style={{fontSize:12,color:"var(--muted)",margin:"8px 0"}}>{({mean:"Media globale: calcola la media dei tre voti e la usa per tutte le celle.",bias:"Bias: aggiorna alternativamente gli effetti di utenti e film con penalizzazione lambda = 1.",svp:"SVP: conserva una componente singolare (rango 1).",svt:"SVT: riduce ogni valore singolare di 0,8.",admira:"ADMiRA-inspired: aggiunge una direzione del residuo, stima i coefficienti sui voti noti e torna a rango 1."} as const)[method]} Cambiare metodo riavvia la simulazione.</p>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:24,margin:"24px 0"}}>
      <div><strong style={{fontSize:13}}>Voti osservati</strong><div style={{marginTop:12}}>{grid(observed,false)}</div><p style={{fontSize:12,color:"var(--muted)"}}>Il punto interrogativo non entra nel calcolo degli errori.</p></div>
      <div><strong style={{fontSize:13}}>Stima dopo {step} aggiornamenti</strong><div style={{marginTop:12}}>{grid(x,true)}</div><p style={{fontSize:12,color:"var(--muted)"}}>La cella arancione è il voto da stimare.</p></div>
    </div>
    <div style={{display:"flex",flexWrap:"wrap",alignItems:"center",gap:12,marginBottom:18}}>
      <button type="button" disabled={step>=20} onClick={()=>method==="bias"?setBiasHistory(h=>[...h,updateBias(h[h.length-1])]):setHistory(h=>[...h,next(h[h.length-1],method)])} style={{cursor:"pointer",padding:"11px 16px",borderRadius:9,border:0,background:"var(--orange)",color:"#1a0a00",fontWeight:750,opacity:history.length>=21?.5:1}}>Iterazione successiva →</button>
      <button type="button" disabled={step===0} onClick={()=>method==="bias"?setBiasHistory(h=>h.slice(0,-1)):setHistory(h=>h.slice(0,-1))} style={{cursor:step===0?"not-allowed":"pointer",padding:"11px 16px",borderRadius:9,border:"1px solid var(--line)",background:"transparent",color:"var(--paper)",opacity:step===0?.45:1}}>← Passo precedente</button>
      <button type="button" onClick={()=>reset(method)} style={{cursor:"pointer",padding:"11px 16px",borderRadius:9,border:"1px solid var(--line)",background:"transparent",color:"var(--paper)"}}>Ricomincia</button>
      <span style={{fontSize:12,color:"var(--muted)"}}>Passo {step}/20 · Errore sui tre voti conosciuti: <strong style={{color:"var(--paper)"}}>{fmt(error)}</strong></span>
    </div>
    <div style={{fontSize:13,lineHeight:1.8,color:"var(--muted)",borderTop:"1px solid var(--line)",paddingTop:14}}>
      <strong style={{color:"var(--paper)"}}>Cosa farà il prossimo clic? Dal passo {step} al passo {step+1}</strong>
      <p style={{margin:"6px 0"}}>1. Calcoliamo la differenza tra voto reale e previsione nelle tre celle note. Con passo pari a 1, correggiamo quelle tre celle fino al valore osservato. La cella sconosciuta resta com’era.</p>
      <div style={{margin:"16px 0",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(175px,1fr))",gap:16}}><div><strong style={{color:"var(--paper)",fontSize:12}}>Matrice dopo la correzione degli errori</strong><div style={{marginTop:10}}>{grid(corrected,true)}</div></div><div><strong style={{color:"var(--paper)",fontSize:12}}>Risultato del prossimo aggiornamento</strong><div style={{marginTop:10}}>{grid(after,true)}</div></div></div>
      <p style={{margin:"6px 0"}}>2. {method==="svp"||method==="svt"?"La matrice corretta ha valori singolari "+fmt(before[0])+" e "+fmt(before[1])+". Misurano il peso delle componenti SVD.":"Questo metodo non usa la soglia sui valori singolari di SVT."}</p>
      <p style={{margin:"6px 0"}}>3. {({mean:"La media globale assegna lo stesso valore a tutte le celle. Dopo il primo passo la stima non cambia più.",bias:"Aggiorniamo prima gli effetti degli utenti e poi quelli dei film, penalizzando gli effetti troppo grandi.",svp:"SVP mantiene la componente maggiore ed elimina la seconda: rango 1.",svt:"SVT sottrae 0,8 a ogni valore singolare, con minimo zero.",admira:"Questa variante illustrativa seleziona la componente principale del residuo, combina quella direzione con la stima precedente usando minimi quadrati sui tre voti noti e tronca a rango 1."} as const)[method]}</p>
      <p style={{margin:"8px 0",color:"var(--paper)"}}>Se premi il pulsante, l’errore sui tre voti conosciuti passerà da {fmt(error)} a {fmt(errorAfter)}. {errorAfter>error+1e-8?"In questo passo aumenta: non è garantito che diminuisca a ogni iterazione.":"Questo non misura la qualità della previsione del voto nascosto."}</p>
    </div>
    <p style={{fontSize:12,lineHeight:1.7,color:"var(--muted)",margin:"15px 0 0"}}><strong style={{color:"var(--paper)"}}>Attenzione:</strong> l’RMSE sui voti conosciuti è un errore di addestramento, non un controllo della previsione mancante. Senza conoscere quel quarto voto non possiamo sapere se la stima sia corretta. I valori della matrice possono anche uscire dall’intervallo 0–5: qui non applichiamo limiti artificiali alle previsioni.</p>
    <p style={{fontSize:11,lineHeight:1.7,color:"var(--muted)",margin:"15px 0 0"}}>Dimostrazione numerica ridotta: schema didattico calcolato per tutti e cinque i metodi; per ADMiRA-inspired il passo di selezione è ridotto a una sola direzione e non replica il solver originale, ma dimensioni e parametri scelti per essere leggibili. L'RMSE mostrato è sul piccolo esempio osservato, non sulla validation del progetto.</p>
  </section>;
}
