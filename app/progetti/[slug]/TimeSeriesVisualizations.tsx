const data = [
  {name:"Aotizhongxin",baseline:9.897670062053624,pm:8.740904437978166,full:8.634781337254894},
  {name:"Changping",baseline:8.939027228298814,pm:8.518013169407476,full:8.322327478310372},
  {name:"Dingling",baseline:8.409101739337622,pm:7.97379980978079,full:7.868484543577634},
  {name:"Dongsi",baseline:10.410990063450257,pm:9.377094263871978,full:9.266642347761527},
  {name:"Guanyuan",baseline:9.996974633465209,pm:8.92642300421134,full:8.90390735008532},
  {name:"Gucheng",baseline:9.875452317030465,pm:9.079356178016763,full:8.955865938027218},
  {name:"Huairou",baseline:8.218377367313538,pm:7.547550778781773,full:7.348224099526009},
  {name:"Nongzhanguan",baseline:9.958144401813742,pm:8.830922106511117,full:8.78522505467323},
  {name:"Shunyi",baseline:10.192694610778442,pm:9.391838299668294,full:9.125666261734496},
  {name:"Tiantan",baseline:9.993025688713239,pm:8.97697703738937,full:8.912943635016127},
  {name:"Wanliu",baseline:9.411109822567552,pm:8.551681376760397,full:8.453138928296193},
  {name:"Wanshouxigong",baseline:10.666588456123886,pm:9.665791539132755,full:9.621612564790471}
];
const fmt=(n:number)=>n.toFixed(2).replace(".",",");
export default function TimeSeriesVisualizations(){
 const sorted=[...data].sort((a,b)=>(b.baseline-b.full)/b.baseline-(a.baseline-a.full)/a.baseline);
 return <div className="hdts-visuals">
  <figure className="hdts-viz-panel">
   <div className="hdts-viz-head"><div><span className="eyebrow">FIGURA 01 / CONFRONTO</span><h3>Due metriche, una conclusione coerente</h3></div><span className="hdts-viz-meta">2016 · 102.298 osservazioni</span></div>
   <div className="hdts-viz-dual">
    {([{title:"MAE",values:[9.663209,8.796995,8.682193],max:11},{title:"RMSE",values:[18.615820,16.705513,16.461690],max:21}]).map(metric=><div key={metric.title}>
      <h4>{metric.title} <span>↓ minore è meglio</span></h4>
      {metric.values.map((value,i)=><div key={i} className="hdts-viz-bar"><div><span>{["Persistenza","Solo PM2.5","PM2.5 + ambiente"][i]}</span><strong>{fmt(value)}</strong></div><div className="hdts-viz-track"><span className={i===2?"hdts-viz-fill best":"hdts-viz-fill"} style={{width:`${100*value/metric.max}%`}} /></div></div>)}
    </div>)}
   </div>
   <figcaption>Valori aggregati archiviati. MAE e RMSE sono calcolati sugli stessi target validi; il 2016 è un periodo retrospettivo consultato durante lo sviluppo.</figcaption>
  </figure>
  <figure className="hdts-viz-panel">
   <div className="hdts-viz-head"><div><span className="eyebrow">FIGURA 02 / ETEROGENEITÀ</span><h3>Il miglioramento riguarda tutte le 12 stazioni?</h3></div><span className="hdts-viz-meta">Riduzione MAE vs persistenza</span></div>
   <div className="hdts-station-chart">
    {sorted.map(s=>{const reduction=100*(s.baseline-s.full)/s.baseline;return <div className="hdts-station-line" key={s.name}><span>{s.name}</span><div className="hdts-station-track"><div style={{width:`${reduction/16*100}%`}}/></div><strong>{fmt(reduction)}%</strong></div>})}
   </div>
   <figcaption>Tutte le 12 stazioni mostrano una riduzione del MAE rispetto alla persistenza nell'archivio 2016. Le barre indicano miglioramenti percentuali, non differenze assolute. <a href="https://github.com/andrea-bianco00/high-dimensional-time-series/blob/main/beijing/results/station_mae.csv" target="_blank" rel="noopener noreferrer">Dati originali ↗</a></figcaption>
  </figure>
  <div className="hdts-viz-takeaway"><strong>Che cosa impariamo dai grafici?</strong><p>Il vantaggio non dipende da una sola metrica o da una sola stazione. Tuttavia la coerenza retrospettiva non sostituisce una verifica su dati nuovi. Per studiare la distribuzione degli errori orari servono previsioni e target abbinati: non sarebbe corretto inventare una curva da questi soli aggregati.</p></div>
 </div>;
}
