import React, { memo, useCallback, useState } from "react";
import { GestureResponderEvent, PanResponder, PanResponderGestureState, StyleSheet, Text, View } from "react-native";

type Props = {
  label: string;
  value: number;
  onChange: (v: number) => void;
  testID?: string;
};

export const SliderControl = memo(function SliderControl({ label, value, onChange, testID }: Props) {
  const [width, setWidth] = useState<number>(0);

  const clamp = useCallback((v: number) => {
    if (v < 0) return 0;
    if (v > 100) return 100;
    return Math.round(v);
  }, []);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (e: GestureResponderEvent) => {
      const x = (e.nativeEvent as any).locationX as number;
      if (width > 0) {
        onChange(clamp((x / width) * 100));
      }
    },
    onPanResponderMove: (_e: GestureResponderEvent, gesture: PanResponderGestureState) => {
      if (width > 0) {
        const newValue = (gesture.moveX / width) * 100;
        onChange(clamp(newValue));
      }
    },
  });

  const handleLayout = (w: number) => {
    if (Number.isFinite(w)) setWidth(w);
  };

  const filledWidth = Math.max(0, Math.min(100, value));
  const thumbLeft = `${filledWidth}%` as const;

  return (
    <View style={styles.container} testID={testID}>
      <Text style={styles.label}>{label}: {value}</Text>
      <View
        style={styles.track}
        onLayout={(e) => handleLayout(e.nativeEvent.layout.width)}
        {...panResponder.panHandlers}
      >
        <View style={[styles.filled, { width: `${filledWidth}%` as const }]} />
        <View style={[styles.thumb, { left: thumbLeft, marginLeft: -12 }]} />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: { marginTop: 8 },
  label: { fontWeight: "700", color: "#111827", marginBottom: 8 },
  track: { height: 8, backgroundColor: "#e5e7eb", borderRadius: 999, position: "relative", justifyContent: "center" },
  filled: { position: "absolute", left: 0, top: 0, bottom: 0, backgroundColor: "#38bdf8", borderRadius: 999 },
  thumb: {
    position: "absolute",
    width: 24,
    height: 24,
    borderRadius: 999,
    backgroundColor: "#0ea5e9",
    top: -8,
  },
});