// app/(tabs)/account.tsx
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../lib/theme";

type TabKey = "info" | "address";

export default function AccountScreen() {
  const { colors } = useTheme();
  const [tab, setTab] = useState<TabKey>("info");

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Stack.Screen
        options={{
          title: "Account",
          headerStyle: { backgroundColor: colors.bg },
          headerTitleStyle: { color: colors.fg },
          headerTintColor: colors.fg,
        }}
      />

      {/* Minimal segmented header */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 10,
          paddingVertical: 8,
          gap: 8,
        }}
        style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
      >
        {SEGMENTS.map((s) => (
          <MiniTab
            key={s.key}
            active={tab === s.key}
            label={s.label}
            icon={s.icon}
            onPress={() => setTab(s.key)}
            colors={colors}
          />
        ))}
      </ScrollView>

      {/* body */}
      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 14 }}
        keyboardShouldPersistTaps="handled"
      >
        {tab === "info" && <AccountInfo colors={colors} />}
        {tab === "address" && <AddressSection colors={colors} />}
      </ScrollView>
    </View>
  );
}

/* ---------- Compact mini tabs ---------- */

const SEGMENTS: {
  key: TabKey;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { key: "info", label: "Info", icon: "person-circle-outline" },
  { key: "address", label: "Address", icon: "home-outline" },
];

function MiniTab({
  active,
  label,
  icon,
  onPress,
  colors,
}: {
  active: boolean;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  colors: any;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: active ? colors.tint : colors.border,
        backgroundColor: active ? colors.tint : "transparent",
      }}
      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
    >
      <Ionicons name={icon} size={14} color={active ? colors.bg : colors.fg} />
      <Text
        style={{
          color: active ? colors.bg : colors.fg,
          fontWeight: "700",
          fontSize: 12,
        }}
        numberOfLines={1}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/* ------------------ Shared bits ------------------ */

function Row({
  icon,
  label,
  children,
  colors,
}: {
  icon?: keyof typeof Ionicons.glyphMap;
  label: string;
  children?: React.ReactNode;
  colors: any;
}) {
  return (
    <View style={{ gap: 6 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        {icon ? <Ionicons name={icon} size={18} color={colors.muted} /> : null}
        <Text style={{ color: colors.fg, fontWeight: "700" }}>{label}</Text>
      </View>
      {children}
    </View>
  );
}

function TextField({
  value,
  onChangeText,
  placeholder,
  colors,
  secureTextEntry,
  keyboardType,
}: any) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.muted}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      style={[
        styles.input,
        {
          borderColor: colors.border,
          backgroundColor: colors.card,
          color: colors.fg,
        },
      ]}
    />
  );
}

/* 1) Account info */
function AccountInfo({ colors }: any) {
  const [fullName, setFullName] = useState("Yasir");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("+8801XXXXXXXXX");
  const [email, setEmail] = useState("you@example.com");
  const [gender, setGender] = useState("male");
  const [dob, setDob] = useState("2001-01-01");

  return (
    <View style={{ gap: 14 }}>
      {/* photo + change button (mock) */}
      <View style={{ alignItems: "center", gap: 8 }}>
        <Image
          source={require("../../assets/images/userlogo.png")}
          style={{
            width: 86,
            height: 86,
            borderRadius: 43,
            outlineWidth: 2,
            outlineColor: colors.border,
            backgroundColor: "#00000010",
          }}
        />
        <TouchableOpacity
          style={[styles.smallBtn, { backgroundColor: colors.tint }]}
          onPress={() =>
            Alert.alert("Change photo", "Wire this up later with ImagePicker.")
          }
        >
          <Text style={{ color: colors.bg, fontWeight: "700" }}>
            Change photo
          </Text>
        </TouchableOpacity>
      </View>

      <Row icon="person" label="Full name" colors={colors}>
        <TextField
          value={fullName}
          onChangeText={setFullName}
          placeholder="Full name"
          colors={colors}
        />
      </Row>

      <Row icon="key" label="Change password" colors={colors}>
        <TextField
          value={password}
          onChangeText={setPassword}
          placeholder="New password"
          colors={colors}
          secureTextEntry
        />
      </Row>

      <Row icon="call" label="Mobile number" colors={colors}>
        <TextField
          value={phone}
          onChangeText={setPhone}
          placeholder="+8801XXXXXXXXX"
          colors={colors}
          keyboardType="phone-pad"
        />
      </Row>

      <Row icon="mail" label="Email" colors={colors}>
        <TextField
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          colors={colors}
          keyboardType="email-address"
        />
      </Row>

      <Row icon="male-female" label="Gender" colors={colors}>
        <TextField
          value={gender}
          onChangeText={setGender}
          placeholder="Male/Female/Other"
          colors={colors}
        />
      </Row>

      <Row icon="calendar" label="Date of Birth" colors={colors}>
        <TextField
          value={dob}
          onChangeText={setDob}
          placeholder="YYYY-MM-DD"
          colors={colors}
          keyboardType="numbers-and-punctuation"
        />
      </Row>

      <TouchableOpacity
        style={[styles.primaryBtn, { backgroundColor: colors.tint }]}
        onPress={() => Alert.alert("Saved ✅", "Account info updated (demo).")}
      >
        <Text style={{ color: colors.bg, fontWeight: "700" }}>
          Save changes
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/* 2) Address */
function AddressSection({ colors }: any) {
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");

  return (
    <View style={{ gap: 12 }}>
      <Row icon="home" label="Address" colors={colors}>
        <TextField
          value={line1}
          onChangeText={setLine1}
          placeholder="House / Road"
          colors={colors}
        />
        <TextField
          value={line2}
          onChangeText={setLine2}
          placeholder="Area / Landmark"
          colors={colors}
        />
        <TextField
          value={city}
          onChangeText={setCity}
          placeholder="City"
          colors={colors}
        />
        <TextField
          value={zip}
          onChangeText={setZip}
          placeholder="Postcode"
          colors={colors}
          keyboardType="number-pad"
        />
        <TextField
          value={country}
          onChangeText={setCountry}
          placeholder="Country"
          colors={colors}
        />
      </Row>

      <TouchableOpacity
        style={[styles.primaryBtn, { backgroundColor: colors.tint }]}
        onPress={() => Alert.alert("Saved ✅", "Address updated (demo).")}
      >
        <Text style={{ color: colors.bg, fontWeight: "700" }}>
          Save address
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  input: { borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 16 },
  smallBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  primaryBtn: { paddingVertical: 12, borderRadius: 12, alignItems: "center" },
});
