"use client";

import { useEffect, useState } from "react";
import { getSettings, getVideos, saveVideos } from "../../../lib/storage";
import type { AppSettings, VideoCourse } from "../../../lib/types";

export default function AdminVideos() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [videos, setVideos] = useState<VideoCourse[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(getSettings());
    setVideos(getVideos());
  }, []);

  if (!settings) return null;

  const update = <K extends keyof VideoCourse>(id: string, key: K, value: VideoCourse[K]) => {
    setVideos((items) => items.map((v) => v.id === id ? { ...v, [key]: value } : v));
  };

  const save = () => {
    saveVideos(videos);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="adminContent">
      <div className="adminTop">
        <div>
          <span className="adminKicker">PAY-PER-VIDEO CATALOG</span>
          <h1>Videos + pricing</h1>
          <p>Every video is sold separately. Default access remains five days unless changed here.</p>
        </div>
        <button className="adminSaveBtn" onClick={save}>{saved ? "Saved ✓" : "Save changes"}</button>
      </div>

      <section className="adminPanel">
        <div className="videoTable">
          <div className="videoTableHead">
            <span>Video</span><span>Price</span><span>Access</span><span>Visible</span>
          </div>

          {videos.map((video) => (
            <div className="videoTableRow" key={video.id}>
              <div className="videoNameCell">
                <span className="videoMiniArt">{video.number}</span>
                <div><strong>{video.title}</strong><small>{video.level} • {video.duration}</small></div>
              </div>

              <label className="adminField inline">
                <span>{settings.currency}</span>
                <input type="number" min="0" value={video.price} onChange={(e) => update(video.id, "price", Number(e.target.value))}/>
              </label>

              <label className="adminField inline">
                <input type="number" min="1" value={video.accessDays} onChange={(e) => update(video.id, "accessDays", Number(e.target.value))}/>
                <span>days</span>
              </label>

              <button
                className={`adminToggle ${video.visible ? "on" : ""}`}
                onClick={() => update(video.id, "visible", !video.visible)}
              >
                <i/>
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="adminNotice">
        <strong>Client model:</strong> no membership is required. A customer purchases one video, receives access for the configured number of days, and the video then locks again.
      </div>
    </div>
  );
}
