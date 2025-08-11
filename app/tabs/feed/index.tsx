import React, { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import Colors from "@/constants/colors";
import { FEED_ITEMS } from "@/mocks/feed";
import { useAppState } from "@/providers/AppState";
import { Heart, MessageCircle, Bookmark } from "lucide-react-native";

export default function FeedScreen() {
  const { feed, toggleLike, saveFromFeed, filterFeed } = useAppState();
  const [filter, setFilter] = useState<"all" | "popular" | "happy" | "calm">("all");

  const items = useMemo(() => filterFeed(filter), [filter, filterFeed]);

  return (
    <View style={styles.container} testID="feed-screen">
      <View style={styles.filters}>
        {(["all", "popular", "happy", "calm"] as const).map((f) => (
          <Pressable
            key={f}
            onPress={() => setFilter(f)}
            style={({ pressed }) => [
              styles.filterChip,
              filter === f && styles.filterChipActive,
              pressed && styles.pressed,
            ]}
            testID={`filter-${f}`}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={items}
        keyExtractor={(it) => it.id}
        contentContainerStyle={{ padding: 16 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => {
          const liked = feed.likes[item.id] ?? false;
          return (
            <View style={styles.card} testID={`feed-item-${item.id}`}>
              <View style={styles.rowBetween}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.moodTag}>{item.moodTag}</Text>
              </View>
              <Text style={styles.metaText}>{item.tracks.length} tracks • {item.likes} likes</Text>

              <View style={styles.actions}>
                <Pressable
                  onPress={() => toggleLike(item.id)}
                  style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
                  testID={`like-${item.id}`}
                >
                  <Heart color={liked ? "#ef4444" : Colors.light.tint} fill={liked ? "#fee2e2" : "transparent"} />
                </Pressable>
                <Pressable
                  onPress={() => {}}
                  style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
                  testID={`comment-${item.id}`}
                >
                  <MessageCircle color={Colors.light.tint} />
                </Pressable>
                <Pressable
                  onPress={() => saveFromFeed(item.id)}
                  style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
                  testID={`save-${item.id}`}
                >
                  <Bookmark color={Colors.light.tint} />
                </Pressable>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  filters: { flexDirection: "row", gap: 8, padding: 16 },
  filterChip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999, backgroundColor: "#f3f4f6" },
  filterChipActive: { backgroundColor: Colors.light.tintSoft },
  filterText: { color: "#6b7280", fontWeight: "700", textTransform: "capitalize" },
  filterTextActive: { color: Colors.light.tint },
  pressed: { opacity: 0.85 },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 12, elevation: 2 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardTitle: { fontSize: 16, fontWeight: "800", color: Colors.light.text },
  moodTag: { paddingVertical: 4, paddingHorizontal: 10, backgroundColor: "#f3f4f6", borderRadius: 999, color: "#6b7280", fontWeight: "700" },
  metaText: { color: "#6b7280", marginTop: 6 },
  actions: { flexDirection: "row", gap: 10, marginTop: 10 },
  iconBtn: { padding: 8, borderRadius: 10, backgroundColor: "#f2f4f7" },
});