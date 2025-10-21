// app/product/[id].tsx
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BadgeIcon from "../../components/BadgeIcon";
import { useCart } from "../../lib/cart";
import { PRODUCTS, type Product } from "../../lib/products";
import { useTheme } from "../../lib/theme";
import { useWishlist } from "../../lib/wishlist";

/* ---- helpers (same as Browse) ---- */
function finalPrice(p: Product) {
  if (!p.offer) return p.price;
  if (p.offer.type === "percent")
    return +(p.price * (1 - p.offer.value / 100)).toFixed(2);
  return Math.max(0, +(p.price - p.offer.value).toFixed(2));
}
function discountPct(p: Product) {
  if (!p.offer) return 0;
  return p.offer.type === "percent"
    ? p.offer.value
    : Math.round((p.offer.value / p.price) * 100);
}

type SizeOption = "XS" | "S" | "M" | "L" | "XL";

export default function ProductDetails() {
  const { items: cartItems } = useCart() as any; // adjust if your cart exposes a different shape
  const { count: wishlistCount, items: wlItems } = useWishlist();
  const cartCount =
    cartItems?.reduce?.((n: number, it: any) => n + (it.qty ?? 1), 0) ??
    cartItems?.length ??
    0;
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const cart = useCart();
  const wishlist = useWishlist();
  const router = useRouter();

  const product = useMemo(() => PRODUCTS.find((p) => p.id === id), [id]);

  // Guard: product not found
  if (!product) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.bg,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Stack.Screen
          options={{
            title: "Detail Product",
            headerStyle: { backgroundColor: colors.bg },
            headerTitleStyle: { color: colors.fg },
            headerTintColor: colors.fg,
            headerRight: () => (
              <View style={{ flexDirection: "row", gap: 4 }}>
                <BadgeIcon
                  name="heart-outline"
                  color={colors.fg}
                  count={wishlistCount ?? wlItems?.length ?? 0}
                  onPress={() => router.push("/(tabs)/wishlist")}
                />
                <BadgeIcon
                  name="cart-outline"
                  color={colors.fg}
                  count={cartCount}
                  onPress={() => router.push("/(tabs)/cart")}
                />
              </View>
            ),
          }}
        />
        <Text
          style={{
            color: colors.fg,
            fontWeight: "700",
            fontSize: 16,
            marginBottom: 12,
          }}
        >
          Product not found
        </Text>
        <Pressable
          onPress={() => router.back()}
          style={{
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 10,
            backgroundColor: colors.card,
          }}
        >
          <Text style={{ color: colors.fg }}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  // ✅ product is defined here — safe to read stock
  const outOfStock = (product.stock ?? 0) <= 0;
  // --- wishlist active + add-to-cart feedback ---
  const wished = wishlist.has(product.id);

  const [adding, setAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const toggleWishlist = () => {
    if (wishlist.has(product.id)) {
      wishlist.remove(product.id);
    } else {
      wishlist.add({
        id: product.id,
        title: product.title,
        image: product.image,
        price: priceNow,
        brand: product.brand,
      });
    }
  };

  const addToCartOnce = () => {
    if (adding) return;
    setAdding(true);
    cart.add(
      {
        id: product.id,
        title:
          showSizes && selectedSize
            ? `${product.title} (${selectedSize})`
            : product.title,
        price: priceNow,
        image: product.image,
      },
      qty
    );
    setJustAdded(true);
    setAdding(false);
    setTimeout(() => setJustAdded(false), 1000);
  };

  // Colors: keep defaults if product doesn't define them
  const colorOptions: string[] = (product as any).colors ?? [
    "#0f172a",
    "#1f2937",
    "#93c5fd",
    "#e5e7eb",
  ];

  // Show sizes ONLY for fashion items
  const isFashion = product.categories.includes("fashion" as any);
  const sizeOptions: SizeOption[] = isFashion
    ? (product as any).sizes ?? (["XS", "S", "M", "L", "XL"] as SizeOption[])
    : [];
  const showSizes = sizeOptions.length > 0;

  const [selectedColor, setSelectedColor] = useState<string>(colorOptions[0]);
  const [selectedSize, setSelectedSize] = useState<SizeOption | null>(
    showSizes ? sizeOptions[1] ?? sizeOptions[0] : null
  );
  const [qty, setQty] = useState(1);

  const priceNow = finalPrice(product);
  const hasDiscount = priceNow !== product.price;

  const onAdd = () => {
    cart.add(
      {
        id: product.id,
        title:
          showSizes && selectedSize
            ? `${product.title} (${selectedSize})`
            : product.title,
        price: priceNow,
        image: product.image,
      },
      qty
    );
    Alert.alert("Added", "Item added to your cart.");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Stack.Screen
        options={{
          title: "Detail Product",
          headerStyle: { backgroundColor: colors.bg },
          headerTitleStyle: { color: colors.fg },
          headerTintColor: colors.fg,
          headerRight: () => (
            <View style={{ flexDirection: "row", gap: 6 }}>
              {/* Heart (toggle active/inactive) */}
              <Pressable
                onPress={toggleWishlist}
                style={{
                  padding: 6,
                  backgroundColor: colors.card,
                  borderRadius: 999,
                }}
              >
                <Ionicons
                  name={wished ? "heart" : "heart-outline"}
                  size={18}
                  color={wished ? colors.tint : colors.fg}
                />
              </Pressable>

              {/* Cart */}
              <Pressable
                onPress={() => router.push("/(tabs)/cart")}
                style={{
                  padding: 6,
                  backgroundColor: colors.card,
                  borderRadius: 999,
                }}
              >
                <Ionicons name="cart-outline" size={18} color={colors.fg} />
              </Pressable>
            </View>
          ),
        }}
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Image + dots */}
        <View style={{ backgroundColor: colors.card, padding: 16 }}>
          <View
            style={{
              width: "100%",
              aspectRatio: 1.2, // uniform hero size
              overflow: "hidden",
              borderRadius: 12,
              backgroundColor: "#00000010",
            }}
          >
            <Image
              source={product.image}
              style={{ width: "100%", height: "100%" }}
              resizeMode="contain" // or "cover" for full-bleed
            />
          </View>

          {/* dots */}
          <View style={styles.dotsWrap}>
            <View
              style={[
                styles.dot,
                { backgroundColor: colors.border, opacity: 0.6 },
              ]}
            />
            <View style={[styles.dot, { backgroundColor: colors.fg }]} />
            <View
              style={[
                styles.dot,
                { backgroundColor: colors.border, opacity: 0.6 },
              ]}
            />
          </View>
        </View>

        {/* Info */}
        <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
          <View style={styles.rowBetween}>
            <Text style={[styles.brand, { color: colors.muted }]}>
              {product.brand ?? "—"}
            </Text>
            <Pressable
              onPress={() =>
                wishlist.add({
                  id: product.id,
                  title: product.title,
                  image: product.image,
                  price: priceNow,
                  brand: product.brand,
                })
              }
              accessibilityLabel="Add to wishlist"
            >
              <Ionicons name="heart-outline" size={22} color={colors.fg} />
            </Pressable>
          </View>

          <Text style={[styles.title, { color: colors.fg }]}>
            {product.title}
          </Text>

          <View style={[styles.row, { gap: 8, marginTop: 4 }]}>
            <Ionicons name="star" size={14} color="#fbbf24" />
            <Text style={[styles.rating, { color: colors.fg }]}>
              {(product.rating ?? 4.8).toFixed(1)}{" "}
              <Text style={{ color: colors.muted }}>
                ({product.reviews ?? 120})
              </Text>
            </Text>
          </View>

          <View style={[styles.row, { gap: 10, marginTop: 8 }]}>
            <Text style={[styles.price, { color: colors.tint }]}>
              ${priceNow.toFixed(2)}
            </Text>
            {hasDiscount && (
              <Text
                style={[
                  styles.oldPrice,
                  { color: colors.muted, textDecorationLine: "line-through" },
                ]}
              >
                ${product.price.toFixed(2)}
              </Text>
            )}
            {!!discountPct(product) && (
              <Text style={{ color: colors.tint, fontWeight: "700" }}>
                -{discountPct(product)}%
              </Text>
            )}
          </View>

          {!!product.description && (
            <Text
              style={[
                styles.desc,
                { color: colors.fg, opacity: 0.85, marginTop: 10 },
              ]}
            >
              {product.description}
            </Text>
          )}

          {/* Colors & Size row */}
          <View style={{ marginTop: 16 }}>
            <View style={[styles.rowBetween, { marginBottom: 8 }]}>
              <Text style={[styles.label, { color: colors.fg }]}>Colors</Text>
              {showSizes ? (
                <Text style={[styles.label, { color: colors.fg }]}>Size</Text>
              ) : (
                <View />
              )}
            </View>

            <View style={[styles.rowBetween, { alignItems: "flex-start" }]}>
              {/* Colors */}
              <View
                style={[styles.row, { gap: 12, flexWrap: "wrap", flex: 1 }]}
              >
                {colorOptions.map((c) => {
                  const selected = c === selectedColor;
                  return (
                    <TouchableOpacity
                      key={c}
                      onPress={() => setSelectedColor(c)}
                      style={[
                        styles.colorDot,
                        {
                          borderColor: selected ? colors.tint : colors.border,
                          borderWidth: selected ? 2 : 1,
                          backgroundColor: c,
                        },
                      ]}
                    />
                  );
                })}
              </View>

              {/* Sizes (only if fashion) */}
              {showSizes ? (
                <View style={[styles.row, { gap: 10 }]}>
                  {sizeOptions.map((s) => {
                    const selected = s === selectedSize;
                    return (
                      <Pressable
                        key={s}
                        onPress={() => setSelectedSize(s)}
                        style={[
                          styles.sizePill,
                          {
                            backgroundColor: selected
                              ? colors.fg
                              : "transparent",
                            borderColor: colors.border,
                          },
                        ]}
                      >
                        <Text
                          style={{
                            color: selected ? colors.bg : colors.fg,
                            fontWeight: "600",
                          }}
                        >
                          {s}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              ) : null}
            </View>
          </View>

          {/* OOS hint */}
          {outOfStock && (
            <Text
              style={{
                color: colors.muted,
                marginTop: 8,
                fontWeight: "600",
              }}
            >
              Out of stock — add to wishlist to get it later.
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Bottom actions (wishlist when OOS) */}
      <View
        style={[
          styles.bottomBar,
          { backgroundColor: colors.bg, borderTopColor: colors.border },
        ]}
      >
        {/* Qty controls disabled if OOS */}
        <View
          style={[
            styles.qtyWrap,
            { borderColor: colors.border, opacity: outOfStock ? 0.5 : 1 },
          ]}
        >
          <Pressable
            onPress={() => !outOfStock && setQty((q) => Math.max(1, q - 1))}
            disabled={outOfStock}
          >
            <Ionicons name="remove" size={20} color={colors.fg} />
          </Pressable>
          <Text style={[styles.qty, { color: colors.fg }]}>{qty}</Text>
          <Pressable
            onPress={() => !outOfStock && setQty((q) => q + 1)}
            disabled={outOfStock}
          >
            <Ionicons name="add" size={20} color={colors.fg} />
          </Pressable>
        </View>

        {outOfStock ? (
          // OOS → wishlist toggle (active/inactive)
          <Pressable
            onPress={toggleWishlist}
            style={[
              styles.outlineBtn,
              {
                borderColor: wished ? colors.tint : colors.border,
                backgroundColor: wished ? colors.tint + "15" : "transparent",
              },
            ]}
          >
            <Ionicons
              name={wished ? "heart" : "heart-outline"}
              size={18}
              color={wished ? colors.tint : colors.fg}
            />
            <Text
              style={[
                styles.outlineText,
                { color: wished ? colors.tint : colors.fg },
              ]}
            >
              {wished ? "IN WISHLIST" : "ADD TO WISHLIST"}
            </Text>
          </Pressable>
        ) : (
          <>
            <Pressable
              onPress={addToCartOnce}
              disabled={adding}
              style={[
                styles.outlineBtn,
                { borderColor: colors.fg, opacity: adding ? 0.6 : 1 },
              ]}
            >
              {adding ? (
                <Ionicons name="time-outline" size={18} color={colors.fg} />
              ) : justAdded ? (
                <Ionicons
                  name="checkmark-circle-outline"
                  size={18}
                  color={colors.fg}
                />
              ) : (
                <Ionicons name="bag-outline" size={18} color={colors.fg} />
              )}
              <Text style={[styles.outlineText, { color: colors.fg }]}>
                {adding ? "ADDING…" : justAdded ? "ADDED ✓" : "ADD TO CART"}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                if ((product.stock ?? 0) <= 0) return;
                addToCartOnce();
                router.push("/payment");
              }}
              disabled={adding}
              style={[
                styles.filledBtn,
                { backgroundColor: colors.fg, opacity: adding ? 0.7 : 1 },
              ]}
            >
              <Text style={[styles.filledText, { color: colors.bg }]}>
                BUY NOW
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dotsWrap: { flexDirection: "row", alignSelf: "center", gap: 8, marginTop: 6 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  row: { flexDirection: "row", alignItems: "center" },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: { fontSize: 13, fontWeight: "600" },
  title: { fontSize: 20, fontWeight: "700", lineHeight: 26, marginTop: 2 },
  rating: { fontSize: 13, fontWeight: "600" },
  price: { fontSize: 22, fontWeight: "800" },
  oldPrice: { fontSize: 16, fontWeight: "600" },
  desc: { fontSize: 14, lineHeight: 20 },
  label: { fontSize: 14, fontWeight: "700" },
  colorDot: { width: 28, height: 28, borderRadius: 14 },
  sizePill: {
    minWidth: 42,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: "center",
  },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderTopWidth: 1,
  },
  qtyWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  qty: { fontSize: 16, fontWeight: "700", minWidth: 18, textAlign: "center" },
  outlineBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    justifyContent: "center",
  },
  outlineText: { fontSize: 13, fontWeight: "800", letterSpacing: 0.3 },
  filledBtn: { paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12 },
  filledText: { fontSize: 13, fontWeight: "800", letterSpacing: 0.3 },
});
