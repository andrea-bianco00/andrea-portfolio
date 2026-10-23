"use client";

import { useState } from "react";
import MathFormula from "../../components/MathFormula";

const algorithms = [
  {
    id: "mean", name: "Media globale", group: "Baseline",
    idea: "Prevede sempre lo stesso voto: la media dei rating presenti nel training.",
    example: "Se la media nel training fosse 3,6, prevederebbe 3,6 per ogni coppia utente–film.",
    steps: ["Calcola la media dei rating osservati nel training.", "Usa quel valore per tutte le previsioni.", "Non distingue né gli utenti né i film."],
    strength: "È un riferimento minimo, facile da interpretare.",
    limit: "Non considera le differenze tra utenti o film.",
    rmse: "1,035", color: "#b9a38d",
    pseudo: ["μ ← media dei rating osservati","per ogni coppia (u, i):","  r̂ᵤᵢ ← μ"],
    cells: [3.6,3.6,3.6,3.6,3.6,3.6,3.6,3.6,3.6],
  },
  {
    id: "bias", name: "Bias utente–film", group: "Baseline",
    idea: "Parte dalla media generale e la corregge in base all'utente e al film.",
    example: "Un utente tende a dare voti alti? Un film riceve spesso voti bassi? Il modello tiene conto di entrambe le tendenze.",
    steps: ["Stima la media globale sul training.", "Stima un effetto per ciascun utente e ciascun film.", "Regolarizza gli effetti per ridurre il rischio di adattarsi troppo ai dati."],
    strength: "Cattura differenze sistematiche con pochi elementi interpretabili.",
    limit: "Non rappresenta direttamente le interazioni personali tra un utente e uno specifico film.",
    rmse: "0,861", color: "#ff7a1a",
    pseudo: ["μ ← media dei rating osservati","bᵤ, bᵢ ← 0","ripeti fino al criterio di arresto:","  aggiorna bᵤ con penalità λ","  aggiorna bᵢ con penalità λ","  verifica la variazione dei bias","r̂ᵤᵢ ← μ + bᵤ + bᵢ"],
    cells: [3.2,3.7,4.1,2.6,3.1,3.5,3.7,4.2,4.6],
  },
  {
    id: "svp", name: "SVP", group: "Matrix completion",
    idea: "Cerca una matrice che riproduca i voti osservati, mantenendo un rango fissato.",
    example: "Invece di imparare un parametro indipendente per ogni voto, prova a descrivere le preferenze con poche dimensioni latenti.",
    steps: ["Parte da una stima della matrice.", "Aggiorna la stima per ridurre l'errore sui rating osservati.", "La riporta a un rango prestabilito e ripete."],
    strength: "Impone direttamente una struttura a rango basso.",
    limit: "La scelta del rango conta; nel nostro esperimento non è stata certificata la convergenza.",
    rmse: "1,390", color: "#d4aa78",
    pseudo: ["X₀ ← 0","ripeti per t = 0, 1, …:","  Eₜ ← PΩ(M − Xₜ)","  Zₜ ← Xₜ + η Eₜ","  Xₜ₊₁ ← Pᵣ(Zₜ)","  verifica la variazione relativa"],
    cells: [3.0,3.6,4.1,2.8,3.4,3.9,2.5,3.1,3.6],
  },
  {
    id: "svt", name: "SVT", group: "Matrix completion",
    idea: "Favorisce una matrice semplice riducendo progressivamente i valori singolari.",
    example: "Le componenti più piccole vengono attenuate o azzerate: così il modello tende a usare meno struttura.",
    steps: ["Aggiorna la matrice in base agli errori sui rating osservati.", "Applica una soglia ai valori singolari.", "Ripete alternando correzione e riduzione."],
    strength: "Controlla la complessità in modo più graduale di un rango fissato.",
    limit: "La soglia influisce sul risultato; qui usiamo una variante a gradiente prossimale, non necessariamente il SVT duale originale.",
    rmse: "1,719", color: "#b8a08c",
    pseudo: ["X₀ ← 0","ripeti per t = 0, 1, …:","  Eₜ ← PΩ(M − Xₜ)","  Zₜ ← Xₜ + η Eₜ","  Zₜ = U Σ Vᵀ  (SVD)","  Xₜ₊₁ ← U diag((σⱼ − ηλ)₊) Vᵀ","  verifica la variazione relativa"],
    cells: [3.1,3.3,3.5,3.0,3.2,3.4,2.9,3.1,3.3],
  },
  {
    id: "admira", name: "ADMiRA-inspired", group: "Matrix completion",
    idea: "Costruisce una soluzione a rango basso selezionando e aggiornando componenti promettenti.",
    example: "Prova a individuare quali direzioni della matrice aiutano maggiormente a spiegare i voti osservati.",
    steps: ["Individua componenti candidate a partire dagli errori.", "Aggiorna una soluzione usando le componenti selezionate.", "Riduce nuovamente la soluzione al rango richiesto."],
    strength: "Esplora un approccio iterativo di tipo pursuit.",
    limit: "La nostra è una variante didattica: non la presentiamo come implementazione verificata dell'ADMiRA canonico.",
    rmse: "1,491", color: "#c8a188",
    pseudo: ["X₀ ← 0","ripeti per t = 0, 1, …:","  Eₜ ← PΩ(M − Xₜ)","  trova fino a 2r direzioni singolari di Eₜ","  unisci le direzioni al sottospazio corrente","  stima i coefficienti sui rating osservati","  Xₜ₊₁ ← Pᵣ(soluzione stimata)"],
    cells: [3.3,3.9,3.4,2.8,3.4,2.9,3.1,3.7,3.2],
  },
] as const;


