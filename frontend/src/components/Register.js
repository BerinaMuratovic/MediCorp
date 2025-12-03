import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import img from "../assets/medicorp.png";
import "../style.css";
import useInputValidation from "../hooks/useInputValidation";
import api from "../services/api";

export default function Register({ onRegisterSuccess }) {
  const navigate = useNavigate();
  const [isFormValid, setIsFormValid] = useState(true);
  const [role, setRole] = useState("PATIENT");

  const {
    value: nameInput,
    isValueValid: isNameValid,
    toShowError: nameInputError,
    valueChangeHandler: nameChangeHandler,
    onBlurHandler: nameBlurHandler,
    reset: resetNameInput,
  } = useInputValidation((value) => value.trim() !== "");

  const {
    value: emailInput,
    isValueValid: isEmailValid,
    toShowError: emailInputError,
    valueChangeHandler: emailChangeHandler,
    onBlurHandler: emailBlurHandler,
    reset: resetEmailInput,
  } = useInputValidation((value) => value.trim() !== "" && value.includes("@"));

  const {
    value: passwordInput,
    isValueValid: isPasswordValid,
    toShowError: passwordInputError,
    valueChangeHandler: passwordChangeHandler,
    onBlurHandler: passwordBlurHandler,
    reset: resetPasswordInput,
  } = useInputValidation((value) => value.trim().length > 6);

  const registerHandler = async (event) => {
    event.preventDefault();

    const valid = isNameValid && isPasswordValid && isEmailValid;
    setIsFormValid(valid);

    if (!valid) {
      alert("Please fill in all fields correctly.");
      return;
    }

    try {
      const response = await api.post("/users/register", {
        name: nameInput,
        email: emailInput,
        password: passwordInput,
        role: role,
      });

      alert("Registration successful!");
      const user = response.data;
      localStorage.setItem("user", JSON.stringify(user));

      
      if (role === "ADMIN") navigate("/admin-dashboard");
      else if (role === "DOCTOR") navigate("/doctor-dashboard");
      else navigate("/patient-dashboard");
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="base-container">
      <div className="header">REGISTER</div>

      <div className="content">
        <div className="image">
          <img src={img} alt="register" className="form-image" />
        </div>

        <div className="form">
          {!isFormValid && <p className="error">Form Invalid. Try again.</p>}

          <div className="form-group">
            <input
              type="text"
              placeholder="Full Name"
              value={nameInput}
              onChange={nameChangeHandler}
              onBlur={nameBlurHandler}
            />
            {nameInputError && <p className="error">Enter a valid name</p>}
          </div>

          <div className="form-group">
            <input
              type="email"
              placeholder="Email Address"
              value={emailInput}
              onChange={emailChangeHandler}
              onBlur={emailBlurHandler}
            />
            {emailInputError && <p className="error">Enter a valid email</p>}
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={passwordInput}
              onChange={passwordChangeHandler}
              onBlur={passwordBlurHandler}
            />
            {passwordInputError && (
              <p className="error">Password must be at least 7 characters</p>
            )}
          </div>

          <div className="form-group">
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="PATIENT">Patient</option>
              <option value="DOCTOR">Doctor</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>
      </div>

      <div className="footer">
        <button className="btn" type="submit" onClick={registerHandler}>
          Register
        </button>
      </div>
    </div>
  );
}
