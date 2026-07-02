import { auth, signOut } from "@/auth";

const sections = [
  {
    title: "Analytics",
    description: "Traffico, comportamento utenti, indicizzazione e monitoraggio.",
    links: [
      {
        name: "Google Analytics",
        href: "https://analytics.google.com/",
        note: "Visite, eventi, sorgenti traffico e utenti.",
      },
      {
        name: "Google Search Console",
        href: "https://search.google.com/search-console",
        note: "Indicizzazione Google, query, sitemap e problemi SEO.",
      },
      {
        name: "Microsoft Clarity",
        href: "https://clarity.microsoft.com/",
        note: "Heatmap, session recordings e comportamento utenti.",
      },
      {
        name: "Bing Webmaster",
        href: "https://www.bing.com/webmasters",
        note: "Indicizzazione su Bing e invio sitemap.",
      },
    ],
  },
  {
    title: "Development",
    description: "Codice, deploy, log e gestione tecnica del progetto.",
    links: [
      {
        name: "GitHub Repository",
        href: "https://github.com/andrea-bianco00/andrea-portfolio",
        note: "Repository principale del portfolio.",
      },
      {
        name: "Vercel Dashboard",
        href: "https://vercel.com/",
        note: "Deploy, domini, log, environment variables.",
      },
      {
        name: "Vercel Deployments",
        href: "https://vercel.com/andrea-bianco/andrea-portfolio/deployments",
        note: "Cronologia deploy e stato produzione.",
      },
      {
        name: "Vercel Logs",
        href: "https://vercel.com/andrea-bianco/andrea-portfolio/logs",
        note: "Errori, richieste e debug produzione.",
      },
    ],
  },
  {
    title: "Dominio e SEO",
    description: "Dominio, DNS, sitemap e strumenti di performance.",
    links: [
      {
        name: "Sito pubblico",
        href: "https://andrea-bianco.com",
        note: "Versione pubblica del portfolio.",
      },
      {
        name: "Porkbun",
        href: "https://porkbun.com/account/domains",
        note: "Gestione dominio andrea-bianco.com.",
      },
      {
        name: "Sitemap",
        href: "https://andrea-bianco.com/sitemap.xml",
        note: "Sitemap inviata ai motori di ricerca.",
      },
      {
        name: "Robots.txt",
        href: "https://andrea-bianco.com/robots.txt",
        note: "Regole di scansione per i crawler.",
      },
      {
        name: "PageSpeed Insights",
        href: "https://pagespeed.web.dev/",
        note: "Performance, SEO, accessibility e best practices.",
      },
      {
        name: "GTmetrix",
        href: "https://gtmetrix.com/",
        note: "Analisi tecnica della velocità del sito.",
      },
    ],
  },
  {
    title: "Documenti",
    description: "CV, materiali personali, tesi e documentazione.",
    links: [
      {
        name: "Google Drive",
        href: "https://drive.google.com/",
        note: "CV, documenti e materiali personali.",
      },
      {
        name: "Overleaf",
        href: "https://www.overleaf.com/project",
        note: "Tesi, CV LaTeX e documenti accademici.",
      },
      {
        name: "LinkedIn",
        href: "https://www.linkedin.com/",
        note: "Profilo professionale e networking.",
      },
    ],
  },
  {
    title: "AI Tools",
    description: "Strumenti di supporto per codice, ricerca, scrittura e studio.",
    links: [
      {
        name: "ChatGPT",
        href: "https://chatgpt.com/",
        note: "Codice, scrittura, ricerca e organizzazione.",
      },
      {
        name: "Claude",
        href: "https://claude.ai/",
        note: "Revisione testi e documenti lunghi.",
      },
      {
        name: "Gemini",
        href: "https://gemini.google.com/",
        note: "AI Google e supporto allo studio.",
      },
      {
        name: "Perplexity",
        href: "https://www.perplexity.ai/",
        note: "Ricerca web con fonti.",
      },
    ],
  },
];

export default async function AdminPage() {
  const session = await auth();

  return (
    <main className="min-h-screen bg-[#100c0a] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-8 border-b border-white/10 pb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.45em] text-orange-400">
              Andrea Bianco
            </p>

            <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-tight md:text-7xl">
              Admin Link Tree
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-6 text-neutral-300">
              Dashboard privata per gestire tutto ciò che ruota intorno al portfolio:
              analytics, sviluppo, dominio, SEO, documenti e strumenti di lavoro.
            </p>

            <p className="mt-4 text-xs text-neutral-500">
              Logged in as {session?.user?.githubUsername ?? session?.user?.name}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="https://andrea-bianco.com"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/15 px-5 py-2 text-sm text-neutral-200 transition hover:border-orange-400 hover:text-orange-300"
            >
              Public site
            </a>

            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="rounded-full bg-white px-5 py-2 text-sm font-medium text-neutral-950 transition hover:bg-orange-300"
              >
                Logout
              </button>
            </form>
          </div>
        </header>

        <div className="mt-10 grid gap-6">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-3xl border border-white/10 bg-white/[0.035] p-6"
            >
              <div className="mb-5">
                <h2 className="text-2xl font-semibold text-orange-300">
                  {section.title}
                </h2>

                <p className="mt-2 text-sm leading-6 text-neutral-400">
                  {section.description}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {section.links.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:-translate-y-1 hover:border-orange-400/70 hover:bg-orange-400/10"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-base font-semibold text-white">
                        {link.name}
                      </h3>

                      <span className="text-neutral-500 transition group-hover:text-orange-300">
                        ↗
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-neutral-400">
                      {link.note}
                    </p>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
