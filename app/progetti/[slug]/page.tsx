import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { T } from "../../components/LocaleProvider";
import { englishProjects } from "../../project-i18n";
import CaseStudyLanguage from "./CaseStudyLanguage";
import NerCaseStudy from "./NerCaseStudy";
import OptimizationCaseStudy from "./OptimizationCaseStudy";
import MatrixCompletionCaseStudy from "./MatrixCompletionCaseStudy";
import HighDimensionalCaseStudy from "./HighDimensionalCaseStudy";
import { getProject, projects } from "../../project-data";
import { getSiteVisibility } from "../../site-visibility";

export const dynamic="force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  const states=await getSiteVisibility();
  if (!project || states["page:progetti"]!==true || states["project:"+slug]!==true) return { title: "Pagina non disponibile | Andrea Bianco", robots: {index:false,follow:false} };
  return { title: `${project.title} | Andrea Bianco`, description: project.summary };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  const states=await getSiteVisibility();
  if (!project || states["page:progetti"]!==true || states["project:"+slug]!==true) notFound();
  return <main className="cozy-page cozy-detail-page">
    
    <article className="section case-study cozy-case">
      <Link href="/progetti" className="text-link"><T it="← Tutti i progetti" en="← All projects"/></Link>
      <header className="case-header">
        <p className="eyebrow">{project.category.toUpperCase()} · {project.year}</p>
        <h1><T it={project.title} en={englishProjects[slug]?.title ?? project.title}/></h1>
        <p className="large-copy"><T it={project.summary} en={englishProjects[slug]?.summary ?? project.summary}/></p>
        <div className="tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        {project.github && <a className="button primary case-github" href={project.github} target="_blank" rel="noopener noreferrer"><T it="Codice su GitHub ↗" en="Code on GitHub ↗"/></a>}
      </header>
      <CaseStudyLanguage slug={slug}>
      {slug === "named-entity-recognition" && <NerCaseStudy />}
      {slug === "statistical-learning-optimization" && <OptimizationCaseStudy />}
      {slug === "matrix-completion-movielens" && <MatrixCompletionCaseStudy />}
      {slug === "high-dimensional-time-series" && <HighDimensionalCaseStudy />}
      </CaseStudyLanguage>
      <div className="case-end"><Link href="/progetti" className="text-link"><T it="← Torna ai progetti" en="← Back to projects"/></Link>{project.github && <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-link"><T it="Repository GitHub ↗" en="GitHub repository ↗"/></a>}</div><footer className="cozy-case-private-footer"><Link href="/dashboard" className="cozy-private-entry"><T it="Area personale ↗" en="Personal area ↗"/></Link></footer>
    </article>
  </main>;
}
