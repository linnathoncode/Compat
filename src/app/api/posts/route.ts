import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { posts } from "~/server/db/schema";

export async function GET() {
  const allPosts = await db.select().from(posts);
  return NextResponse.json(allPosts);
}

export async function POST() {
  const inserted = await db
    .insert(posts)
    .values({ name: "New Post" })
    .returning();
  return NextResponse.json(inserted);
}
