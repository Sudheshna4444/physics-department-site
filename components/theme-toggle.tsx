"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "physics-dept-theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem(STORAGE_KEY);
    const initialTheme =
      savedTheme === "dark" || savedTheme === "light"
        ? savedTheme
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";

    document.documentElement.dataset.theme = initialTheme;
    setTheme(initialTheme);
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
    setTheme(nextTheme);
  }

  return (
    <button
      aria-label="Toggle color theme"
      className="theme-toggle"
      onClick={toggleTheme}
      type="button"
    >
      {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
      <span>{theme === "light" ? "Dark" : "Light"}</span>
    </button>
  );
}
