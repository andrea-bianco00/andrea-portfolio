import MathFormula from "../../components/MathFormula";
import MatrixIterationDemo from "./MatrixIterationDemo";
import AlgorithmExplorer from "./AlgorithmExplorer";

const results = [
  { name: "Bias utente–film (lambda = 5)", rmse: 0.860652, type: "Baseline", winner: true },
  { name: "Media globale", rmse: 1.035442, type: "Baseline" },
  { name: "SVP (rango 5)", rmse: 1.38950, type: "Matrix completion" },
  { name: "ADMiRA, variante didattica (rango 2)", rmse: 1.49071, type: "Matrix completion" },
  { name: "SVT (soglia 30)", rmse: 1.71912, type: "Matrix completion" },
];

const card: React.CSSProperties = {
  background: "linear-gradient(145deg,#17110c,#0c0907)",
  border: "1px solid var(--line)",
  borderRadius: 18,
  padding: "clamp(18px,3vw,32px)",
  margin: "32px 0",
};
const muted: React.CSSProperties = { color: "var(--muted)", fontSize: 13, lineHeight: 1.7 };
const label: React.CSSProperties = { color: "var(--orange)", fontSize: 10, fontWeight: 750, letterSpacing: ".14em" };

function RatingMatrix() {
  const example = [
    [4, null, 3, null, 5, null],
    [null, 2, null, 4, null, null],
    [5, null, null, 3, null, 4],
    [null, 4, 2, null, null, null],
  ];
  return <figure style={card}>
    <div style={{display:"flex",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
      <span style={label}>COME SI PRESENTANO I DATI</span>
      <span style={muted}>Esempio inventato, non estratto da MovieLens</span>
    </div>
    <div style={{overflowX:"auto",marginTop:22}}>
      <div style={{display:"grid",gridTemplateColumns:"65px repeat(6,minmax(38px,1fr))",gap:7,minWidth:370,maxWidth:650}}>
        <div />
        {Array.from({length:6},(_,j)=><div key={j} style={{textAlign:"center",...muted}}>Film {j+1}</div>)}
        {example.map((row,i)=><div key={i} style={{display:"contents"}}>
          <div style={{...muted,alignSelf:"center"}}>Utente {i+1}</div>
          {row.map((v,j)=><div key={j} style={{height:49,display:"grid",placeItems:"center",borderRadius:7,border:"1px solid "+(v===null?"#493023":"#ad5a22"),background:v===null?"#100c09":"#4b250e",color:v===null?"#8d7766":"#ffe0bf",fontWeight:700}}>{v===null?"?":v}</div>)}
        </div>)}
      </div>
    </div>
    <figcaption style={{...muted,marginTop:18}}>Ogni riga rappresenta un utente, ogni colonna un film. I numeri sono voti già osservati; i punti interrogativi sono quelli che vorremmo prevedere. Nei dati reali la matrice è molto più grande e sparsa.</figcaption>
  </figure>;
}

function SplitFigure() {
  const parts=[{name:"Training",n:70585,p:70,color:"#ff7a1a"},{name:"Validation",n:15125,p:15,color:"#e9c59d"},{name:"Test",n:15126,p:15,color:"#79665a"}];
  return <figure style={card}>
    <span style={label}>COME ABBIAMO SEPARATO I DATI</span>
    <div role="img" aria-label="70 per cento training, 15 per cento validation e 15 per cento test" style={{display:"flex",height:30,overflow:"hidden",borderRadius:7,margin:"22px 0 18px",gap:3}}>
      {parts.map(p=><div key={p.name} style={{width:p.p+"%",background:p.color}}/>)}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:12}}>
      {parts.map(p=><div key={p.name}><div style={{display:"flex",alignItems:"center",gap:7,fontSize:12,color:"var(--paper)"}}><span style={{display:"inline-block",width:9,height:9,background:p.color,borderRadius:2}}/>{p.name}</div><strong style={{display:"block",fontSize:"clamp(1.1rem,2.5vw,1.8rem)",marginTop:8}}>{p.n.toLocaleString("it-IT")}</strong><span style={muted}>{p.p}% dei rating</span></div>)}
    </div>
    <figcaption style={{...muted,marginTop:18}}>Split casuale a livello di rating, con seed fissato. La validation serve a scegliere il modello; il test rimane separato fino alla valutazione finale. Non è uno split per utente o cronologico.</figcaption>
  </figure>;
}

