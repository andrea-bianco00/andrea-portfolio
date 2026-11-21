import "server-only";

export type SiteVisibility = Record<string, boolean>;

/** Load authoritative visibility states. Missing records or database failures remain hidden. */
export async function getSiteVisibility(): Promise<SiteVisibility> {
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
 const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
 if(!url||!key) return {};
 try{
  const r=await fetch(url+"/rest/v1/site_visibility?select=key,is_visible",{cache:"no-store",headers:{apikey:key,Authorization:"Bearer "+key},signal:AbortSignal.timeout(8000)});
  if(!r.ok) return {};
  const data=await r.json() as {key:string;is_visible:boolean}[];
  return Object.fromEntries(data.map(item=>[item.key,item.is_visible]));
 }catch{return {};}
}
