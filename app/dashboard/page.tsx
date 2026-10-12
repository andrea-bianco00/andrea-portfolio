import type { Metadata } from "next";
import { requireSession, supabase } from "./lib";
import { signOut } from "./actions";
import TrackerView from "./TrackerView";
export const metadata: Metadata = { title: "Le mie candidature | Area privata", robots: {index:false,follow:false} };
export const dynamic = "force-dynamic";
export type Application = {id:string;company:string;role_title:string;status:string;location:string|null;applied_on:string|null;created_at:string};
export default async function Dashboard() {
 const {token} = await requireSession();
 const response = await supabase("/rest/v1/job_applications?select=id,company,role_title,status,location,applied_on,created_at&order=created_at.desc&limit=500",{},token);
 if (!response.ok) return <main className="tracker-shell"><h1>Impossibile caricare le candidature</h1><form action={signOut}><button>Esci</button></form></main>;
 const applications = await response.json() as Application[];
 const taskResponse=await supabase("/rest/v1/application_tasks?select=id,title,due_on,completed,application_id&completed=eq.false&order=due_on.asc.nullslast&limit=200",{},token);
 const tasks=taskResponse.ok?await taskResponse.json() as {id:string;title:string;due_on:string|null;completed:boolean;application_id:string}[]:[];
 return <main className="tracker-shell"><header className="tracker-header"><a href="/" className="brand">ANDREA BIANCO / PRIVATE</a><form action={signOut}><button className="tracker-exit">ESCI ↗</button></form></header><div className="tracker-content"><p className="eyebrow">IL MIO SPAZIO DI LAVORO</p><h1>Le mie <em>candidature.</em></h1><p className="tracker-muted">Opportunità, colloqui e prossimi passi in un unico posto.</p><TrackerView applications={applications} tasks={tasks}/></div></main>;
}