import React, { useCallback, useMemo, useState } from "react";
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import Colors from "@/constants/colors";
import { MoodEmojiPicker } from "@/components/MoodEmojiPicker";
import { SliderControl } from "@/components/SliderControl";
import { useAppState } from "@/providers/AppState";
import { PlayCircle, Brain } from "lucide-react-native";

export default function MoodInputScreen() {
  const router = useRouter();
  const { mood, setMood, wearable } = useAppState();
  const [journal, setJournal] = useState<string>(mood.journal ?? "");
  const [energy, setEnergy] = useState<number>(mood.energy);
  const [valence, setValence] = useState<number>(mood.valence);

  const onSave = useCallback(() => {
    try {
      setMood({
        emoji: mood.emoji,
        journal: journal.trim(),
        energy,
        valence,
        heartRate: wearable?.connected ? wearable.heartRate : undefined,
      });
      router.push("/playlist");
    } catch (e) {
      console.log("save mood error", e);
      Alert.alert("Couldn't save mood", "Please try again");
    }
  }, [setMood, journal, energy, valence, wearable, mood.emoji, router]);

  const wearableInfo = useMemo(
    () => (wearable?.connected ? `Heart rate: ${wearable.heartRate} bpm` : "No wearable connected"),
    [wearable]
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} testID="mood-screen">
      <Text style={styles.title}>How are you feeling?</Text>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Emoji</Text>
        <MoodEmojiPicker
          selected={mood.emoji}
          onSelect={(e) => setMood({ ...mood, emoji: e })}
          testID="mood-emoji-picker"
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Journal</Text>
        <TextInput
          testID="journal-input"
          style={styles.input}
          placeholder="Write a short note about your mood..."
          placeholderTextColor="#9CA3AF"
          multiline
          value={journal}
          onChangeText={setJournal}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Sliders</Text>
        <SliderControl label="Energy" value={energy} onChange={setEnergy} testID="energy-slider" />
        <SliderControl label="Valence (sad ↔ happy)" value={valence} onChange={setValence} testID="valence-slider" />
        <View style={styles.wearableRow}>
          <Brain color="#6b7280" />
          <Text style={styles.wearableText}>{wearableInfo}</Text>
        </View>
      </View>

      <Pressable
        onPress={onSave}
        style={({ pressed }) => [styles.primaryBtn, pressed && styles.btnPressed]}
        testID="save-and-generate"
      >
        <PlayCircle color="#fff" size={22} />
        <Text style={styles.primaryBtnText}>Generate Playlist</Text>
      </Pressable>

      {Platform.OS !== "web" ? <View style={{ height: 24 }} /> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  content: { padding: 16, gap: 12 },
  title: { fontSize: 22, fontWeight: "800", color: Colors.light.text, marginTop: 8 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: Colors.light.text, marginBottom: 8 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
    minHeight: 100,
    color: Colors.light.text,
    textAlignVertical: "top",
  },
  wearableRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 12 },
  wearableText: { color: "#6b7280" },
  primaryBtn: {
    backgroundColor: Colors.light.tint,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 16,
    marginTop: 4,
  },
  primaryBtnText: { color: "#fff", fontWeight: "800", fontSize: 16, textAlign: "center" },
  btnPressed: { opacity: 0.9 },
});