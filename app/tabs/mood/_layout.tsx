import { Stack } from "expo-router";
import React from "react";

export default function MoodStack() {
  return (
    <Stack screenOptions={{ headerTitle: "Mood Input" }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}