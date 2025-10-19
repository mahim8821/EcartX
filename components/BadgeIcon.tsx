// components/BadgeIcon.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
  size?: number;
  count?: number;
  onPress?: () => void;
  style?: any;
};

export default function BadgeIcon({
  name,
  color,
  size = 22,
  count = 0,
  onPress,
  style,
}: Props) {
  const badge = Math.min(99, Math.max(0, count || 0));
  const inner = (
    <View
      style={[{ padding: 6, borderRadius: 999, position: "relative" }, style]}
    >
      <Ionicons name={name} color={color} size={size} />
      {badge > 0 && (
        <View
          style={{
            position: "absolute",
            right: 2,
            top: 2,
            minWidth: 16,
            height: 16,
            borderRadius: 8,
            backgroundColor: "#ef4444",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 3,
          }}
        >
          <Text style={{ color: "white", fontSize: 10, fontWeight: "800" }}>
            {badge}
          </Text>
        </View>
      )}
    </View>
  );

  if (!onPress) return inner;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
    >
      {inner}
    </Pressable>
  );
}
