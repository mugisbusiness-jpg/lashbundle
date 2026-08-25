"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  ["/admin", "Overview"],
  ["/admin/videos", "Videos"],
  ["/admin/theme", "Theme Studio"],
  ["/admin/settings", "Settings"]
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <main className="adminPage">
      <aside className="adminRail">
        <Link href="/" className="adminBrand">
          <span>LA</span>
          <div><strong>Lash</strong><small>Academy Admin</small></div>
        </Link>

        <nav>
          {items.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className={pathname === href ? "active" : ""}
            >
              <span className="navDot"/>
              {label}
            </Link>
          ))}
        </nav>

        <div className="railFooter">
          <span>Sales model</span>
          <strong>Pay per video</strong>
          <small>Membership disabled</small>
        </div>
      </aside>

      <section className="adminStage">{children}</section>
    </main>
  );
}
