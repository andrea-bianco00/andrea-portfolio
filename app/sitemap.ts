import type { MetadataRoute } from "next";
import { projects } from "./project-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://andrea-bianco.com";
  const paths = ["", "/progetti", "/ricerca", "/about", "/cv", ...projects.map((project) => `/progetti/${project.slug}`)];
  return paths.map((path) => ({ url: `${baseUrl}${path}`, changeFrequency: path ? "monthly" : "weekly", priority: path === "" ? 1 : path === "/progetti" ? 0.9 : 0.7 }));
}
