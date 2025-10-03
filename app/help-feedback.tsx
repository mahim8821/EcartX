// app/help-feedback.tsx
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useTheme } from "../lib/theme";

export default function HelpFeedbackScreen() {
  const { colors } = useTheme();
  const fg = { color: colors.fg };
  const mut = { color: colors.muted };
  const cardBg = { backgroundColor: colors.card, borderColor: colors.border };

  const mailTo = () => Linking.openURL("mailto:support@ecartx.app");
  const callTo = () => Linking.openURL("tel:+880123456789");

  const [text, setText] = useState("");

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Stack.Screen
        options={{
          title: "Help & feedback",
          headerStyle: { backgroundColor: colors.bg },
          headerTitleStyle: { color: colors.fg },
          headerTintColor: colors.fg,
        }}
      />

      <ScrollView contentContainerStyle={styles.container}>
        {/* Help Center */}
        <View style={[styles.card, cardBg]}>
          <Text style={[styles.sectionTitle, fg]}>Help Center</Text>

          <MenuRow
            colors={colors}
            icon="help-circle-outline"
            title="FAQs"
            onPress={() => Alert.alert("Help", "Open FAQs (demo).")}
          />
          <MenuRow
            colors={colors}
            icon="cube-outline"
            title="Shipping & returns"
            onPress={() =>
              Alert.alert("Help", "Open Shipping & Returns (demo).")
            }
          />
          <MenuRow
            colors={colors}
            icon="shield-checkmark-outline"
            title="Warranty"
            onPress={() => Alert.alert("Help", "Open Warranty (demo).")}
          />

          <Pressable
            style={styles.primaryBtn}
            onPress={() => Alert.alert("Support", "Contact support (demo).")}
          >
            <Text style={styles.primaryText}>Get support →</Text>
          </Pressable>
        </View>

        {/* Customer care */}
        <View style={[styles.card, cardBg]}>
          <Text style={[styles.sectionTitle, fg]}>Customer care</Text>

          <Pressable style={styles.row} onPress={mailTo}>
            <Ionicons
              name="mail-outline"
              size={20}
              color={mut.color as string}
            />
            <Text style={[styles.rowText, fg]}>support@ecartx.app</Text>
            <Ionicons
              name="open-outline"
              size={18}
              color={mut.color as string}
            />
          </Pressable>

          <Pressable style={styles.row} onPress={callTo}>
            <Ionicons
              name="call-outline"
              size={20}
              color={mut.color as string}
            />
            <Text style={[styles.rowText, fg]}>+880-1-2345-6789</Text>
            <Ionicons
              name="open-outline"
              size={18}
              color={mut.color as string}
            />
          </Pressable>
        </View>

        {/* Feedback */}
        <View style={[styles.card, cardBg]}>
          <Text style={[styles.sectionTitle, fg]}>Feedback</Text>

          <TextInput
            value={text}
            onChangeText={setText}
            multiline
            placeholder="Tell us what to improve…"
            placeholderTextColor={colors.muted}
            style={[
              styles.input,
              {
                minHeight: 120,
                textAlignVertical: "top",
                borderColor: colors.border,
                backgroundColor: colors.bg,
                color: colors.fg,
              },
            ]}
          />

          <Pressable
            style={styles.primaryBtn}
            onPress={() => {
              setText("");
              Alert.alert("Thanks! 🫶", "Feedback submitted (demo).");
            }}
          >
            <Text style={styles.primaryText}>Submit feedback</Text>
          </Pressable>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

function MenuRow({
  colors,
  icon,
  title,
  onPress,
}: {
  colors: any;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <Ionicons name={icon} size={20} color={colors.muted} />
      <Text style={[styles.rowText, { color: colors.fg }]}>{title}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
});
