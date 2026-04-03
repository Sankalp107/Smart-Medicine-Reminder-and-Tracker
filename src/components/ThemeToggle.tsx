"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
      aria-label="Toggle Dark Mode"
    >
      {theme === "dark" ? (
        <Sun className="w-3.5 h-3.5 text-warning" />
      ) : (
        <Moon className="w-3.5 h-3.5 text-foreground" />
      )}
    </button>
  );
}
