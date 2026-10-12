import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
export const configured = Boolean(url && key);
export const cookieName = "andrea_job_session";

export async function supabase(path: string, init: RequestInit = {}, token?: string) {
  if (!url || !key) throw new Error("Supabase non configurato");
  return fetch(url + path, { ...init, cache: "no-store", headers: {
    apikey: key, Authorization: "Bearer " + (token || key),
    "Content-Type": "application/json", ...init.headers
  }});
}

export async function session() {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token || !configured) return null;
  const response = await supabase("/auth/v1/user", {}, token);
  if (!response.ok) return null;
  const user = await response.json() as {id:string;email?:string};
  return {token,user};
}

export async function requireSession() {
  const s = await session();
  if (!s) redirect("/dashboard/login");
  return s;
}
