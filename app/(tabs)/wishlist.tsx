// app/(tabs)/wishlist.tsx
import { Stack } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useCart } from "../../lib/cart";
import { useTheme } from "../../lib/theme";
import { useWishlist } from "../../lib/wishlist";

export default function WishlistScreen() {
  const { colors } = useTheme();
  const { items, remove, clear } = useWishlist();
  const { add } = useCart();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Stack.Screen
        options={{
          title: "Wishlist",
          headerStyle: { backgroundColor: colors.bg },
          headerTitleStyle: { color: colors.fg },
          headerTintColor: colors.fg,
          headerRight: () =>
            items.length ? (
              <Pressable onPress={clear} style={{ padding: 6 }}>
                <Text style={{ color: colors.muted, fontWeight: "700" }}>
                  Clear
                </Text>
              </Pressable>
            ) : null,
        }}
      />

      {items.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <Text
            style={{ color: colors.muted, fontSize: 16, textAlign: "center" }}
          >
            Your wishlist is empty. Add some favorites to find them faster
            later.
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(it) => it.id}
          contentContainerStyle={{ padding: 12, gap: 12 }}
          renderItem={({ item }) => (
            <View
              style={[
                styles.card,
                { borderColor: colors.border, backgroundColor: colors.card },
              ]}
            >
              <Image
                source={item.image}
                style={styles.img}
                resizeMode="cover"
              />
              <View style={{ flex: 1, paddingHorizontal: 12 }}>
                <Text
                  style={{ color: colors.fg, fontWeight: "700" }}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                {!!item.brand && (
                  <Text style={{ color: colors.muted, marginTop: 2 }}>
                    {item.brand}
                  </Text>
                )}
                <Text
                  style={{ color: colors.fg, fontWeight: "800", marginTop: 6 }}
                >
                  ${item.price.toFixed(2)}
                </Text>

                <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
                  <Pressable
                    onPress={() => remove(item.id)}
                    style={[styles.btn, { borderColor: colors.border }]}
                  >
                    <Text style={{ color: colors.fg, fontWeight: "700" }}>
                      Remove
                    </Text>
                  </Pressable>
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
                    style={[styles.btn, { backgroundColor: colors.fg }]}
                  >
                    <Text style={{ color: colors.bg, fontWeight: "800" }}>
                      Move to Cart
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 14,
    overflow: "hidden",
    padding: 10,
  },
  img: {
    width: 90,
    height: 90,
    borderRadius: 10,
    backgroundColor: "#00000010",
  },
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
});
