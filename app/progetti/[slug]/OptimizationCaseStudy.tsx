const repo = "https://github.com/andrea-bianco00/machine-learning-methods";
const figures = "https://raw.githubusercontent.com/andrea-bianco00/machine-learning-methods/main/public-figures";

function ExperimentFigure({file, title, caption}:{file:string;title:string;caption:string}) {
  return <figure style={{margin:"30px 0 38px",padding:"clamp(16px,3vw,28px)",border:"1px solid rgba(255,255,255,.15)",borderRadius:18,background:"linear-gradient(145deg,#171411,#221a15)"}}>
    <p className="eyebrow" style={{marginBottom:14}}>GRAFICO ORIGINALE · ESPERIMENTO PYTHON</p>
    <div style={{borderRadius:10,overflow:"hidden",background:"#fff",padding:"clamp(6px,1.5vw,16px)"}}>
      <a href={`${figures}/${file}`} target="_blank" rel="noopener noreferrer" title="Apri il grafico originale a grandezza naturale">
        <img src={`${figures}/${file}`} alt={title} loading="lazy" style={{display:"block",width:"100%",height:"auto",objectFit:"contain"}} />
      </a>
    </div>
    <figcaption style={{marginTop:16,color:"#d7c7b9",lineHeight:1.7,fontSize:14}}>{caption} <a href={`${figures}/${file}`} target="_blank" rel="noopener noreferrer" style={{color:"#ff8b43",textDecoration:"underline",whiteSpace:"nowrap"}}>Ingrandisci ↗</a></figcaption>
  </figure>;
}



