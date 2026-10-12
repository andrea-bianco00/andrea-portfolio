import Link from "next/link";

const metrics = [
  { label: "Entity F1", bilstm: 69.94, distilbert: 85.78 },
  { label: "Precision", bilstm: 67.41, distilbert: 83.22 },
  { label: "Recall", bilstm: 72.66, distilbert: 88.51 },
  { label: "Token accuracy", bilstm: 92.70, distilbert: 96.36 },
];
const histories = {
  bilstm: [0.3718, 0.2763, 0.2204, 0.2023, 0.1868, 0.1874, 0.1745, 0.1823, 0.1893, 0.1888],
  distilbert: [0.1181, 0.0880, 0.0757],
};
const fmt = (n: number) => n.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function LossChart({ values, name }: { values: number[]; name: string }) {
  const max = 0.4;
  const points = values.map((value, index) => `${(index / (values.length - 1)) * 100},${100 - (value / max) * 100}`).join(" ");
  return <div className="ner-loss-panel">
    <div className="ner-loss-head"><strong>{name}</strong><span>{values.length} epoche</span></div>
    <svg className="ner-loss-svg" viewBox="0 0 100 110" preserveAspectRatio="none" role="img" aria-label={`Validation loss ${name}: ${values.map((v, i) => `epoca ${i + 1}, ${v.toFixed(4)}`).join("; ")}`}>
      {[0,25,50,75,100].map(y=><line key={y} x1="0" x2="100" y1={y} y2={y} stroke="#463025" strokeWidth=".5" strokeDasharray="2 3" />)}
      <polyline points={points} fill="none" stroke={name==="DistilBERT"?"#ff7a1a":"#f3e7d3"} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke"/>
      {values.map((value,i)=><circle key={i} cx={(i/(values.length-1))*100} cy={100-(value/max)*100} r="1.8" fill={name==="DistilBERT"?"#ff7a1a":"#f3e7d3"} vectorEffect="non-scaling-stroke"/>)}
    </svg>
    <div className="ner-loss-axis"><span>Epoca 1</span><span>Epoca {values.length}</span></div>
    <p>Validation loss finale: <strong>{values[values.length-1].toFixed(4)}</strong></p>
  </div>;
}

