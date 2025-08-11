import React, { memo, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Play, Pause } from "lucide-react-native";
import Colors from "@/constants/colors";
import { Track } from "@/types";

type Props = {
  track: Track;
  index: number;
  testID?: string;
};

export const PlaylistList = memo(function PlaylistList({ track, index, testID }: Props) {
  const [playing, setPlaying] = useState<boolean>(false);
  const durationText = useMemo(() => `${Math.floor(track.durationSec / 60)}:${(track.durationSec % 60).toString().padStart(2, "0")}`, [track.durationSec]);

  return (
    <View style={styles.row} testID={testID}>
      <Text style={styles.index}>{index + 1}</Text>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{track.title}</Text>
        <Text style={styles.artist} numberOfLines={1}>{track.artist}</Text>
      </View>
      <Text style={styles.duration}>{durationText}</Text>
      <Pressable
        onPress={() => setPlaying(!playing)}
        style={({ pressed }) => [styles.playBtn, pressed && styles.pressed]}
        testID={`play-toggle-${track.id}`}
      >
        {playing ? <Pause color={Colors.light.tint} /> : <Play color={Colors.light.tint} />}
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  row: { backgroundColor: "#fff", padding: 12, borderRadius: 12, flexDirection: "row", alignItems: "center", gap: 12 },
  index: { width: 20, textAlign: "center", color: "#9CA3AF", fontWeight: "700" },
  info: { flex: 1 },
  title: { color: "#111827", fontWeight: "800" },
  artist: { color: "#6b7280" },
  duration: { color: "#6b7280", width: 48, textAlign: "right" },
  playBtn: { padding: 8, borderRadius: 10, backgroundColor: "#f2f4f7" },
  pressed: { opacity: 0.85 },
});