function ValidationChart() {
  return <figure style={card}>
    <div style={{display:"flex",justifyContent:"space-between",gap:15,flexWrap:"wrap",alignItems:"baseline"}}>
      <span style={label}>CONFRONTO SULLA VALIDATION</span>
      <span style={muted}>RMSE ↓ più basso è meglio</span>
    </div>
    <div style={{marginTop:26}}>
      {results.map(r=><div key={r.name} style={{marginBottom:23}}>
        <div style={{display:"flex",justifyContent:"space-between",gap:14,alignItems:"baseline",marginBottom:8}}>
          <span style={{fontSize:13,fontWeight:r.winner?750:500,color:"var(--paper)"}}>{r.name.includes("lambda = 5") ? <>Bias utente–film (<MathFormula tex={String.raw`\lambda=5`} />)</> : r.name}</span>
          <strong style={{fontVariantNumeric:"tabular-nums",fontSize:15,color:r.winner?"var(--orange)":"var(--paper)"}}>{r.rmse.toFixed(3).replace(".",",")}</strong>
        </div>
        <div style={{height:15,background:"#33241b",borderRadius:5,overflow:"hidden"}}>
          <div style={{height:"100%",width:(r.rmse/1.8*100)+"%",background:r.winner?"var(--orange)":"#aa927f",borderRadius:5}}/>
        </div>
      </div>)}
    </div>
    <figcaption style={{...muted,borderTop:"1px solid var(--line)",paddingTop:16}}>Per ogni famiglia è mostrata la configurazione con il miglior RMSE sulla validation, non tutte le 11 configurazioni provate. I valori provengono dai risultati registrati del progetto; non sono stime ricostruite per questa pagina. Non sono disponibili RMSE sul test per gli altri modelli.</figcaption>
  </figure>;
}

