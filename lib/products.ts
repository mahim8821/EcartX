// lib/products.ts
import { ImageSourcePropType } from "react-native";

export type Category =
  | "fashion" | "electronics" | "home" | "grocery"
  | "medical_medicine" | "medical_sanitary" | "medical_device";

export type Offer = { type: "flat" | "percent"; value: number; label?: string; expiresAt?: string };

export type Product = {
  id: string;
  title: string;
  brand?: string;
  price: number;
  image: ImageSourcePropType;
  rating?: number; // 0..5
  stock?: number;  // 0 = OOS
  categories: Category[];
  tags?: string[];
  offer?: Offer;
};

export const PRODUCTS: Product[] = [
  { id: "p1", title: "Classic T-Shirt", brand: "EcartX", price: 19.99, image: require("/Users/mahim/MyFirstApp/assets/images/tshirt.png"), rating: 4.5, stock: 12, categories: ["fashion"], tags: ["shirt","top"], offer:{type:"percent", value:15, label:"Deal"} },
  { id: "p2", title: "Sneakers", brand: "Runner", price: 59.0, image: require("/Users/mahim/MyFirstApp/assets/images/sneakers.jpg"), rating: 4.2, stock: 22, categories: ["fashion"], tags:["shoes"] },
  { id: "p3", title: "Backpack", brand: "Urban", price: 29.5, image: require("/Users/mahim/MyFirstApp/assets/images/backpack.jpeg"), rating: 4.7, stock: 8, categories: ["home"], tags:["bag"] },
  { id: "p4", title: "Headphones", brand: "AudioPro", price: 89.0, image: require("/Users/mahim/MyFirstApp/assets/images/Headphones.jpeg"), rating: 4.1, stock: 5, categories: ["electronics"], tags:["audio"] },
  { id: "p5", title: "Watch", brand: "Tickr", price: 120.0, image: require("/Users/mahim/MyFirstApp/assets/images/watchs.webp"), rating: 4.8, stock: 0, categories: ["electronics"], tags:["wearable"], offer:{type:"flat", value:20, label:"Sale"} },
  { id: "p6", title: "Sunglasses", brand: "ShadeX", price: 25.0, image: require("/Users/mahim/MyFirstApp/assets/images/sunglasses.jpg"), rating: 4.0, stock: 40, categories: ["fashion"], tags:["uv"] },
  { id: "p7", title: "Hoodie", brand: "EcartX", price: 39.0, image: require("/Users/mahim/MyFirstApp/assets/images/hoodie.jpg"), rating: 4.4, stock: 11, categories: ["fashion"], tags:["winter"] },
  { id: "p8", title: "Cap", brand: "EcartX", price: 14.0, image: require("/Users/mahim/MyFirstApp/assets/images/cap.jpeg"), rating: 3.9, stock: 33, categories: ["fashion"], tags:["hat"] },

  // ——— Medical aisle
  { id: "m1", title: "Paracetamol 500mg ", brand: "Beximco", price: 2.5, image: require("/Users/mahim/MyFirstApp/assets/images/napa.png"), rating: 4.6, stock: 100, categories: ["medical_medicine"], tags:["fever","acetaminophen"], offer:{type:"percent", value:10} },
  { id: "m2", title: "Sepnil Hand Sanitizer 200ml", brand: "Sepnil", price: 3.2, image: require("/Users/mahim/MyFirstApp/assets/images/sepnil-instant-hand-sanitizer-200-ml.webp"), rating: 4.3, stock: 60, categories: ["medical_sanitary"], tags:["sanitary","alcohol"] },
  { id: "m3", title: "3-ply Face Mask (50 pcs)", brand: "SafeAir", price: 4.9, image: require("/Users/mahim/MyFirstApp/assets/images/mask.jpeg"), rating: 4.1, stock: 0, categories: ["medical_sanitary"], tags:["mask"], offer:{type:"percent", value:25, label:"-25%"} },
  { id: "m4", title: "Digital Thermometer", brand: "ThermoX", price: 8.5, image: require("/Users/mahim/MyFirstApp/assets/images/Digital Thermometer.webp"), rating: 4.5, stock: 20, categories: ["medical_device"], tags:["fever","device"] },
];