const pseudocode: Record<string, {text?: string; tex?: string}[]> = {
  mean: [
    {tex:String.raw`\mu \leftarrow \frac{1}{|\Omega|}\sum_{(u,i)\in\Omega} M_{ui}`},
    {text:"Per ogni coppia utente–film:"},
    {tex:String.raw`\hat r_{ui}\leftarrow\mu`},
  ],
  bias: [
    {tex:String.raw`\mu\leftarrow \operatorname{media}(M_{\Omega})`},
    {tex:String.raw`b_u,b_i\leftarrow 0`},
    {text:"Ripeti fino al criterio di arresto:"},
    {tex:String.raw`b_u\leftarrow \frac{\sum_{i\in\Omega_u}(M_{ui}-\mu-b_i)}{\lambda+|\Omega_u|}`},
    {tex:String.raw`b_i\leftarrow \frac{\sum_{u\in\Omega_i}(M_{ui}-\mu-b_u)}{\lambda+|\Omega_i|}`},
    {text:"Controlla la variazione dei parametri."},
    {tex:String.raw`\hat r_{ui}\leftarrow\mu+b_u+b_i`},
  ],
  svp: [
    {tex:String.raw`X_0\leftarrow 0`},
    {tex:String.raw`\text{Ripeti per }t=0,1,\ldots`},
    {tex:String.raw`E_t\leftarrow P_{\Omega}(M-X_t)`},
    {tex:String.raw`Z_t\leftarrow X_t+\eta E_t`},
    {tex:String.raw`X_{t+1}\leftarrow P_r(Z_t)`},
    {text:"Controlla la variazione relativa."},
  ],
  svt: [
    {tex:String.raw`X_0\leftarrow 0`},
    {text:"Ripeti per t = 0, 1, …:"},
    {tex:String.raw`E_t\leftarrow P_{\Omega}(M-X_t)`},
    {tex:String.raw`Z_t\leftarrow X_t+\eta E_t`},
    {tex:String.raw`Z_t=U\Sigma V^{\top}`},
    {tex:String.raw`X_{t+1}\leftarrow U\,\operatorname{diag}((\sigma_j-\eta\lambda)_+)\,V^{\top}`},
    {text:"Controlla la variazione relativa."},
  ],
  admira: [
    {tex:String.raw`X_0\leftarrow 0`},
    {text:"Ripeti per t = 0, 1, …:"},
    {tex:String.raw`E_t\leftarrow P_{\Omega}(M-X_t)`},
    {tex:String.raw`\text{Seleziona fino a }2r\text{ direzioni singolari del residuo.}`},
    {text:"Unisci le direzioni al sottospazio corrente."},
    {text:"Stima i coefficienti sui rating osservati."},
    {tex:String.raw`X_{t+1}\leftarrow P_r(\widetilde X_{t+1})`},
  ],
};

