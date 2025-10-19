// lib/wishlist.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Product } from "./products";

export type WishlistItem = Pick<
  Product,
  "id" | "title" | "image" | "price" | "brand"
>;

type WishlistCtx = {
  items: WishlistItem[];
  add: (item: WishlistItem) => void;
  remove: (id: string) => void;
  has: (id: string) => boolean;
  clear: () => void;
  count: number;
};

const WishlistContext = createContext<WishlistCtx | null>(null);
const STORAGE_KEY = "@ecartx:wishlist:v1";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const count = items.length;

  // hydrate once
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setItems(JSON.parse(raw));
      } catch {}
    })();
  }, []);

  // persist on change
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items)).catch(() => {});
  }, [items]);

  const add = (item: WishlistItem) =>
    setItems((prev) =>
      prev.find((x) => x.id === item.id) ? prev : [item, ...prev]
    );

  const remove = (id: string) =>
    setItems((prev) => prev.filter((x) => x.id !== id));

  const has = (id: string) => items.some((x) => x.id === id);

  const clear = () => setItems([]);

  const value = useMemo(
    () => ({ items, add, remove, has, clear, count }),
    [items, count]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx)
    throw new Error("WishlistContext missing — wrap app with WishlistProvider");
  return ctx;
}
