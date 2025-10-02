import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { CartProvider } from "../lib/cart";
import { ThemeProvider } from "../lib/theme";

function RootNav() {
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
}
//export const unstable_settings = {
//initialRouteName: "splash",
//};

export default function RootLayout() {
  return (
    <ThemeProvider>
      <CartProvider>
        <StatusBar style="light" />
        <Stack initialRouteName="splash">
          <Stack.Screen name="splash" options={{ headerShown: false }} />
          <Stack.Screen name="promo" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </CartProvider>
    </ThemeProvider>
  );
}
