import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { backups } from "~/server/db/schema";
import { authOptions } from "../auth/[...nextauth]/config";
import { eq } from "drizzle-orm";

type CreateBackupBody = {
  playlistName: string;
  playlistData: unknown;
  ownerName?: string;
  trackCount: number;
  spotifyUrl: string;
  imageUrl?: string;
  format?: string;
  dataUrl?: string;
};

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userBackups = await db.query.backups.findMany({
    where: (row) => eq(row.userId, session.userId),
  });

  return NextResponse.json(userBackups);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  console.log(`userId: ${session?.userId}`);

  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as CreateBackupBody;

  const {
    playlistName,
    playlistData,
    ownerName,
    trackCount,
    spotifyUrl,
    imageUrl,
    format,
    dataUrl,
  } = body;

  try {
    const result = await db.insert(backups).values({
      userId: session.userId,
      playlistId: spotifyUrl.split("/").pop() ?? "",
      playlistName,
      playlistData,
      ownerName,
      trackCount,
      imageUrl,
      format: format ?? "json",
      dataUrl: dataUrl ?? null,
    });
    console.log(`userId: ${session.userId}`);

    return NextResponse.json({ success: true, result }, { status: 201 });
  } catch (err) {
    console.error("Failed to insert backup", err);
    return NextResponse.json(
      { error: "Database insert failed" },
      { status: 500 },
    );
  }
}
