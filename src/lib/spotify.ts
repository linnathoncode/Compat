interface SpotifyApiError {
  error?: {
    status?: number;
    message?: string;
  };
}

interface SpotifyUser {
  id: string;
  display_name: string | null;
  external_urls: {
    spotify: string;
  };
}

interface SpotifyImage {
  url: string;
  height: number | null;
  width: number | null;
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{
    id: string;
    name: string;
    external_urls: {
      spotify: string;
    };
  }>;
  album: {
    id: string;
    name: string;
    images: SpotifyImage[];
  };
  duration_ms: number;
  external_urls: {
    spotify: string;
  };
}

interface SpotifyPlaylistTrack {
  added_at: string;
  added_by: SpotifyUser;
  is_local: boolean;
  track: SpotifyTrack | null;
}

interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string | null;
  public: boolean;
  collaborative: boolean;
  owner: SpotifyUser;
  followers: {
    total: number;
  };
  images: SpotifyImage[];
  tracks: {
    total: number;
    items: SpotifyPlaylistTrack[];
  };
  external_urls: {
    spotify: string;
  };
  snapshot_id: string;
}

interface PlaylistBackupData {
  playlistId: string;
  playlistName: string;
  playlistData: SpotifyPlaylist;
  ownerName: string;
  trackCount: number;
  spotifyUrl: string;
  imageUrl: string | null;
}
interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token?: string;
}

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

export async function getPlaylistForBackup(
  playlistId: string,
  accessToken: string,
): Promise<PlaylistBackupData> {
  const playlist = await getSpotifyPlaylist(playlistId, accessToken);

  return {
    playlistId: playlist.id,
    playlistName: playlist.name,
    playlistData: playlist,
    ownerName: playlist.owner.display_name || playlist.owner.id,
    trackCount: playlist.tracks.total,
    spotifyUrl: playlist.external_urls.spotify,
    imageUrl: playlist.images.length > 0 ? playlist.images[0]!.url : null,
  };
}

export async function refreshAccessToken(
  refreshToken: string,
  clientId: string,
  clientSecret: string,
): Promise<SpotifyTokenResponse> {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }).toString(),
  });

  if (!response.ok) {
    const errorData = (await response.json()) as SpotifyApiError;
    throw new Error(
      `Failed to refresh access token: ${errorData.error?.message}`,
    );
  }

  const data = (await response.json()) as SpotifyTokenResponse;
  return data;
}
