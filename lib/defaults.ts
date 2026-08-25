import type { AppSettings, LiveClass, VideoCourse } from "./types";

export const DEFAULT_SETTINGS: AppSettings = {
  academyName: "Lashmaker Academy",
  courseName: "Classic Course",
  inviteCode: "CLASSIC291",
  defaultAccessDays: 5,
  currency: "$",
  features: {
    inviteOnly: true,
    videoStore: true,
    liveClasses: true,
    testimonials: true,
    previews: true,
    studentLibrary: true,
    memberships: false
  },
  theme: {
    primary: "#9BCBEB",
    primaryStrong: "#63A9D3",
    background: "#090B0A",
    surface: "#111412",
    ink: "#F7F8F6",
    muted: "#9AA29B",
    radius: 22,
    heroStyle: "minimal",
    buttonStyle: "soft"
  }
};

export const DEFAULT_VIDEOS: VideoCourse[] = [
  {
    id: "classic-foundation",
    number: "01",
    title: "Classic Lash Foundation",
    subtitle: "The clean-set system",
    description: "A detailed foundational class covering consultation, isolation, direction, placement and finishing for cleaner classic sets.",
    category: "Classic Course",
    level: "Foundation",
    duration: "52 min",
    price: 69,
    accessDays: 5,
    visible: true,
    featured: true
  },
  {
    id: "mapping-retention",
    number: "02",
    title: "Mapping + Retention",
    subtitle: "Style with intention",
    description: "Learn a repeatable mapping approach and the technical details that help improve balance, attachment and retention.",
    category: "Classic Course",
    level: "Intermediate",
    duration: "41 min",
    price: 55,
    accessDays: 5,
    visible: true,
    featured: false
  },
  {
    id: "perfect-placement",
    number: "03",
    title: "Perfect Placement",
    subtitle: "Direction changes everything",
    description: "A focused technique lesson on distance, attachment, direction and symmetry for a more polished final result.",
    category: "Classic Course",
    level: "Intermediate",
    duration: "34 min",
    price: 49,
    accessDays: 5,
    visible: true,
    featured: false
  },
  {
    id: "client-experience",
    number: "04",
    title: "The Luxury Client Experience",
    subtitle: "Beyond the lash set",
    description: "Create a premium appointment flow from welcome to aftercare so your technical work feels elevated from start to finish.",
    category: "Classic Course",
    level: "Business",
    duration: "29 min",
    price: 39,
    accessDays: 5,
    visible: true,
    featured: false
  }
];

export const DEFAULT_LIVES: LiveClass[] = [
  {
    id: "live-technique-lab",
    title: "Classic Course Live Technique Lab",
    description: "Watch a full technical demonstration, ask questions in real time, and see common placement mistakes corrected live.",
    date: "September 12, 2026",
    time: "12:00 PM ET",
    price: 89,
    seats: 30
  }
];
