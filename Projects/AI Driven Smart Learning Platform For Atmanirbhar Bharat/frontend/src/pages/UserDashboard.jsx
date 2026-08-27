import React, { useState } from "react";
import "../components/UserDashboard.css";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const navigate = useNavigate();

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const dashboardCards = [
    {
      title: "Courses",
      icon: "📚",
      description: "Browse and learn new skills",
      action: () => navigate("/courses")
    },
    {
      title: "Internships",
      icon: "🎓",
      description: "Find internship opportunities",
      action: () => navigate("/internships")
    },
    {
      title: "Study Material",
      icon: "🎥",
      description: "Videos, PDFs and Notes",
      action: () => navigate("/videoexplorer")
    },
    {
      title: "AI Assistant",
      icon: "🤖",
      description: "Ask study related questions",
      action: () => navigate("/aiassistant")
    },
    {
      title: "Progress",
      icon: "📈",
      description: "Track your learning journey",
      action: () => alert("Coming Soon")
    },

  ];

  return (
    <div className="user-dashboard">
      {/* NAVBAR */}

      <div className="dashboard-navbar">
        <div className="dashboard-logo">
          SmartLearn
        </div>

        <div className="dashboard-icons">
          <div className="notification-icon">
            🔔
          </div>

          <div
            className="profile-icon"
            onClick={() =>
              setShowProfileMenu(!showProfileMenu)
            }
          >
            👤
          </div>

          {showProfileMenu && (
            <div className="profile-dropdown">
              <p onClick={() => navigate("/profile")}>
                Profile
              </p>

              <p>Settings</p>

              <p>Logout</p>
            </div>
          )}
        </div>
      </div>

      {/* HERO */}

      <div className="hero-card">
        <div className="hero-content">
          <h1>
            Welcome Back 👋
          </h1>

          <p>
            Your AI-powered learning companion.
            Explore courses, internships,
            study materials and AI assistance
            from one place.
          </p>

          <button>
            Start Learning
          </button>
        </div>
      </div>

      {/* DASHBOARD CARDS */}

      <div className="dashboard-cards">

        {dashboardCards.map((card, index) => (

          <div
            key={index}
            className="feature-card"
            onClick={card.action}
          >

            <div className="card-icon">
              {card.icon}
            </div>

            <h3>
              {card.title}
            </h3>

            <p>
              {card.description}
            </p>

          </div>

        ))}

      </div>
    </div>
  );
};

export default UserDashboard;