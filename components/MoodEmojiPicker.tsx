import React, { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { EMOJIS, Emoji } from "@/types";

type Props = {
  selected?: Emoji;
  onSelect: (e: Emoji) => void;
  testID?: string;
};

export const MoodEmojiPicker = memo(function MoodEmojiPicker({ selected, onSelect, testID }: Props) {
  return (
    <View style={styles.row} testID={testID}>
      {EMOJIS.map((e) => {
        const active = e === selected;
        return (
          <Pressable
            key={e}
            onPress={() => onSelect(e)}
            style={({ pressed }) => [styles.item, active && styles.itemActive, pressed && styles.pressed]}
            testID={`emoji-${e}`}
          >
            <Text style={styles.emoji}>{e}</Text>
          </Pressable>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  item: { width: 44, height: 44, borderRadius: 12, backgroundColor: "#f3f4f6", alignItems: "center", justifyContent: "center" },
  itemActive: { backgroundColor: "#e0f2fe", borderWidth: 1, borderColor: "#38bdf8" },
  emoji: { fontSize: 22 },
  pressed: { opacity: 0.9 },
});