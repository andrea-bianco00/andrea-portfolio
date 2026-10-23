import {createHmac,createHash,randomBytes,timingSafeEqual} from "node:crypto";
import {NextRequest,NextResponse} from "next/server";
import {initial,update,STEP} from "../../lib/geometry-core";
export const runtime="nodejs";
export const dynamic="force-dynamic";
const SUPABASE="https://mjxlppdnuxrnajpugfvh.supabase.co";

const json=(data:unknown,status=200)=>NextResponse.json(data,{status,headers:{"Cache-Control":"no-store"}});
const validNick=(x:unknown):x is string=>typeof x==="string"&&/^[A-Za-z0-9_-]{2,20}$/.test(x);
const validUuid=(x:unknown):x is string=>typeof x==="string"&&/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(x);
function sign(payload:string,secret:string){return createHmac("sha256",secret).update(payload).digest("hex")}
function safeEq(a:string,b:string){return a.length===b.length&&timingSafeEqual(Buffer.from(a),Buffer.from(b))}
export async function POST(request:NextRequest){
 const secret=process.env.GEOMETRY_SUBMIT_TOKEN;
 const dbKey=process.env.GEOMETRY_SUPABASE_SECRET_KEY;
 if(!secret||secret.length<32||!dbKey)return json({error:"La pubblicazione dei record non è ancora attiva."},503);
 const origin=request.headers.get("origin");
 if(origin&&origin!==new URL(request.url).origin&&origin!=="https://andrea-bianco.com"&&origin!=="https://www.andrea-bianco.com")return json({error:"Origine non consentita"},403);
 if(Number(request.headers.get("content-length")||0)>180000)return json({error:"Dati troppo grandi"},413);
 let body:Record<string,unknown>;
 try{
  // Enforce the actual body size even when Content-Length is absent or dishonest.
  const raw=await request.text();
  if(Buffer.byteLength(raw,"utf8")>180000)return json({error:"Dati troppo grandi"},413);
  body=JSON.parse(raw);
 }catch{return json({error:"Richiesta non valida"},400)}
 if(!body||typeof body!=="object")return json({error:"Richiesta non valida"},400);
 if(body.action==="start"){
  const seed=randomBytes(4).readUInt32BE(0),now=Date.now(),nonce=randomBytes(16).toString("hex");
  const payload=[seed,now,nonce].join(".");
  return json({session:payload+"."+sign(payload,secret),seed});
 }
 if(body.action!=="finish"||!validNick(body.nickname)||!validUuid(body.playerId)||typeof body.session!=="string"||!Array.isArray(body.moves))return json({error:"Dati della partita non validi"},400);
 const parts=body.session.split(".");
 if(parts.length!==4||!/^\d+$/.test(parts[0])||!/^\d+$/.test(parts[1])||! /^[a-f0-9]{32}$/.test(parts[2])||! /^[a-f0-9]{64}$/.test(parts[3]))return json({error:"Sessione non valida"},400);
 const payload=parts.slice(0,3).join(".");
 if(!safeEq(sign(payload,secret),parts[3]))return json({error:"Sessione non autorizzata"},403);
 const seed=Number(parts[0]),started=Number(parts[1]),elapsed=Date.now()-started;
 if(!Number.isInteger(seed)||seed<0||seed>4294967295||!Number.isFinite(started)||elapsed<1000||elapsed>300000)return json({error:"Sessione scaduta"},400);
 const game=initial(seed);let ticks=0;
 const maxTicks=Math.min(36000,Math.floor((elapsed+1500)/(STEP*1000)));
 if(body.moves.length>36000)return json({error:"Replay troppo lungo"},400);
 for(const move of body.moves){
  if(!Array.isArray(move)||move.length!==3)return json({error:"Replay non valido"},400);
  const [x,y,count]=move;
  if(!Number.isInteger(x)||!Number.isInteger(y)||Math.abs(x)>1000||Math.abs(y)>1000||!Number.isInteger(count)||count<1||count>36000)return json({error:"Movimento non valido"},400);
  // Reject excessive work before simulating any ticks from this run.
  if(ticks+count>maxTicks)return json({error:"Replay troppo lungo per la durata della sessione"},400);
  for(let i=0;i<count;i++){
   if(game.dead)return json({error:"Replay non valido dopo la collisione"},400);
   update(game,STEP,x/1000,y/1000);ticks++;
   if(ticks>36000)return json({error:"Partita troppo lunga"},400);
  }
 }
 if(!game.dead||ticks<120||ticks*STEP*1000>elapsed+1500)return json({error:"La partita non ha superato la verifica"},400);
 const duration=Math.round(game.t*1000);
 const replayHash=createHash("sha256").update(body.session+JSON.stringify(body.moves)).digest("hex");
 const sessionId=[parts[2].slice(0,8),parts[2].slice(8,12),"4"+parts[2].slice(13,16),"8"+parts[2].slice(17,20),parts[2].slice(20,32)].join("-");
 try{
  const result=await fetch(SUPABASE+"/rest/v1/rpc/geometry_submit_verified",{
   method:"POST",cache:"no-store",signal:AbortSignal.timeout(8000),
   headers:{"Content-Type":"application/json","apikey":dbKey},
   body:JSON.stringify({p_token:secret,p_session:sessionId,p_player:body.playerId,p_nickname:body.nickname,p_duration:duration,p_hash:replayHash})
  });
  if(!result.ok)return json({error:"Salvataggio non disponibile; riprova più tardi."},503);
  return json({ok:true,duration_ms:duration});
 }catch{return json({error:"Impossibile contattare il database"},503)}
}
