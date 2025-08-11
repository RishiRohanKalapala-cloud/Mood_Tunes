import { Stack } from "expo-router";
import React from "react";

export default function ProfileStack() {
  return (
    <Stack screenOptions={{ headerTitle: "Profile" }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}