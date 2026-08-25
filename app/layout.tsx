import type { Metadata } from "next";
import "./globals.css";
import ThemeRuntime from "../components/ThemeRuntime";

export const metadata: Metadata = {
  title: "Lashmaker Academy | Classic Course",
  description: "Private pay-per-video lash education."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeRuntime />
        {children}
      </body>
    </html>
  );
}
