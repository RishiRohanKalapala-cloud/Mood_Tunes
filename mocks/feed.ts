import { FeedItem, Track } from "@/types";

const sampleTracks: Track[] = [
  { id: "s1", title: "Sunlit Roads", artist: "Aria Lane", durationSec: 185 },
  { id: "s2", title: "Calm Currents", artist: "Riverlight", durationSec: 201 },
  { id: "s3", title: "Midnight Neon", artist: "Pulse City", durationSec: 172 },
];

export const FEED_ITEMS: FeedItem[] = [
  { id: "f1", title: "Happy Boost", tracks: sampleTracks, likes: 23, moodTag: "😊", popularity: 76 },
  { id: "f2", title: "Deep Focus", tracks: sampleTracks, likes: 45, moodTag: "😌", popularity: 88 },
  { id: "f3", title: "Night Chill", tracks: sampleTracks, likes: 12, moodTag: "😴", popularity: 52 },
];