import React from "react";
import { View } from "react-native";
import { useTheme } from "../../lib/theme";

export default function Card({ children, style }: any) {
  const { colors, radius, shadow } = useTheme();
  return (
    <View style={[{ backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, overflow: "hidden", }, shadow(3), style]}>
      {children}
    </View>
  );
}
