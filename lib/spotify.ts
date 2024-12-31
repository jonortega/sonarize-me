import { User, Track, Artist, Genre } from "@/lib/types";

export async function getUserStats(): Promise<{
  user: User;
  topTracks: Track[];
  topArtists: Artist[];
  topGenres: Genre[];
}> {
  // Mock data for preview
  return {
    user: {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      imageUrl: "https://i.pravatar.cc/300",
    },
    topTracks: [
      { id: "1", name: "Shape of You", artist: "Ed Sheeran", albumArtUrl: "https://i.pravatar.cc/300?img=1" },
      { id: "2", name: "Blinding Lights", artist: "The Weeknd", albumArtUrl: "https://i.pravatar.cc/300?img=2" },
      { id: "3", name: "Dance Monkey", artist: "Tones and I", albumArtUrl: "https://i.pravatar.cc/300?img=3" },
      { id: "4", name: "Someone You Loved", artist: "Lewis Capaldi", albumArtUrl: "https://i.pravatar.cc/300?img=4" },
      { id: "5", name: "Watermelon Sugar", artist: "Harry Styles", albumArtUrl: "https://i.pravatar.cc/300?img=5" },
    ],
    topArtists: [
      { id: "1", name: "Ed Sheeran", imageUrl: "https://i.pravatar.cc/300?img=6" },
      { id: "2", name: "The Weeknd", imageUrl: "https://i.pravatar.cc/300?img=7" },
      { id: "3", name: "Dua Lipa", imageUrl: "https://i.pravatar.cc/300?img=8" },
      { id: "4", name: "Post Malone", imageUrl: "https://i.pravatar.cc/300?img=9" },
      { id: "5", name: "Ariana Grande", imageUrl: "https://i.pravatar.cc/300?img=10" },
    ],
    topGenres: [{ name: "Pop" }, { name: "Rock" }, { name: "Hip-Hop" }, { name: "R&B" }, { name: "Electronic" }],
  };
}
