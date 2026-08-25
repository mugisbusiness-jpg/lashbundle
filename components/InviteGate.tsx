"use client";

import { useEffect, useState } from "react";
import { getSettings, grantInviteAccess, hasInviteAccess } from "../lib/storage";

export default function InviteGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const settings = getSettings();
    if (!settings.features.inviteOnly) {
      setAllowed(true);
    } else {
      setAllowed(hasInviteAccess());
    }
    setReady(true);
  }, []);

  if (!ready) return null;
  if (allowed) return <>{children}</>;

  const unlock = () => {
    const settings = getSettings();
    if (code.trim().toUpperCase() === settings.inviteCode.trim().toUpperCase()) {
      grantInviteAccess();
      setAllowed(true);
      setError("");
    } else {
      setError("That invitation code is not recognized.");
    }
  };

  return (
    <main className="invitePage">
      <div className="inviteAura auraOne" />
      <div className="inviteAura auraTwo" />
      <section className="inviteCard">
        <div className="inviteMonogram"></div>
        <span className="kicker">PRIVATE EDUCATION</span>
        <h1>Welcome to<br/><em>Classic Course.</em></h1>
        <p>This academy is currently available by invitation only. Enter your private access code to continue.</p>
        <div className={`inviteField ${error ? "error" : ""}`}>
          <input
            value={code}
            onChange={(event) => setCode(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") unlock();
            }}
            placeholder="Invitation code"
            autoFocus
          />
          <button onClick={unlock}>Enter Academy</button>
        </div>
        {error && <small className="formError">{error}</small>}
        <div className="inviteFoot">
          <span>Invite-only access</span>
          <i/>
          <span>Private training</span>
          <i/>
          <span>Classic Course</span>
        </div>
      </section>
    </main>
  );
}
