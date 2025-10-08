// lib/catalog.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Product } from "./products";

export type SortKey = "popular" | "price_low_high" | "price_high_low" | "discount" | "newest";

export function finalPrice(p: Product): number {
  if (!p.offer) return p.price;
  if (p.offer.type === "percent") return +(p.price * (1 - p.offer.value / 100)).toFixed(2);
  return Math.max(0, +(p.price - p.offer.value).toFixed(2));
}

export function discountPercent(p: Product): number {
  if (!p.offer) return 0;
  if (p.offer.type === "percent") return p.offer.value;
  return Math.max(0, Math.round((p.offer.value / p.price) * 100));
}

export function inStock(p: Product) { return (p.stock ?? 0) > 0; }

export function filterAndSortProducts(opts: {
  products: Product[];
  term?: string;
  category?: string; // "all" | "fashion" | "medical" (macro) | exact
  medicalSub?: "all" | "medical_medicine" | "medical_sanitary" | "medical_device";
  onlyOffers?: boolean;
  ratingMin?: number;
  priceMin?: number;
  priceMax?: number;
  inStockOnly?: boolean;
  brands?: string[];
  sortKey?: SortKey;
}): Product[] {
  const {
    products, term = "", category = "all", medicalSub = "all",
    onlyOffers, ratingMin, priceMin, priceMax, inStockOnly, brands, sortKey = "popular",
  } = opts;

  let data = products.slice();

  // search
  const t = term.trim().toLowerCase();
  if (t) {
    data = data.filter(p =>
      p.title.toLowerCase().includes(t) ||
      (p.tags || []).some(tag => tag.toLowerCase().includes(t))
    );
  }

  // category
  if (category !== "all") {
    if (category === "medical") {
      if (medicalSub !== "all") data = data.filter(p => p.categories.includes(medicalSub as any));
      else data = data.filter(p => p.categories.some(c => c.startsWith("medical_")));
    } else {
      data = data.filter(p => p.categories.includes(category as any));
    }
  }

  // filters
  if (onlyOffers) data = data.filter(p => p.offer);
  if (typeof ratingMin === "number") data = data.filter(p => (p.rating ?? 0) >= ratingMin);
  if (typeof priceMin === "number") data = data.filter(p => finalPrice(p) >= priceMin);
  if (typeof priceMax === "number") data = data.filter(p => finalPrice(p) <= priceMax);
  if (inStockOnly) data = data.filter(inStock);
  if (brands && brands.length) data = data.filter(p => p.brand && brands.includes(p.brand));

  // sort
  const cmp: Record<SortKey, (a: Product, b: Product) => number> = {
    popular: (a, b) => (b.rating ?? 0) - (a.rating ?? 0),
    price_low_high: (a, b) => finalPrice(a) - finalPrice(b),
    price_high_low: (a, b) => finalPrice(b) - finalPrice(a),
    discount: (a, b) => discountPercent(b) - discountPercent(a),
    newest: (_a, _b) => 0, // later if you add createdAt
  };

  data.sort(cmp[sortKey]);
  return data;
}

/* ---------- tiny persistence (AsyncStorage) ---------- */
const KEY = "ecartx_browse_ui_state";

export type BrowseUIState = {
  selectedCategory: string;
  medicalSub: "all" | "medical_medicine" | "medical_sanitary" | "medical_device";
  sortKey: SortKey;
  lastSearch: string;
};

export async function saveBrowseState(state: BrowseUIState) {
  try { await AsyncStorage.setItem(KEY, JSON.stringify(state)); } catch {}
}

export async function loadBrowseState(): Promise<BrowseUIState | null> {
  try {
    const s = await AsyncStorage.getItem(KEY);
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}
