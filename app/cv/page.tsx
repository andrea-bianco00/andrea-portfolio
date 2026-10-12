import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "../components/SiteNav";

export const metadata: Metadata = {
  title: "Curriculum e percorso | Andrea Bianco",
  description: "Il percorso di Andrea Bianco tra statistica, Data Science e ricerca: formazione, esperienza, competenze e progetti.",
};

const skills = [
  { title: "Linguaggi", items: ["Python", "R", "SQL"] },
  { title: "Ambiti", items: ["Statistica", "Machine Learning", "NLP", "Analisi dei dati"] },
  { title: "Metodi", items: ["Modellazione statistica", "Simulazioni", "Valutazione dei modelli", "Ricerca"] },
];

export default function CVPage() {
  return <main>
    <SiteNav />
    <article className="section cv-page">
      <header className="cv-hero">
        <p className="eyebrow">CURRICULUM / PROFILO PROFESSIONALE</p>
        <h1>Il mio <em>percorso.</em></h1>
        <p className="large-copy">Sono Andrea Bianco, Data Scientist con una formazione in statistica. Unisco ricerca, analisi quantitativa e Machine Learning per affrontare problemi complessi con metodo e attenzione ai risultati.</p>
        <div className="cv-actions">
          <a href="mailto:andrea.bianco00.ab@gmail.com?subject=Opportunit%C3%A0%20professionale" className="button primary">CONTATTAMI ↗</a>
          <Link href="/progetti" className="button secondary">VEDI I PROGETTI →</Link>
        </div>
      </header>

      <nav className="cv-index" aria-label="Sezioni del curriculum">
        <a href="#esperienza">Esperienza</a><a href="#formazione">Formazione</a><a href="#competenze">Competenze</a><a href="#documenti">PDF</a>
      </nav>

      <section className="cv-section" id="esperienza">
        <div><p className="eyebrow">01 / ESPERIENZA</p><h2>Ricerca e applicazione.</h2></div>
        <div className="cv-detail">
          <span className="cv-date">2026 · FRANCIA</span>
          <h3>CREST–ENSAI</h3>
          <p className="cv-subtitle">Tirocinio di ricerca · Dati funzionali sparsi</p>
          <p>Studio della letteratura scientifica, implementazione di metodi statistici in R, simulazioni e confronto tra approcci di stima su dati sintetici e reali.</p>
          <Link href="/ricerca" className="text-link">APPROFONDISCI LA RICERCA ↗</Link>
        </div>
      </section>

      <section className="cv-section" id="formazione">
        <div><p className="eyebrow">02 / FORMAZIONE</p><h2>Le basi del mio metodo.</h2></div>
        <div className="cv-detail cv-education">
          <div><span className="cv-date">2025 — 2026</span><h3>ENSAI</h3><p>Master in Smart Data Science · AI and Data Science</p></div>
          <div><span className="cv-date">2024 — 2026</span><h3>Università di Bologna</h3><p>Percorso magistrale in Data Science</p></div>
          <div><span className="cv-date">2021 — 2024</span><h3>Statistica</h3><p>Formazione universitaria in Scienze Statistiche</p></div>
        </div>
      </section>

      <section className="cv-section" id="competenze">
        <div><p className="eyebrow">03 / COMPETENZE</p><h2>Strumenti e metodo.</h2></div>
        <div className="cv-detail cv-skills">
          {skills.map(group=><div key={group.title}><h3>{group.title}</h3><div className="tags">{group.items.map(item=><span key={item}>{item}</span>)}</div></div>)}
          <p>Per vedere come utilizzo questi strumenti nella pratica, puoi esplorare i progetti documentati, con codice, risultati e limiti metodologici.</p>
          <Link href="/progetti" className="text-link">ESPLORA I PROGETTI ↗</Link>
        </div>
      </section>

      <section className="cv-documents" id="documenti">
        <div><p className="eyebrow">04 / DOCUMENTI</p><h2>Curriculum in PDF.</h2><p>I PDF in italiano e inglese saranno disponibili qui dopo la verifica delle versioni definitive. Nel frattempo puoi consultare il percorso in questa pagina e contattarmi direttamente.</p></div>
        <div className="cv-doc-list">
          <div><span>IT / CURRICULUM ITALIANO</span><strong>PDF in preparazione</strong></div>
          <div><span>EN / ENGLISH RESUME</span><strong>PDF in preparazione</strong></div>
        </div>
      </section>
      <div className="case-end"><Link href="/" className="text-link">← TORNA ALLA HOME</Link><a href="mailto:andrea.bianco00.ab@gmail.com" className="text-link">SCRIVIMI ↗</a></div>
    </article>
  </main>;
}