function PortfolioChart({heading,description,values,unit,lowerBetter=true}:{heading:string;description:string;values:{name:string;value:number;color:string}[];unit:string;lowerBetter?:boolean}) {
 const max=Math.max(...values.map(v=>v.value))*1.13;
 return <figure style={{margin:"30px 0 38px",padding:"clamp(20px,4vw,36px)",border:"1px solid #463328",borderRadius:20,background:"linear-gradient(145deg,#19120f,#251811)"}}>
  <p className="eyebrow" style={{color:"#ff862c",marginBottom:8}}>RISULTATI REALI · VISUALIZZAZIONE INTERATTIVA</p>
  <h3 style={{fontSize:"clamp(21px,2.6vw,29px)",color:"#f7e9d8",margin:"0 0 8px"}}>{heading}</h3>
  <p style={{color:"#c4ab95",fontSize:14,marginBottom:28}}>{description}</p>
  <div role="img" aria-label={heading} style={{display:"grid",gap:22}}>
   {values.map(v=><div key={v.name}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",gap:12,flexWrap:"wrap",marginBottom:9}}>
     <span style={{fontSize:14,color:"#f4e5d5",fontWeight:600}}>{v.name}</span>
     <strong style={{fontSize:21,color:v.color,fontVariantNumeric:"tabular-nums"}}>{v.value.toLocaleString("it-IT",{maximumFractionDigits:4})}{unit}</strong>
    </div>
    <div style={{height:13,background:"#37271f",borderRadius:99,overflow:"hidden"}}>
     <div style={{width:`${v.value/max*100}%`,height:"100%",borderRadius:99,background:v.color,transition:"width .7s ease"}}/>
    </div>
   </div>)}
  </div>
  <figcaption style={{color:"#bca592",fontSize:12,lineHeight:1.7,marginTop:22}}>Barre proporzionali con origine zero. {lowerBetter?"Valori più bassi sono migliori.":"Valori più alti sono migliori."} Dati verificati nei report originali del progetto.</figcaption>
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
      <ExperimentFigure file="q2_signals.png" title="Segnale lineare e segnale non lineare ReLU" caption="Come leggerlo: il primo segnale cresce in modo lineare, il secondo presenta una soglia. È il motivo per cui una retta da sola non può rappresentare perfettamente il fenomeno." />
      <p>Ho quindi confrontato due modelli addestrati con lo stesso tipo di algoritmo senza gradienti: uno lineare e uno che include una componente ReLU. La metrica è la <strong>MSE</strong>, l'errore quadratico medio sulle previsioni: più è bassa, meglio è.</p>
      <PortfolioChart heading="Quanto cambia l'errore di previsione?" description="Q6 · MSE mediana su 1.000 nuove osservazioni, cinque esecuzioni per metodo." unit="" values={[{name:"Lineare · ZSGD",value:0.520539,color:"#e6c3a4"},{name:"Flessibile · ZGD",value:0.708470,color:"#a88a75"},{name:"Flessibile con ReLU · ZSGD",value:0.246118,color:"#ff862c"}]}/>
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
      <p>Nel progetto ho implementato e confrontato questi algoritmi controllando il numero di valutazioni richieste. Ho anche studiato come cambiano i risultati al variare del passo di aggiornamento e delle direzioni casuali utilizzate.</p>
      <PortfolioChart heading="GD e SGD arrivano entrambi vicini al minimo" description="Q4 · Errore di training finale, 30.000 valutazioni di gradienti individuali. Le differenze sono minime." unit="" values={[{name:"Minimo OLS",value:0.346020375,color:"#a88a75"},{name:"Gradient Descent",value:0.3460224578,color:"#ff862c"},{name:"Stochastic Gradient Descent · media",value:0.3461215602,color:"#e6c3a4"}]}/>
      <p>Entrambi i metodi arrivano vicino al minimo OLS. Le <strong>curve di convergenza</strong> nel repository raccontano invece come ci arrivano: GD con pochi aggiornamenti completi e SGD con molti aggiornamenti rumorosi.</p>
      <ExperimentFigure file="q5_convergence.png" title="Curve originali Q5: GD, SGD e metodi zeroth-order con instabilità visibili" caption="La scala logaritmica è intenzionale: alcune traiettorie senza gradienti diventano molto instabili. Non è un errore grafico, ma un risultato importante da interpretare." />
      <div className="ner-insight"><span className="eyebrow">IL RISULTATO PIÙ ISTRUTTIVO</span><p><strong>Una stima del gradiente matematicamente corretta non garantisce un addestramento stabile.</strong> Alcune configurazioni zeroth-order divergono. Ho mantenuto e documentato anche questi casi: capire i fallimenti è parte del lavoro sperimentale.</p></div>
      <p className="ner-note">I budget di valutazioni di gradienti e di valori della funzione sono dichiarati separatamente: non equivalgono automaticamente allo stesso tempo di calcolo. I dettagli e le curve delle esecuzioni sono disponibili nel <a href={`${repo}/blob/main/docs/Q5_RESULTS.md`} target="_blank" rel="noopener noreferrer" style={{color:"var(--orange)",textDecoration:"underline"}}>report sull'ottimizzazione</a>.</p>
    </section>

    <section className="case-section" id="applicazione">
      <p className="eyebrow">04 / TERZA SCOPERTA · UN PROBLEMA DI CLASSIFICAZIONE</p>
      <h2>Un metodo senza gradienti può competere con un ottimizzatore standard?</h2>
      <p>Per la domanda bonus ho utilizzato il dataset pubblico <strong>UCI MAGIC Gamma Telescope</strong>: 19.020 eventi simulati descritti da dieci variabili numeriche. L'obiettivo è distinguere eventi gamma da eventi hadron.</p>
      <p>Per isolare il più possibile l'effetto dell'ottimizzazione, ho confrontato <strong>la stessa famiglia di modelli</strong>, la regressione logistica, addestrata con L-BFGS oppure con ZSGD. I dati sono divisi in training, validation e test; la standardizzazione viene appresa soltanto sul training.</p>
      <PortfolioChart heading="I due metodi distinguono le classi in modo simile" description="Q7 · ROC-AUC sullo stesso test set MAGIC. ZSGD: tre esecuzioni distinte, senza selezionare la migliore." unit="" lowerBetter={false} values={[{name:"Regressione logistica · L-BFGS",value:0.830492,color:"#ff862c"},{name:"ZSGD · seed 142",value:0.826648,color:"#e6c3a4"},{name:"ZSGD · seed 143",value:0.829815,color:"#d3a078"},{name:"ZSGD · seed 144",value:0.833424,color:"#aa8064"}]}/>
      <p>Il confronto dei falsi positivi chiarisce perché non basta dire «ROC-AUC circa 0,83»: quando si decide concretamente quali eventi classificare come gamma, <strong>la soglia scelta</strong> cambia il tipo e la quantità degli errori.</p>
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
