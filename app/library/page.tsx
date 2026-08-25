"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../../components/Header";
import InviteGate from "../../components/InviteGate";
import { getPurchases, getSettings, getVideos } from "../../lib/storage";
import type { AppSettings, Purchase, VideoCourse } from "../../lib/types";

function timeLeft(expiresAt?: string) {
  if (!expiresAt) return { expired: true, label: "Expired" };
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return { expired: true, label: "Expired" };
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(hours / 24);
  return {
    expired: false,
    label: days >= 1 ? `${days}d ${hours % 24}h remaining` : `${Math.max(hours, 1)}h remaining`
  };
}

export default function LibraryPage() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [videos, setVideos] = useState<VideoCourse[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  useEffect(() => {
    setSettings(getSettings());
    setVideos(getVideos());
    setPurchases(getPurchases());
  }, []);

  if (!settings) return null;

  const videoPurchases = purchases.filter((p) => p.kind === "video");
  const livePurchases = purchases.filter((p) => p.kind === "live");

  return (
    <InviteGate>
      <main>
        <Header active="library" />

        <section className="libraryHero">
          <div className="content">
            <span className="kicker">PRIVATE LIBRARY</span>
            <h1>Your purchased<br/><em>education.</em></h1>
            <p>Each video remains available only during its private access window.</p>
          </div>
        </section>

        <section className="content librarySection">
          <div className="libraryHeading">
            <h2>On-demand access</h2>
            <span>{videoPurchases.length} purchased</span>
          </div>

          {videoPurchases.length === 0 ? (
            <div className="emptyLibrary">
              <span className="emptyOrb">▶</span>
              <h3>Your library is waiting.</h3>
              <p>Purchase a Classic Course video and it will appear here with a five-day access timer.</p>
              <Link href="/" className="btn btnPrimary">Browse Classic Course</Link>
            </div>
          ) : (
            <div className="libraryList">
              {videoPurchases.map((purchase) => {
                const course = videos.find((v) => v.id === purchase.itemId);
                const status = timeLeft(purchase.expiresAt);

                return (
                  <article className={`libraryItem ${status.expired ? "expired" : ""}`} key={purchase.id}>
                    <div className="libraryArtwork">
                      <span>{course?.number || "CC"}</span>
                      <div className="visualRings"><i/><i/><i/></div>
                    </div>
                    <div className="libraryInfo">
                      <div className="metaRow">
                        <span>{course?.level || "Classic Course"}</span>
                        <span>{course?.duration || "Video"}</span>
                      </div>
                      <h3>{purchase.title}</h3>
                      <div className={`accessTag ${status.expired ? "expired" : ""}`}>
                        <i/> {status.label}
                      </div>
                      <small>
                        Access ends {purchase.expiresAt ? new Date(purchase.expiresAt).toLocaleString() : "—"}
                      </small>
                    </div>
                    <div className="libraryAction">
                      {status.expired ? (
                        <Link href="/" className="miniBtn">Purchase again</Link>
                      ) : (
                        <button className="miniBtn activeAccess" onClick={() => alert("Secure player placeholder — demo only.")}>
                          Continue watching
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {settings.features.liveClasses && livePurchases.length > 0 && (
            <div className="purchasedLives">
              <div className="libraryHeading">
                <h2>Live access</h2>
                <span>{livePurchases.length} reservation(s)</span>
              </div>
              {livePurchases.map((purchase) => (
                <div className="simplePurchase" key={purchase.id}>
                  <div><strong>{purchase.title}</strong><small>Paid {settings.currency}{purchase.price}</small></div>
                  <button className="miniBtn activeAccess" onClick={() => alert("Live room placeholder — connect LiveKit later.")}>Join live</button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </InviteGate>
  );
}
