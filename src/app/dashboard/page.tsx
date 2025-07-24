"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PlaylistInputForm from "~/components/PlaylistInputForm";
// import TextField from "~/components/TextField";
import { useAuth } from "~/context/AuthContext";
import usePlaylistData from "~/hooks/usePlaylistData";

export default function HomePage() {
  const router = useRouter();
  const { status } = useAuth();

  const [playlistId, setPlaylistId] = useState<string | null>(null);
  const { data, source, isLoading, error } = usePlaylistData(playlistId);

  useEffect(() => {
    console.log(status);
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [router, status]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-[#000000f9] to-[#1e152c] pt-12 text-white">
      <PlaylistInputForm
        isLoading={isLoading}
        onSubmit={(id) => setPlaylistId(id)}
      />
    </main>
  );
}
