import React, { useCallback, useEffect, useMemo, useState } from "react";
import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FeedItem, MoodInput, Playlist, SavedPlaylist, Emoji } from "@/types";
import { FEED_ITEMS } from "@/mocks/feed";

type Wearable = {
  connected: boolean;
  heartRate: number;
};

type Settings = {
  shareAnonymously: boolean;
};

type FeedState = {
  items: FeedItem[];
  likes: Record<string, boolean>;
};

type ContextValue = {
  quickMoodEmoji?: Emoji;
  setQuickMoodEmoji: (e?: Emoji) => void;

  wearable?: Wearable;
  connectWearable: () => Promise<void>;
  disconnectWearable: () => void;

  mood: MoodInput;
  setMood: (m: MoodInput) => void;

  playlist: Playlist;
  setPlaylist: (p: Playlist) => void;

  savedPlaylists: SavedPlaylist[];
  savePlaylist: (p: Playlist) => void;

  shareToFeed: () => Promise<void>;

  settings: Settings;
  setSettings: (s: Settings) => void;

  feed: FeedState;
  toggleLike: (id: string) => void;
  saveFromFeed: (id: string) => void;
  filterFeed: (f: "all" | "popular" | "happy" | "calm") => FeedItem[];
};

const STORAGE_KEYS = {
  settings: "@moodtunes:settings",
  saved: "@moodtunes:saved",
} as const;

export const [AppStateProvider, useAppState] = createContextHook<ContextValue>(() => {
  const [quickMoodEmojiState, setQuickMoodEmojiState] = useState<Emoji | undefined>(undefined);
  const [wearable, setWearable] = useState<Wearable | undefined>(undefined);

  const [mood, setMood] = useState<MoodInput>({
    emoji: quickMoodEmojiState ?? ("😊" as const),
    journal: "",
    energy: 60,
    valence: 60,
    heartRate: undefined,
  });

  const [playlist, setPlaylist] = useState<Playlist>({
    id: "current",
    name: "Mood Tunes Mix",
    tracks: [],
  });

  const [savedPlaylists, setSavedPlaylists] = useState<SavedPlaylist[]>([]);
  const [settings, setSettings] = useState<Settings>({ shareAnonymously: true });
  const [feed, setFeed] = useState<FeedState>({ items: FEED_ITEMS, likes: {} });

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.settings)
      .then((raw) => {
        if (raw) {
          const s = JSON.parse(raw) as Settings;
          setSettings(s);
        }
      })
      .catch((e) => console.log("load settings error", e));
    AsyncStorage.getItem(STORAGE_KEYS.saved)
      .then((raw) => {
        if (raw) {
          const s = JSON.parse(raw) as SavedPlaylist[];
          setSavedPlaylists(s);
        }
      })
      .catch((e) => console.log("load saved error", e));
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings)).catch((e) => console.log("save settings error", e));
  }, [settings]);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.saved, JSON.stringify(savedPlaylists)).catch((e) => console.log("save saved playlists error", e));
  }, [savedPlaylists]);

  const connectWearable = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 800));
    const hr = 60 + Math.round(Math.random() * 60);
    setWearable({ connected: true, heartRate: hr });
    setMood((m) => ({ ...m, heartRate: hr }));
  }, []);

  const disconnectWearable = useCallback(() => {
    setWearable(undefined);
    setMood((m) => ({ ...m, heartRate: undefined }));
  }, []);

  const savePlaylist = useCallback((p: Playlist) => {
    const entry: SavedPlaylist = { ...p, id: `${Date.now()}` };
    setSavedPlaylists((prev) => [entry, ...prev]);
  }, []);

  const shareToFeed = useCallback(async () => {
    const newItem: FeedItem = {
      id: `${Date.now()}`,
      title: playlist.name,
      tracks: playlist.tracks,
      likes: 0,
      moodTag: mood.emoji ?? ("😐" as const),
      popularity: Math.round(Math.random() * 100),
    };
    setFeed((f) => ({ ...f, items: [newItem, ...f.items] }));
  }, [playlist, mood.emoji]);

  const toggleLike = useCallback((id: string) => {
    setFeed((f) => {
      const liked = f.likes[id] ?? false;
      const items = f.items.map((it) => (it.id === id ? { ...it, likes: it.likes + (liked ? -1 : 1) } : it));
      return { items, likes: { ...f.likes, [id]: !liked } };
    });
  }, []);

  const saveFromFeed = useCallback((id: string) => {
    setFeed((f) => {
      const it = f.items.find((x) => x.id === id);
      if (it) {
        const p: Playlist = { id: `saved-${id}`, name: it.title, tracks: it.tracks };
        const entry: SavedPlaylist = { ...p, id: `${Date.now()}` };
        setSavedPlaylists((prev) => [entry, ...prev]);
      }
      return f;
    });
  }, []);

  const filterFeed = useCallback(
    (filter: "all" | "popular" | "happy" | "calm") => {
      const base = [...feed.items];
      if (filter === "popular") return base.sort((a, b) => b.likes - a.likes);
      if (filter === "happy") return base.filter((i) => ["😀", "😊", "🤩", "🥳"].includes(i.moodTag));
      if (filter === "calm") return base.filter((i) => ["😌", "😴"].includes(i.moodTag));
      return base;
    },
    [feed.items]
  );

  const updateQuickMoodEmoji = useCallback((e?: Emoji) => {
    setQuickMoodEmojiState(e);
  }, []);

  const value: ContextValue = useMemo(
    () => ({
      quickMoodEmoji: quickMoodEmojiState,
      setQuickMoodEmoji: updateQuickMoodEmoji,
      wearable,
      connectWearable,
      disconnectWearable,
      mood,
      setMood,
      playlist,
      setPlaylist,
      savedPlaylists,
      savePlaylist,
      shareToFeed,
      settings,
      setSettings,
      feed,
      toggleLike,
      saveFromFeed,
      filterFeed,
    }),
    [
      quickMoodEmojiState,
      wearable,
      connectWearable,
      disconnectWearable,
      mood,
      playlist,
      savedPlaylists,
      savePlaylist,
      shareToFeed,
      settings,
      feed,
      toggleLike,
      saveFromFeed,
      filterFeed,
      updateQuickMoodEmoji,
    ]
  );

  return value;
});