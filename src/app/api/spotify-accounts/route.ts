import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { ADMIN_EMAILS } from "~/lib/constants";
import { db } from "~/server/db";
import { spotifyAccounts } from "~/server/db/schema";

export async function GET() {
  const session = await getServerSession();
  if (!session || !ADMIN_EMAILS.includes(session.user?.email ?? "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const allSpotifyAccounts = await db.select().from(spotifyAccounts);
  return NextResponse.json(allSpotifyAccounts);
}
