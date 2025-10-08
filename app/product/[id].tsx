import { Stack, useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { useCart } from "../../lib/cart";
import { discountPercent, finalPrice, inStock } from "../../lib/catalog";
import { PRODUCTS } from "../../lib/products";
import { useTheme } from "../../lib/theme";

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { add } = useCart();

  const p = useMemo(() => PRODUCTS.find((x) => x.id === id), [id]);
  if (!p)
    return (
      <View>
        <Text>Not found</Text>
      </View>
    );
  const off = discountPercent(p);
  const oos = !inStock(p);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }}>
      <Stack.Screen
        options={{
          title: p.title,
          headerStyle: { backgroundColor: colors.bg },
          headerTintColor: colors.fg,
          headerTitleStyle: { color: colors.fg },
        }}
      />

      <Image
        source={p.image}
        style={{ width: "100%", height: 280, backgroundColor: "#00000010" }}
      />
      <View style={{ padding: 16, gap: 8 }}>
        <Text style={{ color: colors.fg, fontSize: 20, fontWeight: "800" }}>
          {p.title}
        </Text>
        <Text style={{ color: colors.muted }}>
          Brand: {p.brand ?? "—"} • ★ {(p.rating ?? 0).toFixed(1)}
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "baseline",
            gap: 8,
            marginTop: 4,
          }}
        >
          <Text style={{ color: colors.fg, fontWeight: "900", fontSize: 18 }}>
            ৳{finalPrice(p).toFixed(2)}
          </Text>
          {off > 0 && (
            <Text
              style={{
                color: colors.muted,
                textDecorationLine: "line-through",
              }}
            >
              ৳{p.price.toFixed(2)}
            </Text>
          )}
          {off > 0 && (
            <Text style={{ color: "#db2777", fontWeight: "800" }}>-{off}%</Text>
          )}
        </View>

        {p.categories.some((c) => c.startsWith("medical_")) && (
          <View
            style={{
              padding: 10,
              borderRadius: 10,
              backgroundColor: colors.card,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text style={{ color: colors.muted, fontSize: 12 }}>
              ⚕️ Medical item: Please follow local regulations and consult a
              healthcare professional if needed.
            </Text>
          </View>
        )}

        <Pressable
          disabled={oos}
          onPress={() =>
            add(
              {
                id: p.id,
                title: p.title,
                price: finalPrice(p),
                image: p.image,
              },
              1
            )
          }
          style={{
            marginTop: 12,
            paddingVertical: 14,
            borderRadius: 12,
            alignItems: "center",
            backgroundColor: oos ? "#9ca3af" : colors.tint,
          }}
        >
          <Text style={{ color: colors.bg, fontWeight: "900" }}>
            {oos ? "Unavailable" : "Add to Cart"}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
