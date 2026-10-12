"use server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookieName, configured, requireSession, supabase } from "./lib";

export async function signIn(_: {error:string}, data:FormData) {
  if (!configured) return {error:"Connessione al database non ancora configurata."};
  const email = String(data.get("email") || "").trim();
  const password = String(data.get("password") || "");
  if (!email || !password) return {error:"Inserisci email e password."};
  try {
    const response = await supabase("/auth/v1/token?grant_type=password", {
      method:"POST",body:JSON.stringify({email,password})
    });
    if (!response.ok) return {error:"Credenziali non valide."};
    const result = await response.json() as {access_token:string;expires_in:number};
    (await cookies()).set(cookieName,result.access_token,{
      httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",
      path:"/dashboard",maxAge:Math.min(result.expires_in,3600)
    });
  } catch { return {error:"Impossibile effettuare l'accesso."}; }
  redirect("/dashboard");
}

export async function signOut() {
  (await cookies()).delete(cookieName);
  redirect("/dashboard/login");
}

const statuses = ["wishlist","applied","screening","interview","assessment","offer","rejected","withdrawn","accepted"];
export async function createApplication(data:FormData) {
  const {token} = await requireSession();
  const company = String(data.get("company")||"").trim().slice(0,160);
  const role_title = String(data.get("role_title")||"").trim().slice(0,180);
  const status = String(data.get("status")||"applied");
  const location = String(data.get("location")||"").trim().slice(0,160);
  const applied_on = String(data.get("applied_on")||"");
  if (!company || !role_title || !statuses.includes(status)) return;
  const response = await supabase("/rest/v1/job_applications", {
    method:"POST",headers:{Prefer:"return=minimal"},
    body:JSON.stringify({company,role_title,status,location:location||null,applied_on:applied_on||null})
  },token);
  if (!response.ok) throw new Error("Salvataggio non riuscito");
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updateStatus(data:FormData) {
  const {token}=await requireSession();
  const id=String(data.get("id")||"");
  const status=String(data.get("status")||"");
  if (!/^[0-9a-f-]{36}$/i.test(id)||!statuses.includes(status)) return;
  const response=await supabase("/rest/v1/job_applications?id=eq."+encodeURIComponent(id),{
    method:"PATCH",headers:{Prefer:"return=minimal"},body:JSON.stringify({status})
  },token);
  if(!response.ok) throw new Error("Aggiornamento non riuscito");
  revalidatePath("/dashboard");
}


const validId = (id:string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
export async function editApplication(data:FormData) {
 const {token}=await requireSession();
 const id=String(data.get("id")||"");
 const company=String(data.get("company")||"").trim();
 const role_title=String(data.get("role_title")||"").trim();
 const location=String(data.get("location")||"").trim();
 const applied_on=String(data.get("applied_on")||"");
 const status=String(data.get("status")||"");
 if(!validId(id)||!company||company.length>160||!role_title||role_title.length>180||location.length>160||!statuses.includes(status)|| (applied_on&&!/^\d{4}-\d{2}-\d{2}$/.test(applied_on))) throw new Error("Dati non validi");
 const response=await supabase("/rest/v1/job_applications?id=eq."+encodeURIComponent(id),{method:"PATCH",headers:{Prefer:"return=representation"},body:JSON.stringify({company,role_title,location:location||null,applied_on:applied_on||null,status})},token);
 if(!response.ok) throw new Error("Modifica non riuscita");
 const rows=await response.json() as unknown[];
 if(rows.length!==1) throw new Error("Candidatura non trovata");
 revalidatePath("/dashboard");
}
export async function deleteApplication(data:FormData) {
 const {token}=await requireSession();
 const id=String(data.get("id")||"");
 if(!validId(id)) throw new Error("Identificativo non valido");
 const response=await supabase("/rest/v1/job_applications?id=eq."+encodeURIComponent(id),{method:"DELETE",headers:{Prefer:"return=representation"}},token);
 if(!response.ok) throw new Error("Eliminazione non riuscita");
 const rows=await response.json() as unknown[];
 if(rows.length!==1) throw new Error("Candidatura non trovata o eliminazione non autorizzata");
 revalidatePath("/dashboard");
}


export async function saveApplicationDetails(data:FormData) {
 const {token}=await requireSession();
 const id=String(data.get("id")||"");
 if(!validId(id)) throw new Error("Candidatura non valida");
 const get=(key:string,max:number)=>String(data.get(key)||"").trim().slice(0,max);
 const job_url=get("job_url",2048);
 if(job_url){try{const parsed=new URL(job_url);if(!["https:","http:"].includes(parsed.protocol))throw Error();}catch{throw new Error("Il link deve iniziare con https:// o http://");}}
 const work_mode=get("work_mode",20);
 const cv_language=get("cv_language",10);
 const salary_min=get("salary_min",12);
 const salary_max=get("salary_max",12);
 const next_action_on=get("next_action_on",10);
 const amount=(s:string)=>s===""?null:/^\d{1,9}$/.test(s)?Number(s):NaN;
 if((work_mode&&!["onsite","hybrid","remote"].includes(work_mode))||(cv_language&&!["it","en","other"].includes(cv_language))||(next_action_on&&!/^\d{4}-\d{2}-\d{2}$/.test(next_action_on))||!Number.isFinite(amount(salary_min)??0)||!Number.isFinite(amount(salary_max)??0))throw new Error("Alcuni valori non sono validi");
 const min=amount(salary_min),max=amount(salary_max);
 if(min!==null&&max!==null&&min>max)throw new Error("La RAL minima supera la massima");
 const payload={application_email:get("application_email",254)||null,recruiter_name:get("recruiter_name",200)||null,recruiter_email:get("recruiter_email",254)||null,recruiter_phone:get("recruiter_phone",60)||null,interviewers:get("interviewers",3000)||null,interview_preparation:get("interview_preparation",20000)||null,next_action_details:get("next_action_details",2000)||null,offer_snapshot:get("offer_snapshot",20000)||null,job_url:job_url||null,source:get("source",120)||null,work_mode:work_mode||null,cv_language:cv_language||null,salary_min:min,salary_max:max,next_action_on:next_action_on||null,notes:get("notes",20000)||null};
 const response=await supabase("/rest/v1/job_applications?id=eq."+encodeURIComponent(id),{method:"PATCH",headers:{Prefer:"return=representation"},body:JSON.stringify(payload)},token);
 if(!response.ok)throw new Error("Impossibile salvare i dettagli");
 const rows=await response.json() as unknown[];
 if(rows.length!==1)throw new Error("Candidatura non trovata");
 revalidatePath("/dashboard");
 revalidatePath("/dashboard/"+id);
}
export async function addApplicationActivity(data:FormData) {
 const {token}=await requireSession();
 const id=String(data.get("application_id")||"");
 const kind=String(data.get("kind")||"note");
 const title=String(data.get("title")||"").trim();
 const details=String(data.get("details")||"").trim();
 if(!validId(id)||!["note","email","call","interview","assessment","follow_up","status_change","other"].includes(kind)||!title||title.length>200||details.length>20000)throw new Error("Attività non valida");
 const response=await supabase("/rest/v1/application_activities",{method:"POST",headers:{Prefer:"return=minimal"},body:JSON.stringify({application_id:id,kind,title,details:details||null})},token);
 if(!response.ok)throw new Error("Impossibile aggiungere l'attività");
 revalidatePath("/dashboard/"+id);
}


type ChildTable="application_contacts"|"application_interviews"|"application_tasks";
const childTables:ChildTable[]=["application_contacts","application_interviews","application_tasks"];
export async function addTrackerRecord(data:FormData){
 const {token}=await requireSession();
 const table=String(data.get("table")||"") as ChildTable;
 const application_id=String(data.get("application_id")||"");
 if(!childTables.includes(table)||!validId(application_id))throw new Error("Dati non validi");
 const field=(name:string,max:number)=>String(data.get(name)||"").trim().slice(0,max);
 const payload:Record<string,unknown>={application_id};
 if(table==="application_contacts"){
  payload.full_name=field("full_name",200);
  payload.role=field("role",160)||null;
  payload.email=field("email",254)||null;
  payload.phone=field("phone",60)||null;
  payload.notes=field("notes",3000)||null;
  if(!payload.full_name)throw new Error("Nome obbligatorio");
 }else if(table==="application_interviews"){
  payload.title=field("title",200);
  payload.interview_type=field("interview_type",20)||"hr";
  payload.scheduled_at=field("scheduled_at",30)||null;
  payload.participants=field("participants",3000)||null;
  payload.meeting_url=field("meeting_url",2048)||null;
  payload.questions=field("questions",12000)||null;
  payload.feedback=field("feedback",12000)||null;
  payload.notes=field("notes",12000)||null;
  if(!payload.title||!["hr","technical","manager","case","other"].includes(String(payload.interview_type)))throw new Error("Colloquio non valido");
  if(payload.scheduled_at){const parsed=new Date(String(payload.scheduled_at));if(Number.isNaN(parsed.getTime()))throw new Error("Data non valida");payload.scheduled_at=parsed.toISOString();}
  if(payload.meeting_url){try{const u=new URL(String(payload.meeting_url));if(!["http:","https:"].includes(u.protocol))throw Error();}catch{throw new Error("Link non valido");}}
 }else{
  payload.title=field("title",200);
  payload.due_on=field("due_on",10)||null;
  if(!payload.title||payload.due_on&&!/^\d{4}-\d{2}-\d{2}$/.test(String(payload.due_on)))throw new Error("Attività non valida");
 }
 const response=await supabase("/rest/v1/"+table,{method:"POST",headers:{Prefer:"return=minimal"},body:JSON.stringify(payload)},token);
 if(!response.ok)throw new Error("Salvataggio non riuscito");
 revalidatePath("/dashboard/"+application_id);
 revalidatePath("/dashboard");
}
export async function deleteTrackerRecord(data:FormData){
 const {token}=await requireSession();
 const table=String(data.get("table")||"") as ChildTable;
 const id=String(data.get("id")||"");
 const application_id=String(data.get("application_id")||"");
 if(!childTables.includes(table)||!validId(id)||!validId(application_id))throw new Error("Dati non validi");
 const response=await supabase("/rest/v1/"+table+"?id=eq."+encodeURIComponent(id)+"&application_id=eq."+encodeURIComponent(application_id),{method:"DELETE",headers:{Prefer:"return=representation"}},token);
 if(!response.ok)throw new Error("Eliminazione non riuscita");
 const rows=await response.json() as unknown[];
 if(rows.length!==1)throw new Error("Elemento non trovato");
 revalidatePath("/dashboard/"+application_id);
 revalidatePath("/dashboard");
}
export async function toggleTrackerTask(data:FormData){
 const {token}=await requireSession();
 const id=String(data.get("id")||"");
 const application_id=String(data.get("application_id")||"");
 const completed=String(data.get("completed"))==="true";
 if(!validId(id)||!validId(application_id))throw new Error("Attività non valida");
 const response=await supabase("/rest/v1/application_tasks?id=eq."+encodeURIComponent(id)+"&application_id=eq."+encodeURIComponent(application_id),{method:"PATCH",headers:{Prefer:"return=representation"},body:JSON.stringify({completed})},token);
 if(!response.ok)throw new Error("Aggiornamento non riuscito");
 const rows=await response.json() as unknown[];
 if(rows.length!==1)throw new Error("Attività non trovata");
 revalidatePath("/dashboard/"+application_id);
 revalidatePath("/dashboard");
}
