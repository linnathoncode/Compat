"use client";

import Link from "next/link";
import { useState } from "react";
import type { PlaylistContentsProps } from "~/types/PlaylistContentsProps";
import type { PlaylistDisplayCardProps } from "~/types/PlaylistDisplayCardProps";
import PlaylistContents from "./PlaylistContents";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  data: PlaylistDisplayCardProps;
  source: string;
};

const PlaylistDisplayCard = ({ data, source }: Props) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  if (data.trackCount == 0) return null;

  function mapSpotifyTracksToProps(
    data: PlaylistDisplayCardProps,
  ): PlaylistContentsProps[] {
    return data.playlistData.tracks.items.map((item) => ({
      trackName: item.track.name,
      albumName: item.track.album.name,
      artists: item.track.artists.map((a) => a.name),
    }));
  }

  return (
    <>
      <div className="2x1 relative m-10 flex w-240 max-w-3xl items-center gap-6 rounded-lg border border-purple-950 bg-[#1e152c] p-6 shadow-md">
        {/* Tick Indicator */}
        <button
          className="absolute top-4 left-4 flex h-8 w-8 items-center justify-center rounded-full bg-purple-900 transition-colors hover:bg-purple-700"
          title="Toggle saved state"
          onClick={() => {
            // Trigger save/unsave event (logic not implemented)
          }}
          type="button"
        >
          {/* Saved state: show tick, Not saved: show empty circle */}
          {/* Replace 'true' with actual saved state */}
          {true ? (
            <svg
              className="h-5 w-5 text-green-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="9" />
            </svg>
          )}
        </button>
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
        {/* Collapse/Decollapse Button */}
        <button
          className="absolute right-4 bottom-4 flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-purple-700"
          title="Collapse/Expand"
          type="button"
          onClick={() => setIsCollapsed((prev) => !prev)}
        >
          {/* Icon: Down arrow for collapse, up arrow for expand */}
          {isCollapsed ? (
            // Up arrow (expanded)
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 15l7-7 7 7"
              />
            </svg>
          ) : (
            // Down arrow (collapsed)
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          )}
        </button>
      </div>
      {/* PlaylistContents below the display card */}
      <AnimatePresence>
        {isCollapsed && (
          <motion.div
            key="playlist-contents"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.3 }}
          >
            <PlaylistContents tracks={mapSpotifyTracksToProps(data)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
export default PlaylistDisplayCard;
