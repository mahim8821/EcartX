// app/splash.tsx
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function Splash() {
  useEffect(() => {
    const t = setTimeout(() => {
      // 👉 change "/" to "/browse" (or any route) if your main screen is different
      router.replace("/promo");
    }, 1000); // 1.5seconds
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>EcartX</Text>
      <Text style={styles.subtitle}>Welcome to EcartX</Text>
      <ActivityIndicator style={{ marginTop: 20 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1020",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    color: "white",
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    color: "#cbd5e1",
    fontSize: 14,
  },
});
