"use client";

import { useEffect } from "react";
import { getSettings } from "../lib/storage";
import type { AppSettings } from "../lib/types";

export function applyTheme(settings: AppSettings) {
  const root = document.documentElement;
  const theme = settings.theme;

  root.style.setProperty("--primary", theme.primary);
  root.style.setProperty("--primary-strong", theme.primaryStrong);
  root.style.setProperty("--page", theme.background);
  root.style.setProperty("--surface", theme.surface);
  root.style.setProperty("--ink", theme.ink);
  root.style.setProperty("--muted", theme.muted);
  root.style.setProperty("--radius", `${theme.radius}px`);
  root.style.setProperty(
    "--button-radius",
    theme.buttonStyle === "pill"
      ? "999px"
      : theme.buttonStyle === "soft"
      ? "14px"
      : "5px"
  );
  document.documentElement.dataset.hero = theme.heroStyle;
}

export default function ThemeRuntime() {
  useEffect(() => {
    const sync = () => applyTheme(getSettings());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("lm-demo-updated", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("lm-demo-updated", sync);
    };
  }, []);

  return null;
}
