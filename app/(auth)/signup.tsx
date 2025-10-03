import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
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

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
async function fakeCreateAccount() {
  await sleep(800);
  return true;
}

export default function Signup() {
  const { colors } = useTheme();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); // e.g. +8801...
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [agree, setAgree] = useState(true);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const validEmail = /\S+@\S+\.\S+/.test(email);
  const validPhone = /^\+?\d{8,15}$/.test(phone || "");
  const valid =
    name.trim().length > 1 && validEmail && password.length >= 6 && agree;

  const onSubmit = async () => {
    setErr(null);
    if (!valid) {
      setErr("Please fill all fields correctly and accept the terms.");
      return;
    }
    try {
      setLoading(true);
      await fakeCreateAccount();
      Alert.alert("Account created 🎉");
      router.replace("/(tabs)/account");
    } catch (e: any) {
      setErr(e?.message ?? "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  // --- Social handlers (stub) ---
  const onGoogle = async () => {
    Alert.alert(
      "Google Sign up",
      "Wire with expo-auth-session/providers/google"
    );
    // After success: router.replace("/(tabs)/account")
  };
  const onFacebook = async () => {
    Alert.alert(
      "Facebook Sign up",
      "Wire with expo-auth-session + Facebook app config"
    );
  };
  const onPhone = async () => {
    if (!validPhone) {
      setErr("Enter a valid phone number (e.g., +8801...)");
      return;
    }
    router.push({ pathname: "/(auth)/phone-otp", params: { phone } });
  };

  return (
    <KeyboardAvoidingView
      style={[s.flex, { backgroundColor: colors.bg }]}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <View style={[s.container]}>
        {/* Header */}
        <Text style={[s.h1, { color: colors.fg }]}>Create your account</Text>
        <Text style={[s.sub, { color: colors.muted }]}>
          Join EcartX and start shopping smarter
        </Text>

        {/* Form Card */}
        <View
          style={[
            s.card,
            { borderColor: colors.border, backgroundColor: colors.card },
          ]}
        >
          {/* Name */}
          <View style={s.field}>
            <Text style={[s.label, { color: colors.fg }]}>Full name</Text>
            <View
              style={[
                s.inputRow,
                { borderColor: colors.border, backgroundColor: colors.bg },
              ]}
            >
              <Ionicons name="person-outline" size={18} color={colors.muted} />
              <TextInput
                style={[s.input, { color: colors.fg }]}
                placeholder="Mahim Hasan"
                placeholderTextColor={colors.muted}
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          {/* Email */}
          <View style={s.field}>
            <Text style={[s.label, { color: colors.fg }]}>Email</Text>
            <View
              style={[
                s.inputRow,
                { borderColor: colors.border, backgroundColor: colors.bg },
              ]}
            >
              <Ionicons name="mail-outline" size={18} color={colors.muted} />
              <TextInput
                style={[s.input, { color: colors.fg }]}
                placeholder="you@example.com"
                placeholderTextColor={colors.muted}
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
              {email.length > 0 && (
                <Ionicons
                  name={validEmail ? "checkmark-circle" : "alert-circle"}
                  size={18}
                  color={validEmail ? "#10b981" : "#ef4444"}
                />
              )}
            </View>
          </View>

          {/* Phone */}
          <View style={s.field}>
            <Text style={[s.label, { color: colors.fg }]}>Phone number</Text>
            <View
              style={[
                s.inputRow,
                { borderColor: colors.border, backgroundColor: colors.bg },
              ]}
            >
              <Ionicons name="call-outline" size={18} color={colors.muted} />
              <TextInput
                style={[s.input, { color: colors.fg }]}
                placeholder="+8801XXXXXXXXX"
                placeholderTextColor={colors.muted}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
              {phone.length > 0 && (
                <Ionicons
                  name={validPhone ? "checkmark-circle" : "alert-circle"}
                  size={18}
                  color={validPhone ? "#10b981" : "#ef4444"}
                />
              )}
            </View>
          </View>

          {/* Password */}
          <View style={s.field}>
            <Text style={[s.label, { color: colors.fg }]}>Password</Text>
            <View
              style={[
                s.inputRow,
                { borderColor: colors.border, backgroundColor: colors.bg },
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color={colors.muted}
              />
              <TextInput
                style={[s.input, { color: colors.fg }]}
                placeholder="Min 6 characters"
                placeholderTextColor={colors.muted}
                secureTextEntry={!showPass}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPass((v) => !v)}
                hitSlop={10}
              >
                <Ionicons
                  name={showPass ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color={colors.muted}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Terms */}
          <TouchableOpacity
            style={s.row}
            onPress={() => setAgree((a) => !a)}
            activeOpacity={0.7}
          >
            <View
              style={[
                s.checkbox,
                {
                  borderColor: colors.border,
                  backgroundColor: agree ? colors.fg : "transparent",
                },
              ]}
            />
            <Text style={{ marginLeft: 8, color: colors.muted }}>
              I agree to the{" "}
              <Text style={[s.link, { color: colors.fg }]}>Terms</Text> &{" "}
              <Text style={[s.link, { color: colors.fg }]}>Privacy</Text>
            </Text>
          </TouchableOpacity>

          {/* Error */}
          {err ? (
            <Text style={[s.err, { color: "#ef4444" }]}>{err}</Text>
          ) : null}

          {/* Primary CTA */}
          <TouchableOpacity
            style={[
              s.btn,
              {
                backgroundColor: colors.tint,
                opacity: !valid || loading ? 0.6 : 1,
              },
            ]}
            disabled={!valid || loading}
            onPress={onSubmit}
          >
            {loading ? (
              <ActivityIndicator color={colors.bg} />
            ) : (
              <Text style={[s.btnText, { color: colors.bg }]}>Sign up</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={s.dividerWrap}>
          <View style={[s.divider, { backgroundColor: colors.border }]} />
          <Text style={{ marginHorizontal: 10, color: colors.muted }}>
            or sign up with
          </Text>
          <View style={[s.divider, { backgroundColor: colors.border }]} />
        </View>

        {/* Social buttons */}
        <View style={s.socialRow}>
          <TouchableOpacity
            style={[
              s.socialBtn,
              { borderColor: colors.border, backgroundColor: colors.card },
            ]}
            onPress={onGoogle}
          >
            <Ionicons name="logo-google" size={18} color={colors.fg} />
            <Text style={[s.socialText, { color: colors.fg }]}>Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              s.socialBtn,
              { borderColor: colors.border, backgroundColor: colors.card },
            ]}
            onPress={onFacebook}
          >
            <Ionicons name="logo-facebook" size={18} color={colors.fg} />
            <Text style={[s.socialText, { color: colors.fg }]}>Facebook</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              s.socialBtn,
              { borderColor: colors.border, backgroundColor: colors.card },
            ]}
            onPress={onPhone}
          >
            <MaterialCommunityIcons
              name="cellphone"
              size={18}
              color={colors.fg}
            />
            <Text style={[s.socialText, { color: colors.fg }]}>Phone</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom link */}
        <View style={{ marginTop: 16, alignItems: "center" }}>
          <Text style={{ color: colors.muted }}>Already have an account?</Text>
          <Link
            href="/(auth)/login"
            style={[s.bottomLink, { color: colors.fg }]}
          >
            Log in →
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, padding: 20, paddingTop: 36 },
  h1: { fontSize: 28, fontWeight: "800" },
  sub: { marginTop: 6, marginBottom: 16, fontSize: 13 },
  card: { borderWidth: 1, borderRadius: 16, padding: 14 },
  field: { marginTop: 12 },
  label: { marginBottom: 6, fontWeight: "600" },
  inputRow: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: { flex: 1, fontSize: 16, paddingVertical: 2 },
  row: { marginTop: 12, flexDirection: "row", alignItems: "center" },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1 },
  err: { marginTop: 10 },
  btn: { marginTop: 14, padding: 14, borderRadius: 12, alignItems: "center" },
  btnText: { fontWeight: "700", fontSize: 16 },
  dividerWrap: { flexDirection: "row", alignItems: "center", marginTop: 18 },
  divider: { height: 1, flex: 1, opacity: 0.6 },
  socialRow: { flexDirection: "row", gap: 10, marginTop: 14 },
  socialBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  socialText: { fontWeight: "600" },
  bottomLink: { textDecorationLine: "underline", marginTop: 6 },
});
