"use client";
import {useMemo,useState} from "react";

const platforms=[
 {name:"LinkedIn Jobs",url:"https://www.linkedin.com/jobs/",category:"Generali",desc:"Offerte, recruiter e networking"},
 {name:"Indeed",url:"https://it.indeed.com/",category:"Generali",desc:"Annunci da aziende e agenzie"},
 {name:"Glassdoor",url:"https://www.glassdoor.it/",category:"Generali",desc:"Lavoro, stipendi e recensioni"},
 {name:"InfoJobs",url:"https://www.infojobs.it/",category:"Generali",desc:"Offerte in Italia"},
 {name:"Monster",url:"https://www.monster.it/",category:"Generali",desc:"Ricerca lavoro e candidature"},
 {name:"Jooble",url:"https://it.jooble.org/",category:"Generali",desc:"Motore di ricerca di annunci"},
 {name:"Jobrapido",url:"https://it.jobrapido.com/",category:"Generali",desc:"Annunci aggregati"},
 {name:"Google Jobs",url:"https://www.google.com/search?q=data+scientist+lavoro+Italia&ibp=htl;jobs",category:"Generali",desc:"Ricerca aggregata di opportunità"},
 {name:"Wellfound",url:"https://wellfound.com/jobs",category:"Tech e startup",desc:"Startup e ruoli tecnologici"},
 {name:"Welcome to the Jungle",url:"https://www.welcometothejungle.com/",category:"Tech e startup",desc:"Aziende, cultura e opportunità"},
 {name:"HackerRank Jobs",url:"https://www.hackerrank.com/",category:"Tech e startup",desc:"Community e competenze tecniche"},
 {name:"We Work Remotely",url:"https://weworkremotely.com/",category:"Tech e startup",desc:"Posizioni da remoto"},
 {name:"Remote OK",url:"https://remoteok.com/",category:"Tech e startup",desc:"Offerte remote internazionali"},
 {name:"Otta / Welcome to the Jungle",url:"https://www.welcometothejungle.com/",category:"Tech e startup",desc:"Opportunità in aziende innovative"},
 {name:"Randstad",url:"https://www.randstad.it/offerte-lavoro/",category:"Agenzie",desc:"Offerte e selezione in Italia"},
 {name:"Adecco",url:"https://www.adecco.it/offerte-lavoro",category:"Agenzie",desc:"Posizioni junior e professionali"},
 {name:"Manpower",url:"https://www.manpower.it/it/annunci-lavoro",category:"Agenzie",desc:"Annunci e opportunità aziendali"},
 {name:"Gi Group",url:"https://www.gigroup.it/offerte-lavoro/",category:"Agenzie",desc:"Ricerca lavoro e recruiting"},
 {name:"Michael Page",url:"https://www.michaelpage.it/",category:"Agenzie",desc:"Opportunità specialistiche"},
 {name:"AlmaLaurea",url:"https://www.almalaurea.it/",category:"Neolaureati",desc:"Opportunità per laureati"},
 {name:"Joinrs",url:"https://www.joinrs.com/",category:"Neolaureati",desc:"Lavoro e graduate program"},
 {name:"EURES",url:"https://eures.europa.eu/index_it",category:"Estero e ricerca",desc:"Lavorare in Europa"},
 {name:"EURAXESS",url:"https://euraxess.ec.europa.eu/jobs",category:"Estero e ricerca",desc:"Ricerca, università e dottorati"},
 {name:"Academic Positions",url:"https://academicpositions.com/",category:"Estero e ricerca",desc:"Posizioni accademiche e PhD"},
 {name:"FindAPhD",url:"https://www.findaphd.com/",category:"Estero e ricerca",desc:"Dottorati internazionali"}
] as const;
const categories=["Tutte","Generali","Tech e startup","Agenzie","Neolaureati","Estero e ricerca"] as const;
export default function JobPlatforms(){
 const [category,setCategory]=useState<string>("Tutte");
 const [query,setQuery]=useState("");
 const matches=useMemo(()=>platforms.filter(p=>(category==="Tutte"||p.category===category)&&(p.name+" "+p.desc+" "+p.category).toLocaleLowerCase("it").includes(query.toLocaleLowerCase("it").trim())),[category,query]);
 return <section className="tracker-panel tracker-platforms" aria-labelledby="tracker-platforms-title">
  <div className="tracker-panel-head"><div><p className="eyebrow">RICERCA OPPORTUNITÀ</p><h2 id="tracker-platforms-title">Dove cercare lavoro<span className="tracker-platforms-dot">.</span></h2><p className="tracker-platforms-intro">Le principali piattaforme in un unico posto. Apri un sito in una nuova scheda e torna qui per salvare la candidatura.</p></div><span className="tracker-platforms-count">{platforms.length} RISORSE ↗</span></div>
  <div className="tracker-platforms-controls"><div className="tracker-platforms-categories" aria-label="Filtra piattaforme">{categories.map(c=><button key={c} type="button" className={category===c?"active":""} aria-pressed={category===c} onClick={()=>setCategory(c)}>{c}</button>)}</div><input type="search" aria-label="Cerca una piattaforma" placeholder="Cerca una piattaforma…" value={query} onChange={e=>setQuery(e.target.value)}/></div>
  <div className="tracker-platforms-grid">{matches.map(p=><a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" className="tracker-platform-card"><span className="tracker-platform-card-top"><span className="tracker-platform-mark" aria-hidden="true">{p.name.slice(0,1)}</span><span className="tracker-platform-arrow" aria-hidden="true">↗</span></span><strong>{p.name}</strong><span className="tracker-platform-description">{p.desc}</span><span className="tracker-platform-category">{p.category}</span></a>)}</div>
  {!matches.length&&<p className="tracker-platforms-empty">Nessuna piattaforma trovata. Prova un'altra ricerca.</p>}
  <p className="tracker-platforms-note">Collegamenti esterni: disponibilità, accesso e annunci dipendono dalle rispettive piattaforme.</p>
 </section>;
}
