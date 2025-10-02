// lib/cart.tsx
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ImageSourcePropType } from "react-native";

export type CartItem = {
  id: string;
  title: string;
  price: number;
  image: ImageSourcePropType; // works with require(...) or { uri }
  qty: number;
};

type CartCtx = {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  totalQty: number;
  totalPrice: number;
};

const CartContext = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const add: CartCtx["add"] = (item, qty = 1) =>
    setItems((prev) => {
      const i = prev.findIndex((x) => x.id === item.id);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + qty };
        return next;
      }
      return [...prev, { ...item, qty }];
    });

  const increment = (id: string) =>
    setItems((prev) =>
      prev.map((x) => (x.id === id ? { ...x, qty: x.qty + 1 } : x))
    );

  const decrement = (id: string) =>
    setItems((prev) =>
      prev
        .map((x) => (x.id === id ? { ...x, qty: x.qty - 1 } : x))
        .filter((x) => x.qty > 0)
    );

  const remove = (id: string) =>
    setItems((prev) => prev.filter((x) => x.id !== id));
  const clear = () => setItems([]);

  const { totalQty, totalPrice } = useMemo(() => {
    const q = items.reduce((s, x) => s + x.qty, 0);
    const p = items.reduce((s, x) => s + x.price * x.qty, 0);
    return { totalQty: q, totalPrice: p };
  }, [items]);

  const value = {
    items,
    add,
    increment,
    decrement,
    remove,
    clear,
    totalQty,
    totalPrice,
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
