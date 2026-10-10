import Link from "next/link";

const featured = [
  { category: "Ricerca · 2026", title: "Mean and Covariance Estimation for Sparse Functional Data", text: "Stima semiparametrica della struttura di covarianza per dati funzionali sparsi, sviluppata durante il tirocinio di ricerca presso CREST–ENSAI.", href: "/ricerca/sparse-functional-data" },
  { category: "Data Science · 2025", title: "Spatial Interpolation with INSEE", text: "Confronto tra tecniche di Machine Learning e metodi geostatistici per l'interpolazione spaziale su dataset di grandi dimensioni.", href: "/progetti/spatial-interpolation" },
  { category: "Machine Learning · 2024", title: "Customer Churn Prediction", text: "Modello predittivo che combina dati strutturati, sentiment analysis ed ensemble learning per individuare clienti a rischio di abbandono.", href: "/progetti/customer-churn" },
];

export default function Home() {
  return (
    <main>
      <nav className="site-nav">
        <Link href="/" className="brand">ANDREA BIANCO</Link>
        <div className="nav-links">
          <Link href="/progetti">PROGETTI</Link>
          <Link href="/ricerca">RICERCA</Link>
          <Link href="/scritti">SCRITTI</Link>
          <Link href="/about">ABOUT</Link>
          <Link href="/cv">CV</Link>
          <span className="language">IT <span>EN</span></span>
        </div>
      </nav>

      <section className="hero">
        <div>
          <p className="eyebrow">DATA SCIENCE · STATISTICS · AI</p>
          <h1>DATI, METODI,<br />DOMANDE<br />DIFFICILI.</h1>
          <p className="hero-copy">Sono Andrea Bianco, data scientist e statistico. Mi interessa capire a fondo i problemi, sperimentare approcci diversi e usare i dati per costruire soluzioni concrete.</p>
          <div className="actions">
            <Link href="/progetti" className="button primary">ESPLORA I PROGETTI</Link>
            <Link href="/about" className="button secondary">CHI SONO</Link>
          </div>
        </div>
        <div className="hero-card" aria-hidden="true">
          <div className="data-viz">
            <span className="dot d1" /><span className="dot d2" /><span className="dot d3" /><span className="dot d4" /><span className="dot d5" />
            <svg viewBox="0 0 500 500" role="presentation"><path d="M20 390 C100 370, 110 270, 185 300 S270 120, 340 190 S410 80, 480 105" /></svg>
            <p>OBSERVE · MODEL · TEST · UNDERSTAND</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head"><p className="eyebrow">SELEZIONE</p><h2>Lavori in evidenza.</h2><Link href="/progetti">TUTTI I PROGETTI →</Link></div>
        <div className="project-grid">
          {featured.map((project) => <Link href={project.href} className="project-card" key={project.title}><p className="project-meta">{project.category}</p><h3>{project.title}</h3><p>{project.text}</p><span>APRI IL PROGETTO ↗</span></Link>)}
        </div>
      </section>

      <section className="section split">
        <div><p className="eyebrow">RICERCA</p><h2>La statistica come modo di capire.</h2></div>
        <div><p className="large-copy">La mia formazione parte dalla statistica e si estende a Data Science, Machine Learning e AI. Nella ricerca mi interessa soprattutto capire perché un metodo funziona, dove fallisce e come può essere migliorato.</p><Link href="/ricerca" className="text-link">ESPLORA LA RICERCA →</Link></div>
      </section>

      <section className="section split personal">
        <div><p className="eyebrow">OLTRE IL LAVORO</p><h2>Questo sito è anche casa mia.</h2></div>
        <div><p className="large-copy">Non voglio che questo spazio sia soltanto un curriculum online. Qui raccolgo anche ciò che costruisco, quello che leggo, esperienze, fotografie e pensieri che vale la pena conservare.</p><Link href="/scritti" className="text-link">LEGGI GLI SCRITTI →</Link></div>
      </section>

      <footer><p>ANDREA BIANCO · 2026</p><div><a href="https://github.com/andrea-bianco00">GITHUB</a><a href="https://www.linkedin.com/in/andreabianco00">LINKEDIN</a></div></footer>
    </main>
  );
}
