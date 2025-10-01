// app/(tabs)/browse.tsx
import { Stack } from "expo-router";
import { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useCart } from "../../lib/cart";
import { useTheme } from "../../lib/theme";

type Product = {
  id: string;
  title: string;
  price: number;
  image: ImageSourcePropType;
  rating?: number;
};

const PRODUCTS: Product[] = [
  {
    id: "p1",
    title: "Classic T-Shirt",
    price: 19.99,
    image: require("../../assets/images/tshirt.png"),
    rating: 4.5,
  },
  {
    id: "p2",
    title: "Sneakers",
    price: 59.0,
    image: require("../../assets/images/sneakers.jpg"),
    rating: 4.2,
  },
  {
    id: "p3",
    title: "Backpack",
    price: 29.5,
    image: require("../../assets/images/backpack.jpeg"),
    rating: 4.7,
  },
  {
    id: "p4",
    title: "Headphones",
    price: 89.0,
    image: require("../../assets/images/Headphones.jpeg"),
    rating: 4.1,
  },
  {
    id: "p5",
    title: "Watch",
    price: 120.0,
    image: require("../../assets/images/watchs.webp"),
    rating: 4.8,
  },
  {
    id: "p6",
    title: "Sunglasses",
    price: 25.0,
    image: require("../../assets/images/sunglasses.jpg"),
    rating: 4.0,
  },
  {
    id: "p7",
    title: "Hoodie",
    price: 39.0,
    image: require("../../assets/images/hoodie.jpg"),
    rating: 4.4,
  },
  {
    id: "p8",
    title: "Cap",
    price: 14.0,
    image: require("../../assets/images/cap.jpeg"),
    rating: 3.9,
  },
];

export default function BrowseScreen() {
  const { colors } = useTheme();
  const { add } = useCart();
  const [q, setQ] = useState("");

  const data = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return PRODUCTS;
    return PRODUCTS.filter((p) => p.title.toLowerCase().includes(term));
  }, [q]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Stack.Screen
        options={{
          title: "EcartX",
          headerStyle: { backgroundColor: colors.bg },
          headerTitleStyle: {
            color: colors.fg,
            fontWeight: "800",
            letterSpacing: 0.3,
          },
          headerTintColor: colors.fg,
        }}
      />

      {/* Search pill */}
      <View style={styles.searchRow}>
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search products…"
          autoCapitalize="none"
          style={[
            styles.search,
            {
              borderColor: colors.border,
              color: colors.fg,
              backgroundColor: colors.card,
            },
          ]}
          placeholderTextColor={colors.muted}
          clearButtonMode="while-editing"
        />
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={{ gap: 12, paddingHorizontal: 12 }}
        contentContainerStyle={{
          paddingVertical: 12,
          gap: 12,
          paddingBottom: 20,
        }}
        ListHeaderComponent={
          <Text style={[styles.count, { color: colors.muted }]}>
            {data.length} of {PRODUCTS.length} items
          </Text>
        }
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                // subtle shadow (iOS) + elevation (Android)
                shadowColor: "#000",
                shadowOpacity: 0.08,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 4 },
                elevation: 2,
              },
            ]}
          >
            {/* Image area with price chip */}
            <Pressable style={styles.imageWrap}>
              <Image
                source={item.image}
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.priceChip}>
                <Text style={styles.priceChipText}>
                  ${item.price.toFixed(2)}
                </Text>
              </View>
            </Pressable>

            {/* Meta */}
            <View style={{ padding: 10 }}>
              <Text
                style={[styles.title, { color: colors.fg }]}
                numberOfLines={1}
              >
                {item.title}
              </Text>
              <Text style={[styles.rating, { color: colors.muted }]}>
                {stars(item.rating ?? 4)} ({(item.rating ?? 4).toFixed(1)})
              </Text>

              {/* CTA */}
              <Pressable
                onPress={() =>
                  add(
                    {
                      id: item.id,
                      title: item.title,
                      price: item.price,
                      image: item.image,
                    },
                    1
                  )
                }
                style={[styles.addBtn, { backgroundColor: colors.tint }]}
              >
                <Text style={{ color: colors.bg, fontWeight: "700" }}>
                  Add to Cart
                </Text>
              </Pressable>
            </View>
          </View>
        )}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}

function stars(rating: number) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  return (
    "★".repeat(full) +
    (half ? "½" : "") +
    "☆".repeat(Math.max(0, 5 - full - half))
  );
}

const styles = StyleSheet.create({
  searchRow: { paddingHorizontal: 12, paddingTop: 12 },
  search: {
    borderWidth: 1,
    borderRadius: 22, // pill
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  count: { paddingHorizontal: 12, paddingTop: 8 },
  card: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  imageWrap: { aspectRatio: 1.15, backgroundColor: "#00000010" },
  image: { width: "100%", height: "100%" },
  priceChip: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(0,0,0,0.65)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  priceChipText: { color: "#fff", fontWeight: "800", fontSize: 12 },
  title: { fontWeight: "700", fontSize: 16 },
  rating: { marginTop: 2, marginBottom: 10 },
  addBtn: {
    marginTop: 6,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 10,
  },
});
