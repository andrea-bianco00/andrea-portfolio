import Link from "next/link";
import SiteNav from "./components/SiteNav";
import DataConstellation from "./components/DataConstellation";
import ButterflyFlightLab from "./components/ButterflyFlightLab";
import { projects } from "./project-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Andrea Bianco | Data Scientist · Statistica e Machine Learning",
  description: "Portfolio di Andrea Bianco: Data Scientist con formazione in statistica. Scopri progetti di NLP, Machine Learning, ricerca e analisi dei dati.",
};

const featured = projects.filter((project) => project.featured).map((project, index) => ({ n: String(index + 1).padStart(2, "0"), category: `${project.category} · ${project.year}`, title: project.title, text: project.summary, href: `/progetti/${project.slug}`, tags: project.tags }));

const approach = [
  ["01","Capire","Partire dal problema e dai dati prima di scegliere il modello."],
  ["02","Modellare","Usare statistica e Machine Learning scegliendo metodi coerenti con il contesto."],
  ["03","Verificare","Confrontare alternative, misurare le prestazioni e cercare i limiti delle soluzioni."],
  ["04","Comunicare","Trasformare risultati tecnici in conclusioni leggibili e utili."],
];

export default function Home() {
  return <main className="home-with-network">
    <DataConstellation />
    <SiteNav />

    <section className="hero home-hero">
      <div className="home-hero-content">
        <p className="eyebrow hero-eyebrow"><span className="hero-status-dot" aria-hidden="true"/> DATA SCIENTIST · STATISTICA · MACHINE LEARNING</p>
        <h1>CAPIRE I DATI.<br/><em>CAPIRE IL PROBLEMA.</em></h1>
        <p className="hero-copy">Sono Andrea Bianco, Data Scientist con una solida formazione statistica ed esperienza di ricerca presso CREST–ENSAI. Sviluppo e valuto modelli di Machine Learning per trasformare problemi complessi in analisi rigorose e risultati utili.</p>
        <div className="home-skill-tags" aria-label="Competenze principali"><span>Python</span><span>R</span><span>SQL</span><span>Machine Learning</span><span>Statistical Modeling</span></div>
        <div className="actions"><Link href="/progetti" className="button primary">→　Scopri i miei progetti</Link><Link href="/cv" className="button secondary">▤　Scarica CV</Link></div>


      </div>
      <ButterflyFlightLab />
    </section>

    <div className="home-reference-stats" aria-label="Profilo in breve"><div><span>♧</span><strong>M.Sc. Data Science</strong><small>Università di Bologna</small></div><div><span>▥</span><strong>Research Internship</strong><small>CREST – ENSAI (FR)</small></div><div><span>⌘</span><strong>Progetti Data Science</strong><small>Machine Learning · NLP · Statistica</small></div><div><span>◎</span><strong>C1</strong><small>Inglese professionale</small></div></div>

    <section className="section work" id="progetti-in-evidenza">
      <div className="section-head"><div><p className="eyebrow">PROGETTI IN EVIDENZA</p><h2>Il lavoro, <em>non solo le parole.</em></h2><p className="home-section-lead">Esperimenti, codice e risultati: progetti raccontati con metodo e attenzione ai limiti.</p></div><Link href="/progetti">Vedi tutti i progetti →</Link></div>
      <div className="project-list">{featured.map(p=><Link href={p.href} className="project-row" key={p.title}><span className="project-number">{p.n}</span><div><p className="project-meta">{p.category}</p><h3>{p.title}</h3><p className="project-description">{p.text}</p><div className="tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div></div><span className="arrow">↗</span></Link>)}</div>
    </section>

    <section className="section">
      <div className="section-title"><p className="eyebrow">APPROCCIO</p><h2>Il metodo prima dello strumento.</h2><p>Non parto da un algoritmo. Parto dalla domanda, cerco di capire cosa raccontano i dati e scelgo gli strumenti di conseguenza.</p></div>
      <div className="approach-grid">{approach.map(a=><article key={a[0]}><span>{a[0]}</span><h3>{a[1]}</h3><p>{a[2]}</p></article>)}</div>
    </section>

    <section className="section research-feature" id="ricerca">
      <div><p className="eyebrow">RICERCA · CREST–ENSAI</p><h2>Quando il dato è poco,<br/><em>il metodo conta ancora di più.</em></h2></div>
      <div><p className="large-copy">Durante il tirocinio di ricerca presso CREST–ENSAI ho lavorato sulla stima della struttura di covarianza per dati funzionali sparsi. Ho studiato la letteratura, implementato metodi in R, progettato simulazioni e confrontato approcci alternativi su dati sintetici e reali.</p><Link href="/ricerca" className="text-link">ESPLORA LA RICERCA →</Link></div>
    </section>

    <section className="section journey">
      <p className="eyebrow">PERCORSO</p><h2>Dalla statistica alla Data Science.</h2>
      <div className="timeline"><article><span>2021 — 2024</span><h3>Statistica</h3><p>Laurea triennale in Scienze Statistiche, Università di Bologna.</p></article><article><span>2024 — 2026</span><h3>Data Science</h3><p>Laurea magistrale in Scienze Statistiche – Data Science, Università di Bologna.</p></article><article><span>2025 — 2026</span><h3>ENSAI</h3><p>Master in Smart Data Science, specializzazione AI and Data Science.</p></article><article><span>2026</span><h3>CREST</h3><p>Ricerca su dati funzionali sparsi con Valentin Patilea a Bruz, Francia.</p></article></div>
      <Link href="/about" className="text-link">IL MIO PERCORSO COMPLETO →</Link>
    </section>



    <section className="contact" id="contatti">
      <p className="eyebrow">CONTATTI / COLLABORAZIONI</p><h2>Costruiamo qualcosa<br/>di interessante.</h2><p>Hai un progetto, una posizione in Data Science o un problema da risolvere con i dati? Scrivimi.</p><a href="mailto:andrea.bianco00.ab@gmail.com?subject=Opportunit%C3%A0%20Data%20Science">SCRIVIMI UNA EMAIL ↗</a>
    </section>

    <footer><p>ANDREA BIANCO · 2026</p><div><a href="https://github.com/andrea-bianco00">GITHUB</a><a href="https://www.linkedin.com/in/andreabianco00">LINKEDIN</a><a href="mailto:andrea.bianco00.ab@gmail.com">EMAIL</a><Link href="/dashboard" aria-label="Accedi all’area riservata">AREA RISERVATA ↗</Link></div></footer>
  </main>;
}
