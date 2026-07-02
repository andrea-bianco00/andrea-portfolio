import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.provider === "github" && profile) {
        const githubProfile = profile as {
          id?: number | string;
          login?: string;
        };

        token.githubId = String(githubProfile.id);
        token.githubUsername = githubProfile.login;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.githubId = token.githubId as string;
        session.user.githubUsername = token.githubUsername as string;
      }

      return session;
    },
  },
});