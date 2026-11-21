import type {Metadata} from "next";
import Link from "next/link";
import SiteNav from "../components/SiteNav";
import {T} from "../components/LocaleProvider";

export const metadata:Metadata={title:"Certificazioni | Andrea Bianco",description:"Certificazioni ottenute e pubblicate da Andrea Bianco."};
export const dynamic="force-dynamic";
type Certificate={id:string;title:string;issuer:string;issued_on:string|null;credential_url:string|null;description:string|null};
export default async function CertificatesPage(){
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
 const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
 let records:Certificate[]=[];let failed=false;
 if(!url||!key){failed=true;}else{
  try{
   const r=await fetch(url+"/rest/v1/certifications?select=id,title,issuer,issued_on,credential_url,description&is_published=eq.true&order=issued_on.desc.nullslast,created_at.desc",{cache:"no-store",headers:{apikey:key,Authorization:"Bearer "+key}});
   if(r.ok)records=await r.json();else failed=true;
  }catch{failed=true;}
 }
 return <main className="cozy-page"><SiteNav/><div className="cozy-shell">
 <header className="cozy-interior-hero"><p className="cozy-kicker"><T it="Un percorso che continua" en="An ongoing journey"/></p>
 <h1><T it="Certificazioni" en="Certificates"/> <em><T it="e competenze." en="and skills."/></em></h1>
 <p className="cozy-lead"><T it="Uno spazio per raccogliere le certificazioni che ho conseguito lungo il mio percorso, dall'università alle esperienze di formazione successive." en="A place to collect the certifications I have earned along my journey, from university to further learning experiences."/></p>
 <p className="cozy-copy"><T it="Aggiungo qui i traguardi man mano che li documento e scelgo di condividerli." en="I add milestones here as I document them and choose to share them."/></p></header>
 <section className="cozy-section cozy-chapter"><div className="cozy-chapter-index"><span>01</span><T it="Le certificazioni" en="Certificates"/></div><div className="cozy-chapter-body">
 {failed?<p className="cozy-copy"><T it="Le certificazioni non sono disponibili al momento. Riprova più tardi." en="Certificates are temporarily unavailable. Please try again later."/></p>
 :records.length===0?<div className="cozy-field-note"><span className="cozy-note-no"><T it="Archivio in costruzione" en="Archive in progress"/></span><h3><T it="Una pagina da riempire, con calma." en="A page to fill, one step at a time."/></h3><p><T it="Le prime certificazioni compariranno qui quando saranno pubblicate." en="The first certificates will appear here once published."/></p></div>
 :<div className="cozy-cert-public-list">{records.map((item,index)=><article className="cozy-cert-public-item" key={item.id}><div className="cozy-cert-public-number">{String(index+1).padStart(2,"0")}</div><div><p className="cozy-kicker">{item.issuer}{item.issued_on?" · "+item.issued_on.slice(0,4):""}</p><h2>{item.title}</h2>{item.description&&<p className="cozy-copy">{item.description}</p>}{item.credential_url&&<a href={item.credential_url} className="cozy-link" target="_blank" rel="noopener noreferrer"><T it="Verifica la certificazione ↗" en="Verify credential ↗"/></a>}</div></article>)}</div>}
 </div></section>
 <footer className="cozy-footer"><span>Andrea Bianco · <T it="Certificazioni" en="Certificates"/></span><div><Link href="/cv">CV</Link><Link href="/progetti"><T it="Progetti" en="Projects"/></Link></div><Link href="/dashboard" className="cozy-private-entry"><T it="Area personale ↗" en="Personal area ↗"/></Link></footer>
 </div></main>
}
