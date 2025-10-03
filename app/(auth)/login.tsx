// app/(tabs)/login.tsx
import { Link, Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../lib/theme";

const MOCK_USER = { email: "test@example.com", password: "123456" };

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fakeSignIn(email: string, password: string) {
  await sleep(800); // mock network delay
  if (email === MOCK_USER.email && password === MOCK_USER.password)
    return { token: "demo-token" };
  throw new Error("Invalid email or password");
}

export default function LoginScreen() {
  const router = useRouter();
  const { colors } = useTheme(); // 👈 global theme

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValidEmail = /\S+@\S+\.\S+/.test(email);
  const isValidPassword = password.length >= 6;
  const formValid = isValidEmail && isValidPassword;

  const onSubmit = async () => {
    setError(null);
    if (!formValid) {
      setError("Enter a valid email and a 6+ char password.");
      return;
    }
    try {
      setLoading(true);
      await fakeSignIn(email.trim(), password);
      Alert.alert("Signed in ✅");
      router.push("/(tabs)/browse");
    } catch (e: any) {
      setError(e.message ?? "Sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: colors.bg }]}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <Stack.Screen
        options={{
          title: "Sign in",
          headerStyle: { backgroundColor: colors.bg },
          headerTitleStyle: { color: colors.fg },
          headerTintColor: colors.fg,
        }}
      />

      <View style={[styles.container]}>
        <Text style={[styles.h1, { color: colors.fg }]}>Welcome back 👋</Text>
        <Text style={[styles.sub, { color: colors.muted }]}>
          Happy shopping
        </Text>

        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.fg }]}>Email</Text>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: colors.border,
                backgroundColor: colors.card,
                color: colors.fg,
              },
              !email || isValidEmail ? null : styles.inputError,
            ]}
            placeholder="you@example.com"
            placeholderTextColor={colors.muted}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            textContentType="emailAddress"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.fg }]}>Password</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={[
                styles.input,
                {
                  flex: 1,
                  borderColor: colors.border,
                  backgroundColor: colors.card,
                  color: colors.fg,
                },
                !password || isValidPassword ? null : styles.inputError,
              ]}
              placeholder="••••••"
              placeholderTextColor={colors.muted}
              secureTextEntry={!showPassword}
              textContentType="password"
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword((s) => !s)}
              style={styles.showBtn}
            >
              <Text style={[styles.showText, { color: colors.fg }]}>
                {showPassword ? "Hide" : "Show"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {error ? (
          <Text style={[styles.err, { color: "#ff5a5f" }]}>{error}</Text>
        ) : null}

        <TouchableOpacity
          style={[
            styles.btn,
            {
              backgroundColor: colors.tint,
              opacity: !formValid || loading ? 0.5 : 1,
            },
          ]}
          onPress={onSubmit}
          disabled={!formValid || loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.bg} />
          ) : (
            <Text style={[styles.btnText, { color: colors.bg }]}>Sign in</Text>
          )}
        </TouchableOpacity>

        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => setRemember((r) => !r)}
            style={styles.checkboxRow}
          >
            <View
              style={[
                styles.checkbox,
                {
                  borderColor: colors.border,
                  backgroundColor: remember ? colors.fg : "transparent",
                },
              ]}
            />
            <Text style={{ marginLeft: 8, color: colors.fg }}>Remember me</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {}}>
            <Link href="/(auth)/forgot-password" asChild>
              <Text style={[styles.link, { color: colors.fg }]}>Forgot?</Text>
            </Link>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 12, alignItems: "center" }}>
          <Text style={{ color: colors.muted }}>No account?</Text>
          <Link
            href="/(auth)/signup"
            style={[styles.secondaryLink, { color: colors.fg }]}
          >
            Create one →
          </Link>
        </View>

        <View
          style={[
            styles.card,
            { borderColor: colors.border, backgroundColor: colors.card },
          ]}
        >
          <Text
            style={[{ fontWeight: "600", marginBottom: 6, color: colors.fg }]}
          >
            Demo credentials
          </Text>
          <Text style={[styles.mono, { color: colors.fg }]}>
            email: {MOCK_USER.email}
          </Text>
          <Text style={[styles.mono, { color: colors.fg }]}>
            pass: {MOCK_USER.password}
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, padding: 20, paddingTop: 40 },
  h1: { fontSize: 24, fontWeight: "800" },
  sub: { marginTop: 6 },
  field: { marginTop: 18 },
  label: { marginBottom: 6, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  inputError: { borderColor: "#ff5a5f" },
  passwordRow: { flexDirection: "row", alignItems: "center" },
  showBtn: { marginLeft: 10, paddingHorizontal: 10, paddingVertical: 10 },
  showText: { fontWeight: "600" },
  err: { marginTop: 8 },
  btn: { padding: 14, borderRadius: 12, alignItems: "center", marginTop: 18 },
  btnText: { fontWeight: "700", fontSize: 16 },
  row: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  checkboxRow: { flexDirection: "row", alignItems: "center" },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1 },
  link: { textDecorationLine: "underline", fontWeight: "600" },
  secondaryLink: {
    textDecorationLine: "underline",
    marginTop: 8,
    alignSelf: "center",
  },
  card: { marginTop: 22, padding: 12, borderRadius: 12, borderWidth: 1 },
  mono: {
    fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }) as any,
  },
});
