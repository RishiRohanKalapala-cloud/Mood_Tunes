import { Stack } from "expo-router";
import React from "react";

export default function HomeStack() {
  return (
    <Stack screenOptions={{ headerTitle: "Mood Tunes" }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}