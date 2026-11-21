import type {Metadata} from "next";
import Link from "next/link";
import {requireSession,supabase} from "../lib";
import {projects} from "../../project-data";
import {updateSiteVisibility} from "./actions";
import {setCertificationVisibility} from "../certificazioni/actions";

export const metadata:Metadata={title:"Gestione sito | Andrea Bianco",robots:{index:false,follow:false}};
export const dynamic="force-dynamic";
type State={key:string;is_visible:boolean};
type Certificate={id:string;title:string;issuer:string;is_published:boolean};
function SwitchForm({itemKey,visible}:{itemKey:string;visible:boolean}){
 return <form action={updateSiteVisibility}><input type="hidden" name="key" value={itemKey}/><input type="hidden" name="visible" value={String(!visible)}/><button type="submit" className={visible?"tracker-outline":"tracker-button"}>{visible?"Nascondi":"Rendi visibile"}</button></form>;
}
export default async function ManageSite(){
 const {token}=await requireSession();
 const [stateResult,certResult]=await Promise.all([
  supabase("/rest/v1/site_visibility?select=key,is_visible",{},token),
  supabase("/rest/v1/certifications?select=id,title,issuer,is_published&order=created_at.desc",{},token)
 ]);
 const failed=!stateResult.ok||!certResult.ok;
 const states:State[]=stateResult.ok?await stateResult.json():[];
 const certificates:Certificate[]=certResult.ok?await certResult.json():[];
 const visibility=new Map(states.map(item=>[item.key,item.is_visible]));
 const projectsPage=visibility.get("page:progetti")===true;
 const certPage=visibility.get("page:certificazioni")===true;
 return <main className="tracker-shell tracker-cozy"><header className="tracker-header"><Link href="/" className="tracker-wordmark">Andrea Bianco<span aria-hidden="true"> ✳</span></Link><Link href="/dashboard" className="tracker-home-link">← Area personale</Link></header>
 <div className="tracker-content cozy-site-manager"><p className="tracker-overline">Area personale / Controllo pubblicazione</p>
 <h1>Gestione <em>del sito.</em></h1>
 <p className="tracker-muted">Decidi ciò che i visitatori possono vedere. Nascondere un contenuto non lo cancella: potrai ripubblicarlo quando vuoi, senza modificare il codice.</p>
 {failed?<p role="alert" className="tracker-error">Impossibile leggere le impostazioni dal database. Riprova più tardi: nessuna modifica è stata effettuata.</p>:<>
 <section className="tracker-panel cozy-manager-section"><div className="tracker-panel-head"><div><p className="eyebrow">01 / PAGINE</p><h2>Sezioni del sito</h2></div></div>
 <div className="cozy-manager-row"><div><h3>Progetti</h3><p>{projectsPage?"Pagina visibile al pubblico":"Pagina nascosta al pubblico"}</p><Link href="/progetti">Apri pagina ↗</Link></div><SwitchForm itemKey="page:progetti" visible={projectsPage}/></div>
 <div className="cozy-manager-row"><div><h3>Certificazioni</h3><p>{certPage?"Pagina visibile al pubblico":"Pagina nascosta al pubblico"}</p><Link href="/certificazioni">Apri pagina ↗</Link></div><SwitchForm itemKey="page:certificazioni" visible={certPage}/></div>
 </section>
 <section className="tracker-panel cozy-manager-section"><div className="tracker-panel-head"><div><p className="eyebrow">02 / PROGETTI</p><h2>Quali lavori mostrare?</h2><p className="tracker-muted">Ogni progetto può essere nascosto singolarmente. Anche i collegamenti nella Home e l'indirizzo diretto saranno disattivati.</p></div></div>
 {projects.map(project=>{const active=visibility.get("project:"+project.slug)===true;return <div className="cozy-manager-row" key={project.slug}><div><span className="cozy-manager-state">{active?"Pubblicato":"Nascosto"} · {project.year}</span><h3>{project.title}</h3><p>{!projectsPage?"La pagina Progetti è nascosta: questo lavoro non è visibile anche se risulta pubblicato.":active?"Visibile sul sito":"Non visibile ai visitatori"}</p></div><SwitchForm itemKey={"project:"+project.slug} visible={active}/></div>})}
 </section>
 <section className="tracker-panel cozy-manager-section"><div className="tracker-panel-head"><div><p className="eyebrow">03 / CERTIFICAZIONI</p><h2>Cosa pubblicare?</h2><p className="tracker-muted">Le nuove certificazioni partono come bozze private. Puoi modificarne i dati nella pagina dedicata.</p><Link href="/dashboard/certificazioni" className="tracker-home-link">Aggiungi o modifica una certificazione ↗</Link></div></div>
 {certificates.length===0?<p className="cozy-manager-empty">Non hai ancora inserito certificazioni.</p>:certificates.map(item=><div className="cozy-manager-row" key={item.id}><div><span className="cozy-manager-state">{item.is_published?"Pubblicata":"Bozza privata"}</span><h3>{item.title}</h3><p>{item.issuer}{!certPage?" · La pagina Certificazioni è nascosta":""}</p></div><form action={setCertificationVisibility}><input type="hidden" name="id" value={item.id}/><input type="hidden" name="published" value={String(!item.is_published)}/><button className={item.is_published?"tracker-outline":"tracker-button"} type="submit">{item.is_published?"Nascondi":"Pubblica"}</button></form></div>)}
 </section>
 </>}
 </div></main>;
}
