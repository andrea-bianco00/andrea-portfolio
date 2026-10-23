import {H, PLAYER_R, W, type Enemy, type Game} from "./geometry-core";

/**
 * Geometry Survivor RL observation contract, version 1.
 * Pure, deterministic, fixed-length and independent of rendering.
 * All positions/velocities are normalized to roughly [-1, 1].
 *
 * Layout: player [x,y,vx,vy], then 8 threats x
 * [dx,dy,relativeVx,relativeVy,collisionRadius,valid], then
 * [elapsedDifficulty]. Total: 53 floats.
 *
 * Sort by predicted closest approach within 2 seconds, not merely
 * distance, so fast incoming threats are not hidden behind distant objects.
 */
export const AI_OBSERVATION_VERSION = 1;
export const AI_MAX_THREATS = 8;
export const AI_OBSERVATION_SIZE = 4 + AI_MAX_THREATS * 6 + 1;
export const AI_ACTIONS = [
  [0,0],[0,-1],[0,1],[-1,0],[1,0],
  [-1,-1],[1,-1],[-1,1],[1,1],
] as const;

const clamp=(n:number)=>Math.max(-1,Math.min(1,n));
const threat=(g:Game,e:Enemy)=>{
  const dx=e.x-g.x,dy=e.y-g.y;
  const vx=e.vx-g.vx,vy=e.vy-g.vy;
  const speed2=vx*vx+vy*vy;
  const closestTime=speed2>1e-6?Math.max(0,Math.min(2,-(dx*vx+dy*vy)/speed2)):0;
  const cx=dx+vx*closestTime,cy=dy+vy*closestTime;
  const clearance=Math.max(0,Math.hypot(cx,cy)-(PLAYER_R+e.r-2));
  return {e,clearance,closestTime,distance:Math.hypot(dx,dy)};
};

export function observeGeometry(g:Game):Float32Array{
  const out=new Float32Array(AI_OBSERVATION_SIZE);
  out[0]=clamp(g.x/(W/2)-1);
  out[1]=clamp(g.y/(H/2)-1);
  out[2]=clamp(g.vx/255);
  out[3]=clamp(g.vy/255);
  const threats=g.enemies.map(e=>threat(g,e)).sort((a,b)=>
    a.clearance-b.clearance||a.closestTime-b.closestTime||a.distance-b.distance
  ).slice(0,AI_MAX_THREATS);
  threats.forEach(({e},i)=>{
    const k=4+i*6;
    out[k]=clamp((e.x-g.x)/W);
    out[k+1]=clamp((e.y-g.y)/H);
    out[k+2]=clamp((e.vx-g.vx)/400);
    out[k+3]=clamp((e.vy-g.vy)/400);
    out[k+4]=clamp((PLAYER_R+e.r-2)/40);
    out[k+5]=1;
  });
  out[AI_OBSERVATION_SIZE-1]=Math.min(g.t,75)/75;
  return out;
}

/** Exactly the same discrete action mapping for training and browser inference. */
export function aiAction(index:number):readonly [number,number]{
  if(!Number.isInteger(index)||index<0||index>=AI_ACTIONS.length)
    throw new RangeError("Invalid AI action");
  return AI_ACTIONS[index];
}
