// components/SortButton.tsx
import React from "react";
import {
  ActionSheetIOS,
  Alert,
  Platform,
  Text,
  TouchableOpacity,
} from "react-native";
import { SortKey } from "../lib/catalog";
import { useTheme } from "../lib/theme";

const LABELS: Record<SortKey, string> = {
  popular: "Popular",
  price_low_high: "Price ↑",
  price_high_low: "Price ↓",
  discount: "Discount",
  newest: "Newest",
};

export default function SortButton({
  value,
  onChange,
}: {
  value: SortKey;
  onChange: (s: SortKey) => void;
}) {
  const { colors } = useTheme();

  const open = () => {
    const keys: SortKey[] = [
      "popular",
      "price_low_high",
      "price_high_low",
      "discount",
    ];
    const labels = keys.map((k) => LABELS[k]);
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: "Sort by",
          options: [...labels, "Cancel"],
          cancelButtonIndex: labels.length,
        },
        (idx) => {
          if (idx < labels.length) onChange(keys[idx]);
        }
      );
    } else {
      Alert.alert("Sort by", "", [
        ...keys.map((k) => ({ text: LABELS[k], onPress: () => onChange(k) })),
        { text: "Cancel" },
      ]);
    }
  };

  return (
    <TouchableOpacity
      onPress={open}
      style={{ paddingHorizontal: 12, paddingVertical: 8 }}
    >
      <Text style={{ color: colors.tint, fontWeight: "800" }}>
        Sort: {LABELS[value]}
      </Text>
    </TouchableOpacity>
  );
}
