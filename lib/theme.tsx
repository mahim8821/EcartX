// lib/theme.tsx
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Colors = {
  bg: string;
  fg: string;
  muted: string;
  card: string;
  border: string;
  tint: string;
  success: string;
  danger: string;
  warning: string;
};
type Theme = {
  dark: boolean;
  toggle: () => void;
  colors: Colors;
  radius: { sm: number; md: number; lg: number; xl: number };
  spacing: (n: number) => number; // spacing(2) = 8
  shadow: (elev?: 3 | 6 | 12) => object; // cross-platform shadow helper
};

const LIGHT: Colors = {
  bg: "#ffffffff",
  fg: "#0b0b0f",
  muted: "#3a4150ff",
  card: "#f9fafb",
  border: "#bdc2caff",
  tint: "#0a515f", // your teal
  success: "#16a34a",
  danger: "#ef4444",
  warning: "#f59e0b",
};

const DARK: Colors = {
  bg: "#02151fff",
  fg: "#d4d4eeff",
  muted: "#a3a3ad",
  card: "#2b2b3aff",
  border: "#133d5dff",
  tint: "#0aabbaff",
  success: "#22c55e",
  danger: "#f87171",
  warning: "#fbbf24",
};

const Ctx = createContext<Theme | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(false);
  const value = useMemo<Theme>(() => {
    const colors = dark ? DARK : LIGHT;
    return {
      dark,
      toggle: () => setDark((d) => !d),
      colors,
      radius: { sm: 8, md: 12, lg: 16, xl: 22 },
      spacing: (n: number) => n * 4,
      shadow: (elev: 3 | 6 | 12 = 3) => {
        const map = {
          3: {
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 3 },
            elevation: 3,
          },
          6: {
            shadowColor: "#000",
            shadowOpacity: 0.12,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 6 },
            elevation: 6,
          },
          12: {
            shadowColor: "#000",
            shadowOpacity: 0.16,
            shadowRadius: 20,
            shadowOffset: { width: 0, height: 12 },
            elevation: 12,
          },
        } as const;
        return map[elev];
      },
    };
  }, [dark]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export function useTheme() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
