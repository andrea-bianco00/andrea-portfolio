import Link from "next/link";

const stations = [
  ["Aotizhongxin",9.898,8.635],["Changping",8.939,8.322],["Dingling",8.409,7.868],
  ["Dongsi",10.411,9.267],["Guanyuan",9.997,8.904],["Gucheng",9.875,8.956],
  ["Huairou",8.218,7.348],["Nongzhanguan",9.958,8.785],["Shunyi",10.193,9.126],
  ["Tiantan",9.993,8.913],["Wanliu",9.411,8.453],["Wanshouxigong",10.667,9.622]
];

export default function HighDimensionalCaseStudy() {
  return <div className="hdts">
    <div className="hdts-kpis" aria-label="Numeri chiave">
      <div><span>RETE ORIGINALE · TAIWAN</span><strong>516</strong><small>sensori PM2.5 · progetto universitario</small></div>
      <div><span>BENCHMARK SUCCESSIVO · BEIJING</span><strong>12</strong><small>stazioni monitorate · previsione a 1 ora</small></div>
      <div><span>RIDUZIONE MAE · RETROSPETTIVA</span><strong>−10,15%</strong><small>LightGBM ambientale vs persistenza, 2016</small></div>
    </div>

    <nav className="hdts-nav" aria-label="Sezioni del progetto">
      <span>IL PERCORSO</span><a href="#hdts-problema">Problema</a><a href="#hdts-metodo">Metodo</a><a href="#hdts-risultati">Risultati</a><a href="#hdts-limiti">Limiti</a>
    </nav>

    <section id="hdts-problema" className="case-section">
      <p className="eyebrow">01 / LA DOMANDA</p>
      <h2>Un sensore racconta un punto. Una rete racconta un sistema.</h2>
      <p>Le concentrazioni di particolato cambiano nel tempo, ma non in modo isolato. Vento, condizioni atmosferiche ed emissioni possono influenzare più aree contemporaneamente. Mi interessava capire se questa dipendenza potesse diventare informazione utile, invece che una complicazione da ignorare.</p>
      <div className="hdts-split">
        <article><span className="hdts-step">IL PUNTO DI PARTENZA</span><h3>516 serie, poche osservazioni</h3><p>Nel progetto universitario, sviluppato con Emidio Grillo e Luca Nudo, abbiamo studiato 744 osservazioni orarie di 516 sensori Taiwan AirBox. Un VAR tradizionale richiede rapidamente troppi parametri: la regolarizzazione aiuta a gestire la dimensionalità e a controllare la complessità.</p><span className="hdts-sub">R · Serie temporali multivariate · VAR regolarizzato</span></article>
        <article><span className="hdts-step">L'ESTENSIONE SUCCESSIVA</span><h3>La previsione deve battere qualcosa di semplice</h3><p>Ho poi affrontato un problema distinto: prevedere il PM2.5 dell'ora successiva sui dati di 12 stazioni Beijing. Il riferimento era volutamente elementare: usare come previsione il valore appena osservato. Ogni modello più complesso doveva dimostrare di aggiungere valore.</p><span className="hdts-sub">Python · Forecasting · Machine Learning</span></article>
      </div>
      <p className="hdts-disclaimer">I due dataset non sono intercambiabili: Beijing non è un test del modello Taiwan e i risultati non vengono confrontati direttamente.</p>
    </section>

    <section id="hdts-metodo" className="case-section">
      <p className="eyebrow">02 / LE SCELTE</p>
      <h2>Prima definire una previsione corretta. Poi scegliere il modello.</h2>
      <div className="hdts-process">
        <article><span>01</span><div><h3>Un obiettivo misurabile</h3><p>Prevedere PM2.5 all'ora t usando soltanto misure dell'ora t−1 o precedenti. Nessuna variabile ambientale osservata nello stesso istante da prevedere.</p></div></article>
        <article><span>02</span><div><h3>Una baseline credibile</h3><p>Partire dalla persistenza. È semplice, riproducibile e spesso competitiva nelle previsioni a brevissimo termine.</p></div></article>
        <article><span>03</span><div><h3>Esperimenti progressivi</h3><p>Confrontare regressione regolarizzata e modelli ad alberi, poi isolare il contributo dello storico PM2.5, delle variabili meteorologiche e degli altri inquinanti.</p></div></article>
        <article><span>04</span><div><h3>Una valutazione temporale</h3><p>Separare i periodi cronologicamente, valutare tutti i modelli sulle stesse osservazioni valide e documentare ore escluse e previsioni negative.</p></div></article>
      </div>
      <div className="hdts-timeline" aria-label="Periodi di analisi">
        <div><strong>2013–2014</strong><span>Addestramento</span></div><div><strong>2015</strong><span>Validazione storica</span></div><div><strong>2013–2015</strong><span>Nuovo fit</span></div><div><strong>2016</strong><span>Valutazione retrospettiva</span></div>
      </div>
    </section>

    <section id="hdts-risultati" className="case-section">
      <p className="eyebrow">03 / COSA È EMERSO</p>
      <h2>Le informazioni ambientali aiutano. Ma il confronto conta più del numero.</h2>
      <p>Su 102.298 osservazioni stazione-ora valutabili del 2016, LightGBM con informazioni ambientali ritardate ha ridotto l'errore medio assoluto rispetto alla persistenza. Il confronto è retrospettivo: il periodo è stato consultato più volte durante lo sviluppo.</p>
      <div className="hdts-chart" role="img" aria-label="Errore medio assoluto: persistenza 9,663; LightGBM PM2.5 8,797; LightGBM con variabili ambientali 8,682">
        <div className="hdts-chart-head"><strong>MAE · PIÙ BASSO È MEGLIO</strong><span>BEIJING · 2016</span></div>
        {[["Persistenza",9.663,false],["LightGBM · solo PM2.5",8.797,false],["LightGBM · PM2.5 + ambiente",8.682,true]].map(([name,value,best])=><div className="hdts-bar-row" key={String(name)}><div className="hdts-bar-label"><span>{name}</span><strong>{Number(value).toFixed(3).replace(".",",")}</strong></div><div className="hdts-bar-track"><div className={best?"hdts-bar-fill hdts-best":"hdts-bar-fill"} style={{width:`${Number(value)/11*100}%`}} /></div></div>)}
        <p>Stesse osservazioni per tutti i modelli. MAE espresso nelle unità PM2.5 del dataset; le previsioni negative non sono state corrette a posteriori.</p>
      </div>
      <div className="hdts-split hdts-insights">
        <article><span className="hdts-step">COSA SUGGERISCONO I DATI</span><h3>La meteorologia aggiunge informazione</h3><p>La versione con variabili ambientali ha ottenuto un MAE inferiore alla versione con solo PM2.5 in tutte le 12 stazioni, nel confronto archiviato.</p></article>
        <article><span className="hdts-step">COSA NON POSSIAMO CONCLUDERE</span><h3>Un buon risultato storico non è una garanzia</h3><p>La scelta dei modelli è stata influenzata dall'esplorazione degli stessi anni. Per misurare la generalizzazione serve un nuovo test indipendente.</p></article>
      </div>
      <details className="hdts-details"><summary>Guarda il confronto per tutte le 12 stazioni <span>+</span></summary><div className="hdts-table-wrap"><table><thead><tr><th>Stazione</th><th>Persistenza · MAE</th><th>LightGBM completo · MAE</th></tr></thead><tbody>{stations.map(([name,base,full])=><tr key={String(name)}><td>{name}</td><td>{Number(base).toFixed(3)}</td><td>{Number(full).toFixed(3)}</td></tr>)}</tbody></table></div><p>Dati aggregati dalla tabella pubblicata nel repository. Per il confronto completo con la versione solo PM2.5, consulta i risultati GitHub.</p></details>
    </section>

    <section id="hdts-limiti" className="case-section">
      <p className="eyebrow">04 / COSA HO IMPARATO</p>
      <h2>Un modello convincente deve saper spiegare anche i propri limiti.</h2>
      <p>Questo lavoro mi ha insegnato che ottenere una metrica migliore è soltanto una parte del processo. Bisogna chiedersi se i dati sarebbero davvero disponibili al momento della previsione, quali osservazioni mancano, quanto il confronto sia equo e se la valutazione sia rimasta indipendente dalle scelte fatte.</p>
      <div className="hdts-limits">
        <div><span>01 / VALIDAZIONE</span><h3>Test indipendente ancora da fare</h3><p>Il 2016 è stato utilizzato durante l'esplorazione: non lo presento come holdout incontaminato.</p></div>
        <div><span>02 / DATI REALI</span><h3>La disponibilità è parte del modello</h3><p>La latenza delle misure fra stazioni non è verificata; alcune ore con dati mancanti non entrano nelle metriche.</p></div>
        <div><span>03 / RIPRODUCIBILITÀ</span><h3>Risultati verificabili, senza scorciatoie</h3><p>Codice, protocollo e metriche sono pubblicati. La verifica in un ambiente completamente pulito resta un passaggio aperto.</p></div>
      </div>
      <div className="hdts-conclusion"><span className="eyebrow">LA LEZIONE CHE PORTO CON ME</span><h3>Non partire dall'algoritmo. Partire dal problema, costruire un confronto onesto e capire perché funziona.</h3><p>È questo il metodo che voglio portare anche in un contesto professionale: usare la statistica e il machine learning per arrivare a decisioni motivate, non soltanto a un punteggio.</p></div>
    </section>

    <div className="hdts-footer"><div><p className="eyebrow">CODICE & DOCUMENTAZIONE</p><h2>Vuoi vedere come l'ho costruito?</h2><p>Il repository contiene il benchmark, i controlli, i risultati e una descrizione trasparente delle scelte e dei limiti.</p></div><div className="hdts-links"><a href="https://github.com/andrea-bianco00/high-dimensional-time-series" target="_blank" rel="noopener noreferrer" className="button primary">APRI IL REPOSITORY ↗</a><Link href="/progetti" className="button secondary">ALTRI PROGETTI ↗</Link></div></div>
  </div>;
}
