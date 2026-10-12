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
