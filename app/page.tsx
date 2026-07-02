const languages = ["IT", "EN", "FR", "ES"];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#070504] text-[#F3E7D3]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <p className="text-sm font-bold tracking-[0.35em] text-[#FF7A1A]">
          ANDREA BIANCO
        </p>

        <div className="flex items-center gap-6 text-xs font-semibold tracking-widest text-[#A8927A]">
          <span>PROGETTI</span>
          <span>RICERCA</span>
          <span>BLOG</span>
          <span>CV</span>
          <div className="flex gap-2 text-[#F3E7D3]">
            {languages.map((lang) => (
              <button key={lang} className="hover:text-[#FF7A1A]">
                {lang}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <section className="mx-auto grid min-h-[80vh] max-w-7xl grid-cols-1 items-center gap-12 px-6 py-20 md:grid-cols-2">
        <div>
          <p className="mb-6 text-sm font-bold uppercase tracking-[0.35em] text-[#FF7A1A]">
            Data Science · Statistics · AI
          </p>

          <h1 className="text-6xl font-black uppercase leading-none tracking-tight md:text-8xl">
            Trasformo dati complessi in decisioni chiare.
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-[#A8927A]">
            Sono Andrea Bianco, data scientist e statistico. Costruisco modelli,
            analisi e strumenti per interpretare fenomeni complessi e generare
            valore attraverso i dati.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a className="rounded-full bg-[#FF7A1A] px-6 py-3 text-sm font-bold uppercase tracking-widest text-[#070504]">
              Vedi progetti
            </a>
            <a className="rounded-full border border-[#3A2418] px-6 py-3 text-sm font-bold uppercase tracking-widest text-[#F3E7D3]">
              Scarica CV
            </a>
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#3A2418] bg-[#111111] p-6">
          <div className="aspect-square rounded-[1.5rem] bg-gradient-to-br from-[#3A2418] via-[#070504] to-[#FF7A1A]" />
        </div>
      </section>
    </main>
  );
}