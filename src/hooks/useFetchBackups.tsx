import { useEffect, useState } from "react";
import type { PlaylistDisplayCardProps } from "~/types/PlaylistDisplayCardProps";

export default function useFetchBackups() {
  const [backups, setBackups] = useState<PlaylistDisplayCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBackups() {
      try {
        const res = await fetch("/api/backups");
        if (!res.ok) {
          throw new Error("Failed to fetch backups");
        }
        const data = (await res.json()) as PlaylistDisplayCardProps[]; // define type for this
        setBackups(data);
      } catch (err) {
        console.error(err);
        setError("Could not load backups");
      } finally {
        setLoading(false);
      }
    }
    void fetchBackups();
  }, []);

  return { backups, loading, error };
}
