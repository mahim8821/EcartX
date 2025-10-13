import { ImageSourcePropType } from "react-native";

export type Category =
  | "fashion"
  | "electronics"
  | "home"
  | "grocery"
  | "medical_medicine"
  | "medical_sanitary"
  | "medical_device";

export type Offer = {
  type: "flat" | "percent";
  value: number;
  label?: string;
  expiresAt?: string;
};

export type Product = {
  id: string;
  title: string;
  brand?: string;
  price: number;
  image: ImageSourcePropType;
  rating?: number; // 0..5
  reviews?: number; // <— added
  stock?: number; // 0 = OOS
  categories: Category[];
  tags?: string[];
  offer?: Offer;

  // fields used by the Product Details screen
  description?: string; // <— added
  colors?: string[]; // hex colors used for color dots
  sizes?: ("XS" | "S" | "M" | "L" | "XL")[]; // available sizes (if applicable)
};

/* ----------------------- Data ----------------------- */

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    title: "Classic T-Shirt",
    brand: "EcartX",
    price: 19.99,
    image: require("../assets/images/tshirt.png"),
    rating: 4.5,
    reviews: 136,
    stock: 12,
    categories: ["fashion"],
    tags: ["shirt", "top"],
    offer: { type: "percent", value: 15, label: "Deal" },
    description:
      "Soft cotton tee with a relaxed fit. Breathable and durable — perfect for everyday wear.",
    colors: ["#0f172a", "#1f2937", "#93c5fd", "#e5e7eb"],
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: "p2",
    title: "Sneakers",
    brand: "Runner",
    price: 59.0,
    image: require("../assets/images/sneakers.jpg"),
    rating: 4.2,
    reviews: 98,
    stock: 22,
    categories: ["fashion"],
    tags: ["shoes"],
    description:
      "Lightweight everyday sneakers with cushioned midsole for all-day comfort.",
    colors: ["#111827", "#9ca3af", "#e5e7eb"],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "p3",
    title: "Backpack",
    brand: "Urban",
    price: 29.5,
    image: require("../assets/images/backpack.jpeg"),
    rating: 4.7,
    reviews: 75,
    stock: 8,
    categories: ["home"],
    tags: ["bag"],
    description:
      "Durable backpack with laptop sleeve, water-resistant fabric, and multiple organizer pockets.",
    colors: ["#111827", "#374151", "#6b7280"],
  },
  {
    id: "p4",
    title: "Headphones",
    brand: "AudioPro",
    price: 89.0,
    image: require("../assets/images/Headphones.jpeg"),
    rating: 4.1,
    reviews: 112,
    stock: 5,
    categories: ["electronics"],
    tags: ["audio"],
    description:
      "Over-ear headphones with deep bass and comfortable memory-foam ear cushions.",
    colors: ["#111827", "#9ca3af"],
  },
  {
    id: "p5",
    title: "Watch",
    brand: "Tickr",
    price: 120.0,
    image: require("../assets/images/watchs.webp"),
    rating: 4.8,
    reviews: 203,
    stock: 0,
    categories: ["fashion"],
    tags: ["wearable"],
    offer: { type: "flat", value: 20, label: "Sale" },
    description:
      "Elegant chronograph with stainless steel case, leather strap, and water resistance.",
    colors: ["#1f2937", "#8d99ae", "#d4af37"], // dark, silver, gold tones
    sizes: ["M", "L", "XL"],
  },
  {
    id: "p6",
    title: "Sunglasses",
    brand: "ShadeX",
    price: 25.0,
    image: require("../assets/images/sunglasses.jpg"),
    rating: 4.0,
    reviews: 61,
    stock: 40,
    categories: ["fashion"],
    tags: ["uv"],
    description:
      "UV400-rated lenses with lightweight frame. Classic fit for outdoor use.",
    colors: ["#111827", "#6b7280"],
  },
  {
    id: "p7",
    title: "Hoodie",
    brand: "EcartX",
    price: 39.0,
    image: require("../assets/images/hoodie.jpg"),
    rating: 4.4,
    reviews: 84,
    stock: 11,
    categories: ["fashion"],
    tags: ["winter"],
    description:
      "Cozy fleece hoodie with kangaroo pocket and ribbed cuffs for warmth.",
    colors: ["#111827", "#374151", "#9ca3af"],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "p8",
    title: "Cap",
    brand: "EcartX",
    price: 14.0,
    image: require("../assets/images/cap.jpeg"),
    rating: 3.9,
    reviews: 45,
    stock: 33,
    categories: ["fashion"],
    tags: ["hat"],
    description:
      "Adjustable cotton cap with breathable eyelets and curved brim.",
    colors: ["#111827", "#6b7280", "#e5e7eb"],
    sizes: ["S", "M", "L"],
  },
  {
    id: "p9",
    title: "Microwave Oven",
    brand: "Conion",
    price: 100.0,
    image: require("../assets/images/MWO-1-2.webp"),
    rating: 4.6,
    reviews: 150,
    stock: 15,
    categories: ["electronics"],
    tags: ["oven"],
    description:
      "20L compact microwave with quick-start and defrost modes for everyday cooking.",
    colors: ["#111827", "#e5e7eb"],
  },
  {
    id: "p10",
    title: "Macbook Air M2",
    brand: "Apple",
    price: 999.0,
    image: require("../assets/images/Macbook.jpg"),
    rating: 4.3,
    reviews: 67,
    stock: 18,
    categories: ["electronics"],
    tags: ["laptop"],
    description:
      "Ultra-portable laptop with Apple M2 chip, Retina display, and all-day battery life.",
    colors: ["#111827", "#9ca3af", "#e5e7eb"],
  },

  // ——— Medical aisle
  {
    id: "m1",
    title: "Paracetamol 500mg",
    brand: "Beximco",
    price: 2.5,
    image: require("../assets/images/napa.png"),
    rating: 4.6,
    reviews: 310,
    stock: 100,
    categories: ["medical_medicine"],
    tags: ["fever", "acetaminophen"],
    offer: { type: "percent", value: 10 },
    description:
      "Pain and fever reducer (acetaminophen). Follow dosage instructions on package.",
  },
  {
    id: "m2",
    title: "Sepnil Hand Sanitizer 200ml",
    brand: "Sepnil",
    price: 3.2,
    image: require("../assets/images/sepnil-instant-hand-sanitizer-200-ml.webp"),
    rating: 4.3,
    reviews: 141,
    stock: 60,
    categories: ["medical_sanitary"],
    tags: ["sanitary", "alcohol"],
    description:
      "Instant hand sanitizer with moisturizers. Effective cleansing without water.",
  },
  {
    id: "m3",
    title: "3-ply Face Mask (50 pcs)",
    brand: "SafeAir",
    price: 4.9,
    image: require("../assets/images/mask.jpeg"),
    rating: 4.1,
    reviews: 220,
    stock: 0,
    categories: ["medical_sanitary"],
    tags: ["mask"],
    offer: { type: "percent", value: 25, label: "-25%" },
    description:
      "Three-layer disposable masks with elastic ear loops. Comfortable daily protection.",
    colors: ["#93c5fd", "#e5e7eb"],
  },
  {
    id: "m4",
    title: "Digital Thermometer",
    brand: "ThermoX",
    price: 8.5,
    image: require("../assets/images/Digital Thermometer.webp"),
    rating: 4.5,
    reviews: 96,
    stock: 20,
    categories: ["medical_device"],
    tags: ["fever", "device"],
    description:
      "Accurate temperature readings with quick response and memory recall.",
    colors: ["#e5e7eb", "#9ca3af"],
  },
  {
    id: "m5",
    title: "Blood Pressure Monitor (OMRON)",
    brand: "Omron",
    price: 45.0,
    image: require("../assets/images/BPM.avif"),
    rating: 4.7,
    reviews: 128,
    stock: 10,
    categories: ["medical_device"],
    tags: ["bp", "device"],
    description:
      "Automatic upper-arm BP monitor with large display and irregular heartbeat detection.",
    colors: ["#111827", "#e5e7eb"],
  },
];
