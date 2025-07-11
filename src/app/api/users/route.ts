import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { ADMIN_EMAILS } from "~/lib/constants";
import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession();
  if (!session || !ADMIN_EMAILS.includes(session.user?.email ?? "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const allUsers = await db.select().from(users);
  return NextResponse.json(allUsers);
}

export async function POST() {
  const session = await getServerSession();

  if (!session || !ADMIN_EMAILS.includes(session.user?.email ?? "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const inserted = await db
    .insert(users)
    .values({
      email: "test",
    })
    .returning();
  return NextResponse.json(inserted);
}
