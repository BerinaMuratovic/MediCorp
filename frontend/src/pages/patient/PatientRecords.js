import React, { useEffect, useState } from "react";
import PatientHeader from "../../components/PatientHeader";
import PatientSidebar from "../../components/PatientSidebar";
import "../../style.css";

export default function PatientRecords() {
  const [user, setUser] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setUser(u);

    fetch(`http://localhost:8080/api/prescriptions/patient/${u.id}`)
      .then(res => res.json())
      .then(setPrescriptions);

    fetch(`http://localhost:8080/api/diagnoses/patient/${u.id}`)
      .then(res => res.json())
      .then(setDiagnoses);

  }, []);

  return (
    <div className="patient-layout">

      {/* SIDEBAR */}
      <PatientSidebar />

      {/* MAIN CONTENT AREA */}
      <div className="content-area">
        
        {/* HEADER */}
        <PatientHeader user={user} />

        <main className="patient-records-page">

  <h2 className="records-title">Medical Records</h2>

  {/* PRESCRIPTIONS */}
  <div className="record-card">
    <h3>Prescriptions</h3>

    {prescriptions.length === 0 ? (
      <p className="empty-message">No prescriptions found.</p>
    ) : (
      prescriptions.map((p) => (
        <div key={p.id} className="record-item">
          <div className="record-left">
            <strong className="record-name">{p.medication?.name}</strong>
            <span className="record-detail">{p.dosage} — {p.frequency}</span>
          </div>

          <div className="record-right">
            <span className="record-date">{p.startDate} → {p.endDate}</span>
            <span className="record-doctor">Dr. {p.prescribedBy?.name}</span>
          </div>
        </div>
      ))
    )}
  </div>

  {/* DIAGNOSES */}
  <div className="record-card">
    <h3>Diagnoses</h3>

    {diagnoses.length === 0 ? (
      <p className="empty-message">No diagnoses found.</p>
    ) : (
      diagnoses.map((d) => (
        <div key={d.id} className="record-item">
          <div className="record-left">
            <strong className="record-name">{d.description}</strong>
            <span className="record-date">{d.date}</span>
          </div>

          <div className="record-right">
            <span className="record-doctor">Dr. {d.doctor?.name}</span>
          </div>
        </div>
      ))
    )}
  </div>

</main>

      </div>
    </div>
  );
}

