import { Stack } from "expo-router";
import React from "react";

export default function FeedStack() {
  return (
    <Stack screenOptions={{ headerTitle: "Social Feed" }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}