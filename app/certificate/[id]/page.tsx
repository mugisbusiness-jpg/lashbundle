
"use client";

import { useEffect, useState } from "react";
import { getCertificates } from "../../../lib/storage";
import type { Certificate } from "../../../lib/types";

export default function CertificatePage({ params }: { params: { id: string } }) {
  const [certificate, setCertificate] = useState<Certificate | null | undefined>(undefined);

  useEffect(() => {
    setCertificate(getCertificates().find((item) => item.id === params.id) || null);
  }, [params.id]);

  if (certificate === undefined) return null;
  if (!certificate) {
    return <main className="certificatePage"><div className="certificateMissing">Certificate not found.</div></main>;
  }

  return (
    <main className="certificatePage">
      <div className="certificateToolbar">
        <button onClick={() => window.print()}>Print / Save PDF</button>
      </div>

      <section className="certificateDocument">
        <div className="certificateInner">
          <span className="certBrand">LashMakers</span>
          <span className="certAcademy">ACADEMY</span>
          <div className="certBlueLine" />

          <small>CERTIFICATE OF COMPLETION</small>
          <p>This certificate is proudly presented to</p>
          <h1>{certificate.studentName}</h1>
          <p>for successfully completing the professional training</p>
          <h2>{certificate.courseTitle}</h2>

          <div className="certificateSignatures">
            <div>
              <span>{new Date(certificate.issuedAt).toLocaleDateString()}</span>
              <small>Date issued</small>
            </div>
            <div>
              <span>{certificate.instructorName}</span>
              <small>Issued by</small>
            </div>
          </div>

          <div className="certificateNumber">{certificate.certificateNumber}</div>
        </div>
      </section>
    </main>
  );
}
