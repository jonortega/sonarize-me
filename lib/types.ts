export interface User {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
}

export interface Track {
  id: string;
  name: string;
  artist: string;
  albumArtUrl: string;
}

export interface Artist {
  id: string;
  name: string;
  imageUrl: string;
}

export interface Genre {
  name: string;
}
