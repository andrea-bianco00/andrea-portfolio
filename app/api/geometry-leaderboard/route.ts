import {NextResponse} from "next/server";
export const dynamic="force-dynamic";
export async function GET(){
 try{
  const response=await fetch("https://mjxlppdnuxrnajpugfvh.supabase.co/rest/v1/geometry_scores?select=nickname,duration_ms&order=duration_ms.desc,created_at.asc&limit=10",{
   headers:{apikey:"sb_publishable_pF-nbo3Nc-xCvJYoiazBtg_8I7RhZcz"},cache:"no-store",signal:AbortSignal.timeout(5000)
  });
  if(!response.ok)throw new Error("Leaderboard unavailable");
  const data=await response.json();
  return NextResponse.json({scores:data},{headers:{"Cache-Control":"public, s-maxage=20, stale-while-revalidate=60"}});
 }catch{return NextResponse.json({error:"Classifica temporaneamente non disponibile"},{status:503})}
}
