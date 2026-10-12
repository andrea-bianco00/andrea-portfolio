import type { Metadata } from "next";
import SiteNav from "../components/SiteNav";
import ProjectDirectory from "./ProjectDirectory";

export const metadata: Metadata = {
  title: "Progetti | Andrea Bianco",
  description: "Portfolio di Data Science, statistica, Machine Learning e NLP: metodi, risultati e codice dei progetti di Andrea Bianco.",
};

export default function ProjectsPage() {
  return <main>
    <SiteNav />
    <section className="section portfolio-page">
      <p className="eyebrow">PORTFOLIO / PROGETTI</p>
      <h1 className="portfolio-title">Dati, modelli,<br/><em>soluzioni.</em></h1>
      <p className="large-copy portfolio-intro">Una raccolta di progetti di Data Science, statistica e intelligenza artificiale. Ogni lavoro racconta il problema affrontato, le scelte metodologiche e i risultati ottenuti.</p>
      <ProjectDirectory />
    </section>
  </main>;
}
