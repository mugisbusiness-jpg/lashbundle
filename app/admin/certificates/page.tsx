
"use client";

import { useEffect, useState } from "react";
import { getCertificates, getVideos, issueCertificate } from "../../../lib/storage";
import type { Certificate, VideoCourse } from "../../../lib/types";

export default function AdminCertificates() {
  const [videos, setVideos] = useState<VideoCourse[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [studentName, setStudentName] = useState("Demo Student");
  const [studentEmail, setStudentEmail] = useState("student@example.com");
  const [courseId, setCourseId] = useState("");
  const [instructorName, setInstructorName] = useState("LashMakers Academy");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const items = getVideos();
    setVideos(items);
    setCourseId(items[0]?.id || "");
    setCertificates(getCertificates());
  }, []);

  const generate = () => {
    const course = videos.find((v) => v.id === courseId);
    if (!course || !studentName.trim() || !studentEmail.trim()) {
      setMessage("Enter student details and select a course.");
      return;
    }

    const cert = issueCertificate({
      studentName: studentName.trim(),
      studentEmail: studentEmail.trim(),
      courseId: course.id,
      courseTitle: course.title,
      instructorName: instructorName.trim() || "LashMakers Academy"
    });

    setCertificates(getCertificates());
    setMessage(`Generated ${cert.certificateNumber}`);
  };

  return (
    <div className="adminContent">
      <div className="adminTop">
        <div>
          <span className="adminKicker">CERTIFICATE STUDIO</span>
          <h1>Generate certificates</h1>
          <p>Create an official completion certificate from admin in seconds.</p>
        </div>
      </div>

      <div className="settingsGrid">
        <section className="adminPanel">
          <div className="panelTitle"><div><span>NEW CERTIFICATE</span><h2>Student + course</h2></div></div>

          <label className="adminField stacked">
            <span>Student name</span>
            <input value={studentName} onChange={(e) => setStudentName(e.target.value)} />
          </label>

          <label className="adminField stacked">
            <span>Student email</span>
            <input value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} />
          </label>

          <label className="adminField stacked">
            <span>Completed course</span>
            <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
              {videos.map((video) => <option key={video.id} value={video.id}>{video.title}</option>)}
            </select>
          </label>

          <label className="adminField stacked">
            <span>Issued by</span>
            <input value={instructorName} onChange={(e) => setInstructorName(e.target.value)} />
          </label>

          <button className="adminSaveBtn" onClick={generate}>Generate certificate</button>
          {message && <div className="adminNotice">{message}</div>}
        </section>

        <section className="adminPanel certificatePreviewPanel">
          <span className="adminKicker">PREVIEW</span>
          <div className="certificatePreview">
            <span className="certLogo">LashMakers</span>
            <small>CERTIFICATE OF COMPLETION</small>
            <p>This certifies that</p>
            <h2>{studentName || "Student Name"}</h2>
            <p>has successfully completed</p>
            <h3>{videos.find((v) => v.id === courseId)?.title || "Classic Course"}</h3>
            <div className="certRule" />
            <small>Issued by {instructorName || "LashMakers Academy"}</small>
          </div>
        </section>
      </div>

      <section className="adminPanel" style={{ marginTop: 15 }}>
        <div className="panelTitle"><div><span>ISSUED</span><h2>Recent certificates</h2></div></div>
        {certificates.length === 0 ? (
          <p className="adminEmptyText">No certificates generated yet.</p>
        ) : (
          <div className="certificateRows">
            {certificates.map((certificate) => (
              <div className="certificateRow" key={certificate.id}>
                <div>
                  <strong>{certificate.studentName}</strong>
                  <small>{certificate.courseTitle} • {certificate.certificateNumber}</small>
                </div>
                <a className="secondaryAdminBtn" href={`/certificate/${certificate.id}`} target="_blank">
                  View / print
                </a>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
