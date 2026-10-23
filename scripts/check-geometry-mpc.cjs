/* Deterministic smoke test of the actual browser game physics and MPC.
   No hidden game state is passed to the policy. This is not a final performance estimate. */
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm"),ts=require("typescript");
const cache=new Map();
function load(file){
 const full=path.resolve(__dirname,"..",file);
 if(cache.has(full))return cache.get(full).exports;
 const module={exports:{}};cache.set(full,module);
 const source=fs.readFileSync(full,"utf8");
 const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 const requireLocal=(id)=>id.startsWith(".")?load(path.relative(path.resolve(__dirname,".."),path.resolve(path.dirname(full),id)+".ts")):require(id);
 vm.runInNewContext("(function(require,module,exports){"+js+"\n})",{console,Math,Set,Array,Number,Error,Float32Array},{filename:full})(requireLocal,module,module.exports);
 return module.exports;
}
const {initial,update,STEP}=load("app/lib/geometry-core.ts");
const {observeForMpc,mpcAction,MPC_ACTIONS}=load("app/lib/geometry-mpc.ts");
function simulate(seed,mode){
 const g=initial(seed);let ticks=0,action=0;
 while(!g.dead&&g.t<120){
  if(ticks%6===0&&mode==="mpc"){
   const o=observeForMpc(g);
   if(o.length!==53||!o.every(Number.isFinite))throw Error("Invalid observation");
   action=mpcAction(o);
   if(!Number.isInteger(action)||action<0||action>=MPC_ACTIONS.length)throw Error("Invalid action");
  }
  const [ax,ay]=mode==="mpc"?MPC_ACTIONS[action]:[0,0];
  const mx=Math.round(ax/(Math.hypot(ax,ay)||1)*1000),my=Math.round(ay/(Math.hypot(ax,ay)||1)*1000);
  update(g,STEP,mx/1000,my/1000);ticks++;
 }
 return g.t;
}
const seeds=[9300000,9300001,9300002,9300003,9300004,9300005,9300006,9300007,9300008,9300009];
const results=seeds.map(seed=>({seed,mpc:simulate(seed,"mpc"),idle:simulate(seed,"idle")}));
for(const row of results){
 const again=simulate(row.seed,"mpc");
 if(Math.abs(again-row.mpc)>1e-8)throw Error("Non-deterministic MPC replay at seed "+row.seed);
}
const mean=k=>results.reduce((a,r)=>a+r[k],0)/results.length;
console.log(JSON.stringify({test:"browser-core MPC deterministic smoke",seeds:seeds.length,cap:120,meanMpc:mean("mpc"),meanIdle:mean("idle"),results},null,2));
