"use server";
import {revalidatePath} from "next/cache";
import {requireSession,supabase} from "../lib";
import {projects} from "../../project-data";

const allowed = new Set(["page:progetti","page:certificazioni",...projects.map(item=>"project:"+item.slug)]);
export async function updateSiteVisibility(data:FormData){
 const {token}=await requireSession();
 const key=String(data.get("key")||"");
 if(!allowed.has(key))throw new Error("Elemento non valido");
 const is_visible=data.get("visible")==="true";
 const r=await supabase("/rest/v1/site_visibility?key=eq."+encodeURIComponent(key),{
   method:"PATCH",headers:{Prefer:"return=representation"},
   body:JSON.stringify({is_visible,updated_at:new Date().toISOString()})
 },token);
 if(!r.ok)throw new Error("Non è stato possibile aggiornare la visibilità");
 const rows=await r.json() as unknown[];
 if(rows.length!==1)throw new Error("Impostazione non trovata");
 revalidatePath("/");revalidatePath("/progetti");revalidatePath("/certificazioni");
 for(const item of projects)revalidatePath("/progetti/"+item.slug);
 revalidatePath("/dashboard/gestione-sito");
}
