import { auth, signOut } from "@/auth";

export default async function AdminPage() {
  const session = await auth();

  return (
    <main className="min-h-screen bg-[#14110f] px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <header className="border-b border-white/10 pb-8">
          <p className="text-sm uppercase tracking-[0.35em] text-orange-400">
            Andrea Bianco
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
            Private Dashboard
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-neutral-300">
            Area privata del portfolio. Qui raccoglieremo analytics, sviluppo,
            dominio, documenti, AI tools e monitoring.
          </p>

          <p className="mt-4 text-xs text-neutral-500">
            Logged in as {session?.user?.githubUsername ?? session?.user?.name}
          </p>

          <form
            className="mt-6"
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="rounded-full border border-white/15 px-5 py-2 text-sm text-neutral-200 transition hover:border-orange-400 hover:text-orange-300"
            >
              Logout
            </button>
          </form>
        </header>

        <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-xl font-medium text-orange-300">
            Setup completato
          </h2>

          <p className="mt-3 text-sm leading-6 text-neutral-300">
            Se vedi questa pagina dopo il login GitHub, significa che
            l'autenticazione privata funziona.
          </p>
        </section>
      </div>
    </main>
  );
}
