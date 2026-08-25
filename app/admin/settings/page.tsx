"use client";

import { useEffect, useState } from "react";
import {
  getSettings,
  resetDemo,
  revokeInviteAccess,
  saveSettings
} from "../../../lib/storage";
import type { AppSettings, FeatureConfig } from "../../../lib/types";

const featureCopy: Record<keyof FeatureConfig, [string, string]> = {
  inviteOnly: ["Invite-only academy", "Require a private invitation code before customers can see courses."],
  videoStore: ["Video store", "Show individual paid video classes on the frontend."],
  liveClasses: ["Live classes", "Show paid Live training and Live purchases."],
  testimonials: ["Testimonials", "Show the testimonial / brand statement section."],
  previews: ["Video previews", "Reserve the option to preview course content."],
  studentLibrary: ["Student library", "Give customers a private page for purchased access."],
  memberships: ["Memberships", "Future subscription model. Keep disabled for the client’s current pay-per-video plan."]
};

export default function AdminSettings() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  if (!settings) return null;

  const save = () => {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const toggle = (key: keyof FeatureConfig) => {
    setSettings({
      ...settings,
      features: {
        ...settings.features,
        [key]: !settings.features[key]
      }
    });
  };

  return (
    <div className="adminContent">
      <div className="adminTop">
        <div>
          <span className="adminKicker">ACADEMY SETTINGS</span>
          <h1>Features + access</h1>
          <p>Deactivate features without deleting them from the system.</p>
        </div>
        <button className="adminSaveBtn" onClick={save}>{saved ? "Saved ✓" : "Save changes"}</button>
      </div>

      <div className="settingsGrid">
        <section className="adminPanel">
          <div className="panelTitle"><div><span>FEATURE CONTROLS</span><h2>Frontend modules</h2></div></div>
          <div className="featureRows">
            {(Object.keys(featureCopy) as Array<keyof FeatureConfig>).map((key) => (
              <div className="featureControl" key={key}>
                <div>
                  <strong>{featureCopy[key][0]}</strong>
                  <p>{featureCopy[key][1]}</p>
                </div>
                <button className={`adminToggle ${settings.features[key] ? "on" : ""}`} onClick={() => toggle(key)}><i/></button>
              </div>
            ))}
          </div>
        </section>

        <div className="settingsSide">
          <section className="adminPanel">
            <div className="panelTitle"><div><span>PRIVATE ACCESS</span><h2>Invitation code</h2></div></div>
            <label className="adminField stacked">
              <span>Current invite code</span>
              <input value={settings.inviteCode} onChange={(e) => setSettings({...settings, inviteCode: e.target.value})}/>
            </label>
            <button className="secondaryAdminBtn" onClick={() => revokeInviteAccess()}>Lock this browser again</button>
            <p className="fieldHelp">Default demo code: <strong>CLASSIC291</strong></p>
          </section>

          <section className="adminPanel">
            <div className="panelTitle"><div><span>COURSE DEFAULTS</span><h2>Access rules</h2></div></div>
            <label className="adminField stacked">
              <span>Default video access days</span>
              <input type="number" min="1" value={settings.defaultAccessDays} onChange={(e) => setSettings({...settings, defaultAccessDays: Number(e.target.value)})}/>
            </label>
            <label className="adminField stacked">
              <span>Currency symbol</span>
              <input value={settings.currency} onChange={(e) => setSettings({...settings, currency: e.target.value})}/>
            </label>
          </section>

          <section className="adminPanel dangerPanel">
            <span className="adminKicker">DEMO TOOLS</span>
            <h2>Reset everything</h2>
            <p>Restore Pantone 291 C, original videos, default invite code and clear demo purchases.</p>
            <button className="dangerBtn" onClick={() => { resetDemo(); window.location.reload(); }}>Reset demo</button>
          </section>
        </div>
      </div>
    </div>
  );
}
