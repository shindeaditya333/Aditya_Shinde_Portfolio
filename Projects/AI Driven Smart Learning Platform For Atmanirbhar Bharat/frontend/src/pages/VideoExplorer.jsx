import React, { useState, useEffect } from "react";
import "../components/VideoExplorer.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VideoExplorer = () => {

  const [search, setSearch] = useState("");
  const [videos, setVideos] = useState([]);
  const [mode, setMode] = useState("offline");
  const [showProfileMenu, setShowProfileMenu]
    = useState(false);
  const navigate = useNavigate();

  const categories = [
    "Java",
    "Python",
    "DSA",
    "Web Dev",
    "AI",
    "Aptitude",
    "Placement Prep"
  ];

  const fetchVideos = async () => {

        try {

            const response =
            await axios.get(
                "http://localhost:5000/api/videos/all"
            );

            setVideos(response.data);

        } catch (error) {

            console.log(error);

        }

  };

const searchVideos = async () => {

  try {

    let response;

    if (mode === "offline") {

      response = await axios.get(
        `http://localhost:5000/api/videos/search?query=${search}`
      );

    }

    else {

      response = await axios.get(
        `http://localhost:5000/api/videos/youtube/search?query=${search}`
      );

    }

    setVideos(response.data);

  }

  catch (error) {

    console.log(error);

  }

};

const loadYoutubeRecommendations = async () => {

  try {

    const response =
    await axios.get(
      "http://localhost:5000/api/videos/youtube/search?query=Programming Tutorial"
    );

    setVideos(response.data);

  }

  catch(error) {

    console.log(error);

  }

};

    useEffect(() => {
        fetchVideos();
    }, []);

  return (

    <div className="user-dashboard">

      {/* NAVBAR */}

      <div className="dashboard-navbar">

        <div className="dashboard-logo">
          SmartLearn
        </div>

        <div className="dashboard-search">

          <input
            type="text"
            placeholder="Search videos, courses..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <button onClick={searchVideos}>
            Search
          </button>

        </div>

        <div className="dashboard-icons">

          <div className="mode-toggle">

            <button
              className={
                mode === "offline"
                ? "active"
                : ""
              }
              onClick={() => {

                setMode("offline");

                fetchVideos();

              }}
            >
              Offline
            </button>

            <button
              className={
                mode === "online"
                ? "active"
                : ""
              }
              onClick={() => {

                setMode("online");

                loadYoutubeRecommendations();

              }}
            >
              Online
            </button>

          </div>

          <div className="notification-icon">
            🔔
          </div>

          <div
            className="profile-icon"
            onClick={() =>
              setShowProfileMenu(
                !showProfileMenu
              )
            }
          >
            👤
          </div>

          {
            showProfileMenu &&

            <div className="profile-dropdown">

              <p
                onClick={() => {
                  navigate("/profile");
                }}
              >
                Profile
              </p>

              <p>
                Settings
              </p>

              <p>
                Logout
              </p>

            </div>
          }

        </div>

      </div>

      {/* HERO */}

      <div className="dashboard-hero">

        <h1>
          Welcome Back 👋
        </h1>

        <p>
          Continue your learning journey.
        </p>

      </div>

      {/* CATEGORIES */}

      <div className="category-section">

        {
          categories.map((category, index) => (

            <button
              key={index}
              className="category-btn"
              onClick={async () => {

                setSearch(category);

                try {

                  let response;

                  if (mode === "offline") {

                    response = await axios.get(
                      `http://localhost:5000/api/videos/search?query=${category}`
                    );

                  } else {

                    response = await axios.get(
                      `http://localhost:5000/api/videos/youtube/search?query=${category}`
                    );

                  }

                  setVideos(response.data);

                }

                catch(error) {

                  console.log(error);

                }

              }}
            >
              {category}
            </button>

          ))
        }

      </div>

      {/* VIDEOS */}

      <div className="videos-container">

        <h2>
          Recommended Videos
        </h2>

        <div className="video-grid">

          {
            videos.length > 0 ? (

              videos.map((video, index) => (

                <div
                  className="video-card"
                  key={index}
                  onClick={() => {

                    if (
                      mode === "online"
                    ) {

                      navigate(
                        "/videoplayer",
                        {
                          state: {
                            video,
                            mode
                          }
                        }
                      );

                    }

                    else {

                      navigate(
                        `/video/${video._id}`,
                        {
                          state: {
                            mode: "offline"
                          }
                        }
                      );

                    }

                  }}
                >

                  <img
                    src={
                      mode === "offline"
                      ? `http://localhost:5000/${video.thumbnail}`
                      : video.thumbnail
                    }
                    alt={video.title}
                  />

                  <div className="video-content">

                    <h3>
                      {video.title}
                    </h3>

                    <p>

                      {

                        mode === "offline"

                        ? video.creator

                        : video.channelTitle

                      }

                    </p>

                    <div className="video-bottom">

                      {

                        mode === "offline"

                        ?

                        <>

                          <span>
                            {video.category}
                          </span>

                          <small>
                            {video.duration}
                          </small>

                        </>

                        :

                        <span>
                          YouTube
                        </span>

                      }

                    </div>

                  </div>

                </div>

              ))

            ) : (

              <div className="no-data">

                No data found

              </div>

            )
          }

        </div>

      </div>

    </div>

  );

};

export default VideoExplorer;