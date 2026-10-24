export default function TaiwanDimensionality(){
 const sensors=516,observations=744,coefficients=sensors*sensors;
 return <figure className="hdts-taiwan-viz">
  <div className="hdts-viz-head"><div><span className="eyebrow">TAIWAN · IL PROBLEMA ORIGINALE</span><h3>Quando le variabili superano le osservazioni</h3></div><span className="hdts-viz-meta">VAR(1) · esempio di complessità</span></div>
  <div className="hdts-taiwan-equation">
   <div><span>OSSERVAZIONI NEL TEMPO</span><strong>744</strong><small>ore disponibili per serie</small></div>
   <span className="hdts-taiwan-versus">vs</span>
   <div><span>COEFFICIENTI VAR(1)</span><strong>{coefficients.toLocaleString("it-IT")}</strong><small>516 × 516, senza intercette</small></div>
  </div>
  <div className="hdts-taiwan-grid" role="img" aria-label="Griglia schematica di 516 sensori, ciascuno rappresentato da una cella. Non è una mappa geografica.">
   {Array.from({length:sensors},(_,i)=><span key={i} className={i%37===0?"hdts-taiwan-cell active":"hdts-taiwan-cell"}/>)}
  </div>
  <div className="hdts-taiwan-note"><strong>Perché è interessante?</strong><p>Ogni sensore potrebbe dipendere dal passato degli altri 515. La matrice dei coefficienti cresce quadraticamente con il numero di serie, mentre la storia osservata resta corta. La regolarizzazione serve a limitare la complessità, non a creare nuove osservazioni.</p></div>
  <figcaption>Visualizzazione <strong>concettuale</strong>: le 516 celle rappresentano il numero di serie, non la posizione geografica né la struttura stimata delle dipendenze. Il conteggio 266.256 è quello di un VAR(1) non vincolato, non il numero di coefficienti effettivamente selezionati dal BigVAR originale.</figcaption>
 </figure>;
}
