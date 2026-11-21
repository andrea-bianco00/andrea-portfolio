import type { Metadata } from "next";
import Link from "next/link";
import { requireSession, supabase } from "./lib";
import { signOut } from "./actions";
import TrackerView from "./TrackerView";
import JobPlatforms from "./JobPlatforms";
import PhDDirectory from "./PhDDirectory";
export const metadata: Metadata = { title: "Le mie candidature | Area privata", robots: {index:false,follow:false} };
export const dynamic = "force-dynamic";
export type Application = {id:string;company:string;role_title:string;status:string;location:string|null;applied_on:string|null;created_at:string};
export default async function Dashboard() {
 const {token} = await requireSession();
 const response = await supabase("/rest/v1/job_applications?select=id,company,role_title,status,location,applied_on,created_at&order=created_at.desc&limit=500",{},token);
 if (!response.ok) return <main className="tracker-shell tracker-cozy"><div className="tracker-content"><p className="tracker-overline">Area personale / Connessione</p><h1>Connessione <em>non disponibile.</em></h1><p className="tracker-muted">Non riesco a caricare le candidature dal database. Verifica che il progetto Supabase sia attivo e riprova.</p><Link href="/" className="tracker-home-link">← Torna al sito</Link><form action={signOut}><button className="tracker-outline">Esci dall’account</button></form></div></main>;
 const applications = await response.json() as Application[];
 const taskResponse=await supabase("/rest/v1/application_tasks?select=id,title,due_on,completed,application_id&completed=eq.false&order=due_on.asc.nullslast&limit=200",{},token);
 const tasks=taskResponse.ok?await taskResponse.json() as {id:string;title:string;due_on:string|null;completed:boolean;application_id:string}[]:[];
 return <main className="tracker-shell tracker-cozy"><header className="tracker-header"><Link href="/" className="tracker-wordmark">Andrea Bianco<span aria-hidden="true"> ✳</span></Link><span className="tracker-header-note">Il mio archivio privato</span><form action={signOut}><button className="tracker-exit">Esci ↗</button></form></header><div className="tracker-content"><div className="tracker-dashboard-intro"><div><p className="tracker-overline">Il mio spazio di lavoro · 2026</p><h1>Le mie <em>candidature.</em></h1><p className="tracker-muted">Un posto per organizzare candidature, opportunità, colloqui e prossimi passi. Una cosa alla volta.</p></div><aside className="tracker-dashboard-aside"><span>Appunto 01 / Organizzazione</span><p>Tenere traccia di ciò che conta, senza perdere il filo.</p><Link href="/" className="tracker-home-link">← Torna al sito</Link></aside></div><nav className="tracker-quick-links" aria-label="Gestione contenuti"><Link href="/dashboard/gestione-sito" className="tracker-cert-shortcut"><span>✳ CONTROLLO SITO</span><strong>Gestione delle pagine</strong><small>Scegli quali progetti e certificazioni rendere visibili ↗</small></Link><Link href="/dashboard/certificazioni" className="tracker-cert-shortcut"><span>✳ ARCHIVIO PERSONALE</span><strong>Le mie certificazioni</strong><small>Aggiungi, modifica e pubblica le certificazioni sul sito ↗</small></Link></nav><TrackerView applications={applications} tasks={tasks}/><JobPlatforms/><PhDDirectory/></div></main>;
}