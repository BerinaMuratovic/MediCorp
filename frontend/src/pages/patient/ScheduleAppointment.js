import React, { useEffect, useState } from "react";
import PatientHeader from "../../components/PatientHeader";
import PatientSidebar from "../../components/PatientSidebar";
import "../../style.css";

export default function ScheduleAppointment() {
  const [user, setUser] = useState(null);
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setUser(u);

    // Fetch doctors
    fetch("http://localhost:8080/api/users")
      .then((res) => res.json())
      .then((data) => {
        const docList = data.filter((u) => u.role === "DOCTOR");
        setDoctors(docList);
      });

    if (u?.id) {
      // Fetch upcoming appointments
      fetch(`http://localhost:8080/api/appointments/patient/${u.id}`)
        .then((res) => res.json())
        .then((data) => {
          
          const upcomingSorted = data.sort(
            (a, b) => new Date(a.date) - new Date(b.date)
          );
          setUpcoming(upcomingSorted);
        });
    }
  }, []);

  const handleSchedule = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("User not found.");
      return;
    }

    const appointment = {
      date,
      reason,
      status: "PENDING",
      patient: { id: user.id },
      doctor: { id: doctorId },
    };

    const res = await fetch("http://localhost:8080/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(appointment),
    });

    if (res.ok) {
      alert("Appointment scheduled!");
      setDate("");
      setReason("");
      setDoctorId("");
    } else {
      alert("Failed to schedule appointment.");
    }
  };

  return (
    <div className="patient-layout">
      <PatientSidebar />
      <div className="content-area">
        <PatientHeader user={user} />

        {/* APPOINTMENT FORM*/}
        <div className="appointment-wrapper">
          <div className="appointment-card">

            <div className="appointment-illustration">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3209/3209265.png"
                alt="appointment"
                style={{ width: "280px" }}
              />
            </div>

            <div className="appointment-form">
              <h2>Schedule Appointment</h2>
              <p>Book an appointment with your preferred doctor.</p>

              <form onSubmit={handleSchedule}>

                <div className="form-group">
                  <label>Date & Time</label>
                  <input
                    type="datetime-local"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Reason</label>
                  <input
                    type="text"
                    placeholder="Describe your reason for visit"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Select Doctor</label>
                  <select
                    value={doctorId}
                    onChange={(e) => setDoctorId(e.target.value)}
                    required
                  >
                    <option value="">-- Choose a doctor --</option>
                    {doctors.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="btn schedule-btn">
                  Schedule
                </button>
              </form>
            </div>
          </div>
        </div>

        {/*AVAILABLE DOCTORS SECTION*/}
        <div className="doctor-section">
          <h3>Available Doctors</h3>
          <div className="doctor-grid">
            {doctors.map((doc) => (
              <div className="doctor-card" key={doc.id}>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3870/3870822.png"
                  alt="doctor"
                  className="doctor-img"
                />
                <h4>{doc.name}</h4>
                <p className="doctor-specialty">
                  {doc.specialty || "General Medicine"}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/*UPCOMING APPOINTMENTS SECTION */}
        <div className="upcoming-section">
          <h3>Your Upcoming Appointments</h3>

          {upcoming.length === 0 ? (
            <p className="empty-upcoming">No upcoming appointments.</p>
          ) : (
            <div className="upcoming-list">
              {upcoming.map((a) => (
                <div key={a.id} className="upcoming-card">
                  <strong>{new Date(a.date).toLocaleString()}</strong>
                  <span>
                    Doctor: {a.doctor?.name || "Unknown Doctor"}
                  </span>
                  <span>Status: {a.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
