import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";

export async function GET() {
  const allUsers = await db.select().from(users);
  return NextResponse.json(allUsers);
}

export async function POST() {
  const inserted = await db
    .insert(users)
    .values({
      email: "test",
    })
    .returning();
  return NextResponse.json(inserted);
}
