
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../../components/Header";
import InviteGate from "../../components/InviteGate";
import {
  getCertificates,
  getFavorites,
  getProgress,
  getPurchases,
  getSettings,
  getVideos,
  saveProgress
} from "../../lib/storage";
import type { AppSettings, Certificate, Purchase, VideoCourse } from "../../lib/types";

function timeLeft(expiresAt?: string) {
  if (!expiresAt) return { expired: true, label: "Expired" };
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return { expired: true, label: "Expired" };

  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(hours / 24);
  const mins = Math.floor((diff % 3600000) / 60000);

  return {
    expired: false,
    label: days > 0 ? `${days}d ${hours % 24}h ${mins}m remaining` : `${hours}h ${mins}m remaining`
  };
}

export default function LibraryPage() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [videos, setVideos] = useState<VideoCourse[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [favorites, setFavorites] = useState<string[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    setSettings(getSettings());
    setVideos(getVideos());
    setPurchases(getPurchases());
    setProgress(getProgress());
    setFavorites(getFavorites());
    setCertificates(getCertificates());
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
            <span className="kicker">MY LIBRARY</span>
            <h1>Continue your<br/><em>training.</em></h1>
            <p>Track progress, watch your access countdown, and open issued certificates.</p>
          </div>
        </section>

        <section className="content librarySection">
          <div className="libraryHeading">
            <h2>Purchased videos</h2>
            <span>{videoPurchases.length} purchase(s)</span>
          </div>

          {videoPurchases.length === 0 ? (
            <div className="emptyLibrary">
              <span className="emptyOrb">▶</span>
              <h3>Your library is waiting.</h3>
              <p>Purchase a Classic Course video and it will appear here with its access timer.</p>
              <Link href="/" className="btn btnPrimary">Browse courses</Link>
            </div>
          ) : (
            <div className="libraryList">
              {videoPurchases.map((purchase) => {
                const video = videos.find((v) => v.id === purchase.itemId);
                const status = timeLeft(purchase.expiresAt);
                const percent = progress[purchase.itemId] || 0;
                const cert = certificates.find((c) => c.courseId === purchase.itemId);

                return (
                  <article className={`libraryItem ${status.expired ? "expired" : ""}`} key={purchase.id}>
                    <div className="libraryArtwork">
                      <span>{video?.number || "CC"}</span>
                      <div className="visualRings"><i/><i/><i/></div>
                    </div>

                    <div className="libraryInfo">
                      <div className="metaRow">
                        <span>{video?.level || "Classic Course"}</span>
                        <span>{video?.duration || "Video"}</span>
                      </div>

                      <h3>{purchase.title}</h3>

                      <div className={`accessTag ${status.expired ? "expired" : ""}`}>
                        <i/> {status.label}
                      </div>

                      {favorites.includes(purchase.itemId) && <span className="favoriteLabel">♥ Favorite</span>}

                      <div className="libraryProgress">
                        <div className="progressTrack"><i style={{ width: `${percent}%` }} /></div>
                        <small>{percent}% watched</small>
                      </div>

                      {cert && (
                        <Link href={`/certificate/${cert.id}`} className="certificateLink">
                          View certificate →
                        </Link>
                      )}
                    </div>

                    <div className="libraryAction">
                      {status.expired ? (
                        <Link href="/" className="miniBtn">Purchase again</Link>
                      ) : (
                        <button
                          className="miniBtn activeAccess"
                          onClick={() => {
                            const nextPercent = Math.min(100, percent + 12);
                            const next = { ...progress, [purchase.itemId]: nextPercent };
                            setProgress(next);
                            saveProgress(next);
                          }}
                        >
                          Resume
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
                  <div>
                    <strong>{purchase.title}</strong>
                    <small>Paid {settings.currency}{purchase.price}</small>
                  </div>
                  <button className="miniBtn activeAccess" onClick={() => alert("Live room placeholder — connect LiveKit later.")}>
                    Join live
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </InviteGate>
  );
}
