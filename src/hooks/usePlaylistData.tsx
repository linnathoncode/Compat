import { useEffect, useState } from "react";

export type Json =
  | string
  | number
  | boolean
  | null
  | Json[]
  | { [key: string]: Json };

export interface SpotifyApiResponse {
  source: string;
  data: Json;
  tokenRefreshed?: boolean;
  newTokens?: {
    accessToken: string;
    refreshToken: string;
  };
}

/**
 * playlistName: string;
  imageUrl?: string;
  trackCount: number;
  spotifyUrl?: string;
  source: string;
  ownerName: string;
 */

export default function usePlaylistData(playlistId: string | null) {
  const [data, setData] = useState<Json | null>(null);
  const [source, setSource] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!playlistId) return;
    const fetchedPlaylist = async () => {
      setLoading(true);
      setError(null);
      setData(null);
      setSource(null);

      try {
        const res = await fetch(`api/playlist/${playlistId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const json: unknown = await res.json();
        if (
          typeof json === "object" &&
          json != null &&
          "source" in json &&
          "data" in json
        ) {
          const parsed = json as SpotifyApiResponse;
          setData(parsed.data);
          setSource(parsed.source);
        } else {
          throw new Error("Invalid API response structure");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message ?? "Unknown error");
        } else {
          setError("Unknown error");
        }
      } finally {
        setLoading(false);
      }
    };
    void fetchedPlaylist();
  }, [playlistId]);

  // console.log(data);
  return { data, source, isLoading, error };
}
