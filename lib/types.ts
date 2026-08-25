export type ThemeConfig = {
  primary: string;
  primaryStrong: string;
  background: string;
  surface: string;
  ink: string;
  muted: string;
  radius: number;
  heroStyle: "cloud" | "editorial" | "minimal";
  buttonStyle: "pill" | "soft" | "square";
};

export type FeatureConfig = {
  inviteOnly: boolean;
  videoStore: boolean;
  liveClasses: boolean;
  testimonials: boolean;
  previews: boolean;
  studentLibrary: boolean;
  memberships: boolean;
};

export type AppSettings = {
  academyName: string;
  courseName: string;
  inviteCode: string;
  defaultAccessDays: number;
  currency: string;
  features: FeatureConfig;
  theme: ThemeConfig;
};

export type VideoCourse = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  price: number;
  accessDays: number;
  visible: boolean;
  featured: boolean;
  number: string;
};

export type LiveClass = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  price: number;
  seats: number;
};

export type Purchase = {
  id: string;
  kind: "video" | "live";
  itemId: string;
  title: string;
  price: number;
  purchasedAt: string;
  expiresAt?: string;
};


export type Certificate = {
  id: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseTitle: string;
  issuedAt: string;
  certificateNumber: string;
  instructorName: string;
};
