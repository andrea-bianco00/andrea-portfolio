"use client";

import Link from "next/link";
import { useState } from "react";

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const links = [{ href: "/progetti", label: "PROGETTI" }, { href: "/ricerca", label: "RICERCA" }, { href: "/about", label: "CHI SONO" }, { href: "/cv", label: "CV" }];
  return <nav className="site-nav" aria-label="Navigazione principale">
    <Link href="/" className="brand" onClick={() => setOpen(false)}>ANDREA BIANCO</Link>
    <button className="nav-toggle" type="button" aria-label={open ? "Chiudi menu" : "Apri menu"} aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen(!open)}>{open ? "CHIUDI ×" : "MENU ☰"}</button>
    <div className={open ? "nav-links nav-open" : "nav-links"} id="primary-navigation">
      {links.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</Link>)}
      <span className="language" aria-label="Lingua del sito: italiano">IT</span>
    </div>
  </nav>;
}
