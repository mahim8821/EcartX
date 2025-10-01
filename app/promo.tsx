// app/promo.tsx
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
const { width } = Dimensions.get("window");

type Banner = {
  id: string;
  title: string;
  subtitle: string;
  image: ImageSourcePropType;
  badge?: string;
  bg?: string; // fallback gradient-ish block
};

const BANNERS: Banner[] = [
  {
    id: "1",
    title: "Medicine Item  💊 ",
    subtitle: "Get Authentic Medicine with Free Delivary🚚",
    image: require("/Users/mahim/MyFirstApp/assets/images/EcartX_MEDICINE.png"),
    badge: "Health",
  },
  {
    id: "2",
    title: "New Arrivals ✨",
    subtitle: "Fresh styles just dropped",
    image: require("/Users/mahim/MyFirstApp/assets/images/NewArrivals.png"),
    badge: "NEW",
  },
  {
    id: "3",
    title: "Free Shipping 🚚",
    subtitle: "On orders over $50",
    image: require("/Users/mahim/MyFirstApp/assets/images/freedelivary.jpg"),
    badge: "FREE",
  },
  {
    id: "4",
    title: "Hot Deals 🔥",
    subtitle: "Up to 50% off selected items",
    image: require("/Users/mahim/MyFirstApp/assets/images/50per.webp"),
    badge: "-50%",
  },
];

export default function Promo() {
  const [index, setIndex] = useState(0);
  const ref = useRef<FlatList<Banner>>(null);

  const goBrowse = () => router.replace("/(tabs)/browse"); // change if your main route differs

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Skip */}
      <Pressable style={styles.skip} onPress={goBrowse} hitSlop={10}>
        <Text style={styles.skipText}>Skip</Text>
      </Pressable>

      {/* Title */}
      <Text style={styles.header}>EcartX</Text>
      <Text style={styles.subheader}>Deals, Promos & Hot Picks</Text>

      {/* Banner carousel */}
      <FlatList
        ref={ref}
        data={BANNERS}
        keyExtractor={(b) => b.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          const i = Math.round(e.nativeEvent.contentOffset.x / width);
          if (i !== index) setIndex(i);
        }}
        renderItem={({ item }) => (
          <View style={{ width, paddingHorizontal: 16 }}>
            <View style={styles.card}>
              <Image
                source={item.image}
                style={styles.image}
                resizeMode="cover"
              />
              {item.badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              )}
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
              </View>
              <Pressable style={styles.cta} onPress={goBrowse}>
                <Text style={styles.ctaText}>Get Deal</Text>
              </Pressable>
            </View>
          </View>
        )}
      />

      {/* Dots */}
      <View style={styles.dots}>
        {BANNERS.map((_, i) => (
          <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
        ))}
      </View>

      {/* Bottom “Continue” */}
      <Pressable style={styles.continue} onPress={goBrowse}>
        <Text style={styles.continueText}>Continue to Browse</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B1020", paddingTop: 26 },
  skip: { position: "absolute", right: 30, top: 60, zIndex: 2 },
  skipText: { color: "#ffffffff", fontWeight: "600" },
  header: {
    color: "white",
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 20,
  },
  subheader: {
    color: "#cbd5e1",
    textAlign: "center",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#12182B",
    borderRadius: 20,
    overflow: "hidden",
    height: 360,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  image: { width: "100%", height: 230 },
  badge: {
    position: "absolute",
    left: 320,
    top: 200,
    backgroundColor: "#EF4444",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: { color: "white", fontWeight: "800", fontSize: 12 },
  cardText: { padding: 12 },
  cardTitle: { color: "white", fontSize: 18, fontWeight: "800" },
  cardSubtitle: { color: "#cbd5e1", marginTop: 4 },
  cta: {
    position: "absolute",
    right: 12,
    bottom: 12,
    backgroundColor: "#4F46E5",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  ctaText: { color: "white", fontWeight: "700" },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 14,
  },
  dot: { width: 8, height: 8, borderRadius: 999, backgroundColor: "#2A3148" },
  dotActive: { backgroundColor: "#6366F1", width: 30 },
  continue: {
    alignSelf: "center",
    marginTop: 30,
    marginBottom: 40,
    backgroundColor: "#4c4ec2ff",
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  continueText: {
    color: "white",
    fontWeight: "700",
    bottom: 0,
    marginTop: 0,
    marginBottom: 0,
  },
});
