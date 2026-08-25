"use client";

import { DEFAULT_LIVES, DEFAULT_SETTINGS, DEFAULT_VIDEOS } from "./defaults";
import type { AppSettings, Certificate, LiveClass, Purchase, VideoCourse } from "./types";

const KEYS = {
  settings: "lm_v5_settings",
  videos: "lm_v5_videos",
  lives: "lm_v5_lives",
  purchases: "lm_v5_purchases",
  invited: "lm_v5_invited",
  favorites: "lm_v5_favorites",
  progress: "lm_v5_progress",
  certificates: "lm_v5_certificates"
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) as T : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event("lm-demo-updated"));
}

export const getSettings = () => read<AppSettings>(KEYS.settings, DEFAULT_SETTINGS);
export const saveSettings = (v: AppSettings) => write(KEYS.settings, v);

export const getVideos = () => read<VideoCourse[]>(KEYS.videos, DEFAULT_VIDEOS);
export const saveVideos = (v: VideoCourse[]) => write(KEYS.videos, v);

export const getLives = () => read<LiveClass[]>(KEYS.lives, DEFAULT_LIVES);
export const saveLives = (v: LiveClass[]) => write(KEYS.lives, v);

export const getPurchases = () => read<Purchase[]>(KEYS.purchases, []);
export const savePurchases = (v: Purchase[]) => write(KEYS.purchases, v);

export function hasInviteAccess() {
  return read<boolean>(KEYS.invited, false);
}

export function grantInviteAccess() {
  write(KEYS.invited, true);
}

export function revokeInviteAccess() {
  write(KEYS.invited, false);
}

export function buyVideo(video: VideoCourse): Purchase {
  const now = new Date();
  const expiresAt = new Date(
    now.getTime() + video.accessDays * 24 * 60 * 60 * 1000
  ).toISOString();

  const existing = getPurchases().filter(
    (purchase) => !(purchase.kind === "video" && purchase.itemId === video.id)
  );

  const purchase: Purchase = {
    id: `purchase-${Date.now()}`,
    kind: "video",
    itemId: video.id,
    title: video.title,
    price: video.price,
    purchasedAt: now.toISOString(),
    expiresAt
  };

  savePurchases([purchase, ...existing]);
  return purchase;
}

export function buyLive(item: LiveClass): Purchase {
  const purchase: Purchase = {
    id: `purchase-${Date.now()}`,
    kind: "live",
    itemId: item.id,
    title: item.title,
    price: item.price,
    purchasedAt: new Date().toISOString()
  };

  savePurchases([purchase, ...getPurchases()]);
  return purchase;
}


export const getFavorites = () => read<string[]>(KEYS.favorites, []);
export const saveFavorites = (value: string[]) => write(KEYS.favorites, value);

export const getProgress = () => read<Record<string, number>>(KEYS.progress, {});
export const saveProgress = (value: Record<string, number>) => write(KEYS.progress, value);

export const getCertificates = () => read<Certificate[]>(KEYS.certificates, []);
export const saveCertificates = (value: Certificate[]) => write(KEYS.certificates, value);

export function issueCertificate(input: {
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseTitle: string;
  instructorName: string;
}): Certificate {
  const existing = getCertificates();
  const stamp = Date.now();
  const certificate: Certificate = {
    ...input,
    id: `cert-${stamp}`,
    issuedAt: new Date().toISOString(),
    certificateNumber: `LM-${new Date().getFullYear()}-${String(existing.length + 1).padStart(4, "0")}`
  };
  saveCertificates([certificate, ...existing]);
  return certificate;
}

export function resetDemo() {
  saveSettings(DEFAULT_SETTINGS);
  saveVideos(DEFAULT_VIDEOS);
  saveLives(DEFAULT_LIVES);
  savePurchases([]);
  saveFavorites([]);
  saveProgress({});
  saveCertificates([]);
  revokeInviteAccess();
}
