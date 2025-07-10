import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getSpotifyPlaylist } from "~/lib/spotify";
import { getServerSession } from "next-auth";
import { authOptions } from "~/app/api/auth/[...nextauth]/config";
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const params = await context.params;
  const session = await getServerSession(authOptions);
  const accessToken = (session as { accessToken?: string } | null)?.accessToken;
  //   const accessToken = req.headers.get("Authorization")?.split("Bearer ")[1];
  console.log(accessToken);

  if (!accessToken) {
    return NextResponse.json(
      { error: "Missing access token" },
      { status: 401 },
    );
  }

  try {
    const playlist = await getSpotifyPlaylist(params.id, accessToken);
    return NextResponse.json(playlist);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
