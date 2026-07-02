import { signIn } from "@/auth";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-6 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
        <p className="text-sm uppercase tracking-[0.3em] text-orange-400">
          Private Area
        </p>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          Admin Dashboard
        </h1>

        <p className="mt-3 text-sm leading-6 text-neutral-300">
          Accesso riservato al proprietario del sito.
        </p>

        <form
          className="mt-8"
          action={async () => {
            "use server";
            await signIn("github", { redirectTo: "/admin" });
          }}
        >
          <button
            type="submit"
            className="w-full rounded-full bg-white px-5 py-3 text-sm font-medium text-neutral-950 transition hover:bg-orange-300"
          >
            Login with GitHub
          </button>
        </form>
      </div>
    </main>
  );
}
