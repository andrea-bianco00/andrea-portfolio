import type {Metadata} from "next";
import {redirect} from "next/navigation";
import {configured,session} from "../lib";
import LoginForm from "./LoginForm";
export const metadata:Metadata={title:"Accesso privato | Andrea Bianco",robots:{index:false,follow:false}};
export default async function LoginPage(){
  if(await session()) redirect("/dashboard");
  return <main className="tracker-shell tracker-login">
    <div className="tracker-login-card">
      <a href="/" className="brand">ANDREA BIANCO</a>
      <p className="eyebrow">AREA PERSONALE / ACCESSO RISERVATO</p>
      <h1>Il mio <em>workspace.</em></h1>
      <p className="tracker-muted">Uno spazio privato per organizzare candidature, colloqui e prossimi passi.</p>
      {!configured?<p role="status" className="tracker-error">Il collegamento al database non è ancora configurato.</p>:<LoginForm/>}
      <a className="tracker-back" href="/">← Torna al portfolio</a>
    </div>
  </main>;
}
