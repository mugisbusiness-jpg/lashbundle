"use client";

import { useEffect, useState } from "react";
import { applyTheme } from "../../../components/ThemeRuntime";
import { getSettings, saveSettings } from "../../../lib/storage";
import type { AppSettings, ThemeConfig } from "../../../lib/types";

const presets: Array<{name: string; values: Partial<ThemeConfig>}> = [
  {
    name: "Dark + Pantone 291 C",
    values: {
      primary: "#9BCBEB",
      primaryStrong: "#63A9D3",
      background: "#090B0A",
      surface: "#111412",
      ink: "#F7F8F6",
      muted: "#9AA29B",
      heroStyle: "minimal"
    }
  },
  {
    name: "Midnight Blue",
    values: {
      primary: "#9BCBEB",
      primaryStrong: "#6DB7E1",
      background: "#071017",
      surface: "#0D1820",
      ink: "#F7FAFC",
      muted: "#91A2AC",
      heroStyle: "editorial"
    }
  },
  {
    name: "Black Editorial",
    values: {
      primary: "#B6DDF4",
      primaryStrong: "#8EC7EA",
      background: "#050505",
      surface: "#111111",
      ink: "#FAFAFA",
      muted: "#969696",
      heroStyle: "minimal"
    }
  }
];

export default function ThemeStudio() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  if (!settings) return null;

  const setTheme = <K extends keyof ThemeConfig>(key: K, value: ThemeConfig[K]) => {
    const next = {
      ...settings,
      theme: { ...settings.theme, [key]: value }
    };
    setSettings(next);
    applyTheme(next);
  };

  const applyPreset = (values: Partial<ThemeConfig>) => {
    const next = {
      ...settings,
      theme: { ...settings.theme, ...values }
    };
    setSettings(next);
    applyTheme(next);
  };

  const save = () => {
    saveSettings(settings);
    applyTheme(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="adminContent">
      <div className="adminTop">
        <div>
          <span className="adminKicker">FRONTEND THEME STUDIO</span>
          <h1>Change the mood anytime.</h1>
          <p>Control the academy’s colors and visual personality directly from admin.</p>
        </div>
        <button className="adminSaveBtn" onClick={save}>{saved ? "Saved ✓" : "Save theme"}</button>
      </div>

      <div className="themeLayout">
        <section className="adminPanel">
          <div className="panelTitle"><div><span>QUICK THEMES</span><h2>Presets</h2></div></div>
          <div className="presetGrid">
            {presets.map((preset) => (
              <button key={preset.name} className="presetCard" onClick={() => applyPreset(preset.values)}>
                <div className="presetSwatches">
                  <i style={{background: preset.values.primary}}/>
                  <i style={{background: preset.values.primaryStrong}}/>
                  <i style={{background: preset.values.ink}}/>
                </div>
                <strong>{preset.name}</strong>
                <span>Apply preset</span>
              </button>
            ))}
          </div>

          <div className="panelDivider"/>

          <div className="panelTitle"><div><span>CUSTOM COLORS</span><h2>Brand palette</h2></div></div>
          <div className="colorEditorGrid">
            {[
              ["primary", "Primary / Pantone"],
              ["primaryStrong", "Strong blue"],
              ["background", "Page background"],
              ["surface", "Cards / surfaces"],
              ["ink", "Main text"],
              ["muted", "Secondary text"]
            ].map(([key, label]) => (
              <label className="colorControl" key={key}>
                <span>{label}</span>
                <div>
                  <input
                    type="color"
                    value={settings.theme[key as keyof ThemeConfig] as string}
                    onChange={(e) => setTheme(key as keyof ThemeConfig, e.target.value as never)}
                  />
                  <code>{settings.theme[key as keyof ThemeConfig] as string}</code>
                </div>
              </label>
            ))}
          </div>
        </section>

        <div className="themeSide">
          <section className="adminPanel">
            <div className="panelTitle"><div><span>SHAPE</span><h2>UI character</h2></div></div>

            <label className="adminField stacked">
              <span>Corner radius: {settings.theme.radius}px</span>
              <input type="range" min="4" max="38" value={settings.theme.radius} onChange={(e) => setTheme("radius", Number(e.target.value))}/>
            </label>

            <label className="adminField stacked">
              <span>Hero style</span>
              <select value={settings.theme.heroStyle} onChange={(e) => setTheme("heroStyle", e.target.value as ThemeConfig["heroStyle"])}>
                <option value="cloud">Cloud / Pantone</option>
                <option value="editorial">Editorial</option>
                <option value="minimal">Minimal</option>
              </select>
            </label>

            <label className="adminField stacked">
              <span>Button shape</span>
              <select value={settings.theme.buttonStyle} onChange={(e) => setTheme("buttonStyle", e.target.value as ThemeConfig["buttonStyle"])}>
                <option value="pill">Pill</option>
                <option value="soft">Soft corners</option>
                <option value="square">Sharper</option>
              </select>
            </label>
          </section>

          <section className="themePreview">
            <span className="adminKicker">LIVE PREVIEW</span>
            <h3>Classic Course</h3>
            <p>Premium private education, class by class.</p>
            <button className="btn btnPrimary">Buy video</button>
          </section>
        </div>
      </div>
    </div>
  );
}
