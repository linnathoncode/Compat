import Link from "next/link";
import type { PlaylistDisplayCardProps } from "~/types/PlaylistDisplayCardProps";

type BaseProps = {
  data: PlaylistDisplayCardProps;
  source: string;
  children?: React.ReactNode; //used for injecting action buttons etc
};

export const BasePlaylistCard = ({ data, source, children }: BaseProps) => {
  return (
    <div className="2x1 relative m-10 flex w-240 max-w-3xl items-center gap-6 rounded-lg border border-purple-950 bg-[#1e152c] p-6 shadow-md">
      {children}
      {data.imageUrl && (
        <img
          src={data.imageUrl}
          alt={data.playlistName}
          width={180}
          height={180}
          className="rounded-sm object-cover"
        />
      )}
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold">{data.playlistName}</h2>
        <p className="text-lg text-zinc-300">Created by: {data.ownerName}</p>
        <p className="text-lg text-zinc-300">{data.trackCount} tracks</p>
        <p className="text-lg text-zinc-300">Source: {source}</p>
        {data.spotifyUrl && (
          <Link
            href={data.spotifyUrl}
            className="mt-2 text-sm text-green-600 hover:underline"
            target="_blank"
          >
            View on Spotify
          </Link>
        )}
      </div>
    </div>
  );
};
