"use client";

import { useRouter } from "next/navigation";
import { GridPlaylistCard } from "~/components/GridPlaylistCard";
import useFetchBackups from "~/hooks/useFetchBackups";

export default function HomePage() {
  const router = useRouter();
  const { backups, loading, error } = useFetchBackups();
  if (!loading) {
    backups.map((backup) => console.log(`playlistId: ${backup.playlistId}`));
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-[#000000f9] to-[#1e152c] bg-fixed pt-12 text-white">
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <div className="grid w-full max-w-5xl grid-cols-1 gap-6 px-4 md:grid-cols-2 lg:grid-cols-3">
          {backups.map((backup) => (
            <GridPlaylistCard
              key={backup.playlistId}
              {...backup}
              data={backup}
              source="backup"
            />
          ))}
        </div>
      )}
    </main>
  );
}
