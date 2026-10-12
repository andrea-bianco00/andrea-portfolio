import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteNav from "../../components/SiteNav";
import { getProject, projects } from "../../project-data";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Progetto non trovato | Andrea Bianco" };
  return { title: `${project.title} | Andrea Bianco`, description: project.summary };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  return <main>
    <SiteNav />
    <article className="section case-study">
      <Link href="/progetti" className="text-link">← TUTTI I PROGETTI</Link>
      <header className="case-header">
        <p className="eyebrow">{project.category.toUpperCase()} · {project.year}</p>
        <h1>{project.title}</h1>
        <p className="large-copy">{project.summary}</p>
        <div className="tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        {project.github && <a className="button primary case-github" href={project.github} target="_blank" rel="noopener noreferrer">ESPLORA IL CODICE SU GITHUB ↗</a>}
      </header>
      {slug === "named-entity-recognition" && <>
        <section className="case-section">
          <p className="eyebrow">01 / IL PROBLEMA</p>
          <h2>Riconoscere le entità nel linguaggio.</h2>
          <p>La Named Entity Recognition (NER) consiste nell'identificare e classificare entità come persone, organizzazioni e luoghi all'interno di un testo. Il progetto confronta un modello ricorrente BiLSTM e un modello Transformer, DistilBERT, sul dataset CoNLL-2003.</p>
        </section>
        <section className="case-section">
          <p className="eyebrow">02 / APPROCCIO</p>
          <h2>Due architetture, un confronto.</h2>
          <div className="case-columns">
            <div><h3>BiLSTM</h3><p>Baseline sequenziale bidirezionale per l'etichettatura dei token, addestrata per 10 epoche.</p></div>
            <div><h3>DistilBERT</h3><p>Transformer preaddestrato adattato al task di token classification, addestrato per 3 epoche.</p></div>
          </div>
          <p>Il repository include codice modulare, controlli sui dati, test automatici e documentazione per ripetere gli esperimenti con una copia autorizzata del dataset.</p>
        </section>
        <section className="case-section">
          <p className="eyebrow">03 / RISULTATI</p>
          <h2>Il Transformer ottiene l'F1 più alta.</h2>
          <div className="case-metrics"><div><strong>69,94%</strong><span>Entity F1 · BiLSTM</span></div><div><strong>85,78%</strong><span>Entity F1 · DistilBERT</span></div></div>
          <p>I valori si riferiscono all'esecuzione completa documentata su Google Colab. Il confronto è utile per osservare la differenza tra le due architetture nel protocollo adottato.</p>
        </section>
        <section className="case-section">
          <p className="eyebrow">04 / LIMITI E RIPRODUCIBILITÀ</p>
          <h2>Interpretare correttamente i numeri.</h2>
          <p>L'F1 è calcolata su etichette BIO espanse ai subword e non coincide con la valutazione CoNLL canonica a livello di parola. Il dataset originale è soggetto a restrizioni e non viene distribuito nel repository. I risultati dell'addestramento completo sono registrati, mentre il notebook finale non è stato verificato integralmente in un runtime Colab nuovo.</p>
          <p>Questi aspetti, insieme ai controlli sui dati, sono descritti nella documentazione metodologica del progetto.</p>
        </section>
      </>}
      <div className="case-end"><Link href="/progetti" className="text-link">← TORNA AI PROGETTI</Link>{project.github && <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-link">REPOSITORY GITHUB ↗</a>}</div>
    </article>
  </main>;
}
