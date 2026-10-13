export default function OptimizationCaseStudy() {
  return <>
    <div className="ner-overview" aria-label="Risultati principali del progetto">
      <div><span className="ner-kpi-label">Esperimenti</span><strong>7</strong><small>Q1–Q7 · bonus classificazione incluso</small></div>
      <div><span className="ner-kpi-label">ROC-AUC Q7</span><strong>0,8305</strong><small>Logistic regression · test UCI MAGIC</small></div>
      <div><span className="ner-kpi-label">Test set Q7</span><strong>3.804</strong><small>Eventi simulati MAGIC · split indipendente</small></div>
    </div>

    <nav className="ner-toc" aria-label="Indice del progetto">
      <span>IN QUESTA PAGINA</span>
      <a href="#problema">Obiettivo</a>
      <a href="#metodo">Metodo</a>
      <a href="#risultati">Risultati</a>
      <a href="#limiti">Limiti</a>
    </nav>

    <section className="case-section" id="problema">
      <p className="eyebrow">01 / OBIETTIVO</p>
      <h2>Quanto conta il metodo di ottimizzazione?</h2>
      <p>Il progetto ricostruisce in Python un'esercitazione di Machine Learning svolta all'ENSAI nel 2025. Studia il rischio di previsione, la regressione sotto specificazione imperfetta e le differenze tra algoritmi basati sui gradienti e metodi <em>zeroth-order</em>, che stimano la direzione di discesa usando soltanto valori della funzione.</p>
      <p>Le implementazioni, i test e gli approfondimenti documentati nel repository sono una ricostruzione successiva della consegna universitaria, con correzioni metodologiche esplicitate.</p>
    </section>

    <section className="case-section" id="metodo">
      <p className="eyebrow">02 / METODO</p>
      <h2>Sette domande, un approccio verificabile.</h2>
      <div className="case-columns ner-models">
        <div><span className="eyebrow">Q1–Q3</span><h3>Statistical learning</h3><p>Rischio OLS, segnali lineari e non lineari, errore di approssimazione e rischio predittivo. Confronti con riferimenti matematici e simulazioni Monte Carlo.</p></div>
        <div><span className="eyebrow">Q4–Q6</span><h3>Optimization</h3><p>Confronto tra Gradient Descent, Stochastic Gradient Descent e versioni zeroth-order. Budget di valutazioni espliciti, analisi di stabilità e modelli con componente ReLU.</p></div>
      </div>
      <p><strong>Q7, domanda bonus:</strong> classificazione sul dataset UCI MAGIC Gamma Telescope. Due regressioni logistiche con la stessa struttura: una addestrata con L-BFGS, l'altra con ZSGD implementato nel progetto. Split stratificato 60/20/20, standardizzazione sul solo training e tre seed per ZSGD.</p>
      <p className="ner-note">Il dataset MAGIC contiene eventi simulati; non è un campione rappresentativo delle condizioni operative reali. Il progetto non redistribuisce il dataset originale.</p>
    </section>

    <section className="case-section" id="risultati">
      <p className="eyebrow">03 / RISULTATI</p>
      <h2>Un confronto che richiede più di una metrica.</h2>
      <p>Sul test set MAGIC di 3.804 osservazioni, la regressione logistica standard raggiunge ROC-AUC 0,8305 e accuracy 78,31%. Le tre esecuzioni ZSGD ottengono ROC-AUC tra 0,8266 e 0,8334 e accuracy tra 77,73% e 77,89%.</p>
      <div className="ner-dataset" aria-label="Metriche sul test set MAGIC">
        <div><strong>0,8305</strong><span>ROC-AUC baseline</span></div>
        <div><strong>0,8298</strong><span>ROC-AUC mediana ZSGD</span></div>
        <div><strong>43,87%</strong><span>Falsi positivi hadron · baseline a soglia 0,5</span></div>
      </div>
      <p>Il tasso di falsi positivi è particolarmente rilevante: alla soglia 0,5 la baseline identifica erroneamente come gamma 587 dei 1.338 eventi hadron nel test. Per un'applicazione reale andrebbe valutata una soglia operativa diversa, coerente con i costi degli errori.</p>
      <div className="ner-insight"><span className="eyebrow">COSA ABBIAMO IMPARATO</span><p>In questo esperimento <strong>ZSGD raggiunge una discriminazione simile alla baseline</strong>, ma non dimostra un vantaggio generale di prestazioni o di efficienza. La parte più importante è il protocollo: budget espliciti, test indipendente e interpretazione dei limiti.</p></div>
      <p>Negli esperimenti simulati, il modello flessibile Q6 addestrato con ZSGD raggiunge una MSE mediana di circa 0,2461 sul test, contro circa 0,5205 della versione lineare ZSGD, alle condizioni specificate.</p>
    </section>

    <section className="case-section" id="limiti">
      <p className="eyebrow">04 / LIMITI E RIPRODUCIBILITÀ</p>
      <h2>I risultati non sono una classifica universale.</h2>
      <div className="ner-limit-grid">
        <div><span>01</span><h3>Budget computazionale</h3><p>Valutazioni di gradienti e valori di funzione non equivalgono a pari tempo di esecuzione. I costi diagnostici sono esclusi dai budget di ottimizzazione.</p></div>
        <div><span>02</span><h3>Variabilità</h3><p>Le conclusioni Q7 derivano da uno split e tre seed ZSGD, senza intervalli di confidenza o confronti su molteplici split.</p></div>
        <div><span>03</span><h3>Scelte dichiarate</h3><p>Le correzioni alle formule della consegna, gli iperparametri e gli esperimenti aggiuntivi sono descritti separatamente dai risultati originali.</p></div>
        <div><span>04</span><h3>Riproduzione</h3><p>Script Python, dipendenze fissate, test automatici e GitHub Actions rigenerano grafici e risultati; la Q7 richiede il dataset UCI.</p></div>
      </div>
      <div className="ner-conclusion"><p className="eyebrow">IN SINTESI</p><h3>Il metodo conta quanto il risultato.</h3><p>Il progetto dimostra implementazione di algoritmi, simulazione statistica, analisi quantitativa e attenzione alle definizioni di rischio e ai limiti dei confronti sperimentali.</p></div>
    </section>

    <section className="ner-resources" aria-label="Documentazione e codice">
      <div><p className="eyebrow">ESPLORA IL LAVORO</p><h2>Codice, test e risultati.</h2><p>Repository pubblico con i sette esperimenti, documentazione per domanda e artefatti riproducibili.</p>
      <a href="https://github.com/andrea-bianco00/machine-learning-methods" target="_blank" rel="noopener noreferrer" className="text-link">APRI IL REPOSITORY GITHUB ↗</a></div>
    </section>
  </>;
}
