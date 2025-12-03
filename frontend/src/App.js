import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import SignIn from "./components/SignIn";
import AdminHome from "./components/AdminHome";
import DoctorHome from "./components/DoctorHome";


import PatientHome from "./pages/patient/PatientHome";
import ScheduleAppointment from "./pages/patient/ScheduleAppointment";
import PatientRecords from "./pages/patient/PatientRecords";
import BloodworkPage from "./pages/patient/BloodworkPage";
import NotificationsPage from "./pages/patient/NotificationsPage";
import PatientProfile from "./pages/patient/PatientProfile";

import "./style.css";

function App() {
  const location = useLocation();

  
  const showTitle = location.pathname === "/";

  return (
    <div className="App">
      {showTitle && <h1 className="app-title">Medical Records App</h1>}

      <Routes>
        {/* Public Login Route */}
        <Route path="/" element={<SignIn />} />

        {/* Dashboards */}
        <Route path="/admin-dashboard" element={<AdminHome />} />
        <Route path="/doctor-dashboard" element={<DoctorHome />} />

        {/* Patient Dashboard */}
        <Route path="/patient-dashboard" element={<PatientHome />} />

        {/* Patient Subpages */}
        <Route path="/patient/appointments" element={<ScheduleAppointment />} />
        <Route path="/patient/records" element={<PatientRecords />} />
        <Route path="/patient/bloodwork" element={<BloodworkPage />} />
        <Route path="/patient/notifications" element={<NotificationsPage />} />
        <Route path="/patient-profile" element={<PatientProfile />} />
      </Routes>
    </div>
  );
}

export default App;
