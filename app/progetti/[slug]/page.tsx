import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteNav from "../../components/SiteNav";
import NerCaseStudy from "./NerCaseStudy";
import OptimizationCaseStudy from "./OptimizationCaseStudy";
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
      {slug === "named-entity-recognition" && <NerCaseStudy />}
      {slug === "statistical-learning-optimization" && <OptimizationCaseStudy />}
      <div className="case-end"><Link href="/progetti" className="text-link">← TORNA AI PROGETTI</Link>{project.github && <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-link">REPOSITORY GITHUB ↗</a>}</div>
    </article>
  </main>;
}
