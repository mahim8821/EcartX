// components/FilterSheet.tsx
import React, { useState } from "react";
import { Modal, Pressable, Switch, Text, TextInput, View } from "react-native";
import { useTheme } from "../lib/theme";

export type Filters = {
  onlyOffers: boolean;
  inStockOnly: boolean;
  ratingMin?: number;
  priceMin?: number;
  priceMax?: number;
  brand?: string;
};

export default function FilterSheet({
  visible,
  onClose,
  value,
  onApply,
}: {
  visible: boolean;
  onClose: () => void;
  value: Filters;
  onApply: (f: Filters) => void;
}) {
  const { colors } = useTheme();
  const [f, setF] = useState<Filters>(value);

  const input = (k: keyof Filters, v: any) => setF({ ...f, [k]: v });

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable
        style={{ flex: 1, backgroundColor: "#00000055" }}
        onPress={onClose}
      >
        <Pressable
          onPress={() => {}}
          style={{
            marginTop: "auto",
            backgroundColor: colors.bg,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            padding: 16,
            gap: 12,
            borderTopWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Text style={{ color: colors.fg, fontWeight: "800", fontSize: 16 }}>
            Filters
          </Text>

          <Row label="Offers only">
            <Switch
              value={f.onlyOffers}
              onValueChange={(v) => input("onlyOffers", v)}
            />
          </Row>

          <Row label="In stock only">
            <Switch
              value={f.inStockOnly}
              onValueChange={(v) => input("inStockOnly", v)}
            />
          </Row>

          <Row label="Min rating">
            <TextInput
              keyboardType="numeric"
              placeholder="4.0"
              placeholderTextColor={colors.muted}
              value={f.ratingMin ? String(f.ratingMin) : ""}
              onChangeText={(t) =>
                input("ratingMin", t ? parseFloat(t) : undefined)
              }
              style={field(colors)}
            />
          </Row>

          <Row label="Price min/max">
            <View style={{ flexDirection: "row", gap: 8, flex: 1 }}>
              <TextInput
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={colors.muted}
                value={f.priceMin ? String(f.priceMin) : ""}
                onChangeText={(t) =>
                  input("priceMin", t ? parseFloat(t) : undefined)
                }
                style={[field(colors), { flex: 1 }]}
              />
              <TextInput
                keyboardType="numeric"
                placeholder="9999"
                placeholderTextColor={colors.muted}
                value={f.priceMax ? String(f.priceMax) : ""}
                onChangeText={(t) =>
                  input("priceMax", t ? parseFloat(t) : undefined)
                }
                style={[field(colors), { flex: 1 }]}
              />
            </View>
          </Row>

          <Row label="Brand">
            <TextInput
              placeholder="EcartX / Runner / ..."
              placeholderTextColor={colors.muted}
              value={f.brand ?? ""}
              onChangeText={(t) => input("brand", t || undefined)}
              style={field(colors)}
            />
          </Row>

          <View style={{ flexDirection: "row", gap: 10, marginTop: 8 }}>
            <Pressable
              onPress={() => setF({ onlyOffers: false, inStockOnly: false })}
              style={btn(colors, "outline")}
            >
              <Text style={{ color: colors.fg, fontWeight: "700" }}>Reset</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                onApply(f);
                onClose();
              }}
              style={btn(colors, "primary")}
            >
              <Text style={{ color: colors.bg, fontWeight: "800" }}>Apply</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const { colors } = useTheme();
  return (
    <View style={{ gap: 8 }}>
      <Text style={{ color: colors.fg, fontWeight: "700" }}>{label}</Text>
      {children}
    </View>
  );
}

const field = (colors: any) => ({
  borderWidth: 1,
  borderColor: colors.border,
  backgroundColor: colors.card,
  color: colors.fg,
  borderRadius: 10,
  padding: 10,
});
const btn = (colors: any, type: "primary" | "outline"): any =>
  type === "primary"
    ? ({
        flex: 1,
        backgroundColor: colors.tint,
        borderRadius: 12,
        alignItems: "center" as const,
        paddingVertical: 12,
      } as any)
    : ({
        flex: 1,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        alignItems: "center" as const,
        paddingVertical: 12,
      } as any);
