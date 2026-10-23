export const W=720,H=405,PLAYER_R=10,STEP=1/120;
export type Enemy={x:number;y:number;vx:number;vy:number;r:number;kind:0|1|2;angle:number};
type Particle={x:number;y:number;vx:number;vy:number;life:number};
type Ring={x:number;y:number;r:number;life:number;max:number};
export type Game={rings:Ring[];near:Set<Enemy>;nearCount:number;deathAge:number;x:number;y:number;vx:number;vy:number;t:number;score:number;enemies:Enemy[];particles:Particle[];spawn:number;seed:number;dead:boolean;trail:{x:number;y:number}[]};
export const initial=():Game=>({rings:[],near:new Set<Enemy>(),nearCount:0,deathAge:0,x:W/2,y:H/2,vx:0,vy:0,t:0,score:0,enemies:[],particles:[],spawn:1.15,seed:271828,dead:false,trail:[]});
function rand(g:Game){g.seed=(Math.imul(g.seed,1664525)+1013904223)>>>0;return g.seed/4294967296}
function spawn(g:Game){
 const kind=Math.floor(rand(g)*3) as 0|1|2,edge=Math.floor(rand(g)*4);
 const x=edge===0?-24:edge===1?W+24:rand(g)*W;
 const y=edge===2?-24:edge===3?H+24:rand(g)*H;
 const dx=g.x-x,dy=g.y-y,aim=Math.atan2(dy,dx);
 // Obstacles target only the player's position at spawn. No homing or surprise turns.
 const spread=(rand(g)-.5)*(kind===2?.26:1.25);
 const a=aim+spread,speed=(kind===1?60:kind===2?112:85)*(1+Math.min(g.t,75)/110);
 const r=kind===1?15:kind===2?12:11;
 g.enemies.push({x,y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,r,kind,angle:rand(g)*6.28});
}
function collide(g:Game,e:Enemy){
 // Conservative bounding circles; same geometry for every obstacle.
 const dx=g.x-e.x,dy=g.y-e.y;
 return dx*dx+dy*dy<(PLAYER_R+e.r-2)**2;
}
export function update(g:Game,dt:number,ax:number,ay:number){
 if(g.dead)return;
 g.t+=dt;g.score=Math.floor(g.t*10);
 const norm=Math.hypot(ax,ay)||1,acc=740,drag=Math.exp(-7*dt);
 g.vx=(g.vx+ax/norm*acc*dt)*drag;g.vy=(g.vy+ay/norm*acc*dt)*drag;
 const speed=Math.hypot(g.vx,g.vy),max=255;
 if(speed>max){g.vx*=max/speed;g.vy*=max/speed}
 g.x=Math.max(PLAYER_R+5,Math.min(W-PLAYER_R-5,g.x+g.vx*dt));
 g.y=Math.max(PLAYER_R+5,Math.min(H-PLAYER_R-5,g.y+g.vy*dt));
 if(g.x<=PLAYER_R+5||g.x>=W-PLAYER_R-5)g.vx=0;
 if(g.y<=PLAYER_R+5||g.y>=H-PLAYER_R-5)g.vy=0;
 g.trail.push({x:g.x,y:g.y});if(g.trail.length>24)g.trail.shift();
 g.spawn-=dt;
 if(g.spawn<=0){
  spawn(g);
  // Spawn rate increases smoothly, then caps. One seeded sequence per run.
  const interval=Math.max(.24,1.05-g.t*.010);
  g.spawn+=interval*(.78+rand(g)*.45);
 }
 for(const e of g.enemies){e.x+=e.vx*dt;e.y+=e.vy*dt;e.angle+=dt*(e.kind===1?1.1:2)}
 g.enemies=g.enemies.filter(e=>e.x>-70&&e.x<W+70&&e.y>-70&&e.y<H+70);
 for(const e of g.enemies){
  const distance=Math.hypot(g.x-e.x,g.y-e.y),contact=PLAYER_R+e.r-2;
  if(distance>contact+3&&distance<contact+17&&!g.near.has(e)){
   g.near.add(e);g.nearCount++;g.rings.push({x:g.x,y:g.y,r:9,life:.42,max:.42});
   for(let j=0;j<7;j++){const a=j*Math.PI*2/7;g.particles.push({x:g.x,y:g.y,vx:Math.cos(a)*62,vy:Math.sin(a)*62,life:.25})}
  }
  if(!collide(g,e))continue;
  g.dead=true;
  for(let i=0;i<38;i++){const a=rand(g)*Math.PI*2,s=30+rand(g)*170;g.particles.push({x:g.x,y:g.y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:.45+rand(g)*.45})}
  g.rings.push({x:g.x,y:g.y,r:14,life:.9,max:.9});
  break;
 }
}
