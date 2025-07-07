import { all } from "axios";
import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { backups } from "~/server/db/schema";

export async function GET() {
  const allBackups = await db.select().from(backups);
  return NextResponse.json(allBackups);
}
