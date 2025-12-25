import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import PatientHeader from "../../components/PatientHeader";
import "../../style.css";

export default function AdminHome() {
  const [admin, setAdmin] = useState(null);

  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [stats, setStats] = useState({
    newUsersLast30Days: 0,
    appointmentsLast30Days: 0,
    userGrowth: 0
  });

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setAdmin(u);

    /* ================= LOAD USERS ================= */
    fetch("http://localhost:8080/api/users")
      .then(res => res.json())
      .then(setUsers)
      .catch(() => console.error("Failed to load users"));

    /* ================= LOAD APPOINTMENTS ================= */
    fetch("http://localhost:8080/api/appointments")
      .then(res => res.json())
      .then(setAppointments)
      .catch(() => console.error("Failed to load appointments"));

    /* ================= LOAD ADMIN STATS ================= */
    fetch("http://localhost:8080/api/admin/stats")
      .then(res => res.json())
      .then(setStats)
      .catch(() => console.error("Failed to load admin stats"));
  }, []);

  const doctors = users.filter(u => u.role === "DOCTOR").length;
  const patients = users.filter(u => u.role === "PATIENT").length;

  return (
    <div className="patient-layout">
      <AdminSidebar />

      <div className="content-area">
        <PatientHeader user={admin} />

        <main className="patient-content">
          <h2 className="dashboard-title">Admin Dashboard</h2>
          <p className="dashboard-subtitle">
            System overview and platform statistics
          </p>

          {/* ================= SUMMARY ================= */}
          <div className="summary-grid">
            <div className="summary-card">
              <h3>Total Users</h3>
              <p>{users.length}</p>
            </div>

            <div className="summary-card">
              <h3>Doctors</h3>
              <p>{doctors}</p>
            </div>

            <div className="summary-card">
              <h3>Patients</h3>
              <p>{patients}</p>
            </div>

            <div className="summary-card">
              <h3>Total Appointments</h3>
              <p>{appointments.length}</p>
            </div>
          </div>

          {/* ================= STATISTICS ================= */}
          <h3 style={{ marginTop: "40px" }}>Platform Statistics</h3>

          <div className="summary-grid">
            <div className="summary-card highlight">
              <h4>New Users (Last 30 Days)</h4>
              <p>{stats.newUsersLast30Days}</p>
            </div>

            <div className="summary-card highlight">
              <h4>Appointments (Last 30 Days)</h4>
              <p>{stats.appointmentsLast30Days}</p>
            </div>

            <div className="summary-card highlight">
              <h4>User Growth</h4>
              <p className={stats.userGrowth >= 0 ? "growth-up" : "growth-down"}>
                {stats.userGrowth >= 0 ? "▲" : "▼"} {Math.abs(stats.userGrowth)}%
              </p>
            </div>
          </div>

          {/* ================= RECENT USERS ================= */}
          <h3 style={{ marginTop: "40px" }}>Recent Users</h3>

          <div className="record-card">
            {users.slice(0, 5).map(u => (
              <div key={u.id} className="record-item">
                <div className="record-left">
                  <strong>{u.name}</strong>
                  <span>{u.email}</span>
                </div>
                <div className="record-right">
                  <span>{u.role}</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
