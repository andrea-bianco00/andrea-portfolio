const repo = "https://github.com/andrea-bianco00/machine-learning-methods";

function BarComparison({ title, items, max, note }: { title: string; items: { label: string; value: number; display: string; highlight?: boolean }[]; max: number; note: string }) {
  return <figure className="ner-chart">
    <h3 style={{ fontSize: 19, margin: "0 0 10px" }}>{title}</h3>
    <p style={{ color: "var(--muted)", fontSize: 13, margin: "0 0 25px" }}>Le barre partono da zero. I valori sono riportati accanto a ciascun metodo.</p>
    {items.map(item => <div className="ner-metric-row" key={item.label}>
      <h3>{item.label}</h3>
      <div className="ner-barline">
        <div className={`ner-bar ${item.highlight ? "ner-bar-orange" : "ner-bar-light"}`} style={{ width: `${Math.max(0, Math.min(100, item.value / max * 100))}%` }} />
        <span>{item.display}</span>
      </div>
    </div>)}
    <figcaption>{note}</figcaption>
  </figure>;
}

export default function OptimizationCaseStudy() {
  return <>
    <div className="ner-overview" aria-label="Tre idee chiave">
      <div><span className="ner-kpi-label">Il punto di partenza</span><strong>01</strong><small>Un modello semplice può sbagliare anche con molti dati</small></div>
      <div><span className="ner-kpi-label">La sfida tecnica</span><strong>02</strong><small>Imparare usando solo valori della funzione, senza gradienti</small></div>
      <div><span className="ner-kpi-label">La prova applicativa</span><strong>03</strong><small>Confrontare due metodi di training nella classificazione</small></div>
    </div>

    <nav className="ner-toc" aria-label="Percorso di lettura">
      <span>IL PERCORSO</span>
      <a href="#domanda">La domanda</a><a href="#modello">Il modello</a><a href="#ottimizzazione">L'ottimizzazione</a><a href="#applicazione">L'applicazione</a><a href="#conclusioni">Conclusioni</a>
    </nav>

    <section className="case-section" id="domanda">
      <p className="eyebrow">01 / LA DOMANDA</p>
      <h2>Un algoritmo può imparare bene anche quando il problema è più complicato del modello?</h2>
      <p>Immagina di voler prevedere un risultato a partire da alcune variabili. Puoi raccogliere più osservazioni, scegliere un modello più flessibile oppure cambiare il modo in cui lo addestri. Ma <strong>quale di queste scelte risolve davvero il problema?</strong></p>
      <p>Ho affrontato questa domanda attraverso esperimenti progressivi: prima la regressione, poi l'ottimizzazione con e senza gradienti, infine una classificazione su un dataset pubblico. Il punto non è trovare un numero più alto, ma capire <em>perché</em> un metodo funziona, quando fallisce e cosa significa confrontarlo correttamente.</p>
      <p className="ner-note">Il lavoro nasce da un'esercitazione ENSAI del 2025. Questa pagina racconta una successiva ricostruzione riproducibile in Python, con test, correzioni metodologiche e approfondimenti documentati.</p>
    </section>

    <section className="case-section" id="modello">
      <p className="eyebrow">02 / PRIMA SCOPERTA · LA SCELTA DEL MODELLO</p>
      <h2>Più dati non bastano se il modello non sa descrivere la realtà.</h2>
      <p>Nei dati simulati, una variabile influenza la risposta in modo lineare, mentre un'altra contribuisce solo quando assume valori positivi: è una relazione con una <strong>soglia</strong>, descritta dalla funzione ReLU.</p>
      <div className="ner-example">
        <div className="ner-example-top"><span>ESPERIMENTO CONCETTUALE</span><span>RELAZIONE DEFINITA DAL PROCESSO GENERATIVO</span></div>
        <svg viewBox="0 0 560 220" role="img" aria-label="Confronto schematico tra una retta e una funzione ReLU: la prima cresce sempre, la seconda rimane zero per valori negativi e cresce per quelli positivi" style={{width:"100%",height:"auto",display:"block",marginTop:20}}>
          <line x1="35" y1="175" x2="530" y2="175" stroke="#a99178" strokeWidth="1"/><line x1="280" y1="20" x2="280" y2="190" stroke="#a99178" strokeWidth="1"/>
          <path d="M45 160 L505 38" fill="none" stroke="#f3e7d3" strokeWidth="3" strokeDasharray="7 6"/>
          <path d="M45 135 L280 135 L505 28" fill="none" stroke="#ff7a1a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          <text x="45" y="206" fill="#a99178" fontSize="12">Valori negativi</text><text x="418" y="206" fill="#a99178" fontSize="12">Valori positivi</text>
          <text x="335" y="52" fill="#ff7a1a" fontSize="13">Effetto con soglia (ReLU)</text><text x="50" y="48" fill="#f3e7d3" fontSize="13">Retta (schema)</text>
        </svg>
        <p>Schema illustrativo, non un grafico di osservazioni sperimentali. Serve a vedere perché una singola retta non riproduce esattamente un effetto con soglia.</p>
      </div>
      <p>Ho quindi confrontato due modelli addestrati con lo stesso tipo di algoritmo senza gradienti: uno lineare e uno che include una componente ReLU. La metrica è la <strong>MSE</strong>, l'errore quadratico medio sulle previsioni: più è bassa, meglio è.</p>
      <BarComparison title="Errore di previsione sul test · Q6" max={0.6} items={[{label:"Modello lineare · ZSGD",value:0.520539,display:"0,5205"},{label:"Modello con ReLU · ZSGD",value:0.246118,display:"0,2461",highlight:true}]} note="Mediane su cinque esecuzioni, dati simulati e test separato. Scala da 0 a 0,6 MSE. Fonte: report Q6 del repository."/>
      <div className="ner-insight"><span className="eyebrow">COSA CI DICE IL GRAFICO</span><p>Nel test, l'errore mediano del modello flessibile è <strong>circa il 53% più basso</strong>. Non significa che i modelli complessi siano sempre migliori: qui la componente ReLU rappresenta proprio la struttura usata per generare i dati.</p></div>
      <p>Il passaggio precedente del progetto mostra anche che la regressione lineare ha un errore di approssimazione teorico non nullo: aumentare il campione riduce l'incertezza della stima, ma non elimina da solo questa limitazione del modello.</p>
    </section>

    <section className="case-section" id="ottimizzazione">
      <p className="eyebrow">03 / SECONDA SCOPERTA · COME SI IMPARA</p>
      <h2>E se non potessimo calcolare il gradiente?</h2>
      <p>Normalmente un algoritmo di ottimizzazione usa il <strong>gradiente</strong> per capire in quale direzione aggiornare i parametri. Ma in alcuni problemi possiamo valutare quanto è buona una soluzione senza avere accesso alle derivate.</p>
      <div className="case-columns ner-models">
        <div><span className="eyebrow">APPROCCIO CLASSICO</span><h3>GD e SGD</h3><p>Usano derivate per aggiornare i parametri. GD considera l'intero campione; SGD lavora con osservazioni estratte casualmente e può compiere più aggiornamenti a parità di valutazioni individuali del gradiente.</p></div>
        <div><span className="eyebrow">APPROCCIO SENZA GRADIENTI</span><h3>ZGD e ZSGD</h3><p>Valutano la funzione in due punti vicini e stimano una direzione di miglioramento. È una strategia utile quando il gradiente non è disponibile, ma può introdurre molta variabilità.</p></div>
      </div>
      <div className="ner-example">
        <div className="ner-example-top"><span>L'INTUIZIONE</span><span>SCHEMA ILLUSTRATIVO</span></div>
        <svg viewBox="0 0 560 210" role="img" aria-label="Curva a forma di valle con due valutazioni della funzione vicine, utilizzate per stimare una direzione di discesa" style={{width:"100%",height:"auto",display:"block",marginTop:20}}>
          <path d="M40 25 Q280 350 520 25" fill="none" stroke="#f3e7d3" strokeWidth="3"/>
          <line x1="355" y1="65" x2="355" y2="171" stroke="#a99178" strokeDasharray="5 5"/>
          <circle cx="330" cy="144" r="6" fill="#ff7a1a"/><circle cx="380" cy="119" r="6" fill="#ff7a1a"/>
          <text x="280" y="185" fill="#ff7a1a" fontSize="13">Due valutazioni vicine</text>
          <text x="38" y="202" fill="#a99178" fontSize="12">Confrontare i valori aiuta a stimare la direzione</text>
        </svg>
      </div>
      <p>Nel progetto ho implementato e confrontato questi algoritmi controllando il numero di valutazioni richieste. Ho anche studiato come cambiano i risultati al variare del passo di aggiornamento e delle direzioni casuali utilizzate.</p>
      <BarComparison title="Quanto si avvicinano al minimo? · Q4" max={0.36} items={[{label:"Minimo OLS (riferimento)",value:0.346020375,display:"0,346020"},{label:"Gradient Descent (GD)",value:0.3460224578,display:"0,346022",highlight:true},{label:"Stochastic GD (media di 5 run)",value:0.3461215602,display:"0,346122",highlight:true}]} note="Valore finale della funzione obiettivo sul training, non errore su dati nuovi. Budget di 30.000 valutazioni di gradienti individuali per metodo. Le differenze sono molto piccole e una scala da zero le rende quasi invisibili: è una scelta intenzionale per non esagerarle." />
      <p>Qui i tre valori sono praticamente sovrapposti: entrambi i metodi arrivano vicino al minimo OLS. Le <strong>curve di convergenza</strong> nel repository raccontano invece come ci arrivano: GD con pochi aggiornamenti completi e SGD con molti aggiornamenti rumorosi.</p>
      <div className="ner-insight"><span className="eyebrow">IL RISULTATO PIÙ ISTRUTTIVO</span><p><strong>Una stima del gradiente matematicamente corretta non garantisce un addestramento stabile.</strong> Alcune configurazioni zeroth-order divergono. Ho mantenuto e documentato anche questi casi: capire i fallimenti è parte del lavoro sperimentale.</p></div>
      <p className="ner-note">I budget di valutazioni di gradienti e di valori della funzione sono dichiarati separatamente: non equivalgono automaticamente allo stesso tempo di calcolo. I dettagli e le curve delle esecuzioni sono disponibili nel <a href={`${repo}/blob/main/docs/Q5_RESULTS.md`} target="_blank" rel="noopener noreferrer" style={{color:"var(--orange)",textDecoration:"underline"}}>report sull'ottimizzazione</a>.</p>
    </section>

    <section className="case-section" id="applicazione">
      <p className="eyebrow">04 / TERZA SCOPERTA · UN PROBLEMA DI CLASSIFICAZIONE</p>
      <h2>Un metodo senza gradienti può competere con un ottimizzatore standard?</h2>
      <p>Per la domanda bonus ho utilizzato il dataset pubblico <strong>UCI MAGIC Gamma Telescope</strong>: 19.020 eventi simulati descritti da dieci variabili numeriche. L'obiettivo è distinguere eventi gamma da eventi hadron.</p>
      <p>Per isolare il più possibile l'effetto dell'ottimizzazione, ho confrontato <strong>la stessa famiglia di modelli</strong>, la regressione logistica, addestrata con L-BFGS oppure con ZSGD. I dati sono divisi in training, validation e test; la standardizzazione viene appresa soltanto sul training.</p>
      <BarComparison title="Capacità di distinguere le classi · ROC-AUC sul test" max={1} items={[{label:"Regressione logistica · L-BFGS",value:0.8305,display:"0,8305"},{label:"Regressione logistica · ZSGD (min)",value:0.8266,display:"0,8266",highlight:true},{label:"Regressione logistica · ZSGD (max)",value:0.8334,display:"0,8334",highlight:true}]} note="ROC-AUC: 0,5 indica discriminazione casuale; 1,0 è il valore ideale. La barra parte da zero per non amplificare le differenze. ZSGD: intervallo dei risultati osservati su tre seed, non intervallo di confidenza."/>
      <BarComparison title="Un altro punto di vista: falsi positivi a soglia 0,5" max={100} items={[{label:"L-BFGS · hadron scambiati per gamma",value:43.8714,display:"43,87%"},{label:"ZSGD · mediana dei tre seed",value:44.6188,display:"44,62%",highlight:true}]} note="Percentuale di eventi hadron del test classificati erroneamente come gamma. Valori più bassi sono migliori. Stesso test set e soglia di classificazione fissata a 0,5; i dati sono eventi simulati." />
      <p>Questo secondo grafico chiarisce perché non basta dire «ROC-AUC circa 0,83»: quando si decide concretamente quali eventi classificare come gamma, <strong>la soglia scelta</strong> cambia il tipo e la quantità degli errori.</p>
      <div className="ner-insight"><span className="eyebrow">COME LEGGERE IL RISULTATO</span><p>Le ROC-AUC sono <strong>molto vicine in questo esperimento</strong>. Questo mostra che ZSGD riesce ad addestrare il classificatore in condizioni definite, non che sia più veloce o generalmente preferibile a L-BFGS.</p></div>
      <p>C'è anche un secondo punto: una buona ROC-AUC non basta per scegliere come usare un classificatore. Alla soglia 0,5, la baseline identifica erroneamente come gamma circa <strong>il 43,9% degli eventi hadron</strong> del test. In un'applicazione concreta bisognerebbe valutare soglie e costi degli errori.</p>
      <p className="ner-note">MAGIC contiene eventi simulati, non osservazioni operative rappresentative di un deployment reale. Il confronto usa uno split fisso e tre seed ZSGD: non è una valutazione esaustiva della robustezza.</p>
    </section>

    <section className="case-section" id="conclusioni">
      <p className="eyebrow">05 / COSA PORTO DA QUESTO PROGETTO</p>
      <h2>Non basta ottenere un risultato: bisogna saperlo spiegare.</h2>
      <div className="ner-limit-grid">
        <div><span>01</span><h3>Ragionamento statistico</h3><p>Distinguere errore di stima, errore di approssimazione e qualità predittiva.</p></div>
        <div><span>02</span><h3>Implementazione</h3><p>Tradurre algoritmi di ottimizzazione in Python e confrontarli con budget espliciti.</p></div>
        <div><span>03</span><h3>Valutazione critica</h3><p>Non nascondere divergenze, variabilità o limitazioni del protocollo sperimentale.</p></div>
        <div><span>04</span><h3>Riproducibilità</h3><p>Organizzare codice, test, dipendenze, report e verifiche automatiche per rendere ispezionabile il lavoro.</p></div>
      </div>
      <div className="ner-conclusion"><p className="eyebrow">IN SINTESI</p><h3>Tre esperimenti, una lezione: il contesto dà significato ai numeri.</h3><p>La flessibilità del modello conta quando i dati sono non lineari; un algoritmo senza gradienti può funzionare, ma richiede attenzione alla stabilità; una metrica di classificazione va interpretata insieme agli errori e ai costi computazionali.</p></div>
    </section>

    <section className="ner-resources" aria-label="Documentazione e codice">
      <div><p className="eyebrow">VUOI APPROFONDIRE?</p><h2>Dal racconto agli esperimenti.</h2><p>Questa pagina presenta le intuizioni e i risultati principali. Su GitHub trovi il codice, i report delle sette domande, le figure riproducibili, i test e le scelte metodologiche.</p></div>
      <div className="ner-resource-links">
        <a href={repo} target="_blank" rel="noopener noreferrer">ESPLORA IL REPOSITORY ↗</a>
        <a href={`${repo}/blob/main/docs/ASSIGNMENT_OVERVIEW.md`} target="_blank" rel="noopener noreferrer">LE SETTE DOMANDE ↗</a>
        <a href={`${repo}/blob/main/docs/FIGURES_AND_RESULTS.md`} target="_blank" rel="noopener noreferrer">GRAFICI E RISULTATI COMPLETI ↗</a>
        <a href={`${repo}/blob/main/docs/METHODOLOGY_AUDIT.md`} target="_blank" rel="noopener noreferrer">SCELTE E LIMITI METODOLOGICI ↗</a>
      </div>
    </section>
  </>;
}
