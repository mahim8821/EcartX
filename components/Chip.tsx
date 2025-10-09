// components/Chip.tsx
import React from "react";
import { Text, TouchableOpacity, ViewStyle } from "react-native";
import { useTheme } from "../lib/theme";

export default function Chip({
  label, active, onPress, style,
}: { label: string; active?: boolean; onPress?: () => void; style?: ViewStyle }) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16,
          borderWidth: 1, borderColor: active ? colors.tint : colors.border,
          backgroundColor: active ? colors.tint : "transparent",
        },
        style,
      ]}
    >
      <Text style={{ color: active ? colors.bg : colors.fg, fontWeight: "700", fontSize: 12 }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
