"use server";
import {revalidatePath} from "next/cache";
import {requireSession,supabase} from "../lib";

const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function text(data:FormData,key:string,max:number){return String(data.get(key)||"").trim().slice(0,max+1)}
function refresh(){revalidatePath("/dashboard/certificazioni");revalidatePath("/certificazioni")}
export async function addCertification(data:FormData) {
 const {token}=await requireSession();
 const title=text(data,"title",180),issuer=text(data,"issuer",180),issued_on=text(data,"issued_on",10),credential_url=text(data,"credential_url",2048),description=text(data,"description",2000);
 if(!title||title.length>180||!issuer||issuer.length>180||description.length>2000||credential_url.length>2048||issued_on&&!/^\d{4}-\d{2}-\d{2}$/.test(issued_on)||credential_url&&!/^https:\/\/[^\s]+$/i.test(credential_url))throw new Error("Dati della certificazione non validi");
 const r=await supabase("/rest/v1/certifications",{method:"POST",headers:{Prefer:"return=minimal"},body:JSON.stringify({title,issuer,issued_on:issued_on||null,credential_url:credential_url||null,description:description||null,is_published:false})},token);
 if(!r.ok)throw new Error("Impossibile aggiungere la certificazione");
 refresh();
}
export async function updateCertification(data:FormData) {
 const {token}=await requireSession();const id=text(data,"id",36);
 const title=text(data,"title",180),issuer=text(data,"issuer",180),issued_on=text(data,"issued_on",10),credential_url=text(data,"credential_url",2048),description=text(data,"description",2000);
 if(!uuid.test(id)||!title||title.length>180||!issuer||issuer.length>180||description.length>2000||credential_url.length>2048||issued_on&&!/^\d{4}-\d{2}-\d{2}$/.test(issued_on)||credential_url&&!/^https:\/\/[^\s]+$/i.test(credential_url))throw new Error("Dati della certificazione non validi");
 const r=await supabase("/rest/v1/certifications?id=eq."+encodeURIComponent(id),{method:"PATCH",headers:{Prefer:"return=representation"},body:JSON.stringify({title,issuer,issued_on:issued_on||null,credential_url:credential_url||null,description:description||null,updated_at:new Date().toISOString()})},token);
 if(!r.ok||!(await r.json() as unknown[]).length)throw new Error("Modifica non riuscita");refresh();
}
export async function setCertificationVisibility(data:FormData) {
 const {token}=await requireSession();const id=text(data,"id",36);
 if(!uuid.test(id))throw new Error("ID non valido");
 const published=data.get("published")==="true";
 const r=await supabase("/rest/v1/certifications?id=eq."+encodeURIComponent(id),{method:"PATCH",headers:{Prefer:"return=representation"},body:JSON.stringify({is_published:published,updated_at:new Date().toISOString()})},token);
 if(!r.ok||!(await r.json() as unknown[]).length)throw new Error("Pubblicazione non riuscita");refresh();
}
export async function removeCertification(data:FormData) {
 const {token}=await requireSession();const id=text(data,"id",36);
 if(!uuid.test(id))throw new Error("ID non valido");
 const r=await supabase("/rest/v1/certifications?id=eq."+encodeURIComponent(id),{method:"DELETE",headers:{Prefer:"return=representation"}},token);
 if(!r.ok||!(await r.json() as unknown[]).length)throw new Error("Eliminazione non riuscita");refresh();
}
