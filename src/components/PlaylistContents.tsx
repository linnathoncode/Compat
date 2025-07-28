import type { PlaylistContentsProps } from "~/types/PlaylistContentsProps";
type Props = {
  tracks: PlaylistContentsProps[];
};

const PlaylistContents = ({ tracks }: Props) => {
  return (
    <div className="2x1 relative m-0 mx-auto flex w-240 max-w-3xl flex-col gap-2 rounded-lg border border-purple-950 bg-black p-4 shadow-md">
      {tracks.map((track, index) => (
        <div
          key={index}
          className="flex items-center gap-0 rounded bg-purple-950/10 px-3 py-1"
        >
          <div className="mr-3 font-bold text-purple-400">{index + 1}.</div>
          <div className="flex-1">
            <h3 className="m-0 text-base font-semibold text-purple-100">
              {track.trackName}
            </h3>
            <p className="m-0 text-xs text-purple-300">
              Album: {track.albumName}
            </p>
            <p className="m-0 text-xs text-purple-300">
              Artists: {track.artists.join(", ")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlaylistContents;
