"use client";
import {useMemo,useState} from "react";
type Resource={name:string;url:string;category:string;description:string};
const resources:Resource[]=[
 {name:"MUR — Bandi dottorato",url:"https://bandi.mur.gov.it/",category:"Italia · Bandi ufficiali",description:"Portale ministeriale dei bandi pubblicati dagli atenei italiani"},
 {name:"Universitaly",url:"https://www.universitaly.it/",category:"Italia · Bandi ufficiali",description:"Informazioni ufficiali sul sistema universitario italiano"},
 {name:"Gazzetta Ufficiale — Concorsi",url:"https://www.gazzettaufficiale.it/30giorni/concorsi",category:"Italia · Bandi ufficiali",description:"Avvisi e concorsi pubblicati nella Gazzetta Ufficiale"},
 {name:"inPA",url:"https://www.inpa.gov.it/",category:"Italia · Bandi ufficiali",description:"Portale del reclutamento pubblico, anche per posizioni di ricerca"},
 {name:"EURAXESS — PhD e ricerca",url:"https://euraxess.ec.europa.eu/jobs/search",category:"Europa · Portali PhD",description:"Offerte di ricerca in Europa: filtra per paese e profilo"},
 {name:"FindAPhD",url:"https://www.findaphd.com/",category:"Europa · Portali PhD",description:"Progetti di dottorato e borse internazionali"},
 {name:"Academic Positions",url:"https://academicpositions.com/",category:"Europa · Portali PhD",description:"Posizioni accademiche, dottorati e ricerca"},
 {name:"AcademicTransfer",url:"https://www.academictransfer.com/",category:"Europa · Portali PhD",description:"PhD e lavori accademici nei Paesi Bassi"},
 {name:"jobs.ac.uk",url:"https://www.jobs.ac.uk/",category:"Europa · Portali PhD",description:"Dottorati e opportunità universitarie nel Regno Unito"},
 {name:"PhDportal",url:"https://www.phdportal.com/",category:"Europa · Portali PhD",description:"Catalogo internazionale di programmi di dottorato"},
 {name:"DAAD — Germany",url:"https://www.daad.de/en/studying-in-germany/phd-studies-research/",category:"Europa · Portali PhD",description:"Informazioni e opportunità per dottorati in Germania"},
 {name:"Research in Germany",url:"https://www.research-in-germany.org/",category:"Europa · Portali PhD",description:"Finanziamenti e ricerca in Germania"},
 {name:"Campus France",url:"https://www.campusfrance.org/en",category:"Europa · Portali PhD",description:"Informazioni su dottorati e finanziamenti in Francia"},
 {name:"ABG — Association Bernard Gregory",url:"https://www.abg.asso.fr/",category:"Europa · Portali PhD",description:"Dottorati e opportunità di ricerca in Francia"},
 {name:"Swissuniversities",url:"https://www.swissuniversities.ch/en/",category:"Europa · Portali PhD",description:"Università e percorsi dottorali in Svizzera"},
 {name:"Nature Careers",url:"https://www.nature.com/naturecareers",category:"Mondo · Ricerca",description:"Offerte accademiche e di ricerca a livello internazionale"},
 {name:"Science Careers",url:"https://jobs.sciencecareers.org/",category:"Mondo · Ricerca",description:"Posizioni di ricerca e opportunità accademiche"},
 {name:"HigherEdJobs",url:"https://www.higheredjobs.com/",category:"Mondo · Ricerca",description:"Lavori e opportunità nel mondo universitario"},
 {name:"University Positions",url:"https://www.universitypositions.eu/",category:"Mondo · Ricerca",description:"Posizioni universitarie e di ricerca in Europa"},
 {name:"PhD Studies — Politecnico di Milano",url:"https://www.dottorato.polimi.it/",category:"Italia · Atenei e scuole",description:"Dottorati, bandi e borse del Politecnico di Milano"},
 {name:"Politecnico di Torino",url:"https://www.polito.it/",category:"Italia · Atenei e scuole",description:"Sezione formazione e dottorati del Politecnico di Torino"},
 {name:"Università di Bologna",url:"https://www.unibo.it/",category:"Italia · Atenei e scuole",description:"Bandi e programmi di dottorato dell'ateneo"},
 {name:"Sapienza Università di Roma",url:"https://www.uniroma1.it/",category:"Italia · Atenei e scuole",description:"Concorsi e corsi di dottorato"},
 {name:"Università degli Studi di Milano",url:"https://www.unimi.it/",category:"Italia · Atenei e scuole",description:"Dottorati e opportunità di ricerca"},
 {name:"Università di Milano-Bicocca",url:"https://www.unimib.it/",category:"Italia · Atenei e scuole",description:"Programmi di dottorato e bandi"},
 {name:"Università di Padova",url:"https://www.unipd.it/",category:"Italia · Atenei e scuole",description:"Scuole di dottorato e selezioni"},
 {name:"Università di Trento",url:"https://www.unitn.it/",category:"Italia · Atenei e scuole",description:"Dottorati, anche in ambito informatico e dati"},
 {name:"Università di Torino",url:"https://www.unito.it/",category:"Italia · Atenei e scuole",description:"Dottorati e bandi dell'ateneo"},
 {name:"Università di Pavia",url:"https://web.unipv.it/",category:"Italia · Atenei e scuole",description:"Offerta dottorale e concorsi"},
 {name:"Università di Pisa",url:"https://www.unipi.it/",category:"Italia · Atenei e scuole",description:"Dottorati e bandi di selezione"},
 {name:"Università di Firenze",url:"https://www.unifi.it/",category:"Italia · Atenei e scuole",description:"Dottorati di ricerca e concorsi"},
 {name:"Università Federico II",url:"https://www.unina.it/",category:"Italia · Atenei e scuole",description:"Dottorati dell'Università di Napoli"},
 {name:"Università di Genova",url:"https://unige.it/",category:"Italia · Atenei e scuole",description:"Dottorati e ricerca"},
 {name:"Università di Roma Tor Vergata",url:"https://web.uniroma2.it/",category:"Italia · Atenei e scuole",description:"Programmi di dottorato e bandi"},
 {name:"Università Ca' Foscari Venezia",url:"https://www.unive.it/",category:"Italia · Atenei e scuole",description:"Corsi di dottorato e borse"},
 {name:"Università di Verona",url:"https://www.univr.it/",category:"Italia · Atenei e scuole",description:"Dottorati e concorsi"},
 {name:"Università di Parma",url:"https://www.unipr.it/",category:"Italia · Atenei e scuole",description:"Dottorati e borse di studio"},
 {name:"Università di Bergamo",url:"https://www.unibg.it/",category:"Italia · Atenei e scuole",description:"Bandi per dottorati"},
 {name:"Università di Brescia",url:"https://www.unibs.it/",category:"Italia · Atenei e scuole",description:"Programmi dottorali"},
 {name:"Università di Siena",url:"https://www.unisi.it/",category:"Italia · Atenei e scuole",description:"Corsi di dottorato"},
 {name:"Università di Cagliari",url:"https://www.unica.it/",category:"Italia · Atenei e scuole",description:"Bandi e dottorati"},
 {name:"Università di Palermo",url:"https://www.unipa.it/",category:"Italia · Atenei e scuole",description:"Dottorati di ricerca"},
 {name:"Università di Bari",url:"https://www.uniba.it/",category:"Italia · Atenei e scuole",description:"Bandi di dottorato"},
 {name:"Università della Calabria",url:"https://www.unical.it/",category:"Italia · Atenei e scuole",description:"Dottorati e selezioni"},
 {name:"Università di Trieste",url:"https://www.units.it/",category:"Italia · Atenei e scuole",description:"Dottorati di ricerca"},
 {name:"Università di Udine",url:"https://www.uniud.it/",category:"Italia · Atenei e scuole",description:"Dottorati e borse"},
 {name:"Scuola Normale Superiore",url:"https://www.sns.it/",category:"Italia · Scuole e ricerca",description:"Selezioni PhD e ricerca avanzata"},
 {name:"Scuola Superiore Sant'Anna",url:"https://www.santannapisa.it/",category:"Italia · Scuole e ricerca",description:"PhD e ricerca interdisciplinare"},
 {name:"SISSA",url:"https://www.sissa.it/",category:"Italia · Scuole e ricerca",description:"PhD in matematica, fisica, neuroscienze e altre discipline"},
 {name:"GSSI — Gran Sasso Science Institute",url:"https://www.gssi.it/",category:"Italia · Scuole e ricerca",description:"Dottorati internazionali, anche in computer science"},
 {name:"IMT Lucca",url:"https://www.imtlucca.it/",category:"Italia · Scuole e ricerca",description:"PhD interdisciplinari e quantitativi"},
 {name:"IUSS Pavia",url:"https://www.iusspavia.it/",category:"Italia · Scuole e ricerca",description:"Corsi di dottorato e ricerca"},
 {name:"Bocconi PhD",url:"https://www.unibocconi.it/",category:"Italia · Scuole e ricerca",description:"PhD in discipline quantitative, economia e statistica"},
 {name:"EUI — European University Institute",url:"https://www.eui.eu/",category:"Italia · Scuole e ricerca",description:"Dottorati internazionali in scienze sociali"},
 {name:"Human Technopole",url:"https://humantechnopole.it/",category:"Italia · Scuole e ricerca",description:"Ricerca e programmi di formazione scientifica"},
 {name:"CNR",url:"https://www.cnr.it/",category:"Italia · Scuole e ricerca",description:"Istituti di ricerca e collaborazioni dottorali"},
 {name:"INFN",url:"https://www.infn.it/",category:"Italia · Scuole e ricerca",description:"Ricerca e percorsi dottorali in collaborazione"},
 {name:"INRIA",url:"https://www.inria.fr/en",category:"Europa · Centri di ricerca",description:"Ricerca informatica, AI, statistica e dottorati in Francia"},
 {name:"Max Planck Society",url:"https://www.mpg.de/en",category:"Europa · Centri di ricerca",description:"Istituti e scuole di ricerca in Germania"},
 {name:"Helmholtz Association",url:"https://www.helmholtz.de/en/",category:"Europa · Centri di ricerca",description:"Dottorati e ricerca interdisciplinare"},
 {name:"ETH Zürich",url:"https://ethz.ch/en.html",category:"Europa · Centri di ricerca",description:"Dottorati e posizioni di ricerca in Svizzera"},
 {name:"EPFL",url:"https://www.epfl.ch/education/phd/",category:"Europa · Centri di ricerca",description:"Programmi di dottorato in Svizzera"},
 {name:"KU Leuven",url:"https://www.kuleuven.be/english/",category:"Europa · Centri di ricerca",description:"PhD e ricerca in Belgio"},
 {name:"TU Delft",url:"https://www.tudelft.nl/en/",category:"Europa · Centri di ricerca",description:"PhD e posizioni di ricerca nei Paesi Bassi"},
 {name:"ENS Paris-Saclay",url:"https://ens-paris-saclay.fr/en",category:"Europa · Centri di ricerca",description:"Dottorati e laboratori francesi"},
 {name:"ENSAI / CREST",url:"https://crest.science/",category:"Europa · Centri di ricerca",description:"Ricerca quantitativa, statistica ed economia"}
];
const filters=["Tutte","Italia · Bandi ufficiali","Italia · Atenei e scuole","Italia · Scuole e ricerca","Europa · Portali PhD","Europa · Centri di ricerca","Mondo · Ricerca"] as const;
export default function PhDDirectory(){
 const [filter,setFilter]=useState<string>("Tutte");
 const [query,setQuery]=useState("");
 const visible=useMemo(()=>resources.filter(r=>(filter==="Tutte"||r.category===filter)&&(r.name+" "+r.description+" "+r.category).toLocaleLowerCase("it").includes(query.trim().toLocaleLowerCase("it"))),[filter,query]);
 return <section className="tracker-panel tracker-phd" aria-labelledby="phd-title"><div className="tracker-panel-head"><div><p className="eyebrow">RICERCA ACCADEMICA / TERZO CICLO</p><h2 id="phd-title">Dottorati di ricerca <em>& PhD.</em></h2><p className="tracker-platforms-intro">Portali ufficiali, università, scuole di eccellenza e centri di ricerca in Italia e all'estero. Per le università, apri il sito e cerca la sezione “Dottorati” o “PhD”.</p></div><span className="tracker-platforms-count">{resources.length} RISORSE ↗</span></div>
 <div className="tracker-phd-featured"><a href="https://bandi.mur.gov.it/" target="_blank" rel="noopener noreferrer"><span>ITALIA · FONTE UFFICIALE</span><strong>Bandi MUR ↗</strong><small>Consulta i bandi di dottorato italiani</small></a><a href="https://euraxess.ec.europa.eu/jobs/search" target="_blank" rel="noopener noreferrer"><span>EUROPA · OPPORTUNITÀ</span><strong>EURAXESS ↗</strong><small>Cerca posizioni di ricerca per paese e disciplina</small></a></div>
 <div className="tracker-platforms-controls"><div className="tracker-platforms-categories" aria-label="Filtra risorse PhD">{filters.map(f=><button key={f} type="button" aria-pressed={filter===f} className={filter===f?"active":""} onClick={()=>setFilter(f)}>{f}</button>)}</div><input type="search" aria-label="Cerca risorse PhD" placeholder="Cerca università, paese, statistica, AI…" value={query} onChange={e=>setQuery(e.target.value)}/></div>
 <div className="tracker-platforms-grid">{visible.map(r=><a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer" className="tracker-platform-card"><span className="tracker-platform-card-top"><span className="tracker-platform-mark" aria-hidden="true">{r.name.charAt(0)}</span><span className="tracker-platform-arrow" aria-hidden="true">↗</span></span><strong>{r.name}</strong><span className="tracker-platform-description">{r.description}</span><span className="tracker-platform-category">{r.category}</span></a>)}</div>
 {!visible.length&&<p className="tracker-platforms-empty">Nessuna risorsa trovata. Prova una ricerca più generale.</p>}
 <p className="tracker-platforms-note">Questo è un elenco di siti da consultare, non un elenco di bandi attualmente aperti. Verifica sempre scadenze, requisiti e borse sul bando ufficiale.</p></section>;
}
