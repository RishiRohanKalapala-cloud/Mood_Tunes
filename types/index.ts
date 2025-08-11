export const EMOJIS = ["😀", "😊", "😐", "😔", "😡", "😴", "🤩", "😌", "😢", "🥳"] as const;
export type Emoji = typeof EMOJIS[number];

export type Track = {
  id: string;
  title: string;
  artist: string;
  durationSec: number;
};

export type Playlist = {
  id: string;
  name: string;
  tracks: Track[];
};

export type SavedPlaylist = Playlist & { id: string };

export type MoodInput = {
  emoji?: Emoji;
  journal?: string;
  energy: number;
  valence: number;
  heartRate?: number;
};

export type FeedItem = {
  id: string;
  title: string;
  tracks: Track[];
  likes: number;
  moodTag: Emoji;
  popularity: number;
};