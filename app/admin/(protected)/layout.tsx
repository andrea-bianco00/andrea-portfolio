import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  const allowedGithubId = process.env.AUTH_ALLOWED_GITHUB_ID;

  if (!allowedGithubId || session.user.githubId !== allowedGithubId) {
    notFound();
  }

  return <>{children}</>;
}
