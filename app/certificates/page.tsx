
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../../components/Header";
import InviteGate from "../../components/InviteGate";
import { getCertificates } from "../../lib/storage";
import type { Certificate } from "../../lib/types";

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCertificates(getCertificates());
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <InviteGate>
      <main>
        <Header active="certificates" />

        <section className="certificateHeroFront">
          <div className="content">
            <span className="kicker">MY CERTIFICATES</span>
            <h1>Your achievements.<br/><em>Beautifully documented.</em></h1>
            <p>
              Certificates issued by LashMakers Academy appear here automatically.
              Open any certificate to print it or save it as PDF.
            </p>
          </div>
        </section>

        <section className="content certificateFrontSection">
          {certificates.length === 0 ? (
            <div className="emptyCertificateFront">
              <div className="emptyCertificateIcon">✓</div>
              <h2>No certificates yet.</h2>
              <p>
                Complete your training and your LashMakers certificate can be issued
                directly from the Academy admin.
              </p>
              <Link href="/" className="btn btnPrimary">Explore training</Link>
            </div>
          ) : (
            <div className="certificateFrontGrid">
              {certificates.map((certificate) => (
                <article className="certificateFrontCard" key={certificate.id}>
                  <div className="certificateFrontVisual">
                    <span className="miniCertBrand">LashMakers</span>
                    <small>CERTIFICATE OF COMPLETION</small>
                    <div className="certFrontLine"/>
                    <strong>{certificate.studentName}</strong>
                    <span>{certificate.courseTitle}</span>
                  </div>

                  <div className="certificateFrontInfo">
                    <span className="kicker">ISSUED CERTIFICATE</span>
                    <h3>{certificate.courseTitle}</h3>
                    <p>
                      Issued {new Date(certificate.issuedAt).toLocaleDateString()} •
                      {" "}{certificate.certificateNumber}
                    </p>
                    <Link
                      href={`/certificate/${certificate.id}`}
                      className="miniBtn activeAccess"
                    >
                      View certificate
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </InviteGate>
  );
}
