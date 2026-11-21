import type {Metadata} from "next";
import Link from "next/link";
import {requireSession,supabase} from "../lib";
import {addCertification,updateCertification,setCertificationVisibility,removeCertification} from "./actions";

export const metadata:Metadata={title:"Gestione certificazioni | Andrea Bianco",robots:{index:false,follow:false}};
export const dynamic="force-dynamic";
type Certificate={id:string;title:string;issuer:string;issued_on:string|null;credential_url:string|null;description:string|null;is_published:boolean};
export default async function CertificateAdmin(){
 const {token}=await requireSession();
 const r=await supabase("/rest/v1/certifications?select=id,title,issuer,issued_on,credential_url,description,is_published&order=issued_on.desc.nullslast,created_at.desc",{},token);
 const error=!r.ok;const records:Certificate[]=r.ok?await r.json():[];
 return <main className="tracker-shell tracker-cozy"><header className="tracker-header"><Link href="/" className="tracker-wordmark">Andrea Bianco<span aria-hidden="true"> ✳</span></Link><Link href="/dashboard" className="tracker-home-link">← Dashboard</Link></header>
 <div className="tracker-content cozy-cert-admin">
 <p className="tracker-overline">Archivio privato / Certificazioni</p>
 <h1>Le mie <em>certificazioni.</em></h1>
 <p className="tracker-muted">Aggiungi una certificazione alla volta. Ogni nuova voce nasce come bozza privata e diventa visibile sul sito soltanto quando premi “Pubblica”.</p>
 <Link href="/certificazioni" className="tracker-home-link">Visualizza la pagina pubblica ↗</Link>
 <section className="tracker-panel cozy-cert-new">
 <div className="tracker-panel-head"><div><p className="eyebrow">NUOVA VOCE</p><h2>Aggiungi una certificazione.</h2></div></div>
 <form action={addCertification} className="cozy-cert-form">
 <label>Nome della certificazione *<input name="title" maxLength={180} required placeholder="Es. SAS Certified Specialist"/></label>
 <label>Ente che la rilascia *<input name="issuer" maxLength={180} required placeholder="Es. SAS"/></label>
 <label>Data di conseguimento<input name="issued_on" type="date"/></label>
 <label>Link di verifica (facoltativo)<input name="credential_url" type="url" pattern="https://.*" maxLength={2048} placeholder="https://..."/></label>
 <label className="cozy-cert-wide">Descrizione (facoltativa)<textarea name="description" rows={3} maxLength={2000} placeholder="Cosa certifica, competenze o note..."/></label>
 <div className="cozy-cert-wide"><button className="tracker-button" type="submit">Salva come bozza +</button></div>
 </form></section>
 <section className="cozy-cert-records"><p className="tracker-overline">ARCHIVIO · {records.length} {records.length===1?"certificazione":"certificazioni"}</p>
 {error&&<p className="tracker-error">Non riesco a caricare le certificazioni dal database. Riprova tra poco.</p>}
 {!error&&records.length===0&&<div className="cozy-cert-empty"><h2>Il primo spazio è pronto.</h2><p>Non hai ancora inserito certificazioni. Compila il modulo sopra per iniziare.</p></div>}
 {records.map(item=><article className="cozy-cert-admin-item" key={item.id}>
 <div className="cozy-cert-admin-head"><div><span className="tracker-overline">{item.is_published?"Visibile sul sito":"Bozza privata"}</span><h2>{item.title}</h2><p>{item.issuer}{item.issued_on?" · "+item.issued_on:""}</p></div><form action={setCertificationVisibility}><input type="hidden" name="id" value={item.id}/><input type="hidden" name="published" value={String(!item.is_published)}/><button className={item.is_published?"tracker-outline":"tracker-button"} type="submit">{item.is_published?"Rendi privata":"Pubblica sul sito ↗"}</button></form></div>
 <details><summary>Modifica i dettagli</summary><form action={updateCertification} className="cozy-cert-form"><input type="hidden" name="id" value={item.id}/><label>Nome *<input name="title" required maxLength={180} defaultValue={item.title}/></label><label>Ente *<input name="issuer" required maxLength={180} defaultValue={item.issuer}/></label><label>Data<input type="date" name="issued_on" defaultValue={item.issued_on||""}/></label><label>Link di verifica<input type="url" name="credential_url" maxLength={2048} defaultValue={item.credential_url||""}/></label><label className="cozy-cert-wide">Descrizione<textarea name="description" rows={3} maxLength={2000} defaultValue={item.description||""}/></label><div className="cozy-cert-wide"><button className="tracker-button">Salva modifiche</button></div></form></details>
 <details className="cozy-cert-danger"><summary>Elimina certificazione</summary><p>L'eliminazione è definitiva. Vuoi procedere?</p><form action={removeCertification}><input type="hidden" name="id" value={item.id}/><button type="submit" className="tracker-outline">Conferma eliminazione</button></form></details>
 </article>)}
 </section></div></main>;
}
