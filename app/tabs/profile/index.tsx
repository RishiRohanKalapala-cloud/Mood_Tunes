import React from "react";
import { Alert, Pressable, StyleSheet, Switch, Text, View } from "react-native";
import Colors from "@/constants/colors";
import { useAppState } from "@/providers/AppState";

export default function ProfileScreen() {
  const { settings, setSettings, savedPlaylists, wearable, disconnectWearable } = useAppState();

  return (
    <View style={styles.container} testID="profile-screen">
      <View style={styles.card}>
        <Text style={styles.title}>Sharing</Text>
        <View style={styles.rowBetween}>
          <Text style={styles.label}>Share anonymously</Text>
          <Switch
            testID="toggle-anon"
            value={settings.shareAnonymously}
            onValueChange={(v) => setSettings({ ...settings, shareAnonymously: v })}
            trackColor={{ true: Colors.light.tintSoft, false: "#e5e7eb" }}
            thumbColor={settings.shareAnonymously ? Colors.light.tint : "#fff"}
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Wearable</Text>
        <Text style={styles.meta}>
          {wearable?.connected ? `Connected • ${wearable.heartRate} bpm` : "Not connected"}
        </Text>
        {wearable?.connected ? (
          <Pressable
            onPress={disconnectWearable}
            style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
            testID="disconnect-wearable"
          >
            <Text style={styles.btnText}>Disconnect</Text>
          </Pressable>
        ) : (
          <Text style={styles.metaSmall}>Connect from Home</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Saved Playlists</Text>
        {savedPlaylists.length === 0 ? (
          <Text style={styles.meta}>No saved playlists yet.</Text>
        ) : (
          savedPlaylists.map((p) => (
            <View key={p.id} style={styles.savedRow} testID={`saved-${p.id}`}>
              <Text style={styles.savedName}>{p.name}</Text>
              <Text style={styles.metaSmall}>{p.tracks.length} tracks</Text>
            </View>
          ))
        )}
        {savedPlaylists.length > 0 ? (
          <Pressable
            onPress={() => Alert.alert("Not implemented", "Manage saved playlists is coming soon")}
            style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
            testID="manage-saved"
          >
            <Text style={styles.btnText}>Manage</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background, padding: 16, gap: 12 },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 12, elevation: 2 },
  title: { fontSize: 16, fontWeight: "800", color: Colors.light.text, marginBottom: 10 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  label: { color: Colors.light.text, fontWeight: "600" },
  meta: { color: "#6b7280" },
  metaSmall: { color: "#9CA3AF" },
  btn: { marginTop: 12, backgroundColor: Colors.light.tint, borderRadius: 12, paddingVertical: 10, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "800" },
  pressed: { opacity: 0.9 },
  savedRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 },
  savedName: { color: Colors.light.text, fontWeight: "700" },
});