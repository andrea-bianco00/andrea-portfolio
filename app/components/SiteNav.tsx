"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "./LocaleProvider";
export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const [pages, setPages] = useState({projects:false,certifications:false});
  useEffect(() => { let live=true; fetch("/api/site-visibility",{cache:"no-store"}).then(r=>r.ok?r.json():null).then(data=>{if(live&&data)setPages({projects:data.projects===true,certifications:data.certifications===true})}).catch(()=>{}); return()=>{live=false}; },[]);
  useEffect(() => {
    if (!open) return;
    const onEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [open]);
  const { language, setLanguage } = useLanguage();
  const links = [
    { href: "/about", it: "Chi sono", en: "About" },
    { href: "/ricerca", it: "Ricerca", en: "Research" },
    { href: "/progetti", it: "Progetti", en: "Projects" },
    { href: "/cv", it: "CV", en: "CV" },
    { href: "/certificazioni", it: "Certificazioni", en: "Certificates" }
  ];
  return <nav className="site-nav" aria-label={language === "en" ? "Main navigation" : "Navigazione principale"}>
    <Link href="/" className="brand" onClick={() => setOpen(false)}>Andrea Bianco</Link>
    <button className="nav-toggle" type="button" aria-label={open ? (language === "en" ? "Close menu" : "Chiudi menu") : (language === "en" ? "Open menu" : "Apri menu")} aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen(!open)}>{open ? (language === "en" ? "CLOSE ×" : "CHIUDI ×") : "MENU ☰"}</button>
    <div className={open ? "nav-links nav-open" : "nav-links"} id="primary-navigation">
      {links.filter(link=>(link.href!=="/progetti"||pages.projects)&&(link.href!=="/certificazioni"||pages.certifications)).map(link => <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>{link[language]}</Link>)}
      <div className="locale-switch" role="group" aria-label={language === "en" ? "Website language" : "Lingua del sito"}>
        <button type="button" onClick={() => setLanguage("it")} aria-pressed={language === "it"} lang="it" className={language === "it" ? "locale-active" : ""}>IT</button>
        <span aria-hidden="true">/</span>
        <button type="button" onClick={() => setLanguage("en")} aria-pressed={language === "en"} lang="en" className={language === "en" ? "locale-active" : ""}>EN</button>
      </div>
    </div>
  </nav>;
}