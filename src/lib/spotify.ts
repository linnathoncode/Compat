interface SpotifyApiError {
  error?: {
    status?: number;
    message?: string;
  };
}

type SpotifyPlaylist = Record<string, unknown>;

export async function getSpotifyPlaylist(
  playlistId: string,
  accessToken: string,
): Promise<SpotifyPlaylist> {
  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    const errorData = (await response.json()) as SpotifyApiError;
    throw new Error(`Failed to fetch playlist: ${errorData.error?.message}`);
  }

  const data = (await response.json()) as SpotifyPlaylist;
  return data;
}
