// app/(tabs)/_layout.tsx
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { useCart } from "../../lib/cart"; // ✅ make sure you created lib/cart.tsx and wrapped app with <CartProvider>

function CartIconWithBadge({
  color,
  size,
  focused,
}: {
  color: string;
  size: number;
  focused: boolean;
}) {
  const { items } = useCart();
  const totalQty = items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <View style={{ width: size, height: size }}>
      <Ionicons
        name={focused ? "cart" : "cart-outline"}
        size={size}
        color={color}
      />
      {totalQty > 0 && (
        <View
          style={{
            position: "absolute",
            right: -8,
            top: -6,
            minWidth: 16,
            height: 16,
            paddingHorizontal: 4,
            borderRadius: 8,
            backgroundColor: "#ef4444",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{ color: "white", fontSize: 10, fontWeight: "700" }}
            numberOfLines={1}
          >
            {totalQty}
          </Text>
        </View>
      )}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
  headerTitle: "EcartX",
  headerStyle: { backgroundColor: "#ffffff" },
  headerTitleStyle: { fontWeight: "800", letterSpacing: 0.3 },
  headerTintColor: "#0a515f",
  tabBarStyle: {
    backgroundColor: "#0a515f",
    borderTopWidth: 0,
    borderRadius:22,
    height: 75,
    paddingBottom: 6,
    paddingTop: 6,
  },
  tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
  tabBarActiveTintColor: "#d9ffd9",
  tabBarInactiveTintColor: "#ffffff",
}}

    >
      <Tabs.Screen
        name="browse"
        options={{
          title: "EcartX",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "pricetag" : "pricetag-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color, size, focused }) => (
            <CartIconWithBadge color={color} size={size} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="login"
        options={{
          title: "Sign in",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      // replace the Menu tab screen with:
<Tabs.Screen
  name="account"
  options={{
    title: "Account",
    tabBarIcon: ({ color, size, focused }) => (
      <Ionicons name={focused ? "person-circle" : "person-circle-outline"} size={size} color={color} />
    ),
  }}
/>


      <Tabs.Screen
        name="menu"
        options={{
          title: "Menu",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "menu" : "menu-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
