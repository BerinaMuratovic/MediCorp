import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../style.css";

export default function PatientHeader({ user }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const dropdownRef = useRef(null);

 
  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:8080/api/notifications/user/${user.id}`)
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch((err) => console.error("Error fetching notifications:", err));
  }, [user]);

 
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="patient-header">
      <div className="logo" onClick={() => navigate("/patient-dashboard")}>
        MediCorp
      </div>

      <div className="header-right">

        {/* NOTIFICATION BELL */}
        <div
          className="notif-wrapper"
          ref={dropdownRef}
        >
          <button
            className="notif-btn"
            onClick={() => setOpen((prev) => !prev)}
          >
            🔔
            {notifications.some((n) => !n.readStatus) && (
              <span className="notif-dot"></span>
            )}
          </button>

          {/* DROPDOWN PANEL */}
          {open && (
            <div className="notif-dropdown">
              <h4>Notifications</h4>

              {notifications.length === 0 ? (
                <p className="notif-empty">No notifications.</p>
              ) : (
                <ul>
                  {notifications
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map((n) => (
                      <li
                        key={n.id}
                        className={`notif-item ${!n.readStatus ? "unread" : ""}`}
                      >
                        <strong>{n.message}</strong>
                        <span>{new Date(n.createdAt).toLocaleString()}</span>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* USER PROFILE */}
        <div className="user-box" onClick={() => navigate("/patient-profile")}>
          <span>{user?.name}</span>
          <img
            src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
            alt="profile"
            className="profile-pic"
          />
        </div>
      </div>
    </header>
  );
}