export default function NerCaseStudy() {
  return <>
    <div className="ner-overview" aria-label="Risultati principali">
      <div><span className="ner-kpi-label">Miglior Entity F1</span><strong>85,78<span>%</span></strong><small>DistilBERT · test set</small></div>
      <div><span className="ner-kpi-label">Differenza F1</span><strong>+15,84<span> pp</span></strong><small>DistilBERT rispetto a BiLSTM</small></div>
      <div><span className="ner-kpi-label">Dimensione del test</span><strong>3.453</strong><small>Frasi nel test set</small></div>
    </div>

    <nav className="ner-toc" aria-label="Indice del progetto">
      <span>IN QUESTA PAGINA</span>
      <a href="#problema">Il problema</a><a href="#metodo">Metodo</a><a href="#risultati">Risultati</a><a href="#training">Training</a><a href="#limiti">Limiti</a>
    </nav>

    <section className="case-section" id="problema">
      <p className="eyebrow">01 / IL PROBLEMA</p>
      <h2>Come riconoscere le entità in una frase?</h2>
      <p>La Named Entity Recognition (NER) identifica nel testo entità come persone, luoghi e organizzazioni. È un problema di classificazione sequenziale: il modello deve capire sia <em>quali parole</em> appartengono a un'entità sia <em>di quale tipo</em> si tratta.</p>
      <div className="ner-example">
        <div className="ner-example-top"><span>UN ESEMPIO CONCRETO</span><span>ILLUSTRATIVO · NON È UNA PREDIZIONE REALE</span></div>
        <p className="ner-sentence"><span className="ner-token">Maria<small>PER</small></span> lavora a <span className="ner-token">Milano<small>LOC</small></span> per <span className="ner-token">OpenAI<small>ORG</small></span>.</p>
        <p>Il modello assegna etichette alle parti della frase, distinguendo persone (PER), luoghi (LOC) e organizzazioni (ORG).</p>
      </div>
    </section>

    <section className="case-section" id="metodo">
      <p className="eyebrow">02 / DATASET E METODO</p>
      <h2>Due approcci alla stessa sfida.</h2>
      <p>Il confronto utilizza i dati CoNLL-2003 e due modelli di token classification. La BiLSTM è una baseline sequenziale; DistilBERT sfrutta invece un encoder Transformer preaddestrato.</p>
      <div className="ner-dataset" aria-label="Dimensioni del dataset">
        <div><strong>14.041</strong><span>Training</span></div><div><strong>3.250</strong><span>Validation</span></div><div><strong>3.453</strong><span>Test</span></div>
      </div>
      <div className="case-columns ner-models">
        <div><span className="eyebrow">MODELLO 01</span><h3>BiLSTM</h3><p>Rete ricorrente bidirezionale a 2 livelli, con embedding inizializzati casualmente.</p><dl><div><dt>Epoche</dt><dd>10</dd></div><div><dt>Learning rate</dt><dd>5 × 10⁻⁴</dd></div><div><dt>Batch size</dt><dd>32</dd></div></dl></div>
        <div><span className="eyebrow">MODELLO 02</span><h3>DistilBERT</h3><p>Encoder <code>distilbert-base-cased</code> preaddestrato, con testa di classificazione.</p><dl><div><dt>Epoche</dt><dd>3</dd></div><div><dt>Learning rate</dt><dd>1 × 10⁻⁵</dd></div><div><dt>Batch size</dt><dd>32</dd></div></dl></div>
      </div>
      <p className="ner-note">Entrambi gli esperimenti registrati utilizzano seed 42 e GPU Tesla T4. Il confronto include anche l'effetto del preaddestramento di DistilBERT: non isola la sola architettura.</p>
    </section>

    <section className="case-section" id="risultati">
      <p className="eyebrow">03 / RISULTATI SPERIMENTALI</p>
      <h2>DistilBERT supera la baseline nelle metriche registrate.</h2>
      <p>Confronto sul test set della nuova esecuzione completa su Colab. Le barre partono da zero per mostrare le differenze senza amplificarle visivamente.</p>
      <figure className="ner-chart">
        <div className="ner-chart-legend"><span><i className="ner-dot ner-dot-light"/> BiLSTM</span><span><i className="ner-dot ner-dot-orange"/> DistilBERT</span></div>
        {metrics.map((metric)=><div className="ner-metric-row" key={metric.label}>
          <h3>{metric.label}</h3>
          <div className="ner-barline"><div className="ner-bar ner-bar-light" style={{width:`${metric.bilstm}%`}}/><span>{fmt(metric.bilstm)}%</span></div>
          <div className="ner-barline"><div className="ner-bar ner-bar-orange" style={{width:`${metric.distilbert}%`}}/><span>{fmt(metric.distilbert)}%</span></div>
        </div>)}
        <figcaption>Fonte: risultati JSON dell'esecuzione completa di ottobre 2026. F1, precision e recall sono calcolate su etichette BIO espanse ai subword, non con lo scoring CoNLL canonico a livello di parola.</figcaption>
      </figure>
      <div className="ner-insight"><span className="eyebrow">COSA SIGNIFICA</span><p>Il vantaggio maggiore emerge nel riconoscimento delle entità: <strong>85,78% di Entity F1 contro 69,94%</strong>, pari a +15,84 punti percentuali. L'accuracy sui token è più alta per entrambi i modelli, ma da sola non descrive altrettanto bene la qualità delle entità individuate.</p></div>
    </section>

    <section className="case-section" id="training">
      <p className="eyebrow">04 / DINAMICA DI ADDESTRAMENTO</p>
      <h2>Come evolve la validation loss?</h2>
      <p>Queste curve utilizzano i valori realmente registrati dopo ogni epoca. Sono presentate separatamente perché i due modelli sono stati addestrati per un numero diverso di epoche.</p>
      <div className="ner-loss-grid"><LossChart name="BiLSTM" values={histories.bilstm}/><LossChart name="DistilBERT" values={histories.distilbert}/></div>
      <p>Per la BiLSTM la validation loss raggiunge il minimo all'epoca 7 (circa 0,1745) e poi oscilla, mentre la training loss continua a diminuire. Per DistilBERT la validation loss diminuisce in tutte e tre le epoche registrate. Sono osservazioni su queste singole esecuzioni, non prove generali di superiorità.</p>
    </section>

    <section className="case-section" id="limiti">
      <p className="eyebrow">05 / INTERPRETAZIONE E LIMITI</p>
      <h2>Una buona analisi racconta anche cosa non dimostrano i risultati.</h2>
      <div className="ner-limit-grid">
        <div><span>01</span><h3>Protocollo di valutazione</h3><p>Lo scoring usa etichette BIO espanse ai subword: i valori non sono direttamente confrontabili con il benchmark CoNLL word-level canonico.</p></div>
        <div><span>02</span><h3>Confronto non isolato</h3><p>DistilBERT parte da pesi preaddestrati, mentre gli embedding BiLSTM sono inizializzati casualmente.</p></div>
        <div><span>03</span><h3>Singola esecuzione</h3><p>È registrata una sola esecuzione completa per modello, senza intervalli di incertezza ottenuti da seed ripetuti.</p></div>
        <div><span>04</span><h3>Riproducibilità e dati</h3><p>Il dataset originale non è redistribuito; il notebook finale non è stato rieseguito integralmente in un nuovo ambiente Colab. L'audit documenta anche sovrapposizioni tra split.</p></div>
      </div>
      <div className="ner-conclusion"><p className="eyebrow">IN SINTESI</p><h3>Il valore del progetto è nel confronto, non soltanto nel punteggio.</h3><p>Il lavoro mostra un flusso sperimentale completo: preparazione dei dati, implementazione e addestramento di modelli diversi, valutazione, interpretazione dei risultati e documentazione dei limiti. I risultati favoriscono DistilBERT nelle condizioni studiate, senza dimostrare che il Transformer sia sempre la scelta migliore.</p></div>
    </section>

    <section className="ner-resources" aria-label="Documentazione e codice">
      <div><p className="eyebrow">ESPLORA IL LAVORO</p><h2>Dal case study al codice.</h2><p>Repository pubblico con implementazione, test, risultati aggregati, metodologia e istruzioni di riproduzione.</p></div>
      <div className="ner-resource-links">
        <a href="https://github.com/andrea-bianco00/natural-language-processing" target="_blank" rel="noopener noreferrer">CODICE SU GITHUB ↗</a>
        <a href="https://github.com/andrea-bianco00/natural-language-processing/blob/main/results/README.md" target="_blank" rel="noopener noreferrer">RISULTATI DOCUMENTATI ↗</a>
        <a href="https://github.com/andrea-bianco00/natural-language-processing/blob/main/METHODOLOGY_AUDIT.md" target="_blank" rel="noopener noreferrer">AUDIT METODOLOGICO ↗</a>
      </div>
    </section>
  </>;
}
