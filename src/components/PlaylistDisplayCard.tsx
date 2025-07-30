"use client";

import Link from "next/link";
import { useState } from "react";
import type { PlaylistContentsProps } from "~/types/PlaylistContentsProps";
import type { PlaylistDisplayCardProps } from "~/types/PlaylistDisplayCardProps";
import PlaylistContents from "./PlaylistContents";
import { AnimatePresence, motion } from "framer-motion";
import { useSaveBackup } from "~/hooks/useSaveBackup";
import { BasePlaylistCard } from "./BasePlaylistCard";

type Props = {
  data: PlaylistDisplayCardProps;
  source: string;
};

const PlaylistDisplayCard = ({ data, source }: Props) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { saveBackup, loading } = useSaveBackup();
  const [isPlaylistBackupLoading, setPlaylistBackupLoading] = useState(false);
  const [isPlaylistSaved, setPlaylistSaved] = useState(source === "database");

  async function handleSave() {
    await saveBackup({
      data: data,
      source: "database", //?????
    });
  }

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
      <BasePlaylistCard data={data} source={source}>
        <button
          className="absolute top-4 left-4 flex h-8 w-8 items-center justify-center rounded-full bg-purple-900 transition-colors hover:bg-purple-700"
          title="Toggle saved state"
          onClick={async () => {
            if (!isPlaylistSaved) {
              setPlaylistBackupLoading(true);
              console.log("saving to database");
              await handleSave();
              console.log("playlist saved to database");
            } else {
              //handle update logic
              console.log("playlist already in database");
            }
            setPlaylistSaved(true);
            setPlaylistBackupLoading(false);
          }}
          type="button"
          disabled={isPlaylistBackupLoading}
        >
          {isPlaylistSaved ? (
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
        {/* Collapse/Decollapse Button */}{" "}
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
      </BasePlaylistCard>
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
  // return (
  //   <>
  //     <div className="2x1 relative m-10 flex w-240 max-w-3xl items-center gap-6 rounded-lg border border-purple-950 bg-[#1e152c] p-6 shadow-md">
  //       {/* Tick Indicator */}
  //
  //
  //       {/* Collapse/Decollapse Button */}
  //       <button
  //         className="absolute right-4 bottom-4 flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-purple-700"
  //         title="Collapse/Expand"
  //         type="button"
  //         onClick={() => setIsCollapsed((prev) => !prev)}
  //       >
  //         {/* Icon: Down arrow for collapse, up arrow for expand */}
  //         {isCollapsed ? (
  //           // Up arrow (expanded)
  //           <svg
  //             className="h-5 w-5 text-white"
  //             fill="none"
  //             stroke="currentColor"
  //             strokeWidth={2.5}
  //             viewBox="0 0 24 24"
  //           >
  //             <path
  //               strokeLinecap="round"
  //               strokeLinejoin="round"
  //               d="M5 15l7-7 7 7"
  //             />
  //           </svg>
  //         ) : (
  //           // Down arrow (collapsed)
  //           <svg
  //             className="h-5 w-5 text-white"
  //             fill="none"
  //             stroke="currentColor"
  //             strokeWidth={2.5}
  //             viewBox="0 0 24 24"
  //           >
  //             <path
  //               strokeLinecap="round"
  //               strokeLinejoin="round"
  //               d="M19 9l-7 7-7-7"
  //             />
  //           </svg>
  //         )}
  //       </button>
  //     </div>
  //     {/* PlaylistContents below the display card */}
  //     <AnimatePresence>
  //       {isCollapsed && (
  //         <motion.div
  //           key="playlist-contents"
  //           initial={{ opacity: 0, y: 16 }}
  //           animate={{ opacity: 1, y: 0 }}
  //           exit={{ opacity: 0, y: 16 }}
  //           transition={{ duration: 0.3 }}
  //         >
  //           <PlaylistContents tracks={mapSpotifyTracksToProps(data)} />
  //         </motion.div>
  //       )}
  //     </AnimatePresence>
  //   </>
  // );
};
export default PlaylistDisplayCard;
