// components/ProductCard.tsx
import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { useCart } from "../lib/cart";
import { discountPercent, finalPrice, inStock } from "../lib/catalog";
import { Product } from "../lib/products";
import { useTheme } from "../lib/theme";

export default function ProductCard({ p }: { p: Product }) {
  const { colors } = useTheme();
  const { add } = useCart();
  const router = useRouter();

  const off = discountPercent(p);
  const oos = !inStock(p);

  return (
    <View
      style={{
        flex: 1,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.card,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
      }}
    >
      <Pressable
        onPress={() =>
          router.push({ pathname: "/product/[id]", params: { id: p.id } })
        }
        style={{ aspectRatio: 1.15, backgroundColor: "#00000010" }}
      >
        <Image
          source={p.image}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
        {off > 0 && (
          <View
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              backgroundColor: "#db2777cc",
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "white", fontWeight: "800", fontSize: 11 }}>
              -{off}%
            </Text>
          </View>
        )}
        {oos && (
          <View
            style={{
              position: "absolute",
              right: 10,
              top: 10,
              backgroundColor: "#00000080",
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "white", fontWeight: "800", fontSize: 11 }}>
              Out of stock
            </Text>
          </View>
        )}
      </Pressable>

      <View style={{ padding: 10 }}>
        <Text numberOfLines={1} style={{ color: colors.fg, fontWeight: "700" }}>
          {p.title}
        </Text>
        <Text style={{ color: colors.muted, marginBottom: 6 }}>
          ★ {(p.rating ?? 0).toFixed(1)}
        </Text>

        {/* price row */}
        <View style={{ flexDirection: "row", alignItems: "baseline", gap: 8 }}>
          <Text style={{ color: colors.fg, fontWeight: "800" }}>
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
        </View>

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
            marginTop: 8,
            borderRadius: 10,
            alignItems: "center",
            paddingVertical: 10,
            backgroundColor: oos ? "#9ca3af" : colors.tint,
            opacity: oos ? 0.6 : 1,
          }}
        >
          <Text style={{ color: colors.bg, fontWeight: "800" }}>
            {oos ? "Unavailable" : "Add to Cart"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
