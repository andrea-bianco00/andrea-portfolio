export default function MatrixCompletionCaseStudy() {
  return <>
    <section className="case-section">
      <p className="eyebrow">IL PROGETTO</p>
      <h2>Ricostruire i rating mancanti</h2>
      <p>Questo progetto nasce da un lavoro universitario svolto insieme a Matteo Mancini. Siamo partiti da un problema tipico dei sistemi di raccomandazione: ogni utente valuta soltanto una piccola parte dei film disponibili. È possibile stimare i rating mancanti usando le informazioni che abbiamo già?</p>
      <p>Per studiarlo abbiamo lavorato con MovieLens e confrontato tre metodi di matrix completion: SVP, SVT e una variante didattica ispirata ad ADMiRA. Abbiamo incluso anche due baseline, perché volevamo capire se la maggiore complessità dei metodi low-rank portasse davvero un vantaggio.</p>
    </section>
    <section className="case-section">
      <p className="eyebrow">COME ABBIAMO LAVORATO</p>
      <h2>Un confronto sullo stesso dataset</h2>
      <p>Il dataset contiene 100.836 rating di 610 utenti su 9.724 film. Abbiamo separato i dati in training (70.585 rating), validation (15.125) e test (15.126), usando la validation per confrontare le 11 configurazioni considerate.</p>
      <p>Una volta scelto il modello con il risultato migliore sulla validation, lo abbiamo valutato sul test finale. Non abbiamo usato i risultati del test per scegliere i parametri o cambiare modello.</p>
    </section>
    <section className="case-section">
      <p className="eyebrow">I RISULTATI</p>
      <h2>Il modello più semplice è andato meglio</h2>
      <div className="case-metrics">
        <div><strong>0,8607</strong><span>RMSE sulla validation · baseline regolarizzata</span></div>
        <div><strong>0,8781</strong><span>RMSE sul test · modello scelto</span></div>
        <div><strong>15.126</strong><span>Rating nel test finale</span></div>
      </div>
      <p>Tra i metodi di matrix completion, il risultato migliore sulla validation è stato quello di SVP con rango 5 (RMSE circa 1,3895). La sorpresa è stata che una baseline regolarizzata, basata sugli effetti dei singoli utenti e film, ha ottenuto un errore molto più basso: 0,8607.</p>
      <p>Questo non significa che SVP, SVT o ADMiRA siano in generale meno efficaci. Significa che, nelle condizioni del nostro esperimento, la soluzione più semplice ha funzionato meglio.</p>
    </section>
    <section className="case-section">
      <p className="eyebrow">CODICE E DOCUMENTAZIONE</p>
      <h2>Il lavoro dietro ai numeri</h2>
      <p>Nel repository abbiamo raccolto le implementazioni, le configurazioni usate, i risultati e i controlli automatici. Abbiamo anche documentato le scelte fatte e i limiti del confronto, compresi i casi in cui gli algoritmi hanno raggiunto il numero massimo di iterazioni.</p>
      <p>I controlli automatici possono essere eseguiti senza il dataset originale; quelli che richiedono MovieLens vengono segnalati come saltati se il file non è disponibile. La verifica del codice non va quindi confusa con una nuova esecuzione completa dell'esperimento.</p>
    </section>
  </>;
}
