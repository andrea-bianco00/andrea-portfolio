import {createHmac} from "node:crypto";
import {NextResponse} from "next/server";
export const dynamic="force-dynamic";
export async function GET(){
 try{
  const response=await fetch("https://mjxlppdnuxrnajpugfvh.supabase.co/rest/v1/geometry_scores?select=player_id,nickname,duration_ms&order=duration_ms.desc,created_at.asc&limit=10",{
   headers:{apikey:"sb_publishable_pF-nbo3Nc-xCvJYoiazBtg_8I7RhZcz"},cache:"no-store",signal:AbortSignal.timeout(5000)
  });
  if(!response.ok)throw new Error("Leaderboard unavailable");
  const data=await response.json();
  // Return only an opaque visual marker, never the raw anonymous player identifier.
  const secret=process.env.GEOMETRY_SUBMIT_TOKEN;
  if(!secret||secret.length<32)throw new Error("Leaderboard marker secret unavailable");
  const scores=(data as {player_id:string;nickname:string;duration_ms:number}[]).map(({player_id,nickname,duration_ms})=>({
   nickname,duration_ms,
   marker:createHmac("sha256",secret).update("geometry-marker:"+player_id).digest("hex").slice(0,8)
  }));
  return NextResponse.json({scores},{headers:{"Cache-Control":"public, s-maxage=20, stale-while-revalidate=60"}});
 }catch{return NextResponse.json({error:"Classifica temporaneamente non disponibile"},{status:503})}
}
