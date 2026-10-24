const stations = [
 {name:"Aotizhongxin",lon:116.397,lat:39.982},
 {name:"Changping",lon:116.230,lat:40.217},
 {name:"Dingling",lon:116.220,lat:40.292},
 {name:"Dongsi",lon:116.417,lat:39.929},
 {name:"Guanyuan",lon:116.339,lat:39.929},
 {name:"Gucheng",lon:116.184,lat:39.914},
 {name:"Huairou",lon:116.628,lat:40.328},
 {name:"Nongzhanguan",lon:116.461,lat:39.937},
 {name:"Shunyi",lon:116.655,lat:40.127},
 {name:"Tiantan",lon:116.407,lat:39.886},
 {name:"Wanliu",lon:116.287,lat:39.987},
 {name:"Wanshouxigong",lon:116.352,lat:39.878}
];
const left=72,right=748,top=58,bottom=462;
const x=(lon:number)=>left+(lon-116.12)/(116.72-116.12)*(right-left);
const y=(lat:number)=>bottom-(lat-39.83)/(40.38-39.83)*(bottom-top);
const central=new Set(["Aotizhongxin","Dongsi","Guanyuan","Gucheng","Nongzhanguan","Tiantan","Wanliu","Wanshouxigong"]);
export default function BeijingStationMap(){
 return <figure className="hdts-map-panel">
  <div className="hdts-viz-head"><div><span className="eyebrow">GEOGRAFIA DEL DATASET</span><h3>Dove si trovano le 12 stazioni di Beijing?</h3></div><span className="hdts-viz-meta">Latitudine · Longitudine</span></div>
  <p>Non sono dodici repliche dello stesso punto: alcune stazioni si concentrano nella zona urbana, altre si trovano più a nord o a est. La posizione aiuta a interpretare perché le misure possano essere correlate senza essere identiche.</p>
  <div className="hdts-map-layout">
   <svg viewBox="0 0 820 525" role="img" aria-label="Mappa schematica georeferenziata delle dodici stazioni PM2.5 nell'area di Pechino, con assi longitudine e latitudine. Nord verso l'alto." className="hdts-station-map">
    <defs><pattern id="hdts-grid" width="88" height="76" patternUnits="userSpaceOnUse"><path d="M 88 0 L 0 0 0 76" fill="none" stroke="#493024" strokeWidth=".6"/></pattern></defs>
    <rect x="0" y="0" width="820" height="525" rx="16" fill="#120c09"/>
    <rect x={left} y={top} width={right-left} height={bottom-top} fill="url(#hdts-grid)" stroke="#493024" strokeWidth="1"/>
    {[116.2,116.3,116.4,116.5,116.6].map(lon=><g key={lon}><line x1={x(lon)} x2={x(lon)} y1={top} y2={bottom} stroke="#493024" strokeDasharray="3 6"/><text x={x(lon)} y={bottom+24} fill="#ac9079" textAnchor="middle" fontSize="11">{lon.toFixed(1)}°E</text></g>)}
    {[39.9,40,40.1,40.2,40.3].map(lat=><g key={lat}><line x1={left} x2={right} y1={y(lat)} y2={y(lat)} stroke="#493024" strokeDasharray="3 6"/><text x={left-12} y={y(lat)+4} fill="#ac9079" textAnchor="end" fontSize="11">{lat.toFixed(1)}°N</text></g>)}
    <text x={right-4} y={top-18} fill="#ff7a1a" textAnchor="end" fontSize="12" fontWeight="bold">N ↑</text>
    <ellipse cx={x(116.37)} cy={y(39.95)} rx="132" ry="85" fill="#ff7a1a" fillOpacity=".045" stroke="#ff7a1a" strokeOpacity=".25" strokeDasharray="5 7"/>
    {stations.map((s,i)=><g key={s.name}>
      <title>{s.name}: {s.lat.toFixed(3)}°N, {s.lon.toFixed(3)}°E</title>
      <circle cx={x(s.lon)} cy={y(s.lat)} r="11" fill={central.has(s.name)?"#ff7a1a":"#f3e7d3"} fillOpacity=".15"/>
      <circle cx={x(s.lon)} cy={y(s.lat)} r="5" fill={central.has(s.name)?"#ff7a1a":"#f3e7d3"} stroke="#120c09" strokeWidth="1.4"/>
      <text x={x(s.lon)+9} y={y(s.lat)-9} fill="#f3e7d3" fontSize="10" fontWeight="600">{i+1}</text>
    </g>)}
    <text x="410" y="510" fill="#ac9079" textAnchor="middle" fontSize="11">Distribuzione geografica dei punti · non è una cartografia stradale</text>
   </svg>
   <div className="hdts-map-key"><div className="hdts-map-key-head"><span className="hdts-map-legend urban"/>Area urbana <span className="hdts-map-legend outer"/>Stazioni periferiche</div><ol>{stations.map((s,i)=><li key={s.name}><span>{String(i+1).padStart(2,"0")}</span><strong>{s.name}</strong></li>)}</ol></div>
  </div>
  <figcaption>Coordinate geografiche pubblicate in letteratura per il Beijing Multi-Site Air Quality dataset, arrotondate a tre decimali. Schema longitudine/latitudine, senza sfondo cartografico né confini amministrativi. Fonte: <a href="https://www.mdpi.com/2071-1050/14/9/5104" target="_blank" rel="noopener noreferrer">Sustainability (2022), tabella 1 ↗</a>. Le categorie urbana/periferica servono solo a orientare la lettura, non sono variabili usate nel benchmark.</figcaption>
 </figure>;
}
