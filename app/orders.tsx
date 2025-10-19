// app/orders.tsx assign to mimya
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTheme } from "../lib/theme";

type Status = "Processing" | "Delivered" | "Cancelled";
type Order = {
  id: string;
  title: string;
  date: string; // ISO or friendly
  items: number;
  total: number; // in your currency
  status: Status;
};

const MOCK_ORDERS: Order[] = [
  {
    id: "o124",
    title: "Headphones",
    date: "2025-09-18",
    items: 1,
    total: 49.99,
    status: "Processing",
  },
  {
    id: "o123",
    title: "Sneakers",
    date: "2025-09-10",
    items: 2,
    total: 119.0,
    status: "Delivered",
  },
  {
    id: "o122",
    title: "USB-C Cable",
    date: "2025-08-31",
    items: 3,
    total: 15.0,
    status: "Delivered",
  },
  {
    id: "o121",
    title: "Smart Watch",
    date: "2025-08-20",
    items: 1,
    total: 199.0,
    status: "cancelled",
  },
];

const FILTERS: (Status | "All")[] = [
  "All",
  "Processing",
  "Delivered",
  "Cancelled",
];

export default function OrdersScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [active, setActive] = useState<(typeof FILTERS)[number]>("All");
  const [refreshing, setRefreshing] = useState(false);

  const list = useMemo(() => {
    if (active === "All") return MOCK_ORDERS;
    return MOCK_ORDERS.filter((o) => o.status === active);
  }, [active]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 700); // mock refresh
  }, []);

  const bg = { backgroundColor: colors.bg };
  const cardBg = { backgroundColor: colors.card, borderColor: colors.border };
  const fg = { color: colors.fg };

  return (
    <View style={[styles.flex, bg]}>
      <Stack.Screen
        options={{
          title: "Orders",
          headerStyle: { backgroundColor: colors.bg },
          headerTitleStyle: { color: colors.fg },
          headerTintColor: colors.fg,
        }}
      />

      {/* Filters */}
      <View style={[styles.filtersWrap, { borderBottomColor: colors.border }]}>
        <FlatList
          horizontal
          data={FILTERS}
          keyExtractor={(k) => String(k)}
          contentContainerStyle={{ paddingHorizontal: 12, gap: 8 }}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setActive(item)}
              style={[
                styles.chip,
                {
                  borderColor: item === active ? colors.tint : colors.border,
                  backgroundColor:
                    item === active ? colors.tint : "transparent",
                },
              ]}
            >
              <Text
                style={{
                  color: item === active ? colors.bg : colors.fg,
                  fontWeight: "700",
                  fontSize: 12,
                }}
              >
                {item}
              </Text>
            </Pressable>
          )}
        />
      </View>

      {/* Orders list */}
      <FlatList
        data={list}
        keyExtractor={(o) => o.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.fg}
          />
        }
        renderItem={({ item }) => (
          <View style={[styles.card, cardBg]}>
            <View style={styles.rowBetween}>
              <Text style={[styles.title, fg]}>{item.title}</Text>
              <StatusPill text={item.status} />
            </View>

            <View style={{ marginTop: 4, gap: 4 }}>
              <MetaRow icon="calendar-outline" text={item.date} />
              <MetaRow
                icon="cube-outline"
                text={`${item.items} item${item.items > 1 ? "s" : ""}`}
              />
              <MetaRow icon="card-outline" text={`$${item.total.toFixed(2)}`} />
              <MetaRow icon="pricetag-outline" text={`Order #${item.id}`} />
            </View>

            <Pressable
              style={[styles.primaryBtn]}
              onPress={() =>
                Alert.alert("Order details (demo)", `Open #${item.id}`)
              }
            >
              <Text style={styles.primaryText}>View details →</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

function StatusPill({ text }: { text: Status }) {
  const map =
    text === "Delivered"
      ? { color: "#10b981", icon: "checkmark-circle-outline" as const }
      : text === "Processing"
      ? { color: "#f59e0b", icon: "time-outline" as const }
      : { color: "#ef4444", icon: "close-circle-outline" as const };

  return (
    <View
      style={{
        paddingHorizontal: 10,
        paddingVertical: Platform.select({ ios: 4, android: 2 }) as number,
        borderRadius: 999,
        backgroundColor: `${map.color}20`,
        borderWidth: 1,
        borderColor: `${map.color}55`,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
      }}
    >
      <Ionicons name={map.icon} size={14} color={map.color} />
      <Text style={{ fontSize: 12, fontWeight: "700", color: map.color }}>
        {text}
      </Text>
    </View>
  );
}

function MetaRow({
  icon,
  text,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
}) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <Ionicons name={icon} size={16} color="#9ca3af" />
      <Text style={{ color: "#9ca3af" }}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },

  filtersWrap: {
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },

  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    gap: 10,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: { fontWeight: "700", fontSize: 16 },

  primaryBtn: {
    marginTop: 8,
    backgroundColor: "black",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  primaryText: { color: "white", fontWeight: "700" },
});
