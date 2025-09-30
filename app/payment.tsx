// app/payment.tsx
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useCart } from "../lib/cart"; // ✅ one level up
import { useTheme } from "../lib/theme"; // ✅ one level up
function Row({ label, value, muted, bold }: { label: string; value: string; muted?: boolean; bold?: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <Text style={{ color: muted ? colors.muted : colors.fg }}>{label}</Text>
      <Text style={{ color: colors.fg, fontWeight: bold ? "800" : "600" }}>{value}</Text>
    </View>
  );
}

export default function PaymentScreen() {
  const { colors } = useTheme();
  const { totalPrice, clear } = useCart();
  const router = useRouter();

  // customer info
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  // coupon
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  const applyCoupon = () => {
    const code = coupon.trim().toLowerCase();
    if (code === "welcome10") {
      setDiscount(Number((totalPrice * 0.1).toFixed(2))); // 10%
      Alert.alert("🎉 Coupon applied", "You saved 10%");
    } else {
      setDiscount(0);
      Alert.alert("Invalid coupon");
    }
  };

  const finalAmount = Math.max(0, totalPrice - discount).toFixed(2);

  const validEmail = !email || /\S+@\S+\.\S+/.test(email);
  const validPhone = !phone || /^\+?[0-9\-()\s]{7,}$/.test(phone);
  const formValid =
    fullName.trim().length >= 2 &&
    address.trim().length >= 5 &&
    validEmail &&
    validPhone;

  const onPay = () => {
    if (!formValid) {
      Alert.alert("Missing info", "Please fill all required fields correctly.");
      return;
    }
    Alert.alert("Payment complete ✅", `Paid $${finalAmount}`, [
      {
        text: "OK",
        onPress: () => {
          clear();
          router.replace("/(tabs)/browse");
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <Stack.Screen
        options={{
          title: "Payment",
          headerStyle: { backgroundColor: colors.bg },
          headerTitleStyle: { color: colors.fg },
          headerTintColor: colors.fg,
        }}
      />

      <ScrollView contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
        <Text style={[styles.h1, { color: colors.fg }]}>Customer Info</Text>
        <Text style={{ color: colors.muted, marginBottom: 12 }}>
          Total to pay:{" "}
          <Text style={{ color: colors.fg, fontWeight: "700" }}>${finalAmount}</Text>
        </Text>

        <Text style={[styles.label, { color: colors.fg }]}>Full name *</Text>
        <TextInput
          value={fullName}
          onChangeText={setFullName}
          placeholder="John Doe"
          placeholderTextColor={colors.muted}
          style={[styles.input, { borderColor: colors.border, backgroundColor: colors.card, color: colors.fg }]}
        />

        <Text style={[styles.label, { color: colors.fg }]}>Phone *</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder="+8801XXXXXXXXX"
          placeholderTextColor={colors.muted}
          style={[
            styles.input,
            { borderColor: colors.border, backgroundColor: colors.card, color: colors.fg },
            !validPhone && styles.inputError,
          ]}
        />

        <Text style={[styles.label, { color: colors.fg }]}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="you@example.com"
          placeholderTextColor={colors.muted}
          style={[
            styles.input,
            { borderColor: colors.border, backgroundColor: colors.card, color: colors.fg },
            !validEmail && styles.inputError,
          ]}
        />

        <Text style={[styles.label, { color: colors.fg }]}>Address *</Text>
        <TextInput
          value={address}
          onChangeText={setAddress}
          multiline
          placeholder="House, road, city, postcode"
          placeholderTextColor={colors.muted}
          style={[
            styles.input,
            styles.textarea,
            { borderColor: colors.border, backgroundColor: colors.card, color: colors.fg },
          ]}
        />

        {/* Coupon box */}
        <Text style={[styles.label, { color: colors.fg }]}>Coupon</Text>
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}>
          <TextInput
            value={coupon}
            onChangeText={setCoupon}
            placeholder="Enter coupon code"
            placeholderTextColor={colors.muted}
            style={[
              styles.input,
              { flex: 1, borderColor: colors.border, backgroundColor: colors.card, color: colors.fg },
            ]}
          />
          <TouchableOpacity onPress={applyCoupon} style={[styles.couponBtn, { backgroundColor: colors.tint }]}>
            <Text style={{ color: colors.bg, fontWeight: "700" }}>Apply</Text>
          </TouchableOpacity>
        </View>

        {discount > 0 && (
          <Text style={{ color: colors.muted, marginBottom: 8 }}>
            Discount applied: <Text style={{ color: colors.fg, fontWeight: "700" }}>- ${discount.toFixed(2)}</Text>
          </Text>
        )}
        {/* totals row */}
<View style={{ gap: 6, marginTop: 6, marginBottom: 8 }}>
  <Row label="Subtotal" value={`$${totalPrice.toFixed(2)}`} />
  <Row label="Discount" value={`-$${discount.toFixed(2)}`} muted />
  <Row label="Total" value={`$${finalAmount}`} bold />
</View>

        {/* Pay button */}
        <TouchableOpacity onPress={onPay} style={[styles.payBtn, { backgroundColor: colors.tint }]}>
          <Text style={{ color: colors.bg, fontWeight: "700", fontSize: 16 }}>Pay ${finalAmount}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  h1: { fontSize: 22, fontWeight: "800" },
  label: { marginTop: 14, marginBottom: 6, fontWeight: "600" },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 16 },
  textarea: { minHeight: 90, textAlignVertical: "top" },
  inputError: { borderColor: "#ff5a5f" },
  couponBtn: { paddingHorizontal: 16, borderRadius: 10, justifyContent: "center" },
  payBtn: { marginTop: 16, paddingVertical: 14, borderRadius: 12, alignItems: "center" },
});
