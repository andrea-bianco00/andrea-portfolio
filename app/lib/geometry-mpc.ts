/** Public-observation adapter for frozen Geometry Survivor MPC.
 * Does not read spawn, seed, score, or any future information.
 * Kept separate from the live game until browser integration is tested.
 */
import type {Game, Enemy} from "./geometry-core";
const W=720,H=405,PLAYER_R=10;
const clip=(v:number)=>Math.max(-1,Math.min(1,v));
function priority(g:Game,e:Enemy):readonly [number,number,number]{
 const dx=e.x-g.x,dy=e.y-g.y,vx=e.vx-g.vx,vy=e.vy-g.vy,v2=vx*vx+vy*vy;
 const t=v2>1e-6?Math.max(0,Math.min(2,-(dx*vx+dy*vy)/v2)):0;
 return [Math.max(0,Math.hypot(dx+vx*t,dy+vy*t)-(PLAYER_R+e.r-2)),t,Math.hypot(dx,dy)];
}
export function observeForMpc(g:Game):number[]{
 const obs=Array<number>(53).fill(0);
 obs[0]=Math.fround(clip(g.x/(W/2)-1));
 obs[1]=Math.fround(clip(g.y/(H/2)-1));
 obs[2]=Math.fround(clip(g.vx/255));
 obs[3]=Math.fround(clip(g.vy/255));
 const threats=g.enemies.map((e,i)=>({e,i,p:priority(g,e)})).sort((a,b)=>{
  for(let j=0;j<3;j++){const d=a.p[j]-b.p[j];if(d!==0)return d;}
  return a.i-b.i;
 }).slice(0,8);
 threats.forEach(({e},i)=>{
  const k=4+6*i;
  const values=[(e.x-g.x)/W,(e.y-g.y)/H,(e.vx-g.vx)/400,(e.vy-g.vy)/400,(PLAYER_R+e.r-2)/40,1];
  values.forEach((v,j)=>obs[k+j]=Math.fround(clip(v)));
 });
 obs[52]=Math.fround(Math.min(g.t,75)/75);
 return obs;
}
/** Frozen MPC action choices; matches evaluation/mpc.py.
 * No access to Game: receives only the public 53-number observation.
 */
export const MPC_ACTIONS:ReadonlyArray<readonly [number,number]>=[
 [0,0],[0,-1],[0,1],[-1,0],[1,0],[-1,-1],[1,-1],[-1,1],[1,1]
];
export function mpcAction(obs:ReadonlyArray<number>,horizon=1.2,dt=0.05):number{
 if(obs.length!==53||!obs.every(Number.isFinite))throw Error("Invalid MPC observation");
 const px=(obs[0]+1)*W/2,py=(obs[1]+1)*H/2,vx=obs[2]*255,vy=obs[3]*255;
 const threats:Array<[number,number,number,number,number]>=[];
 for(let j=0;j<8;j++){const k=4+6*j;if(obs[k+5]<=0)continue;
  threats.push([px+obs[k]*W,py+obs[k+1]*H,vx+obs[k+2]*400,vy+obs[k+3]*400,obs[k+4]*40]);
 }
 let bestAction=0,bestScore=-Infinity;
 const n=Math.round(horizon/dt);
 for(let action=0;action<MPC_ACTIONS.length;action++){
  const [ax,ay]=MPC_ACTIONS[action];let x=px,y=py,ux=vx,uy=vy,score=0;
  const norm=Math.hypot(ax,ay)||1;
  for(let i=1;i<=n;i++){
   const t=i*dt,drag=Math.exp(-7*dt);
   ux=(ux+ax/norm*740*dt)*drag;uy=(uy+ay/norm*740*dt)*drag;
   const speed=Math.hypot(ux,uy);
   if(speed>255){ux=ux*255/speed;uy=uy*255/speed;}
   x=Math.max(15,Math.min(W-15,x+ux*dt));y=Math.max(15,Math.min(H-15,y+uy*dt));
   if(x===15||x===W-15)ux=0;if(y===15||y===H-15)uy=0;
   const wall=Math.min(x-15,W-15-x,y-15,H-15-y);
   score+=0.0005*Math.min(wall,90)*dt;
   for(const [ex,ey,evx,evy,r] of threats){
    const clearance=Math.hypot(x-(ex+evx*t),y-(ey+evy*t))-r;
    if(clearance<0)score-=1000*dt;
    else score-=2.5*Math.max(0,45-clearance)**2/2025*dt;
   }
  }
  if(score>bestScore){bestScore=score;bestAction=action;}
 }
 return bestAction;
}
