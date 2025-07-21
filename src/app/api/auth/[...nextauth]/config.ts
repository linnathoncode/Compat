import SpotifyProvider from "next-auth/providers/spotify";
import type { NextAuthOptions } from "next-auth";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { spotifyAccounts, users } from "~/server/db/schema";

// extend nextauth types to include session and jwt properties
declare module "next-auth" {
  interface Session {
    user: {
      name?: string;
      email: string;
    };
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    userId: string;
    spotifyId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    userId: string;
    spotifyId?: string;
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
    async signIn({ user, account }) {
      // Deny login if any critical info is missing
      if (!user.email || !account?.access_token || !account?.refresh_token) {
        console.log("info missing");
        return false;
      }

      // 1 - Find existingUser (if exists)
      let existingUser = await db.query.users.findFirst({
        where: eq(users.email, user.email),
      });

      // 2 - Create user if not exists
      // Id is created randomly on call and createdAt is default.now()
      if (!existingUser) {
        await db.insert(users).values({
          email: user.email,
        });

        // Query the database again to get the newly created user's id and email
        existingUser = await db.query.users.findFirst({
          where: eq(users.email, user.email),
          columns: {
            id: true,
            email: true,
            createdAt: true,
          },
        });
      }

      // 3 - Insert Spotify Account info
      if (!existingUser?.id) {
        throw new Error(
          "User ID is missing when inserting Spotify account info.",
        );
      }
      await db
        .insert(spotifyAccounts)
        .values({
          userId: existingUser.id,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          spotifyId: account.providerAccountId,
          expiresAt: new Date(
            account.expires_at ? account.expires_at * 1000 : Date.now(),
          ),
          scope: account.scope,
          tokenType: account.token_type,
        })
        .onConflictDoUpdate({
          target: spotifyAccounts.userId,
          set: {
            accessToken: account.access_token,
            spotifyId: account.providerAccountId,
            refreshToken: account.refresh_token,
            expiresAt: new Date(account.expires_at! * 1000),
            scope: account.scope ?? "",
            tokenType: account.token_type ?? "",
          },
        });
      return true;
    },

    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
        token.userId = account.userId!;
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
      if (typeof token.userId === "string") {
        session.userId = token.userId;
      }
      if (typeof token.spotifyId === "string") {
        session.spotifyId = token.spotifyId;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
