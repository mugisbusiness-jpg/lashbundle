"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPurchases, getSettings, getVideos } from "../../lib/storage";
import type { AppSettings, Purchase, VideoCourse } from "../../lib/types";

export default function AdminOverview() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [videos, setVideos] = useState<VideoCourse[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  useEffect(() => {
    setSettings(getSettings());
    setVideos(getVideos());
    setPurchases(getPurchases());
  }, []);

  if (!settings) return null;

  const revenue = purchases.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="adminContent">
      <div className="adminTop">
        <div>
          <span className="adminKicker">CLASSIC COURSE CONTROL</span>
          <h1>Good afternoon.</h1>
          <p>Manage the private academy without touching code.</p>
        </div>
        <Link href="/" className="adminViewBtn">View academy ↗</Link>
      </div>

      <div className="adminStats">
        <article><span>Demo revenue</span><strong>{settings.currency}{revenue}</strong><small>Browser demo activity</small></article>
        <article><span>Video purchases</span><strong>{purchases.filter(p => p.kind === "video").length}</strong><small>Individual purchases</small></article>
        <article><span>Published videos</span><strong>{videos.filter(v => v.visible).length}</strong><small>Visible on storefront</small></article>
        <article><span>Live classes</span><strong>{settings.features.liveClasses ? "ON" : "OFF"}</strong><small>Feature toggle</small></article>
      </div>

      <div className="adminDashboardGrid">
        <section className="adminPanel">
          <div className="panelTitle">
            <div><span>LAUNCH MODEL</span><h2>Pay per video</h2></div>
            <span className="statusPill">ACTIVE</span>
          </div>
          <div className="settingSummary">
            <div><span>Membership</span><strong>Disabled</strong></div>
            <div><span>Default access</span><strong>{settings.defaultAccessDays} days</strong></div>
            <div><span>Invite-only</span><strong>{settings.features.inviteOnly ? "Enabled" : "Disabled"}</strong></div>
            <div><span>Live classes</span><strong>{settings.features.liveClasses ? "Enabled" : "Disabled"}</strong></div>
          </div>
        </section>

        <section className="adminPanel bluePanel">
          <span className="adminKicker">BRAND THEME</span>
          <h2>Pantone 291 C</h2>
          <p>Your current academy theme uses the client’s signature light blue. You can change the full frontend theme anytime.</p>
          <div className="colorSwatches">
            <i style={{background: settings.theme.primary}}/>
            <i style={{background: settings.theme.primaryStrong}}/>
            <i style={{background: settings.theme.background}}/>
            <i style={{background: settings.theme.ink}}/>
          </div>
          <Link href="/admin/theme" className="panelLink">Open Theme Studio →</Link>
        </section>
      </div>

      <section className="adminPanel quickPanel">
        <span className="adminKicker">QUICK ACTIONS</span>
        <div className="quickLinks">
          <Link href="/admin/videos"><strong>Edit videos + prices</strong><span>Set price, visibility and access days →</span></Link>
          <Link href="/admin/settings"><strong>Feature controls</strong><span>Turn Live and other features on/off →</span></Link>
          <Link href="/admin/theme"><strong>Change frontend theme</strong><span>Colors, corner style and hero mood →</span></Link>
        </div>
      </section>
    </div>
  );
}
