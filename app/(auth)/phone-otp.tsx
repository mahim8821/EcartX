import { router, useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import {
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

export default function PhoneOtp() {
  const { colors } = useTheme();
  const { phone } = useLocalSearchParams<{ phone?: string }>();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<(TextInput | null)[]>([]);

  const onChange = (v: string, i: number) => {
    const next = [...code];
    next[i] = v.replace(/\D/g, "").slice(0, 1);
    setCode(next);
    if (next[i] && i < 5) inputs.current[i + 1]?.focus();
  };

  const onVerify = () => {
    if (code.join("").length !== 6)
      return Alert.alert("Enter the 6-digit code");
    // TODO: verify with backend
    Alert.alert("Verified ✅");
    router.replace("/(tabs)/account");
  };

  return (
    <KeyboardAvoidingView
      style={[s.flex, { backgroundColor: colors.bg }]}
      behavior={Platform.select({ ios: "padding" })}
    >
      <View style={s.container}>
        <Text style={[s.h1, { color: colors.fg }]}>Verify your phone</Text>
        <Text style={{ color: colors.muted, marginTop: 6 }}>
          We sent a code to {phone || "your number"}
        </Text>

        <View style={s.otpRow}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <TextInput
              key={i}
              ref={(el) => {
                inputs.current[i] = el;
              }}
              style={[
                s.otpBox,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.card,
                  color: colors.fg,
                },
              ]}
              keyboardType="number-pad"
              maxLength={1}
              value={code[i]}
              onChangeText={(v) => onChange(v, i)}
              textAlign="center"
            />
          ))}
        </View>

        <TouchableOpacity
          style={[s.btn, { backgroundColor: colors.tint }]}
          onPress={onVerify}
        >
          <Text style={[s.btnText, { color: colors.bg }]}>Confirm</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ marginTop: 14 }}
          onPress={() => Alert.alert("Resent", "A new code was sent (stub).")}
        >
          <Text style={{ color: colors.fg, textDecorationLine: "underline" }}>
            Resend code
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, padding: 20, paddingTop: 36, alignItems: "center" },
  h1: { fontSize: 24, fontWeight: "800" },
  otpRow: { flexDirection: "row", gap: 10, marginTop: 18 },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 20,
  },
  btn: {
    marginTop: 18,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    alignSelf: "stretch",
  },
  btnText: { fontWeight: "700", fontSize: 16, textAlign: "center" },
});
