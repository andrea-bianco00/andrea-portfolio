import katex from "katex";
import "katex/dist/katex.min.css";

function Equation({math, label}:{math:string;label:string}) {
  return <figure className="hdts-equation">
    <div className="hdts-equation-scroll" role="img" aria-label={label} dangerouslySetInnerHTML={{__html:katex.renderToString(math,{displayMode:true,throwOnError:false,strict:"warn",trust:false})}}/>
    <figcaption>{label}</figcaption>
  </figure>;
}

export default function TimeSeriesTheory() {
  return <section id="hdts-teoria" className="case-section hdts-theory">
    <p className="eyebrow">03 / DENTRO I MODELLI</p>
    <h2>Non basta usare un modello: bisogna sapere cosa sta imparando.</h2>
    <p>La parte più interessante del progetto è il legame tra due problemi: <strong>modellare le dipendenze in una rete di serie temporali</strong> e <strong>trasformare quelle dipendenze in una previsione verificabile</strong>. Le formule qui sotto descrivono il principio dei metodi; dove parlo del VAR mi riferisco allo studio Taiwan, mentre la pipeline LightGBM appartiene all'estensione Beijing.</p>

    <div className="hdts-theory-block">
      <div className="hdts-theory-head"><span>01 / TAIWAN</span><strong>Modello statistico</strong></div>
      <h3>VAR: ogni serie può dipendere dal passato delle altre</h3>
      <p>In un <em>Vector Autoregression</em> di ordine p, il vettore delle misure all'istante t è spiegato dai vettori osservati nelle p ore precedenti. Ogni matrice di coefficienti descrive quali serie influenzano quali altre, a uno specifico ritardo.</p>
      <Equation math={String.raw`\\mathbf y_t=\\mathbf c+\\sum_{\\ell=1}^{p} A_{\\ell}\\mathbf y_{t-\\ell}+\\boldsymbol\\varepsilon_t`} label="yₜ è un vettore di d serie; Aₗ è una matrice d × d per ciascun ritardo."/>
      <p>Con <strong>d = 516</strong>, un VAR con un solo ritardo ha già <strong>266.256 coefficienti autoregressivi</strong>, prima di contare l'intercetta. A fronte di 744 osservazioni orarie, stimarli senza vincoli non è una strada realistica.</p>
      <div className="hdts-theory-insight"><strong>Perché regolarizzare?</strong><p>Una penalizzazione rende il problema più stabile e può favorire una struttura sparsa: non tutte le connessioni tra sensori devono essere diverse da zero. È il principio che motiva il VAR regolarizzato nel progetto universitario.</p></div>
      <Equation math={String.raw`\\min_{\\mathbf c,\\,A_1,\\ldots,A_p}\\;\\sum_t\\left\\|\\mathbf y_t-\\mathbf c-\\sum_{\\ell=1}^p A_{\\ell}\\mathbf y_{t-\\ell}\\right\\|_2^2+\\lambda\\sum_{\\ell=1}^p\\left\\|A_{\\ell}\\right\\|_1`} label="Esempio didattico: penalità L1 sui coefficienti del VAR. Non è una dichiarazione della configurazione esatta del BigVAR originale."/>
      <p>Il parametro λ controlla il compromesso: valori più grandi spingono più coefficienti verso zero; valori troppo grandi possono eliminare anche relazioni utili. <strong>Questa formula illustra una possibile regolarizzazione L1</strong>, senza attribuirla come specifica implementazione ai file originali non pubblicati.</p>
    </div>

    <div className="hdts-theory-block">
      <div className="hdts-theory-head"><span>02 / BEIJING</span><strong>Baseline</strong></div>
      <h3>Persistenza: il modello da battere</h3>
      <p>Prima di introdurre algoritmi più sofisticati, serve un riferimento che chiunque possa comprendere: la previsione dell'ora successiva coincide con l'ultima misura osservata.</p>
      <Equation math={String.raw`\\widehat y_{s,t}^{\\,\\mathrm{pers}}=y_{s,t-1}`} label="Per la stazione s, il valore previsto all'ora t è quello osservato all'ora t−1."/>
      <p>Su orizzonti di un'ora il PM2.5 è spesso persistente: una baseline così semplice può già ottenere buoni risultati. Se un modello più complesso non la supera, la complessità aggiunta è difficile da giustificare.</p>
    </div>

    <div className="hdts-theory-block">
      <div className="hdts-theory-head"><span>03 / BEIJING</span><strong>Gradient boosting</strong></div>
      <h3>LightGBM: tanti alberi piccoli che correggono gli errori</h3>
      <p>LightGBM è un'implementazione efficiente del <em>gradient boosting</em> su alberi decisionali. Un albero suddivide lo spazio delle variabili in regioni e produce una previsione per ogni regione. Nel boosting, gli alberi vengono aggiunti progressivamente per ridurre l'errore della previsione corrente.</p>
      <Equation math={String.raw`\\widehat\\Delta_{s,t}=\\sum_{m=1}^{M}\\eta\\,f_{m}(\\mathbf x_{s,t}),\\qquad\\widehat y_{s,t}=y_{s,t-1}+\\widehat\\Delta_{s,t}`} label="Nel benchmark gli alberi stimano la variazione di PM2.5, che viene sommata all'ultima misura osservata."/>
      <p>Qui <strong>x</strong> contiene lo storico del PM2.5 di tutte le 12 stazioni (ritardi 1, 2, 3, 6, 12 e 24 ore), le componenti cicliche del calendario e, nella versione completa, misure ambientali ritardate di un'ora. L'algoritmo può catturare interazioni e non linearità senza doverle specificare a mano.</p>
      <Equation math={String.raw`\\mathcal L=\\sum_{i=1}^{n}\\big(\\Delta_i-\\widehat\\Delta_i\\big)^2+\\sum_{m=1}^{M}\\Omega(f_m)`} label="Schema concettuale della funzione obiettivo: errore quadratico più controllo della complessità degli alberi."/>
      <p>Nel codice pubblicato uso <strong>70 alberi, learning rate 0,045, massimo 31 foglie e regolarizzazione L2 pari a 10</strong>. Il numero di alberi e il learning rate regolano quanto gradualmente viene costruita la previsione; la struttura degli alberi e la penalizzazione ne limitano la complessità. Questi parametri sono una configurazione storica fissata per il confronto, <strong>non il risultato di una selezione su un test incontaminato</strong>.</p>
    </div>

    <div className="hdts-theory-block">
      <div className="hdts-theory-head"><span>04 / VALUTAZIONE</span><strong>Metriche</strong></div>
      <h3>MAE e RMSE: due modi diversi di misurare l'errore</h3>
      <p>Una previsione va giudicata su osservazioni che non sono state usate per stimare il modello. Qui confronto le previsioni sulle stesse ore valide e riporto sia l'errore assoluto medio sia la radice dell'errore quadratico medio.</p>
      <div className="hdts-theory-metrics">
        <div><h4>MAE · errore medio assoluto</h4><Equation math={String.raw`\\mathrm{MAE}=\\frac1n\\sum_{i=1}^{n}|y_i-\\widehat y_i|`} label="Facile da interpretare nelle unità del PM2.5: ogni errore pesa linearmente."/><p>È la metrica principale: risponde alla domanda «di quanto sbaglio, in media?».</p></div>
        <div><h4>RMSE · radice dell'errore quadratico medio</h4><Equation math={String.raw`\\mathrm{RMSE}=\\sqrt{\\frac1n\\sum_{i=1}^{n}(y_i-\\widehat y_i)^2}`} label="Gli errori grandi pesano di più perché vengono elevati al quadrato."/><p>È utile quando vogliamo evidenziare maggiormente le previsioni molto sbagliate.</p></div>
      </div>
      <p><strong>Un punto metodologico decisivo:</strong> il modello LightGBM è addestrato a minimizzare una perdita quadratica, mentre il risultato principale è riportato in MAE. Non sono la stessa cosa: un modello può migliorare una metrica senza migliorare necessariamente l'altra.</p>
    </div>
    <div className="hdts-theory-summary"><span>IL FILO LOGICO</span><p>Il VAR aiuta a ragionare sulle <strong>dipendenze fra serie</strong>. La persistenza definisce il <strong>livello minimo da superare</strong>. LightGBM prova a sfruttare <strong>relazioni non lineari e variabili aggiuntive</strong>. MAE e RMSE misurano il risultato. E la separazione temporale — insieme alla consapevolezza dei limiti del test retrospettivo — determina quanto possiamo fidarci delle conclusioni.</p></div>
  </section>;
}
