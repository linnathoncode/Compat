import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import type { NextAuthOptions } from "next-auth";
// import type { Session } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  }
}

const authOptions: NextAuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization:
        "https://accounts.spotify.com/authorize?" +
        new URLSearchParams({
          scope: [
            "user-read-email",
            "playlist-read-private",
            "playlist-modify-public",
            "playlist-modify-private",
          ].join(" "),
        }).toString(),
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        ((token.accessToken = account.access_token),
          (token.refreshToken = account.refresh_token),
          (token.expiresAt = account.expires_at));
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string | undefined;
      session.refreshToken = token.refreshToken as string | undefined;
      session.expiresAt = token.expiresAt as number | undefined;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
