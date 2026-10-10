import Link from "next/link";

const featured = [
  { n:"01", category:"Ricerca · 2026", title:"Mean and Covariance Estimation for Sparse Functional Data", text:"Stima della media e della struttura di covarianza per dati funzionali sparsi attraverso un approccio semiparametrico, sviluppata durante il tirocinio di ricerca presso CREST–ENSAI.", href:"/ricerca/sparse-functional-data", tags:["R","Functional Data Analysis","Simulazione"] },
  { n:"02", category:"Data Science · 2025", title:"Spatial Interpolation with INSEE", text:"Un framework di interpolazione spaziale che mette a confronto Random Forest, Gradient Boosting e Kriging su dataset di grandi dimensioni.", href:"/progetti/spatial-interpolation", tags:["Machine Learning","Spatial Data","R"] },
  { n:"03", category:"Machine Learning · 2024", title:"Customer Churn Prediction", text:"Predizione del churn combinando dati strutturati, sentiment analysis ed ensemble learning in un progetto sviluppato con BCG.", href:"/progetti/customer-churn", tags:["Classification","NLP","Ensemble Learning"] },
];

const approach = [
  ["01","Capire","Partire dal problema e dai dati prima di scegliere il modello."],
  ["02","Modellare","Usare statistica e Machine Learning scegliendo metodi coerenti con il contesto."],
  ["03","Verificare","Confrontare alternative, misurare le prestazioni e cercare i limiti delle soluzioni."],
  ["04","Comunicare","Trasformare risultati tecnici in conclusioni leggibili e utili."],
];

export default function Home() {
  return <main>
    <nav className="site-nav">
      <Link href="/" className="brand">ANDREA BIANCO</Link>
      <div className="nav-links"><Link href="/progetti">PROGETTI</Link><Link href="/ricerca">RICERCA</Link><Link href="/scritti">SCRITTI</Link><Link href="/about">CHI SONO</Link><Link href="/cv">CV</Link><span className="language">IT <span>EN</span></span></div>
    </nav>

    <section className="hero">
      <div>
        <p className="eyebrow">DATA SCIENTIST · STATISTICA · MACHINE LEARNING</p>
        <h1>CAPIRE I DATI.<br/><em>CAPIRE IL PROBLEMA.</em></h1>
        <p className="hero-copy">Sono Andrea Bianco, Data Scientist con una formazione in Statistica. Mi interessa capire a fondo i problemi e usare statistica, Machine Learning e AI per costruire soluzioni efficaci in contesti reali.</p>
        <div className="actions"><Link href="/progetti" className="button primary">ESPLORA I PROGETTI</Link><Link href="/about" className="button secondary">SCOPRI CHI SONO</Link></div>
        <div className="hero-links"><a href="https://github.com/andrea-bianco00">GITHUB ↗</a><a href="https://www.linkedin.com/in/andreabianco00">LINKEDIN ↗</a><a href="mailto:andrea.bianco00.ab@gmail.com">EMAIL ↗</a></div>
      </div>
      <div className="hero-card" aria-label="Visualizzazione astratta ispirata all'analisi di dati funzionali">
        <div className="viz-label"><span>FUNCTIONAL DATA</span><span>μ(t) · C(s,t)</span></div>
        <svg className="curves" viewBox="0 0 500 500" role="img">
          <path d="M15 385 C90 345 120 255 195 295 S305 155 485 115"/><path d="M15 410 C95 375 125 300 200 315 S315 205 485 145"/><path d="M15 355 C100 330 130 220 205 270 S310 110 485 92"/><path d="M15 430 C90 395 145 345 215 335 S330 245 485 175"/>
        </svg>
        <div className="viz-caption"><strong>OSSERVARE</strong><strong>MODELLARE</strong><strong>VERIFICARE</strong></div>
      </div>
    </section>

    <section className="section work">
      <div className="section-head"><div><p className="eyebrow">LAVORI SELEZIONATI</p><h2>Progetti che raccontano<br/>come lavoro.</h2></div><Link href="/progetti">VEDI TUTTI I PROGETTI →</Link></div>
      <div className="project-list">{featured.map(p=><Link href={p.href} className="project-row" key={p.title}><span className="project-number">{p.n}</span><div><p className="project-meta">{p.category}</p><h3>{p.title}</h3><p className="project-description">{p.text}</p><div className="tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div></div><span className="arrow">↗</span></Link>)}</div>
    </section>

    <section className="section">
      <div className="section-title"><p className="eyebrow">APPROCCIO</p><h2>Il metodo prima dello strumento.</h2><p>Non parto da un algoritmo. Parto dalla domanda, cerco di capire cosa raccontano i dati e scelgo gli strumenti di conseguenza.</p></div>
      <div className="approach-grid">{approach.map(a=><article key={a[0]}><span>{a[0]}</span><h3>{a[1]}</h3><p>{a[2]}</p></article>)}</div>
    </section>

    <section className="section research-feature">
      <div><p className="eyebrow">RICERCA · CREST–ENSAI</p><h2>Quando il dato è poco,<br/><em>il metodo conta ancora di più.</em></h2></div>
      <div><p className="large-copy">Durante il tirocinio di ricerca presso CREST–ENSAI ho lavorato sulla stima della struttura di covarianza per dati funzionali sparsi. Ho studiato la letteratura, implementato metodi in R, progettato simulazioni e confrontato approcci alternativi su dati sintetici e reali.</p><Link href="/ricerca" className="text-link">SCOPRI LA MIA RICERCA →</Link></div>
    </section>

    <section className="section journey">
      <p className="eyebrow">PERCORSO</p><h2>Dalla statistica alla Data Science.</h2>
      <div className="timeline"><article><span>2021 — 2024</span><h3>Statistica</h3><p>Laurea triennale in Scienze Statistiche, Università di Bologna.</p></article><article><span>2024 — 2026</span><h3>Data Science</h3><p>Laurea magistrale in Scienze Statistiche – Data Science, Università di Bologna.</p></article><article><span>2025 — 2026</span><h3>ENSAI</h3><p>Master in Smart Data Science, specializzazione AI and Data Science.</p></article><article><span>2026</span><h3>CREST</h3><p>Ricerca su dati funzionali sparsi con Valentin Patilea a Bruz, Francia.</p></article></div>
      <Link href="/about" className="text-link">IL MIO PERCORSO COMPLETO →</Link>
    </section>

    <section className="section personal">
      <div><p className="eyebrow">OLTRE I DATI</p><h2>Un posto anche<br/>per il resto.</h2></div>
      <div><p className="large-copy">Questo sito non vuole essere soltanto un curriculum online. Voglio usarlo per raccogliere ciò che costruisco, quello che leggo, esperienze, fotografie e pensieri che vale la pena conservare.</p><Link href="/scritti" className="text-link">VAI AGLI SCRITTI →</Link></div>
    </section>

    <section className="contact">
      <p className="eyebrow">CONTATTI</p><h2>Parliamone.</h2><p>Per opportunità, progetti o semplicemente per scambiare due idee.</p><a href="mailto:andrea.bianco00.ab@gmail.com">andrea.bianco00.ab@gmail.com ↗</a>
    </section>

    <footer><p>ANDREA BIANCO · 2026</p><div><a href="https://github.com/andrea-bianco00">GITHUB</a><a href="https://www.linkedin.com/in/andreabianco00">LINKEDIN</a><a href="mailto:andrea.bianco00.ab@gmail.com">EMAIL</a></div></footer>
  </main>;
}
