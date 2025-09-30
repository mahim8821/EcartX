// app/_layout.tsx
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { CartProvider } from "../lib/cart";
import { ThemeProvider, useTheme } from "../lib/theme";

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

export default function RootLayout() {
  return (
    <ThemeProvider>
      <CartProvider>
        <RootNav />
      </CartProvider>
    </ThemeProvider>
  );
}