export default function AlgorithmExplorer() {
  const [selected, setSelected] = useState<(typeof algorithms)[number]["id"]>("bias");
  const current = algorithms.find(a => a.id === selected)!;
  return <div style={{border:"1px solid var(--line)",borderRadius:20,background:"linear-gradient(145deg,#19110b,#0d0907)",padding:"clamp(18px,3vw,32px)",margin:"32px 0"}}>
    <div style={{display:"flex",justifyContent:"space-between",gap:16,alignItems:"baseline",flexWrap:"wrap",marginBottom:20}}>
      <strong style={{fontSize:18}}>Esplora gli algoritmi</strong>
      <span style={{fontSize:12,color:"var(--muted)"}}>Seleziona un metodo per vedere come ragiona</span>
    </div>
    <div role="group" aria-label="Scegli un algoritmo" style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:30}}>
      {algorithms.map(a=><button key={a.id} type="button" aria-pressed={selected===a.id} onClick={()=>setSelected(a.id)} style={{border:"1px solid "+(selected===a.id?"var(--orange)":"var(--line)"),background:selected===a.id?"var(--orange)":"#241910",color:selected===a.id?"#140a03":"var(--paper)",borderRadius:999,padding:"11px 15px",fontSize:12,fontWeight:700,cursor:"pointer"}}>{a.name}</button>)}
    </div>
    <div aria-live="polite">
      <div style={{display:"flex",justifyContent:"space-between",gap:16,flexWrap:"wrap",alignItems:"start"}}>
        <div><span style={{fontSize:10,letterSpacing:".13em",color:"var(--orange)",fontWeight:750}}>{current.group.toUpperCase()}</span><h3 style={{fontSize:"clamp(1.5rem,3vw,2.2rem)",margin:"9px 0 12px",fontFamily:"Georgia,serif",fontWeight:450}}>{current.name}</h3></div>
        <div style={{textAlign:"right"}}><strong style={{fontSize:26,color:"var(--orange)"}}>{current.rmse}</strong><div style={{fontSize:11,color:"var(--muted)"}}>RMSE validation ↓</div></div>
      </div>
      <p style={{color:"var(--paper)",fontSize:16,lineHeight:1.7,maxWidth:730}}>{current.idea}</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:25,marginTop:24}}>
        <div>
          <span style={{fontSize:11,color:"var(--orange)",fontWeight:750}}>COME FUNZIONA, IN TRE PASSAGGI</span>
          <ol style={{paddingLeft:22,color:"var(--muted)",lineHeight:1.75,fontSize:14}}>{current.steps.map((step,i)=><li key={i} style={{marginTop:9}}>{step}</li>)}</ol>
          <p style={{fontSize:13,color:"var(--muted)",lineHeight:1.75}}><strong style={{color:"var(--paper)"}}>Esempio:</strong> {current.example}</p>
        </div>
        <figure style={{margin:0,padding:18,borderRadius:14,border:"1px solid var(--line)",background:"#0c0907"}}>
          <div style={{fontSize:11,color:"var(--muted)",marginBottom:15}}>Come potrebbe apparire una piccola matrice di previsioni</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:7,maxWidth:285}}>
            {current.cells.map((v,i)=><div key={i} style={{height:58,borderRadius:7,background:`rgba(255,122,26,${0.08+(v-2)*0.17})`,border:"1px solid #704122",display:"grid",placeItems:"center",fontSize:16,fontWeight:700,color:"#ffe4cb"}}>{v.toFixed(1).replace(".",",")}</div>)}
          </div>
          <figcaption style={{fontSize:11,lineHeight:1.65,color:"var(--muted)",marginTop:15}}>Illustrazione inventata per mostrare la logica del metodo: <strong>non</strong> sono previsioni prodotte dal codice del progetto. I valori reali di RMSE sono riportati sopra.</figcaption>
        </figure>
      </div>
      <section style={{marginTop:28,padding:22,border:"1px solid var(--line)",borderRadius:14,background:"#0a0807"}}>
        <strong style={{fontSize:15}}>Pseudocodice e notazione matematica</strong>
        <div style={{fontSize:13,color:"var(--muted)",lineHeight:1.85,marginTop:7,marginBottom:12}}>
          <span>I passaggi principali, semplificati a partire dal codice del progetto. </span>
          {current.id==="mean" && <span><MathFormula tex={String.raw`\mu`} /> è la media dei voti osservati; <MathFormula tex={String.raw`\Omega`} /> è l’insieme delle coppie utente–film presenti nel training; <MathFormula tex={String.raw`M_{ui}`} /> è il voto osservato.</span>}
          {current.id==="bias" && <span><MathFormula tex={String.raw`\mu`} /> è la media globale; <MathFormula tex={String.raw`b_u`} /> e <MathFormula tex={String.raw`b_i`} /> sono gli effetti dell’utente e del film; <MathFormula tex={String.raw`\lambda`} /> controlla la regolarizzazione. <MathFormula tex={String.raw`\Omega_u`} /> e <MathFormula tex={String.raw`\Omega_i`} /> indicano rispettivamente i voti disponibili per quell’utente e quel film.</span>}
          {current.id==="svp" && <span><MathFormula tex={String.raw`M`} /> è la matrice dei voti, <MathFormula tex={String.raw`X_t`} /> la stima all’iterazione <MathFormula tex={String.raw`t`} />, <MathFormula tex={String.raw`P_{\Omega}`} /> seleziona solo le celle osservate, <MathFormula tex={String.raw`\eta`} /> è il passo di aggiornamento e <MathFormula tex={String.raw`P_r`} /> conserva le prime <MathFormula tex={String.raw`r`} /> componenti singolari.</span>}
          {current.id==="svt" && <span><MathFormula tex={String.raw`M`} /> è la matrice dei voti; <MathFormula tex={String.raw`P_{\Omega}`} /> seleziona le celle osservate; <MathFormula tex={String.raw`\eta`} /> è il passo e <MathFormula tex={String.raw`\lambda`} /> regola la soglia. <MathFormula tex={String.raw`U\Sigma V^{\top}`} /> è la decomposizione ai valori singolari e <MathFormula tex={String.raw`(a)_+=\max(a,0)`} /> azzera i valori sotto soglia.</span>}
          {current.id==="admira" && <span><MathFormula tex={String.raw`M`} /> è la matrice dei voti, <MathFormula tex={String.raw`X_t`} /> la stima corrente, <MathFormula tex={String.raw`P_{\Omega}`} /> seleziona le celle osservate e <MathFormula tex={String.raw`r`} /> è il rango desiderato. <MathFormula tex={String.raw`\widetilde X_{t+1}`} /> è la soluzione intermedia prima del troncamento <MathFormula tex={String.raw`P_r`} />.</span>}
        </div>
        <ol className="portfolio-pseudocode-math" style={{paddingLeft:28,lineHeight:1.9}}>{pseudocode[current.id].map((line,i)=><li key={i}>{line.tex ? <MathFormula tex={line.tex} /> : <span style={{color:"var(--muted)"}}>{line.text}</span>}</li>)}</ol>
        <p style={{fontSize:12,color:"var(--muted)",lineHeight:1.6}}>Le implementazioni includono ulteriori controlli numerici e criteri di arresto. SVT usa una variante prossimale; ADMiRA è una variante didattica, non l'algoritmo canonico.</p>
      </section>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:14,marginTop:22}}>
        <div style={{padding:16,borderLeft:"2px solid var(--orange)",background:"#21150d"}}><strong style={{fontSize:12}}>Punto di forza</strong><p style={{fontSize:13,color:"var(--muted)",lineHeight:1.6,marginBottom:0}}>{current.strength}</p></div>
        <div style={{padding:16,borderLeft:"2px solid #8d7464",background:"#21150d"}}><strong style={{fontSize:12}}>Limite</strong><p style={{fontSize:13,color:"var(--muted)",lineHeight:1.6,marginBottom:0}}>{current.limit}</p></div>
      </div>
    </div>
  </div>;
}
