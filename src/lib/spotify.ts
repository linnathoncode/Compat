export async function getSpotifyPlaylist(
  playlistId: string,
  accessToken: string,
) {
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
    const errorData = await response.json();
    throw new Error(`Failed to fetch playlist: ${errorData.error?.message}`);
  }

  const data = await response.json();
  return data;
}
