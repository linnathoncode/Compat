import { NextRequest, NextResponse } from "next/server";
import { getSpotifyPlaylist } from "~/lib/spotify";
import { getServerSession } from "next-auth";
import { authOptions } from "~/app/api/auth/[...nextauth]/route";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const params = await context.params;
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;
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
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
