import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Linking,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useTheme } from "../../lib/theme";

const LANGS = ["English", "বাংলা", "हिंदी", "العربية", "Français"];

export default function MenuScreen() {
  const router = useRouter();
  const { dark, toggle, colors } = useTheme(); // ✅ global theme

  const [language, setLanguage] = useState<string>(LANGS[0]);
  const [langOpen, setLangOpen] = useState(false);
  const [coupon, setCoupon] = useState("");
  const membership = useMemo(() => ({ tier: "Free", renews: "—" }), []);

  const bg = { backgroundColor: colors.bg };
  const fg = { color: colors.fg };
  const mut = { color: colors.muted };
  const cardBg = { backgroundColor: colors.card, borderColor: colors.border };

  const openDeviceSettings = async () => {
    try {
      if (Linking.openSettings) await Linking.openSettings();
      else await Linking.openURL("app-settings:");
    } catch {
      Alert.alert(
        "Unable to open Settings",
        "Open your phone Settings app manually."
      );
    }
  };

  const applyCoupon = () => {
    if (!coupon.trim())
      return Alert.alert("Coupon", "Enter a coupon code first.");
    if (coupon.trim().toUpperCase() === "WELCOME10") {
      Alert.alert(
        "Coupon applied ✅",
        "10% off will be applied at checkout (demo)."
      );
      setCoupon("");
    } else {
      Alert.alert("Invalid coupon", "Try WELCOME10 for testing.");
    }
  };

  const logout = () => {
    Alert.alert("Logged out", "You have been signed out (demo).");
    router.push("/login");
  };

  return (
    <SafeAreaView style={[styles.safe, bg]}>
      <Stack.Screen options={{ title: "Menu" }} />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Device settings */}
        <Pressable
          onPress={openDeviceSettings}
          style={[styles.row, styles.card, cardBg]}
        >
          <Ionicons name="cog-outline" size={22} color={mut.color as string} />
          <Text style={[styles.rowText, fg]}>Open device settings</Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={mut.color as string}
          />
        </Pressable>
        {/* Appearance */}
        <View style={[styles.card, cardBg]}>
          <Text style={[styles.sectionTitle, fg]}>Appearance</Text>

          <View style={styles.row}>
            <Ionicons
              name={dark ? "moon" : "moon-outline"}
              size={20}
              color={mut.color as string}
            />
            <Text style={[styles.rowText, fg]}>Dark mode</Text>
            <Switch value={dark} onValueChange={toggle} />
          </View>

          <Pressable onPress={() => setLangOpen(true)} style={styles.row}>
            <Ionicons
              name="language-outline"
              size={20}
              color={mut.color as string}
            />
            <Text style={[styles.rowText, fg]}>Language</Text>
            <Text style={mut}>{language}</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={mut.color as string}
            />
          </Pressable>
        </View>

        {/* Coupon */}
        <View style={[styles.card, cardBg]}>
          <Text style={[styles.sectionTitle, fg]}>Coupon</Text>
          <View style={[styles.row, { gap: 12 }]}>
            <Ionicons
              name="pricetag-outline"
              size={20}
              color={mut.color as string}
            />
            <TextInput
              value={coupon}
              onChangeText={setCoupon}
              placeholder="Enter coupon code"
              placeholderTextColor={mut.color as string}
              style={[
                styles.input,
                fg,
                { borderColor: cardBg.borderColor as string },
              ]}
              autoCapitalize="characters"
            />
            <Pressable style={styles.smallBtn} onPress={applyCoupon}>
              <Text style={styles.smallText}>Apply</Text>
            </Pressable>
          </View>
        </View>

        {/* Auth */}
        <View style={[styles.card, cardBg]}>
          <Text style={[styles.sectionTitle, fg]}>Account</Text>
          <Pressable style={styles.row} onPress={() => router.push("/login")}>
            <Ionicons
              name="log-in-outline"
              size={20}
              color={mut.color as string}
            />
            <Text style={[styles.rowText, fg]}>Sign in</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={mut.color as string}
            />
          </Pressable>

          <Pressable style={styles.dangerBtn} onPress={logout}>
            <Ionicons name="log-out-outline" size={18} color="#fff" />
            <Text style={styles.dangerText}>Log out</Text>
          </Pressable>
        </View>

        {/* Direct nav to Browse */}
        <Pressable
          style={styles.primaryBtn}
          onPress={() => router.push("/(tabs)/browse")}
        >
          <Text style={styles.primaryText}>Browse Prducts →</Text>
        </Pressable>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Language modal */}
      <Modal
        visible={langOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setLangOpen(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setLangOpen(false)}
        >
          <View />
        </Pressable>
        <View style={[styles.modalSheet, bg]}>
          <Text style={[styles.sectionTitle, fg]}>Choose language</Text>
          {LANGS.map((l) => (
            <Pressable
              key={l}
              onPress={() => {
                setLanguage(l);
                setLangOpen(false);
                Alert.alert("Language set (demo)", l);
              }}
              style={styles.modalRow}
            >
              <Text style={[styles.modalText, fg]}>{l}</Text>
              {l === language && (
                <Ionicons
                  name="checkmark"
                  size={18}
                  color={mut.color as string}
                />
              )}
            </Pressable>
          ))}
          <Pressable
            onPress={() => setLangOpen(false)}
            style={[styles.smallBtn, { alignSelf: "flex-end" }]}
          >
            <Text style={styles.smallText}>Close</Text>
          </Pressable>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: 16, gap: 14 },
  card: { borderWidth: 1, borderRadius: 14, padding: 14, gap: 12 },
  sectionTitle: { fontSize: 16, fontWeight: "700" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowText: { flex: 1, marginLeft: 10, fontSize: 16, fontWeight: "500" },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 10 : 6,
  },
  primaryBtn: {
    marginTop: 4,
    backgroundColor: "black",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  primaryText: { color: "white", fontWeight: "700" },
  smallBtn: {
    backgroundColor: "#111",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  smallText: { color: "white", fontWeight: "700" },
  dangerBtn: {
    marginTop: 8,
    backgroundColor: "#ef4444",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    gap: 6,
    flexDirection: "row",
    justifyContent: "center",
  },
  dangerText: { color: "white", fontWeight: "700" },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)" },
  modalSheet: {
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    gap: 8,
  },
  modalRow: {
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalText: { fontSize: 16 },
});
