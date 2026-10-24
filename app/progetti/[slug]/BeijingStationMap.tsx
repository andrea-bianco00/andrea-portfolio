"use client";

import {useEffect,useRef,useState} from "react";

const stations=[
 {name:"Aotizhongxin",lat:39.982,lon:116.397},{name:"Changping",lat:40.217,lon:116.230},
 {name:"Dingling",lat:40.292,lon:116.220},{name:"Dongsi",lat:39.929,lon:116.417},
 {name:"Guanyuan",lat:39.929,lon:116.339},{name:"Gucheng",lat:39.914,lon:116.184},
 {name:"Huairou",lat:40.328,lon:116.628},{name:"Nongzhanguan",lat:39.937,lon:116.461},
 {name:"Shunyi",lat:40.127,lon:116.655},{name:"Tiantan",lat:39.886,lon:116.407},
 {name:"Wanliu",lat:39.987,lon:116.287},{name:"Wanshouxigong",lat:39.878,lon:116.352}
];
type LeafletMap={setView:(point:[number,number],zoom:number)=>LeafletMap;fitBounds:(bounds:[number,number][],options?:{padding?:[number,number]})=>LeafletMap;remove:()=>void;invalidateSize:()=>void};
type LeafletMarker={addTo:(map:LeafletMap)=>LeafletMarker;bindPopup:(html:string)=>LeafletMarker;remove:()=>void};
type LeafletTile={addTo:(map:LeafletMap)=>LeafletTile;remove:()=>void};
type LeafletAPI={map:(element:HTMLElement,options?:Record<string,unknown>)=>LeafletMap;tileLayer:(url:string,options:Record<string,unknown>)=>LeafletTile;circleMarker:(point:[number,number],options:Record<string,unknown>)=>LeafletMarker;control:{scale:()=>{addTo:(map:LeafletMap)=>void}}};
declare global{interface Window{L?:LeafletAPI}}
const bounds=stations.map(s=>[s.lat,s.lon] as [number,number]);
const leafletJs="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
const leafletCss="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
let leafletLoading:Promise<void>|null=null;
function loadLeaflet(){
 if(window.L)return Promise.resolve();
 if(leafletLoading)return leafletLoading;
 leafletLoading=new Promise<void>((resolve,reject)=>{
  if(!document.querySelector('link[data-hdts-leaflet]')){const css=document.createElement("link");css.rel="stylesheet";css.href=leafletCss;css.dataset.hdtsLeaflet="1";document.head.appendChild(css)}
  const existing=document.querySelector('script[data-hdts-leaflet]') as HTMLScriptElement|null;
  if(existing){existing.addEventListener("load",()=>resolve(),{once:true});existing.addEventListener("error",()=>reject(new Error("Map library unavailable")),{once:true});return}
  const script=document.createElement("script");script.src=leafletJs;script.async=true;script.dataset.hdtsLeaflet="1";script.onload=()=>resolve();script.onerror=()=>reject(new Error("Map library unavailable"));document.body.appendChild(script);
 }).catch(error=>{leafletLoading=null;throw error});
 return leafletLoading;
}
export default function BeijingStationMap(){
 const container=useRef<HTMLDivElement>(null);
 const map=useRef<LeafletMap|null>(null);
 const markers=useRef<LeafletMarker[]>([]);
 const tileLayer=useRef<LeafletTile|null>(null);
 const [basemap,setBasemap]=useState<"streets"|"terrain">("streets");
 const [ready,setReady]=useState(false);
 const [error,setError]=useState(false);
 const [showStations,setShowStations]=useState(true);
 const [view,setView]=useState<"china"|"beijing">("china");
 useEffect(()=>{
  let disposed=false;
  loadLeaflet().then(()=>{
   if(disposed||!container.current||!window.L)return;
   const L=window.L;
   const instance=L.map(container.current,{scrollWheelZoom:true}).setView([35.8,104.2],4);
   tileLayer.current=L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',maxZoom:19}).addTo(instance);
   L.control.scale().addTo(instance);
   map.current=instance;
   markers.current=stations.map(s=>L.circleMarker([s.lat,s.lon],{radius:8,color:"#fff3e5",weight:2,fillColor:"#ff7a1a",fillOpacity:.95}).addTo(instance).bindPopup(`<strong>${s.name}</strong><br/>PM2.5 monitoring station<br/>${s.lat.toFixed(3)}° N · ${s.lon.toFixed(3)}° E`));
   setReady(true);
   requestAnimationFrame(()=>instance.invalidateSize());
  }).catch(()=>{if(!disposed)setError(true)});
  return()=>{disposed=true;tileLayer.current=null;markers.current.forEach(m=>m.remove());markers.current=[];map.current?.remove();map.current=null};
 },[]);
 function changeView(next:"china"|"beijing"){
  if(!map.current)return;
  if(next==="china")map.current.setView([35.8,104.2],4);
  else map.current.fitBounds(bounds,{padding:[45,45]});
  setView(next);
 }
 function changeBasemap(next:"streets"|"terrain"){
  if(!map.current||!window.L)return;
  tileLayer.current?.remove();
  const terrain=next==="terrain";
  tileLayer.current=window.L.tileLayer(
    terrain?"https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}":"https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    {attribution:terrain?'Tiles &copy; Esri; data &copy; OpenStreetMap contributors and GIS user community':'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',maxZoom:terrain?18:19}
  ).addTo(map.current);
  setBasemap(next);
 }
 function toggleMarkers(){
  if(!map.current||!window.L)return;
  if(showStations)markers.current.forEach(m=>m.remove());
  else markers.current.forEach(m=>m.addTo(map.current!));
  setShowStations(!showStations);
 }
 return <figure className="hdts-map-panel">
  <div className="hdts-viz-head"><div><span className="eyebrow">GEOGRAFIA DEL DATASET · MAPPA INTERATTIVA</span><h3>Dalla Cina alle 12 stazioni di Beijing</h3></div><span className="hdts-viz-meta">OpenStreetMap · Esri</span></div>
  <p>Esplora la posizione delle stazioni sulla cartografia reale. Parti dalla Cina intera, avvicinati a Beijing e seleziona un punto arancione per visualizzare le coordinate.</p>
  <div className="hdts-map-toolbar" role="group" aria-label="Controlli della mappa">
   <button type="button" disabled={!ready} aria-pressed={view==="china"} onClick={()=>changeView("china")}>Cina intera</button>
   <button type="button" disabled={!ready} aria-pressed={view==="beijing"} onClick={()=>changeView("beijing")}>Zoom sulle 12 stazioni</button>
   <button type="button" disabled={!ready} aria-pressed={showStations} onClick={toggleMarkers}>{showStations?"Nascondi stazioni":"Mostra stazioni"}</button>
  </div>
  <div className="hdts-map-style-picker" role="group" aria-label="Stile della mappa"><span>STILE MAPPA</span><button type="button" disabled={!ready} aria-pressed={basemap==="streets"} onClick={()=>changeBasemap("streets")}>Stradale chiara</button><button type="button" disabled={!ready} aria-pressed={basemap==="terrain"} onClick={()=>changeBasemap("terrain")}>Terreno</button></div>
  <div className="hdts-live-map-wrap">
   <div ref={container} className="hdts-live-map" role="region" aria-label="Mappa interattiva della Cina e delle 12 stazioni PM2.5 di Pechino"/>
   {!ready&&!error&&<div className="hdts-map-loading">Caricamento cartografia interattiva…</div>}
   {error&&<div className="hdts-map-loading">La cartografia non è disponibile in questo momento. Controlla la connessione o le impostazioni di blocco dei contenuti.</div>}
  </div>
  <figcaption>Trascina per spostarti, usa la rotellina o i pulsanti +/− per lo zoom e tocca i marcatori per i dettagli. La mappa usa OpenStreetMap (stradale) oppure Esri World Topographic Map (terreno), senza chiavi API; i punti rappresentano le 12 stazioni del benchmark Beijing e non i 516 sensori Taiwan. Coordinate indicative arrotondate, da verificare con i metadati originali prima di un'analisi spaziale.</figcaption>
 </figure>;
}
