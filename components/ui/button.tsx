import React from "react";
import { Pressable, Text } from "react-native";
import { useTheme } from "../../lib/theme";

export default function Button({
  title, onPress, variant = "primary", disabled = false,
}: { title: string; onPress?: () => void; variant?: "primary" | "outline" | "ghost"; disabled?: boolean }) {
  const { colors, radius, shadow, spacing } = useTheme();
  const base = {
    borderRadius: radius.lg,
    paddingVertical: spacing(3),
    paddingHorizontal: spacing(4),
    alignItems: "center" as const,
    justifyContent: "center" as const,
  };
  const styles = {
    primary: { ...base, backgroundColor: colors.tint, ...shadow(3), opacity: disabled ? 0.5 : 1 },
    outline: { ...base, borderWidth: 1, borderColor: colors.border, backgroundColor: "transparent" },
    ghost:   { ...base, backgroundColor: "transparent" },
  }[variant];

  const textColor = variant === "primary" ? colors.bg : colors.fg;

  return (
    <Pressable style={styles} onPress={onPress} disabled={disabled}>
      <Text style={{ color: textColor, fontWeight: "700" }}>{title}</Text>
    </Pressable>
  );
}
