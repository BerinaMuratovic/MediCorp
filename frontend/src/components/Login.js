import React from "react";
import { useNavigate } from "react-router-dom";
import img from "../assets/medicorp.png";
import useInputValidation from "../hooks/useInputValidation";
import api from "../services/api";
import "../style.css";

export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate();

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
  } = useInputValidation((value) => value.trim().length >= 6);

  const loginHandler = async (event) => {
    event.preventDefault();

    if (!isEmailValid || !isPasswordValid) {
      alert("Please enter a valid email and password.");
      return;
    }

    try {
      const response = await api.post("/users/login", {
        email: emailInput,
        password: passwordInput,
      });

      const user = response.data;
      console.log("Login success:", user);
      alert(`Welcome ${user.name}! Role: ${user.role}`);

      localStorage.setItem("user", JSON.stringify(user));
      if (onLoginSuccess) onLoginSuccess(user);

      
      if (user.role === "ADMIN") navigate("/admin-dashboard");
      else if (user.role === "DOCTOR") navigate("/doctor-dashboard");
      else navigate("/patient-dashboard");
    } catch (error) {
      console.error("Login error:", error);
      alert("Invalid email or password.");
    }

    resetEmailInput();
    resetPasswordInput();
  };

  return (
    <div className="base-container">
      <div className="header">LOGIN</div>
      <div className="content">
        <div className="image">
          <img src={img} alt="login" className="form-image" />
        </div>

        <div className="form">
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
            {passwordInputError && <p className="error">Password too short</p>}
          </div>
        </div>
      </div>

      <div className="footer">
        <button className="btn" type="submit" onClick={loginHandler}>
          Login
        </button>
      </div>
    </div>
  );
}
