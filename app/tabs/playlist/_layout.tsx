import { Stack } from "expo-router";
import React from "react";

export default function PlaylistStack() {
  return (
    <Stack screenOptions={{ headerTitle: "Your Playlist" }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}