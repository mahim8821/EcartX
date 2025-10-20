// app/_layout.tsx
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { CartProvider } from "../lib/cart";
import { ThemeProvider } from "../lib/theme";
import { WishlistProvider } from "../lib/wishlist";

// ⬇️ Add this import
import { requestPushPermissionsAndGetToken } from "../lib/notifications";

export default function RootLayout() {
  // ⬇️ Ask for permission + fetch Expo push token once at app start
  useEffect(() => {
    (async () => {
      try {
        const token = await requestPushPermissionsAndGetToken();
        console.log("Expo push token:", token);
        // TODO: send `token` to your backend user profile if/when you add one
      } catch (e: any) {
        console.log("Push setup error:", e?.message);
      }
    })();
  }, []);

  return (
    <ThemeProvider>
      <CartProvider>
        <WishlistProvider>
          <StatusBar style="light" />
          <Stack initialRouteName="splash">
            <Stack.Screen name="splash" options={{ headerShown: false }} />
            <Stack.Screen name="promo" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          </Stack>
        </WishlistProvider>
      </CartProvider>
    </ThemeProvider>
  );
}

/* function RootNav() {
  const { colors } = useTheme();
  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.bg },
          headerTintColor: colors.fg,
          headerTitleStyle: { color: colors.fg },
          contentStyle: { backgroundColor: colors.bg },
        }}
      />
    </>
  );
} */
//export const unstable_settings = {
//initialRouteName: "splash",
//};
