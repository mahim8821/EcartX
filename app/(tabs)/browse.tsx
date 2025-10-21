// app/(tabs)/browse.tsx
import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Animated,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useCart } from "../../lib/cart";
import { PRODUCTS, Product } from "../../lib/products";
import { useTheme } from "../../lib/theme";
import { useWishlist } from "../../lib/wishlist";

//Types & constants
type CatKey =
  | "all"
  | "fashion"
  | "electronics"
  | "home"
  | "medical"
  | "medical_medicine"
  | "medical_sanitary"
  | "medical_device";

const CATEGORIES: { key: CatKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "fashion", label: "Fashion" },
  { key: "electronics", label: "Electronics" },
  { key: "home", label: "Home" },
  { key: "medical", label: "Medical" },
];

const MED_SUBS: { key: CatKey; label: string }[] = [
  { key: "medical_medicine", label: "Medicine" },
  { key: "medical_sanitary", label: "Sanitary" },
  { key: "medical_device", label: "Devices" },
];

type SortKey = "popular" | "price_low" | "price_high" | "discount";
const SORT_LABEL: Record<SortKey, string> = {
  popular: "Popular",
  price_low: "Price ↑",
  price_high: "Price ↓",
  discount: "Discount",
};

//Price helpers
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

/* ============================== Screen ============================== */

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<Product>);

