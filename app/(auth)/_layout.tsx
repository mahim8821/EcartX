// app/(auth)/_layout.tsx
import { Stack } from "expo-router";
import { useTheme } from "../../lib/theme";

export default function AuthLayout() {
  const { colors } = useTheme();
  return (
    <Stack screenOptions={{ headerTitle: "", headerShadowVisible: false }}>
      <Stack.Screen name="login" options={{ headerTitle: "Sign in" }} />
      <Stack.Screen name="signup" options={{ headerTitle: "Sign up" }} />
      <Stack.Screen
        name="forgot-password"
        options={{ headerTitle: "Reset password" }}
      />
    </Stack>
  );
}
