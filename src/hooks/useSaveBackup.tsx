import { useState } from "react";
import type { PlaylistDisplayCardProps } from "~/types/PlaylistDisplayCardProps";

type SavePlaylistBackupParams = {
  data: PlaylistDisplayCardProps;
  source: string;
};

export function useSaveBackup() {
  const [loading, setLoading] = useState(false);

  async function saveBackup({ data, source }: SavePlaylistBackupParams) {
    setLoading(true);
    try {
      const res = await fetch("api/backups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          format: "json",
          dataUrl: source, // ????
        }),
      });
      type ApiResponse = { error?: string };
      const json = (await res.json()) as ApiResponse;
      if (!res.ok) {
        throw new Error(
          (json && typeof json.error === "string" ? json.error : undefined) ??
            "Something went wrong (Playlist backup hook)",
        );
      }
      console.log("Playlist backedup successfully!");
    } catch (err) {
      console.error("Failed to save backup", err);
    } finally {
      setLoading(false);
    }
  }
  return { saveBackup, loading };
}
