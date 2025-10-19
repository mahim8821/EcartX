// app/(tabs)/_layout.tsx
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import BadgeIcon from "../../components/BadgeIcon";
import { useCart } from "../../lib/cart";
import { useTheme } from "../../lib/theme";
import { useWishlist } from "../../lib/wishlist";

// --- small helpers so this never crashes even if shapes differ
function safeCartCount(cart: any): number {
  // if your cart exposes {items:[{qty}]}:
  if (cart?.items && Array.isArray(cart.items)) {
    const sum = cart.items.reduce(
      (n: number, it: any) => n + (it?.qty ?? 1),
      0
    );
    return Number.isFinite(sum) ? sum : cart.items.length;
  }
  // or {count}
  if (typeof cart?.count === "number") return cart.count;
  // or array directly
  if (Array.isArray(cart)) return cart.length;
  return 0;
}

function safeWishlistCount(wl: any): number {
  if (typeof wl?.count === "number") return wl.count;
  if (wl?.items && Array.isArray(wl.items)) return wl.items.length;
  if (Array.isArray(wl)) return wl.length;
  return 0;
}

export default function TabsLayout() {
  const { colors } = useTheme();
  const cartCtx = useCart();
  const wishlistCtx = useWishlist();

  const cartCount = safeCartCount(cartCtx);
  const wlCount = safeWishlistCount(wishlistCtx);

  return (
    <Tabs
      screenOptions={{
        headerTitle: "EcartX",
        headerStyle: { backgroundColor: colors.bg },
        headerTitleStyle: { fontWeight: "800", letterSpacing: 0.3 },
        headerTintColor: colors.fg,
        tabBarStyle: {
          backgroundColor: "#182b37ff",
          borderTopWidth: 0,
          height: 75,
          paddingBottom: 6,
          borderRadius: 0,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 14, fontWeight: "600" },
        tabBarActiveTintColor: "#d9ffd9",
        tabBarInactiveTintColor: "#9AA4AA",
      }}
    >
      {/* Home/Browse */}
      <Tabs.Screen
        name="browse"
        options={{
          title: "EcartX",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "grid" : "grid-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      {/* Wishlist with badge */}
      <Tabs.Screen
        name="wishlist"
        options={{
          title: "Wishlist",
          tabBarIcon: ({ color }) => (
            <BadgeIcon name="heart-outline" color={color} count={wlCount} />
          ),
        }}
      />

      {/* Cart with badge */}
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color }) => (
            <BadgeIcon name="cart-outline" color={color} count={cartCount} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "person-circle" : "person-circle-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: "Menu",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "menu" : "menu-sharp"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* add your other tabs as needed */}
    </Tabs>
  );
}

{
  /*  <Tabs
      screenOptions={{
        headerTitle: "EcartX",
        headerStyle: { backgroundColor: colors.bg },
        headerTitleStyle: { fontWeight: "800", letterSpacing: 0.3 },
        headerTintColor: colors.fg,
        tabBarStyle: {
          backgroundColor: "#182b37ff",
          borderTopWidth: 0,
          height: 75,
          paddingBottom: 6,
          borderRadius: 0,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 14, fontWeight: "600" },
        tabBarActiveTintColor: "#d9ffd9",
        tabBarInactiveTintColor: "#9AA4AA",
      }}
    > */
}
