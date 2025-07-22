import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getPlaylistForBackup, refreshAccessToken } from "~/lib/spotify";
import { getServerSession } from "next-auth";
// import { AuthOptions } from "next-auth";
import { backups } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";
import { db } from "~/server/db";
import { authOptions } from "../../auth/[...nextauth]/config";

async function getBackupFromDatabase(playlistId: string, userId: string) {
  try {
    const existingBackup = await db
      .select()
      .from(backups)
      .where(
        and(eq(backups.playlistId, playlistId), eq(backups.userId, userId)),
      )
      .limit(1);

    return existingBackup.length > 0 ? existingBackup[0] : null;
  } catch (error) {
    console.error("Database query failed", error);
    return null;
  }
}

async function fetchPlaylistWithRetry(
  playlistId: string,
  initialAccessToken: string,
  refreshToken: string | undefined,
) {
  try {
    const playlistData = await getPlaylistForBackup(
      playlistId,
      initialAccessToken,
    );
    return { playlistData, tokenRefreshed: false };
  } catch (error: unknown) {
    // Check if error is due to expired token
    const isTokenExpired =
      typeof error === "object" &&
      error !== null &&
      "message" in error &&
      typeof (error as { message: unknown }).message === "string" &&
      ((error as { message: string }).message.includes("401") ||
        (error as { message: string }).message.includes(
          "The access token expired",
        ) ||
        (error as { message: string }).message.includes(
          "Invalid access token",
        ));

    if (!isTokenExpired || !refreshToken) {
      throw error; // Re-throw if not a token issue or no refresh token
    }
    console.log("Access token expired, attempting refresh...");
    try {
      // Attempt to refresh the token
      const clientId = process.env.SPOTIFY_CLIENT_ID!;
      const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;

      if (!clientId || !clientSecret) {
        throw new Error("Spotify client credentials not configured");
      }

      const tokenResponse = await refreshAccessToken(
        refreshToken,
        clientId,
        clientSecret,
      );

      // TO:DO UPDATE THE SESSION AND DATABASE WITH NEW TOKENS
      // This might require a custom session update mechanism
      console.warn(
        "Token refreshed but session not updated - user may need to re-authenticate on next request",
      );

      // Retry the original request with new token
      const playlistData = await getPlaylistForBackup(
        playlistId,
        tokenResponse.access_token,
      );
      return {
        playlistData,
        tokenRefreshed: true,
        newAccessToken: tokenResponse.access_token,
        newRefreshToken: tokenResponse.refresh_token,
      };
    } catch (refreshError) {
      console.error("Token refresh failed:", refreshError);
      throw new Error(
        "Authentication failed - please re-connect your Spotify account",
      );
    }
  }
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const params = await context.params;
  const session = await getServerSession(authOptions);

  if (!session?.userId) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  const userId = session.userId;
  const playlistId = params.id;
  const accessToken = session.accessToken;
  const refreshToken = session.refreshToken;

  try {
    // First, check if backup exists in database
    console.log("Checking database for existing backup...");
    const existingBackup = await getBackupFromDatabase(playlistId, userId);

    if (existingBackup) {
      console.log("Found existing backup in database");
      return NextResponse.json({
        source: "database",
        data: {
          playlistId: existingBackup.playlistId,
          playlistName: existingBackup.playlistName,
          playlistData: existingBackup.playlistData,
          ownerName: existingBackup.ownerName,
          trackCount: existingBackup.trackCount,
          spotifyUrl: existingBackup.spotifyUrl,
          imageUrl: existingBackup.imageUrl,
          createdAt: existingBackup.createdAt,
          updatedAt: existingBackup.updatedAt,
        },
      });
    }

    // No backup found in database, fetch from Spotify API
    console.log("No backup found in database, fetching from Spotify...");

    if (!accessToken) {
      return NextResponse.json(
        { error: "Missing Spotify access token" },
        { status: 401 },
      );
    }

    const result = await fetchPlaylistWithRetry(
      playlistId,
      accessToken,
      refreshToken,
    );

    return NextResponse.json({
      source: "spotify",
      data: result.playlistData,
      tokenRefreshed: result.tokenRefreshed,
      ...(result.tokenRefreshed && {
        newTokens: {
          accessToken: result.newAccessToken,
          refreshToken: result.newRefreshToken,
        },
      }),
    });
  } catch (error: unknown) {
    console.error("Playlist fetch error:", error);

    // Return appropriate error response
    if (
      typeof error === "object" &&
      error !== null &&
      "message" in error &&
      typeof (error as { message: unknown }).message === "string"
    ) {
      const message = (error as { message: string }).message;
      if (message.includes("User not found")) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      if (message.includes("Authentication failed")) {
        return NextResponse.json(
          { error: message, requiresReauth: true },
          { status: 401 },
        );
      }
    }

    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