export default function BrowseScreen() {
  const { colors } = useTheme();
  const { add } = useCart();
  const wishlist = useWishlist();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<CatKey>("all");
  const [medSub, setMedSub] = useState<CatKey>("medical_medicine");
  const [sort, setSort] = useState<SortKey>("popular");
  const [addingId, setAddingId] = useState<string | null>(null);

  // Featured deals (>= 15% off, top 10)
  const deals = useMemo(
    () => PRODUCTS.filter((p) => discountPct(p) >= 15).slice(0, 10),
    []
  );

  // Filter + search + sort
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    let items = PRODUCTS;

    // Category
    if (cat !== "all" && cat !== "medical") {
      items = items.filter((p) => p.categories.includes(cat as any));
    }
    if (cat === "medical") {
      items = items.filter((p) =>
        p.categories.some((c) => c.startsWith("medical"))
      );
      if (medSub)
        items = items.filter((p) => p.categories.includes(medSub as any));
    }

    // Search
    if (term) {
      items = items.filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          (p.brand ?? "").toLowerCase().includes(term)
      );
    }

    // Sort
    const cmp = {
      popular: (a: Product, b: Product) => (b.rating ?? 0) - (a.rating ?? 0),
      price_low: (a: Product, b: Product) => finalPrice(a) - finalPrice(b),
      price_high: (a: Product, b: Product) => finalPrice(b) - finalPrice(a),
      discount: (a: Product, b: Product) => discountPct(b) - discountPct(a),
    }[sort];

    return [...items].sort(cmp);
  }, [q, cat, medSub, sort]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.bg,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: colors.border,
      }}
    >
      <Stack.Screen
        options={{
          title: "EcartX",
          headerStyle: { backgroundColor: colors.bg },
          headerTitleStyle: { color: colors.fg },
          headerTintColor: colors.fg,
        }}
      />

      {/* Search + Sort */}
      <View style={{ flexDirection: "row", gap: 8, padding: 12 }}>
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search products…"
          placeholderTextColor={colors.muted}
          style={[
            styles.input,
            {
              flex: 1,
              borderColor: colors.border,
              backgroundColor: colors.card,
              color: colors.fg,
            },
          ]}
          clearButtonMode="while-editing"
        />

        <SortButton sort={sort} onChange={setSort} />
      </View>

      {/* Category chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingVertical: 10,
          gap: 10,
          alignItems: "center",
        }}
        style={{
          borderTopWidth: StyleSheet.hairlineWidth,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
        }}
      >
        {CATEGORIES.map((c) => (
          <ChipBtn
            key={c.key}
            label={c.label}
            active={cat === c.key}
            onPress={() => setCat(c.key)}
            colors={colors}
          />
        ))}
      </ScrollView>

      {/* Medical sub chips */}
      {cat === "medical" && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 12,
            paddingVertical: 8,
            gap: 8,
            alignItems: "center",
          }}
        >
          {MED_SUBS.map((m) => (
            <ChipBtn
              key={m.key}
              label={m.label}
              active={medSub === m.key}
              onPress={() => setMedSub(m.key)}
              small
              colors={colors}
            />
          ))}
        </ScrollView>
      )}

      {/* Product grid with Featured deals at the very top ONLY in All category */}
      <AnimatedFlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12, paddingHorizontal: 12 }}
        contentContainerStyle={{ paddingVertical: 12, gap: 12 }}
        ListHeaderComponent={
          <View style={{ gap: 12 }}>
            {/* Featured deals row FIRST (only for All) */}
            {cat === "all" && deals.length > 0 && (
              <View style={{ paddingTop: 0 }}>
                <Text
                  style={{
                    color: colors.fg,
                    fontWeight: "800",
                    fontStyle: "bold",
                    fontSize: 20,
                    paddingHorizontal: 12,
                    marginBottom: 6,
                  }}
                >
                  Featured deals 🔥
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 12, gap: 18 }}
                >
                  {deals.map((p) => (
                    <Pressable
                      key={"deal-" + p.id}
                      onPress={() =>
                        router.push({
                          pathname: "/product/[id]",
                          params: { id: p.id },
                        })
                      }
                      style={[
                        styles.dealCard,
                        {
                          backgroundColor: colors.card,
                          borderColor: colors.border,
                        },
                      ]}
                    >
                      {!!discountPct(p) && (
                        <View
                          style={[
                            styles.ribbon,
                            { backgroundColor: colors.tint },
                          ]}
                        >
                          <Text
                            style={{
                              color: colors.bg,
                              fontWeight: "900",
                              fontSize: 12,
                            }}
                          >
                            -{discountPct(p)}%
                          </Text>
                        </View>
                      )}
                      <View style={styles.dealImgBox}>
                        <Image
                          source={p.image}
                          style={styles.img}
                          resizeMode="cover"
                        />
                      </View>
                      <Text
                        style={{ color: colors.fg, fontWeight: "700" }}
                        numberOfLines={1}
                      >
                        {p.title}
                      </Text>
                      <PriceLine colors={colors} p={p} />
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* count line */}
            <Text style={{ color: colors.muted, paddingHorizontal: 12 }}>
              {filtered.length} of {PRODUCTS.length} items
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const outOfStock = (item.stock ?? 0) <= 0;
          const isWished = wishlist.has(item.id);
          const isAdding = addingId === item.id;

          return (
            <View
              style={[
                styles.card,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              {/* pressable top opens details */}
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/product/[id]",
                    params: { id: item.id },
                  })
                }
                style={{ flex: 1 }}
              >
                {!!discountPct(item) && (
                  <View
                    style={[styles.ribbon, { backgroundColor: colors.tint }]}
                  >
                    <Text
                      style={{
                        color: colors.bg,
                        fontWeight: "700",
                        fontSize: 12,
                      }}
                    >
                      -{discountPct(item)}%
                    </Text>
                  </View>
                )}

                {/* optional OOS badge */}
                {outOfStock && (
                  <View
                    style={{
                      position: "absolute",
                      right: 8,
                      top: 8,
                      backgroundColor: "#ef4444",
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                      borderRadius: 6,
                      zIndex: 2,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "700",
                        fontSize: 10,
                      }}
                    >
                      OOS
                    </Text>
                  </View>
                )}

                {
                  <View style={styles.imgBox}>
                    <Image
                      source={item.image}
                      style={styles.img}
                      resizeMode="cover"
                    />
                  </View>
                }
                <Text
                  style={{
                    color: colors.fg,
                    fontWeight: "700",
                    paddingHorizontal: 10,
                  }}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                <PriceLine colors={colors} p={item} />
              </Pressable>

              {/* bottom button */}
              {outOfStock ? (
                // Wishlist toggle when OOS
                <Pressable
                  onPress={() => {
                    if (isWished) wishlist.remove(item.id);
                    else
                      wishlist.add({
                        id: item.id,
                        title: item.title,
                        image: item.image,
                        price: item.price,
                        brand: item.brand,
                      });
                  }}
                  style={[
                    styles.addBtn,
                    {
                      backgroundColor: isWished
                        ? colors.tint + "15"
                        : "transparent",
                      borderWidth: 1,
                      borderColor: isWished ? colors.tint : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: isWished ? colors.tint : colors.fg,
                      fontWeight: "700",
                    }}
                  >
                    {isWished ? "In Wishlist" : "Add to Wishlist"}
                  </Text>
                </Pressable>
              ) : (
                // Add to cart with brief "Added ✓" feedback
                <Pressable
                  onPress={() => {
                    if (isAdding) return;
                    setAddingId(item.id);
                    add(
                      {
                        id: item.id,
                        title: item.title,
                        price: item.price,
                        image: item.image,
                      },
                      1
                    );
                    setTimeout(() => setAddingId(null), 1000);
                  }}
                  style={[
                    styles.addBtn,
                    {
                      backgroundColor: colors.tint,
                      opacity: isAdding ? 0.7 : 1,
                    },
                  ]}
                >
                  <Text style={{ color: colors.bg, fontWeight: "700" }}>
                    {isAdding ? "Added ✓" : "Add to Cart"}
                  </Text>
                </Pressable>
              )}
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

/* ----------------------- Small UI pieces ----------------------- */

function ChipBtn({
  label,
  active,
  onPress,
  small,
  colors,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  small?: boolean;
  colors: any;
}) {
  const HEIGHT = small ? 32 : 36;
  const MIN_W = small ? 90 : 100;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          height: HEIGHT,
          minWidth: MIN_W,
          paddingHorizontal: 14,
          borderRadius: HEIGHT / 2,
          borderWidth: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: active ? colors.fg : "transparent",
          borderColor: active ? colors.fg : colors.border,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      <Text
        numberOfLines={1}
        style={{
          fontWeight: "700",
          fontSize: 14,
          color: active ? colors.bg : colors.fg,
          textAlign: "center",
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function PriceLine({ p, colors }: { p: Product; colors: any }) {
  const fp = finalPrice(p);
  const hasDiscount = fp !== p.price;
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 10,
        marginTop: 4,
      }}
    >
      <Text style={{ color: colors.fg, fontSize: 16, fontWeight: "700" }}>
        ${fp.toFixed(2)}
      </Text>
      {hasDiscount && (
        <Text
          style={{ color: colors.muted, textDecorationLine: "line-through" }}
        >
          ${p.price.toFixed(2)}
        </Text>
      )}
    </View>
  );
}

/* ----------------------- Sort Button + Menu ----------------------- */

function SortButton({
  sort,
  onChange,
}: {
  sort: SortKey;
  onChange: (s: SortKey) => void;
}) {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={({ pressed }) => [
          styles.sortBtn,
          {
            borderColor: colors.border,
            backgroundColor: colors.card,
            opacity: pressed ? 0.9 : 1,
          },
        ]}
      >
        <Ionicons name="swap-vertical-outline" size={18} color={colors.fg} />
        <Text style={{ color: colors.fg, marginLeft: 6, fontWeight: "600" }}>
          Sort
        </Text>
        <Text style={{ marginLeft: 6, color: colors.muted }}>
          {SORT_LABEL[sort]}
        </Text>
      </Pressable>

      <Modal
        visible={open}
        animationType="fade"
        transparent
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.sheetBackdrop} onPress={() => setOpen(false)}>
          <View />
        </Pressable>
        <View
          style={[
            styles.sheetBox,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          {(Object.keys(SORT_LABEL) as SortKey[]).map((key) => {
            const active = sort === key;
            return (
              <Pressable
                key={key}
                onPress={() => {
                  onChange(key);
                  setOpen(false);
                }}
                style={[
                  styles.sheetItem,
                  active && { backgroundColor: colors.tint + "22" },
                ]}
              >
                <Text
                  style={{
                    color: active ? colors.tint : colors.fg,
                    fontWeight: active ? ("700" as const) : ("500" as const),
                  }}
                >
                  {SORT_LABEL[key]}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Modal>
    </>
  );
}

/* ----------------------- Styles ----------------------- */

const styles = StyleSheet.create({
  input: { borderWidth: 1, borderRadius: 15, padding: 12, fontSize: 16 },
  sortBtn: {
    height: 42,
    minWidth: 120,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  // unified image sizing
  imgBox: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#00000010",
    overflow: "hidden",
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  dealImgBox: {
    width: 160,
    aspectRatio: 1.2,
    backgroundColor: "#00000010",
    overflow: "hidden",
    borderRadius: 10,
  },
  img: { width: "100%", height: "100%" },

  card: { flex: 1, borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  addBtn: {
    margin: 10,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  ribbon: {
    position: "absolute",
    left: 8,
    top: 8,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    zIndex: 2,
  },
  dealCard: { width: 160, borderRadius: 14, borderWidth: 1, padding: 1 },

  // sort sheet
  sheetBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.25)" },
  sheetBox: {
    position: "absolute",
    right: 12,
    top: 105,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
    minWidth: 170,
  },
  sheetItem: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e5e5",
  },
});
