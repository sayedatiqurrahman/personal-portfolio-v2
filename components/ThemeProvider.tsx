"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Accent = "green" | "yellow" | "cyan" | "magenta" | "orange" | "pink" | "lime";

type AccentContextType = {
  accent: Accent;
  setAccent: (a: Accent) => void;
};

const AccentContext = createContext<AccentContextType>({
  accent: "green",
  setAccent: () => {},
});

export function useAccent() {
  return useContext(AccentContext);
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [accent, setAccent] = useState<Accent>("green");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("accent") as Accent | null;
    if (stored) setAccent(stored);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-accent", accent);
    localStorage.setItem("accent", accent);
  }, [accent, mounted]);

  return (
    <AccentContext.Provider value={{ accent, setAccent }}>
      {children}
    </AccentContext.Provider>
  );
}
