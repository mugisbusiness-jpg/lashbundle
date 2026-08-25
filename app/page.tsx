
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import InviteGate from "../components/InviteGate";
import {
  buyLive,
  buyVideo,
  getFavorites,
  getLives,
  getProgress,
  getPurchases,
  getSettings,
  getVideos,
  saveFavorites,
  saveProgress
} from "../lib/storage";
import type { AppSettings, LiveClass, Purchase, VideoCourse } from "../lib/types";

type Checkout =
  | { kind: "video"; item: VideoCourse }
  | { kind: "live"; item: LiveClass };

export default function Home() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [videos, setVideos] = useState<VideoCourse[]>([]);
  const [lives, setLives] = useState<LiveClass[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [checkout, setCheckout] = useState<Checkout | null>(null);
  const [toast, setToast] = useState("");

  const sync = () => {
    setSettings(getSettings());
    setVideos(getVideos());
    setLives(getLives());
    setPurchases(getPurchases());
    setFavorites(getFavorites());
    setProgress(getProgress());
  };

  useEffect(() => {
    sync();
    window.addEventListener("lm-demo-updated", sync);
    return () => window.removeEventListener("lm-demo-updated", sync);
  }, []);

  const activeVideoIds = useMemo(() => {
    return new Set(
      purchases
        .filter(
          (p) =>
            p.kind === "video" &&
            p.expiresAt &&
            new Date(p.expiresAt).getTime() > Date.now()
        )
        .map((p) => p.itemId)
    );
  }, [purchases]);

  if (!settings) return null;

  const currency = settings.currency;

  const completeCheckout = () => {
    if (!checkout) return;

    if (checkout.kind === "video") {
      buyVideo(checkout.item);
      const next = { ...getProgress(), [checkout.item.id]: 8 };
      saveProgress(next);
      setProgress(next);
      setToast(`${checkout.item.title} unlocked for ${checkout.item.accessDays} days.`);
    } else {
      buyLive(checkout.item);
      setToast("Your paid Live seat has been reserved.");
    }

    setCheckout(null);
    sync();
    setTimeout(() => setToast(""), 3200);
  };

  const toggleFavorite = (id: string) => {
    const next = favorites.includes(id)
      ? favorites.filter((item) => item !== id)
      : [...favorites, id];
    setFavorites(next);
    saveFavorites(next);
  };

  const continueVideo = Object.entries(progress)
    .map(([id, percent]) => ({ video: videos.find((v) => v.id === id), percent }))
    .find((item) => item.video);

  return (
    <InviteGate>
      <main className="storefront">
        <Header active="academy" />
        {toast && <div className="successToast">{toast}</div>}

        <section className="heroStaticSection">
          <div className="content">
            <div className="heroStaticImage">
              <img src="/lashmakers-hero.jpg" alt="Professional lash training" />
              <div className="heroStaticOverlay" />
              <div className="heroStaticCopy">
                <span className="kicker">THE CLASSIC COURSE</span>
                <h1>Master.<br/>Perfect.<br/><em>Elevate.</em></h1>
                <p>Premium lash education for artists who want precision, confidence and beautiful results.</p>
                <a href="#classes" className="btn btnPrimary">Explore courses →</a>
              </div>

              <div className="heroFeatureBar">
                <div><strong>Pay Per Video</strong><span>Buy only what you need</span></div>
                <div><strong>5-Day Access</strong><span>Private access for 5 days</span></div>
                <div><strong>Private Academy</strong><span>Invite-only learning</span></div>
                <div><strong>Certificate</strong><span>Issued from admin</span></div>
              </div>
            </div>
          </div>
        </section>

        {continueVideo?.video && (
          <section className="content continueSection">
            <div className="continueTitleRow">
              <div>
                <span className="kicker">CONTINUE LEARNING</span>
                <h2>Pick up where you left off.</h2>
              </div>
              <Link href="/library">View library →</Link>
            </div>

            <article className="continueCard">
              <div className="continueThumb"><span>▶</span></div>
              <div className="continueInfo">
                <div className="metaRow">
                  <span>{continueVideo.video.level}</span>
                  <span>{continueVideo.video.duration}</span>
                </div>
                <h3>{continueVideo.video.title}</h3>
                <div className="progressTrack">
                  <i style={{ width: `${continueVideo.percent}%` }} />
                </div>
                <small>{continueVideo.percent}% watched</small>
              </div>
              <button
                className="miniBtn activeAccess"
                onClick={() => {
                  const nextPercent = Math.min(100, continueVideo.percent + 12);
                  const next = { ...progress, [continueVideo.video!.id]: nextPercent };
                  setProgress(next);
                  saveProgress(next);
                  setToast(`Progress updated to ${nextPercent}%.`);
                  setTimeout(() => setToast(""), 2200);
                }}
              >
                Resume
              </button>
            </article>
          </section>
        )}

        {settings.features.videoStore && (
          <section id="classes" className="content classSection">
            <div className="sectionIntro">
              <div>
                <span className="kicker">AVAILABLE TRAINING</span>
                <h2>Choose the training<br/>you need now.</h2>
              </div>
              <p>
                Every video is purchased separately. Access begins after purchase
                and expires automatically after the selected access period.
              </p>
            </div>

            <div className="classGrid">
              {videos.filter((v) => v.visible).map((video) => (
                <article className={`classCard ${video.featured ? "featured" : ""}`} key={video.id}>
                  <div className="classVisual">
                    <span className="classNumber">{video.number}</span>
                    <div className="visualRings"><i/><i/><i/></div>
                    <button
                      className="previewButton"
                      onClick={() => alert("Preview player placeholder — demo only.")}
                    >
                      ▶
                    </button>
                    <small>{video.subtitle}</small>
                  </div>

                  <div className="classInfo">
                    <div className="metaRow">
                      <span>{video.level}</span>
                      <span>{video.duration}</span>
                    </div>

                    <div className="titleWithFavorite">
                      <h3>{video.title}</h3>
                      <button
                        className={`favoriteBtn ${favorites.includes(video.id) ? "saved" : ""}`}
                        onClick={() => toggleFavorite(video.id)}
                        aria-label="Save to favorites"
                      >
                        ♥
                      </button>
                    </div>

                    <p>{video.description}</p>

                    <div className="purchaseRow">
                      <div>
                        <strong>{currency}{video.price}</strong>
                        <small>{video.accessDays}-day access</small>
                      </div>

                      {activeVideoIds.has(video.id) ? (
                        <Link href="/library" className="miniBtn activeAccess">Watch now</Link>
                      ) : (
                        <button
                          className="miniBtn"
                          onClick={() => setCheckout({ kind: "video", item: video })}
                        >
                          Buy video
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="content premiumFeatures">
          <div><strong>Private Access</strong><span>Invite-only academy with protected learning.</span></div>
          <div><strong>5-Day Window</strong><span>Every purchase has a clear access countdown.</span></div>
          <div><strong>Resume Watching</strong><span>Progress stays visible in the student library.</span></div>
          <div><strong>Certificates</strong><span>Generate completion certificates from admin.</span></div>
        </section>

        {settings.features.liveClasses && (
          <section className="liveSection">
            <div className="content liveGrid">
              <div className="liveHeadline">
                <span className="livePill"><i/> LIVE CLASS</span>
                <h2>Learn live.<br/><em>Ask in real time.</em></h2>
                <p>Live sessions are sold separately and can be disabled completely from admin.</p>
              </div>

              <div className="liveStack">
                {lives.map((live) => (
                  <article className="liveTicket" key={live.id}>
                    <div className="ticketTop">
                      <span>{live.date}</span>
                      <strong>{live.time}</strong>
                    </div>
                    <h3>{live.title}</h3>
                    <p>{live.description}</p>
                    <div className="ticketBottom">
                      <div>
                        <strong>{currency}{live.price}</strong>
                        <small>{live.seats} seats available</small>
                      </div>
                      <button className="btn btnLight" onClick={() => setCheckout({ kind: "live", item: live })}>
                        Pay to join
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        <footer className="siteFooter">
          <div className="content footerGrid">
            <div>
              <strong>LashMakers</strong>
              <small>ACADEMY</small>
            </div>
            <div><b>Classic Course</b><span>Private professional lash education</span></div>
            <div><b>Access</b><span>Invite only • Pay per video</span></div>
            <div><b>Signature Blue</b><span>Pantone 291 C</span></div>
          </div>
        </footer>

        {checkout && (
          <div className="checkoutOverlay" onMouseDown={() => setCheckout(null)}>
            <section className="checkoutModal" onMouseDown={(e) => e.stopPropagation()}>
              <button className="modalClose" onClick={() => setCheckout(null)}>×</button>
              <span className="kicker">DEMO CHECKOUT</span>
              <h2>{checkout.item.title}</h2>
              <p>
                {checkout.kind === "video"
                  ? `${checkout.item.accessDays}-day private video access`
                  : "Paid admission to this Live class"}
              </p>

              <div className="checkoutSummary">
                <span>One-time payment</span>
                <strong>{currency}{checkout.item.price}.00</strong>
              </div>

              <label className="fakeInput">
                <span>Email</span>
                <input value="student@example.com" readOnly />
              </label>

              <label className="fakeInput">
                <span>Card</span>
                <input value="4242 4242 4242 4242" readOnly />
              </label>

              <button className="btn btnPrimary checkoutPay" onClick={completeCheckout}>
                Pay {currency}{checkout.item.price}.00
              </button>

              <small className="demoNote">Demo only — no real payment is processed.</small>
            </section>
          </div>
        )}
      </main>
    </InviteGate>
  );
}
