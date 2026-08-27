import React, { useState } from "react";
import axios from "axios";
import "../components/Auth.css";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validate = () => {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      return "Name is required";
    }

    if (!emailRegex.test(formData.email)) {
      return "Invalid email";
    }

    if (formData.password.length < 6) {
      return "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {

      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password
        }
      );

      setSuccess(response.data.message);
      setError("");

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (err) {

      setError(err.response?.data?.message || "Signup failed");
      setSuccess("");

    }
  };

  return (
    <div className="auth-container">

      <div className="auth-card">

        <h1 className="auth-title">Create Account</h1>

        <p className="auth-subtitle">
          Join the Smart Learning Platform
        </p>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create password"
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              onChange={handleChange}
            />
          </div>

          <button className="auth-btn">
            Sign Up
          </button>

        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/">Login</Link>
        </div>

      </div>

    </div>
  );
};

export default Signup;