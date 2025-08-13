import React from "react";
import { View } from "react-native";

export default function ProgressBar({ progress = 0, height = 8 }) {
  const pct = Math.max(0, Math.min(1, progress));
  return (
    <View style={{ height, backgroundColor: "#2b2b2b", borderRadius: 999, overflow: "hidden" }}>
      <View style={{ width: `${pct * 100}%`, height: "100%", backgroundColor: "#F3C0E0" }} />
    </View>
  );
}
