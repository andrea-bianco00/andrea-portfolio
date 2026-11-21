"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { projectCategories, projects } from "../project-data";
import { englishProjects } from "../project-i18n";
import { useLanguage } from "../components/LocaleProvider";

export default function ProjectDirectory() {
  const { language } = useLanguage();
  const [category, setCategory] = useState("Tutti");
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => projects.filter((project) => {
    const matchesCategory = category === "Tutti" || project.category === category;
    const searchable = [project.title, project.category, project.summary, englishProjects[project.slug]?.title ?? "", englishProjects[project.slug]?.summary ?? "", ...project.tags].join(" ").toLocaleLowerCase("it");
    return matchesCategory && searchable.includes(query.trim().toLocaleLowerCase("it"));
  }), [category, query]);

  return <>
    <div className="portfolio-controls">
      <div className="portfolio-filters" role="group" aria-label={language === "en" ? "Filter by category" : "Filtra per categoria"}>
        {projectCategories.map((item) => <button key={item} type="button" className={category === item ? "filter-chip active" : "filter-chip"} aria-pressed={category === item} onClick={() => setCategory(item)}>{language === "en" && item === "Tutti" ? "All" : item}</button>)}
      </div>
      <label className="portfolio-search"><span className="sr-only">{language === "en" ? "Search projects" : "Cerca un progetto"}</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={language === "en" ? "Search projects or technologies…" : "Cerca progetti o tecnologie…"} /></label>
    </div>
    <p className="portfolio-count" aria-live="polite">{filtered.length} {language === "en" ? (filtered.length === 1 ? "project" : "projects") : (filtered.length === 1 ? "progetto" : "progetti")}</p>
    <div className="project-list">
      {filtered.map((project, index) => <Link href={`/progetti/${project.slug}`} className="project-row" key={project.slug}>
        <span className="project-number">{String(index + 1).padStart(2, "0")}</span>
        <div><p className="project-meta">{project.category} · {project.year}</p><h3>{language === "en" ? (englishProjects[project.slug]?.title ?? project.title) : project.title}</h3><p className="project-description">{language === "en" ? (englishProjects[project.slug]?.summary ?? project.summary) : project.summary}</p><div className="tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
        <span className="arrow" aria-hidden="true">↗</span>
      </Link>)}
    </div>
    {filtered.length === 0 && <p className="portfolio-empty">{language === "en" ? "No projects found. Try changing the filter or search." : "Nessun progetto trovato. Prova a cambiare filtro o ricerca."}</p>}
  </>;
}
