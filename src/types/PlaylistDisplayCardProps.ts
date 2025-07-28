export type PlaylistDisplayCardProps = {
  playlistName: string;
  playlistData: {
    tracks: {
      items: SpotifyPlaylistItem[];
    };
  };
  ownerName: string;
  trackCount: number;
  spotifyUrl: string;
  imageUrl: string;
};

type SpotifyPlaylistItem = {
  track: SpotifyTrack;
};

type SpotifyTrack = {
  name: string;
  album: SpotifyAlbum;
  artists: SpotifyArtist[];
};

type SpotifyAlbum = {
  name: string;
};

type SpotifyArtist = {
  name: string;
};
