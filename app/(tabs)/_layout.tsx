import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Text, View } from "react-native";
import { useCart } from "../../lib/cart";
import { useTheme } from "../../lib/theme";
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
  const { dark, toggle, colors } = useTheme();
  return (
    /*export default function TabsLayout() {
  //const isDark = useColorScheme() === "dark";
  const { dark, toggle, colors } = useTheme();

  const headerBg = isDark ? "#0B1820" : "#FFFFFF";
  const headerText = isDark ? "#FFFFFF" : "#0B1820";
  const tabBg = isDark ? "#0B1820" : "#FFFFFF";
  const tabActive = isDark ? "#FFFFFF" : "#0B1820";
  const tabInactive = isDark ? "#9AA4AA" : "#6B7280";
  const borderTop = isDark ? "transparent" : "#E5E7EB";
  return (*/
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
        tabBarLabelStyle: { fontSize: 14, fontWeight: "550" },
        tabBarActiveTintColor: "#d9ffd9",
        tabBarInactiveTintColor: "#9AA4AA",
      }}
      /*screenOptions={{
        headerTitle: "EcartX",
        headerTitleAlign: "center",
        headerShadowVisible: false,

        // ⬇️ THEME-AWARE HEADER
        headerStyle: { backgroundColor: headerBg },
        headerTintColor: headerText,
        headerTitleStyle: { color: headerText },

        // ⬇️ THEME-AWARE TAB BAR
        tabBarStyle: {
          backgroundColor: tabBg,
          borderTopColor: borderTop,
        },
        tabBarActiveTintColor: tabActive,
        tabBarInactiveTintColor: tabInactive,
      }} */
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
