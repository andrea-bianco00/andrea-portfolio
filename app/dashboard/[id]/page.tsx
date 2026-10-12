import type {Metadata} from "next";
import Link from "next/link";
import {notFound} from "next/navigation";
import {requireSession,supabase} from "../lib";
import {saveApplicationDetails,addApplicationActivity} from "../actions";
export const metadata:Metadata={title:"Scheda candidatura | Andrea Bianco",robots:{index:false,follow:false}};
export const dynamic="force-dynamic";
type RecordData={id:string;company:string;role_title:string;status:string;location:string|null;applied_on:string|null;job_url:string|null;source:string|null;work_mode:string|null;cv_language:string|null;salary_min:number|null;salary_max:number|null;next_action_on:string|null;notes:string|null};
type Activity={id:string;kind:string;title:string;details:string|null;occurred_at:string};
const kinds:Record<string,string>={note:"Nota",email:"Email",call:"Telefonata",interview:"Colloquio",assessment:"Test tecnico",follow_up:"Follow-up",status_change:"Cambio stato",other:"Altro"};
export default async function ApplicationDetail({params}:{params:Promise<{id:string}>}){
 const {id}=await params;
 if(!/^[0-9a-f-]{36}$/i.test(id))notFound();
 const {token}=await requireSession();
 const r=await supabase("/rest/v1/job_applications?id=eq."+encodeURIComponent(id)+"&select=id,company,role_title,status,location,applied_on,job_url,source,work_mode,cv_language,salary_min,salary_max,next_action_on,notes&limit=1",{},token);
 if(!r.ok)throw new Error("Impossibile caricare la candidatura");
 const records=await r.json() as RecordData[];
 if(!records.length)notFound();
 const a=records[0];
 const eventsResponse=await supabase("/rest/v1/application_activities?application_id=eq."+encodeURIComponent(id)+"&select=id,kind,title,details,occurred_at&order=occurred_at.desc&limit=200",{},token);
 const activities=eventsResponse.ok?await eventsResponse.json() as Activity[]:[];
 return <main className="tracker-shell"><header className="tracker-header"><Link href="/dashboard" className="brand">← TUTTE LE CANDIDATURE</Link><a href="/" className="tracker-exit">ANDREA BIANCO / PRIVATE</a></header>
 <div className="tracker-content tracker-detail"><p className="eyebrow">SCHEDA CANDIDATURA / {a.status.toUpperCase()}</p><h1>{a.company}<em>.</em></h1><p className="tracker-muted">{a.role_title}{a.location?" · "+a.location:""}{a.applied_on?" · Candidatura: "+a.applied_on:""}</p>
 <div className="tracker-detail-grid"><section className="tracker-panel tracker-detail-panel"><div className="tracker-panel-head"><div><p className="eyebrow">01 / INFORMAZIONI</p><h2>Dettagli dell’offerta</h2></div></div>
 <form action={saveApplicationDetails} className="tracker-detail-form"><input type="hidden" name="id" value={a.id}/>
 <label>Link dell’offerta<input type="url" name="job_url" maxLength={2048} placeholder="https://..." defaultValue={a.job_url||""}/></label>
 {a.job_url&&/^https?:\/\//i.test(a.job_url)&&<a href={a.job_url} target="_blank" rel="noopener noreferrer" className="tracker-job-link">APRI L’ANNUNCIO ↗</a>}
 <label>Fonte della candidatura<input name="source" maxLength={120} defaultValue={a.source||""} placeholder="LinkedIn, sito aziendale, referral..."/></label>
 <label>Modalità di lavoro<select name="work_mode" defaultValue={a.work_mode||""}><option value="">Non specificata</option><option value="onsite">In sede</option><option value="hybrid">Ibrido</option><option value="remote">Da remoto</option></select></label>
 <label>CV utilizzato<select name="cv_language" defaultValue={a.cv_language||""}><option value="">Non specificato</option><option value="it">Italiano</option><option value="en">Inglese</option><option value="other">Altro</option></select></label>
 <div className="tracker-salary"><label>RAL minima (€)<input type="number" min="0" name="salary_min" defaultValue={a.salary_min??""} placeholder="26000"/></label><label>RAL massima (€)<input type="number" min="0" name="salary_max" defaultValue={a.salary_max??""} placeholder="30000"/></label></div>
 <label>Prossima attività / scadenza<input type="date" name="next_action_on" defaultValue={a.next_action_on||""}/></label>
 <label>Le mie note<textarea name="notes" maxLength={20000} rows={11} defaultValue={a.notes||""} placeholder="Informazioni sull’azienda, preparazione al colloquio, impressioni, domande da fare, dettagli dell’offerta..."/></label>
 <button className="tracker-button">SALVA LE INFORMAZIONI →</button></form></section>
 <section className="tracker-panel tracker-detail-panel"><div className="tracker-panel-head"><div><p className="eyebrow">02 / CRONOLOGIA</p><h2>Colloqui e attività</h2></div></div>
 <form action={addApplicationActivity} className="tracker-detail-form"><input type="hidden" name="application_id" value={a.id}/><label>Tipo di attività<select name="kind" defaultValue="note">{Object.entries(kinds).map(([key,value])=><option key={key} value={key}>{value}</option>)}</select></label><label>Titolo *<input name="title" maxLength={200} required placeholder="Es. Colloquio tecnico con il team"/></label><label>Descrizione<textarea name="details" maxLength={20000} rows={5} placeholder="Che cosa è successo? Che cosa ricordare?"/></label><button className="tracker-button">+ AGGIUNGI ATTIVITÀ</button></form>
 <div className="tracker-timeline">{activities.length?activities.map(item=><article className="tracker-timeline-entry" key={item.id}><span>{kinds[item.kind]||item.kind} · {new Date(item.occurred_at).toLocaleDateString("it-IT")}</span><h3>{item.title}</h3>{item.details&&<p>{item.details}</p>}</article>):<div className="tracker-empty"><span>◎</span><h3>Nessuna attività ancora</h3><p>Aggiungi una nota, un colloquio o un follow-up per costruire lo storico.</p></div>}</div>
 </section></div><p className="tracker-footnote">Informazioni personali · Visibili soltanto nell’area riservata</p></div></main>;
}