export default function MatrixCompletionCaseStudy() {
  return <>
    <div className="ner-overview" aria-label="Numeri principali del progetto">
      <div><span className="ner-kpi-label">Rating MovieLens</span><strong>100.836</strong><small>610 utenti · 9.724 film valutati</small></div>
      <div><span className="ner-kpi-label">Configurazioni confrontate</span><strong>11</strong><small>Tre metodi low-rank e due baseline</small></div>
      <div><span className="ner-kpi-label">RMSE finale sul test</span><strong>0,878</strong><small>Solo per il modello scelto sulla validation</small></div>
    </div>
    <nav className="ner-toc" aria-label="Sezioni del progetto"><span>IN QUESTA PAGINA</span><a href="#mc-problema">Il problema</a><a href="#mc-metodo">Il metodo</a><a href="#mc-risultati">I risultati</a><a href="#mc-limiti">Cosa abbiamo verificato</a></nav>
    <section className="case-section" id="mc-problema">
      <p className="eyebrow">01 / IL PROBLEMA</p>
      <h2>Come stimare i voti che mancano?</h2>
      <p>Questo progetto nasce da un lavoro universitario svolto con Matteo Mancini. Abbiamo studiato un problema comune nei sistemi di raccomandazione: ogni utente valuta soltanto una piccola parte dei film disponibili. Il resto della matrice è vuoto.</p>
      <RatingMatrix />
      <p>L&apos;idea alla base della <strong>matrix completion</strong> è che le preferenze degli utenti possano essere descritte, almeno in parte, da poche caratteristiche latenti. Abbiamo voluto capire quanto funzionasse questa ipotesi sul dataset MovieLens Latest Small.</p>
    </section>
    <section className="case-section" id="mc-metodo">
      <p className="eyebrow">02 / IL METODO</p>
      <h2>Confrontare i modelli senza usare il test per sceglierli</h2>
      <p>Abbiamo confrontato <strong>SVP</strong>, <strong>SVT</strong> e una variante didattica ispirata ad <strong>ADMiRA</strong>. A questi abbiamo affiancato due riferimenti semplici: la media globale dei rating e un modello che tiene conto degli effetti dei singoli utenti e film.</p>
      <AlgorithmExplorer />
      <MatrixIterationDemo />
      <SplitFigure />
      <p>Il criterio di confronto è l&apos;<strong>RMSE</strong>, la radice dell&apos;errore quadratico medio. Penalizza maggiormente gli errori grandi: se prevediamo 4 stelle quando il voto reale è 2, l&apos;errore pesa più di una previsione sbagliata di mezza stella.</p>
      <div style={{...card,textAlign:"center"}}>
        <span style={label}>LA METRICA UTILIZZATA</span>
        <div style={{margin:"22px 0"}}><MathFormula display tex={String.raw`\operatorname{RMSE}=\sqrt{\frac{1}{n}\sum\limits_{i=1}^{n}(\hat y_i-y_i)^2}`} ariaLabel="Radice della media degli errori quadratici tra previsioni e voti osservati" /></div>
        <p style={{...muted,margin:"0 auto",maxWidth:620}}>Tutti i modelli sono stati confrontati sugli stessi rating di validation. Abbiamo poi valutato una sola volta sul test il modello selezionato.</p>
      </div>
    </section>
    <section className="case-section" id="mc-risultati">
      <p className="eyebrow">03 / I RISULTATI</p>
      <h2>La baseline regolarizzata è risultata la migliore</h2>
      <p>Tra i tre metodi di matrix completion, SVP con rango 5 ha ottenuto l&apos;RMSE più basso sulla validation. Ma il modello con effetti utente–film, molto più semplice, ha fatto meglio di tutti.</p>
      <ValidationChart />
      <p>Il modello selezionato è stato quindi valutato sui 15.126 rating del test finale, ottenendo un <strong>RMSE di 0,8781</strong>. Sui film già presenti nel training l&apos;RMSE è stato 0,8713; sui 701 rating relativi a film non osservati nel training è salito a 1,0068.</p>
      <p>Questi numeri suggeriscono che prevedere i rating di film non visti durante l&apos;addestramento è più difficile. Non dimostrano, invece, che le baseline siano sempre migliori dei metodi low-rank: il risultato riguarda le implementazioni e le configurazioni che abbiamo effettivamente provato.</p>
    </section>
    <section className="case-section" id="mc-limiti">
      <p className="eyebrow">04 / CODICE E VERIFICHE</p>
      <h2>Che cosa si può controllare nel repository</h2>
      <p>Abbiamo pubblicato codice, configurazioni, risultati registrati e test automatici. Il repository distingue i controlli eseguibili senza MovieLens da quelli che richiedono l&apos;archivio originale. Quando manca, questi ultimi vengono segnalati come saltati, non come superati.</p>
      <p>Alcuni algoritmi hanno raggiunto il numero massimo di iterazioni; non dichiariamo quindi una convergenza che non abbiamo verificato. La CI controlla il codice e gli artefatti offline, ma non ripete l&apos;intero esperimento né dimostra un isolamento del processo a livello di sistema operativo.</p>
      <a href="https://github.com/andrea-bianco00/matrix-completion-movielens" target="_blank" rel="noopener noreferrer" className="text-link" style={{display:"inline-block",marginTop:20}}>CODICE, RISULTATI E DOCUMENTAZIONE SU GITHUB ↗</a>
    </section>
  </>;
}
