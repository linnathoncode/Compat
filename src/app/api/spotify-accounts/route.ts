import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { spotifyAccounts } from "~/server/db/schema";

export async function GET() {
  const allSpotifyAccounts = await db.select().from(spotifyAccounts);
  return NextResponse.json(allSpotifyAccounts);
}
