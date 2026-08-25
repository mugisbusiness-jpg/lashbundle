"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import InviteGate from "../components/InviteGate";
import {
  buyLive,
  buyVideo,
  getLives,
  getPurchases,
  getSettings,
  getVideos
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
  const [checkout, setCheckout] = useState<Checkout | null>(null);
  const [toast, setToast] = useState("");

  const sync = () => {
    setSettings(getSettings());
    setVideos(getVideos());
    setLives(getLives());
    setPurchases(getPurchases());
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
      setToast(`${checkout.item.title} unlocked for ${checkout.item.accessDays} days.`);
    } else {
      buyLive(checkout.item);
      setToast("Your paid Live seat has been reserved.");
    }
    setCheckout(null);
    sync();
    window.setTimeout(() => setToast(""), 3500);
  };

  return (
    <InviteGate>
      <main className="storefront">
        <Header active="academy" />

        {toast && <div className="successToast">{toast}</div>}

        <section className="heroSection">
          <div className="heroShape shapeOne"/>
          <div className="heroShape shapeTwo"/>
          <div className="heroMesh"/>
          <div className="content heroGrid">
            <div className="heroText">
              <span className="kicker">THE CLASSIC COURSE</span>
              <h1>
                Learn beautifully.<br/>
                <em>Master precisely.</em>
              </h1>
              <p>
                Premium lash education, now available class by class.
                Purchase only the training you need and receive private
                access for five focused days.
              </p>
              <div className="heroButtons">
                <a href="#classes" className="btn btnInk">Explore classes <span>↗</span></a>
                <Link href="/library" className="btn btnGhost">My purchases</Link>
              </div>
            </div>

            <div className="heroArtwork">
              <div className="artCard artBack">
                <span>CLASSIC</span>
              </div>
              <div className="artCard artFront">
                <span className="artEyebrow">PRIVATE TRAINING</span>
                <div className="lashIllustration">
                  <i/><i/><i/><i/><i/><i/><i/><i/><i/>
                </div>
                <strong>Precision<br/>is a practice.</strong>
                <small>Pay per video • 5-day access</small>
              </div>
              <div className="floatingBadge">
                <strong>291 C</strong>
                <small>Signature blue</small>
              </div>
            </div>
          </div>
        </section>

        <section className="content trustStrip">
          <div><strong>01</strong><span>One-time payment</span></div>
          <div><strong>02</strong><span>5-day private access</span></div>
          <div><strong>03</strong><span>No membership required</span></div>
          <div><strong>04</strong><span>Learn at your pace</span></div>
        </section>

        {settings.features.videoStore && (
          <section id="classes" className="content classSection">
            <div className="sectionIntro">
              <div>
                <span className="kicker">PAY PER VIDEO</span>
                <h2>Choose the lesson<br/>you need now.</h2>
              </div>
              <p>
                Every class is purchased individually. Your private viewing
                window begins immediately after payment and expires automatically.
              </p>
            </div>

            <div className="classGrid">
              {videos.filter((v) => v.visible).map((video, index) => (
                <article className={`classCard ${video.featured ? "featured" : ""}`} key={video.id}>
                  <div className="classVisual">
                    <span className="classNumber">{video.number}</span>
                    <div className="visualRings"><i/><i/><i/></div>
                    <button
                      className="previewButton"
                      onClick={() => alert("Preview player placeholder — demo only.")}
                    >
                      <span>▶</span>
                    </button>
                    <small>{video.subtitle}</small>
                  </div>

                  <div className="classInfo">
                    <div className="metaRow">
                      <span>{video.level}</span>
                      <span>{video.duration}</span>
                    </div>
                    <h3>{video.title}</h3>
                    <p>{video.description}</p>
                    <div className="purchaseRow">
                      <div>
                        <strong>{currency}{video.price}</strong>
                        <small>{video.accessDays} days access</small>
                      </div>

                      {activeVideoIds.has(video.id) ? (
                        <Link href="/library" className="miniBtn activeAccess">Watch now</Link>
                      ) : (
                        <button className="miniBtn" onClick={() => setCheckout({ kind: "video", item: video })}>
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

        {settings.features.liveClasses && (
          <section className="liveSection">
            <div className="content liveGrid">
              <div className="liveHeadline">
                <span className="livePill"><i/> LIVE CLASS</span>
                <h2>Watch it happen.<br/><em>Ask in real time.</em></h2>
                <p>Live sessions are optional paid experiences and can be turned off completely from the admin dashboard.</p>
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

        {settings.features.testimonials && (
          <section className="content manifesto">
            <span className="kicker">THE LASHMAKER STANDARD</span>
            <blockquote>
              “Technique gets stronger when education feels clear, intentional
              and beautiful enough to return to.”
            </blockquote>
            <small>Classic Course • Lashmaker Academy</small>
          </section>
        )}

        <footer className="siteFooter">
          <div className="content">
            <div>
              <strong>{settings.academyName}</strong>
              <small>Private education • {settings.courseName}</small>
            </div>
            <span>© 2026</span>
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
