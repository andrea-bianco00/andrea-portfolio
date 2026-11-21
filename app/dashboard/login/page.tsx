import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { configured, session } from "../lib";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Area personale | Accesso — Andrea Bianco",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  if (await session()) redirect("/dashboard");
  return <main className="tracker-shell tracker-login tracker-cozy">
    <div className="tracker-login-layout">
      <div className="tracker-login-intro">
        <Link href="/" className="tracker-wordmark">Andrea Bianco<span aria-hidden="true"> ✳</span></Link>
        <p className="tracker-overline">Uno spazio tutto mio · Accesso riservato</p>
        <h1>Le idee hanno bisogno di <em>un posto.</em></h1>
        <p>Un piccolo archivio personale per tenere insieme candidature, progetti, opportunità di ricerca e cose da non dimenticare.</p>
        <div className="tracker-login-sketch" aria-hidden="true">
          <svg viewBox="0 0 320 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 130C59 106 88 123 120 75C148 29 183 48 199 76C218 108 254 98 306 26" stroke="#79927a" strokeWidth="2" strokeLinecap="round" strokeDasharray="5 7"/>
            <circle cx="120" cy="75" r="8" fill="#B78468"/><circle cx="199" cy="76" r="6" fill="#79927a"/><circle cx="306" cy="26" r="5" fill="#B78468"/>
            <path d="M35 52h52m-26-26v52M233 135h48m-24-24v48" stroke="#C9B69A" strokeWidth="1"/>
            <rect x="17" y="106" width="66" height="36" rx="4" stroke="#B6A88F"/><path d="M25 119h34m-34 9h47" stroke="#B6A88F" strokeWidth="2"/>
          </svg>
        </div>
      </div>
      <section className="tracker-login-card" aria-labelledby="login-title">
        <p className="tracker-overline">01 / Area personale</p>
        <h2 id="login-title">Bentornato.</h2>
        <p className="tracker-muted">Accedi con l'email e la password del tuo account personale.</p>
        {!configured
          ? <p role="status" className="tracker-error">Il collegamento al database non è configurato.</p>
          : <LoginForm />}
        <p className="tracker-login-help">Non ricordi la password? Le password non sono visibili dal sito: puoi ripristinarla dal tuo progetto Supabase, nella sezione Authentication.</p>
        <Link className="tracker-back" href="/">← Torna al sito</Link>
      </section>
    </div>
    <footer className="tracker-login-footer"><span>Un angolo privato di andrea-bianco.com</span><span>Solo per uso personale · 2026</span></footer>
  </main>;
}
