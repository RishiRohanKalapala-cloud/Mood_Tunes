import React, { useCallback, useEffect } from "react";
import { Alert, FlatList, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Colors from "@/constants/colors";
import { useAppState } from "@/providers/AppState";
import { useMutation } from "@tanstack/react-query";
import { generatePlaylist } from "@/services/llm";
import { PlaylistList } from "@/components/PlaylistList";
import { Repeat, Save, Share2 } from "lucide-react-native";

export default function PlaylistScreen() {
  const { mood, setPlaylist, playlist, shareToFeed } = useAppState();

  const mutation = useMutation({
    mutationKey: ["generate-playlist", mood],
    mutationFn: () => generatePlaylist(mood),
    onSuccess: (tracks) => {
      setPlaylist({ id: "current", name: "Mood Tunes Mix", tracks });
    },
    onError: (e: unknown) => {
      console.log("generate error", e);
      Alert.alert("Could not generate playlist", "Please try again in a moment.");
    },
  });

  useEffect(() => {
    if (playlist.tracks.length === 0) {
      mutation.mutate();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onRegenerate = useCallback(() => mutation.mutate(), [mutation.mutate]);
  const onSave = useCallback(() => {
    Alert.alert("Saved", "Playlist saved to your profile.");
  }, []);
  const onShare = useCallback(async () => {
    await shareToFeed();
    Alert.alert("Shared", "Your playlist is now visible on the feed.");
  }, [shareToFeed]);

  return (
    <View style={styles.container} testID="playlist-screen">
      <View style={styles.headerRow}>
        <Text style={styles.title}>Mood Tunes Mix</Text>
        <View style={styles.headerActions}>
          <Pressable onPress={onRegenerate} style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]} testID="regenerate">
            <Repeat color={Colors.light.tint} />
          </Pressable>
          <Pressable onPress={onSave} style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]} testID="save-playlist">
            <Save color={Colors.light.tint} />
          </Pressable>
          <Pressable onPress={onShare} style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]} testID="share-playlist">
            <Share2 color={Colors.light.tint} />
          </Pressable>
        </View>
      </View>

      {mutation.isPending && playlist.tracks.length === 0 ? (
        <View style={styles.loadingBox}>
          <Text style={styles.loadingText}>Generating based on your mood...</Text>
        </View>
      ) : (
        <FlatList
          data={playlist.tracks}
          keyExtractor={(t) => t.id}
          renderItem={({ item, index }) => (
            <PlaylistList track={item} index={index} testID={`track-${index}`} />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          contentContainerStyle={{ padding: 16 }}
          testID="playlist-list"
        />
      )}

      {Platform.OS !== "web" ? <View style={{ height: 16 }} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16 },
  title: { fontSize: 20, fontWeight: "800", color: Colors.light.text },
  headerActions: { flexDirection: "row", gap: 8 },
  iconBtn: { padding: 8, borderRadius: 10, backgroundColor: "#f2f4f7" },
  pressed: { opacity: 0.8 },
  loadingBox: {
    margin: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: { color: "#6b7280" },
});