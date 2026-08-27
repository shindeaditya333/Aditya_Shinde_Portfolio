import React, { useState } from "react";
import axios from "axios";
import "../components/Auth.css";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    try {

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      setSuccess(response.data.message);

    const user =
    response.data.user;

    const hasProfile =
    response.data.hasProfile;

    if (user.role === "admin") {

      setTimeout(() => {

        navigate("/admindashboard");

      }, 1000);

    }

    else {

      if (hasProfile) {

        setTimeout(() => {

          navigate("/userdashboard");

        }, 1000);

      }

      else {

        setTimeout(() => {

          navigate("/profilesetup");

        }, 1000);

      }

    }


    } catch (err) {

      setError(
        err.response?.data?.message || "Login Failed"
      );

    }

  };

  return (

    <div className="auth-container">

      <div className="auth-card">

        <h1 className="auth-title">
          Welcome
        </h1>

        <p className="auth-subtitle">
          Login to continue learning
        </p>

        {
          error &&
          <p className="error">
            {error}
          </p>
        }

        <form onSubmit={handleSubmit}>

          <div className="input-group">

            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter email"
              onChange={handleChange}
            />

          </div>

          <div className="input-group">

            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter password"
              onChange={handleChange}
            />

          </div>

          <button className="auth-btn">
            Login
          </button>

        </form>

        <div className="auth-footer">

          Don't have an account?

          {" "}

          <Link to="/signup">
            Signup
          </Link>

        </div>

      </div>

      {
        success &&

        <div className="popup-overlay">

          <div className="popup-box">

            <h2>
              {success}
            </h2>

            <button
              type="button"
              onClick={() => {
                setSuccess("");
              }}
              className="popup-btn"
            >
              OK
            </button>

          </div>

        </div>
      }

    </div>

  );

};

export default Login;