// app/(tabs)/cart.tsx
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCart } from "../../lib/cart";
import { useTheme } from "../../lib/theme";

export default function CartScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { items, increment, decrement, remove, totalPrice, clear } = useCart();
  const bg = { backgroundColor: colors.bg };
  const fg = { color: colors.fg };
  const mut = { color: colors.muted };
  const cardBg = { backgroundColor: colors.card, borderColor: colors.border };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Stack.Screen
        options={{
          title: "My Cart",
          headerStyle: { backgroundColor: colors.bg },
          headerTitleStyle: { color: colors.fg },
          headerTintColor: colors.fg,
        }}
      />

      {items.length === 0 ? (
        <View style={styles.center}>
          <Text style={{ color: colors.muted }}>Your cart is empty</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 12, gap: 12 }}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.row,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <Image source={item.image} style={styles.thumb} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.fg, fontWeight: "700" }}>
                    {item.title}
                  </Text>
                  <Text style={{ color: colors.muted }}>
                    ${item.price.toFixed(2)}
                  </Text>
                  <View style={styles.qtyRow}>
                    <TouchableOpacity
                      onPress={() => decrement(item.id)}
                      style={[styles.qtyBtn, { borderColor: colors.border }]}
                    >
                      <Text style={{ color: colors.fg }}>-</Text>
                    </TouchableOpacity>
                    <Text
                      style={{
                        color: colors.fg,
                        width: 24,
                        textAlign: "center",
                      }}
                    >
                      {item.qty}
                    </Text>
                    <TouchableOpacity
                      onPress={() => increment(item.id)}
                      style={[styles.qtyBtn, { borderColor: colors.border }]}
                    >
                      <Text style={{ color: colors.fg }}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* <Pressable
                  style={styles.primaryBtn}
                  onPress={() => router.push("/(tabs)/browse")}
                >
                  <Text style={styles.primaryText}>Browse Products →</Text>
                </Pressable> } */}
                <TouchableOpacity onPress={() => remove(item.id)}>
                  <Text style={{ color: "#ef4444" }}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
          />
          <View style={[styles.card, cardBg]}>
            <Pressable
              style={styles.row}
              onPress={() => router.push("/(tabs)/browse")}
            >
              <Ionicons
                name="log-in-outline"
                size={20}
                color={mut.color as string}
              />
              <Text style={[styles.rowText, fg]}>Browse Product</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={mut.color as string}
              />
            </Pressable>
          </View>

          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <Text style={{ color: colors.fg, fontSize: 16, fontWeight: "700" }}>
              Total: ${totalPrice.toFixed(2)}
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/payment")} // 👈 navigate to Payment
              style={[styles.checkoutBtn, { backgroundColor: colors.tint }]}
            >
              <Text style={{ color: colors.bg, fontWeight: "700" }}>
                Checkout
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  row: {
    flexDirection: "row",
    gap: 12,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: "#00000010",
  },
  qtyRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 6 },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    padding: 12,
    borderTopWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  checkoutBtn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10 },
});
