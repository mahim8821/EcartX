// lib/products.ts
export type Product = {
  id: string;
  title: string;
  price: number;
  image: string;
  rating?: number;
};

export const PRODUCTS: Product[] = [
  { id: "p1", title: "Classic T-Shirt", price: 19.99, image: require("../../assets/images/tshirt.png"),       rating: 4.5 },
  { id: "p2", title: "Sneakers",        price: 59.0,  image: require("../../assets/images/sneakers.jpg"),     rating: 4.2 },
  { id: "p3", title: "Backpack",        price: 29.5,  image: require("../../assets/images/backpack.jpeg"),    rating: 4.7 },
  { id: "p4", title: "Headphones",      price: 89.0,  image: require("../../assets/images/Headphones.jpeg"),  rating: 4.1 },
  { id: "p5", title: "Watch",           price: 120.0, image: require("../../assets/images/watchs.webp"),      rating: 4.8 },
  { id: "p6", title: "Sunglasses",      price: 25.0,  image: require("../../assets/images/sunglasses.jpg"),   rating: 4.0 },
  { id: "p7", title: "Hoodie",          price: 39.0,  image: require("../../assets/images/hoodie.jpg"),       rating: 4.4 },
  { id: "p8", title: "Cap",             price: 14.0,  image: require("../../assets/images/cap.jpeg"),         rating: 3.9 },
];