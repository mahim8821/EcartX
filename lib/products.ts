// lib/products.ts
export type Product = {
  id: string;
  title: string;
  price: number;
  image: string;
  rating?: number;
};

export const PRODUCTS: Product[] = [
  { id: "p1", title: "Classic T-Shirt", price: 19.99, image: "../assets/images/tshirt.png", rating: 4.5 },
  { id: "p2", title: "Sneakers",       price: 59.0,  image: "https://picsum.photos/seed/shoes/400/400", rating: 4.2 },
  { id: "p3", title: "Backpack",       price: 29.5,  image: "https://picsum.photos/seed/bag/400/400",   rating: 4.7 },
  { id: "p4", title: "Headphones",     price: 89.0,  image: "https://picsum.photos/seed/phones/400/400",rating: 4.1 },
  { id: "p5", title: "Watch",          price: 120.0, image: "https://picsum.photos/seed/watch/400/400", rating: 4.8 },
  { id: "p6", title: "Sunglasses",     price: 25.0,  image: "https://picsum.photos/seed/glasses/400/400",rating: 4.0 },
  { id: "p7", title: "Hoodie",         price: 39.0,  image: "https://picsum.photos/seed/hoodie/400/400", rating: 4.4 },
  { id: "p8", title: "Cap",            price: 14.0,  image: "https://picsum.photos/seed/cap/400/400",    rating: 3.9 },
];
