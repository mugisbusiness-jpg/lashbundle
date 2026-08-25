"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSettings } from "../lib/storage";

export default function Header({ active = "" }: { active?: string }) {
  const [name, setName] = useState("Lashmaker Academy");
  const [course, setCourse] = useState("Classic Course");

  useEffect(() => {
    const sync = () => {
      const settings = getSettings();
      setName(settings.academyName);
      setCourse(settings.courseName);
    };
    sync();
    window.addEventListener("lm-demo-updated", sync);
    return () => window.removeEventListener("lm-demo-updated", sync);
  }, []);

  return (
    <header className="siteHeader">
      <Link href="/" className="logoLockup">
        <span>
          <strong>LashMakers</strong>
          <small>{course}</small>
        </span>
      </Link>

      <nav className="mainNav">
        <Link className={active === "academy" ? "active" : ""} href="/">Academy</Link>
        <Link className={active === "library" ? "active" : ""} href="/library">My Library</Link>
        <Link className="adminShortcut" href="/admin">Admin</Link>
      </nav>
    </header>
  );
}
