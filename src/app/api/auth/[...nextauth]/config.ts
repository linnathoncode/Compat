import SpotifyProvider from "next-auth/providers/spotify";
import type { NextAuthOptions } from "next-auth";

// extend nextauth types to include session and jwt properties
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: [
            "user-read-email",
            "playlist-read-private",
            "playlist-modify-public",
            "playlist-modify-private",
          ].join(" "),
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
      }
      return token;
    },
    async session({ session, token }) {
      if (typeof token.accessToken === "string") {
        session.accessToken = token.accessToken;
      }
      if (typeof token.refreshToken === "string") {
        session.refreshToken = token.refreshToken;
      }
      if (typeof token.expiresAt === "number") {
        session.expiresAt = token.expiresAt;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
