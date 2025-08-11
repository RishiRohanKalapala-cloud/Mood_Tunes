
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useMemo, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { HeartPulse, PlayCircle, Link as LinkIcon } from "lucide-react-native";
import Colors from "@/constants/colors";
import { MoodEmojiPicker } from "@/components/MoodEmojiPicker";
import { useAppState } from "@/providers/AppState";

export default function HomeScreen() {
  const router = useRouter();
  const { connectWearable, wearable, setQuickMoodEmoji, quickMoodEmoji } = useAppState();
  const [connecting, setConnecting] = useState<boolean>(false);
  const hrText = useMemo(() => (wearable?.connected ? `${wearable.heartRate} bpm` : "Not connected"), [wearable]);

  const onConnectWearable = useCallback(async () => {
    try {
      setConnecting(true);
      await connectWearable();
    } catch (e) {
      console.log("connect wearable error", e);
    } finally {
      setConnecting(false);
    }
  }, [connectWearable]);

  return (
    <View style={styles.container} testID="home-screen">
      <LinearGradient colors={[Colors.light.gradientStart, Colors.light.gradientEnd]} style={styles.hero} />
      <View style={styles.header}>
        <Text style={styles.title} testID="home-title">Mood Tunes</Text>
        <Text style={styles.subtitle}>Curate music that matches your vibe</Text>
      </View>

      <View style={styles.card} testID="quick-mood-card">
        <Text style={styles.cardTitle}>Quick mood</Text>
        <MoodEmojiPicker
          selected={quickMoodEmoji}
          onSelect={setQuickMoodEmoji}
          testID="home-emoji-picker"
        />
        <Pressable
          style={({ pressed }) => [styles.primaryBtn, pressed && styles.btnPressed]}
          onPress={() => router.push("/mood")}
          testID="go-mood-input"
        >
          <PlayCircle color="#fff" size={22} />
          <Text style={styles.primaryBtnText}>Open mood input</Text>
        </Pressable>
      </View>

      <View style={styles.row}>
        <View style={styles.cardSmall} testID="wearable-card">
          <View style={styles.rowHeader}>
            <HeartPulse color={wearable?.connected ? Colors.light.tint : "#666"} />
            <Text style={styles.cardTitle}>Wearable</Text>
          </View>
          <Text style={styles.metaText}>{hrText}</Text>
          <Pressable
            onPress={onConnectWearable}
            style={({ pressed }) => [styles.secondaryBtn, pressed && styles.btnPressed]}
            testID="connect-wearable"
          >
            <LinkIcon color={Colors.light.tint} size={18} />
            <Text style={styles.secondaryBtnText}>{connecting ? "Connecting..." : wearable?.connected ? "Reconnect" : "Connect"}</Text>
          </Pressable>
        </View>

        <View style={styles.cardSmall} testID="generate-card">
          <Text style={styles.cardTitle}>Generate</Text>
          <Text style={styles.metaText}>Build playlist from your mood</Text>
          <Pressable
            onPress={() => router.push("/playlist")}
            style={({ pressed }) => [styles.primaryBtn, pressed && styles.btnPressed]}
            testID="generate-playlist"
          >
            <PlayCircle color="#fff" size={22} />
            <Text style={styles.primaryBtnText}>Generate</Text>
          </Pressable>
        </View>
      </View>

      {Platform.OS !== "web" ? <View style={{ height: 16 }} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  hero: { position: "absolute", top: 0, left: 0, right: 0, height: 200 },
  header: { paddingTop: 28, paddingHorizontal: 20, paddingBottom: 12 },
  title: { fontSize: 28, fontWeight: "800", color: Colors.light.text },
  subtitle: { fontSize: 14, color: "#666", marginTop: 4 },
  card: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: Colors.light.text },
  row: { flexDirection: "row", gap: 12, paddingHorizontal: 16, marginTop: 12 },
  rowHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  cardSmall: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
    minHeight: 140,
    justifyContent: "space-between",
  },
  metaText: { color: "#6b7280", marginTop: 6 },
  primaryBtn: {
    backgroundColor: Colors.light.tint,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
  },
  primaryBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  secondaryBtn: {
    backgroundColor: "#f2f4f7",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
  },
  secondaryBtnText: { color: Colors.light.tint, fontWeight: "700", fontSize: 14 },
  btnPressed: { opacity: 0.85 },
});