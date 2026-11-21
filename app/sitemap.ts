import type { MetadataRoute } from "next";
import { projects } from "./project-data";
import { getSiteVisibility } from "./site-visibility";

export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://andrea-bianco.com";
  const visibility = await getSiteVisibility();
  const paths = ["", "/ricerca", "/about", "/cv"];
  if(visibility["page:progetti"]===true) {
    paths.push("/progetti");
    for (const project of projects) {
      if(visibility["project:"+project.slug]===true)paths.push("/progetti/"+project.slug);
    }
  }
  if(visibility["page:certificazioni"]===true)paths.push("/certificazioni");
  return paths.map(path => ({url:baseUrl+path,changeFrequency:path?"monthly":"weekly",priority:path===""?1:path==="/progetti"?0.9:0.7}));
}
