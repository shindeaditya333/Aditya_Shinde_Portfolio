import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import "../components/AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab]
    = useState("upload");

  const [formData, setFormData]
    = useState({

      title: "",
      description: "",
      category: "",
      creator: "",
      duration: ""

    });

  const [video, setVideo]
    = useState(null);

  const [thumbnail, setThumbnail]
    = useState(null);

  const [success, setSuccess]
    = useState("");

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
      e.target.value

    });

  };

  const handleUpload = async (e) => {

    e.preventDefault();

      if (
          !formData.title ||
          !formData.description ||
          !formData.category ||
          !formData.creator ||
          !formData.duration ||
          !thumbnail ||
          !video
        ) {

          alert("❗All fields are necessary");

          return;

        }

    try {

      const data =
      new FormData();

      data.append(
        "title",
        formData.title
      );

      data.append(
        "description",
        formData.description
      );

      data.append(
        "category",
        formData.category
      );

      data.append(
        "creator",
        formData.creator
      );

      data.append(
        "duration",
        formData.duration
      );

      data.append(
        "thumbnail",
        thumbnail
      );

      data.append(
        "video",
        video
      );

      const response =
      await axios.post(

        "http://localhost:5000/api/videos/upload",

        data

      );

      setSuccess(
        response.data.message
      );

    } catch (error) {

      console.log(error);

      alert("Upload Failed");

    }

  };

  return (

    <div className="admin-dashboard">

      {/* SIDEBAR */}

      <div className="admin-sidebar">

        <h2>
          Admin Panel
        </h2>

        <button
          onClick={() =>
            setActiveTab("upload")
          }
        >
          Upload Videos
        </button>

        <button
          onClick={() =>
            setActiveTab("videos")
          }
        >
          Manage Videos
        </button>

        <button
          onClick={() =>
            navigate("/managecourses")
          }
        >
          Manage Courses
        </button>
        
        <button
          onClick={() =>
            setActiveTab("users")
          }
        >
          Manage Users
        </button>

        <button
          onClick={() =>
            setActiveTab("analytics")
          }
        >
          Analytics
        </button>

      </div>

      {/* CONTENT */}

      <div className="admin-content">

        {
          activeTab === "upload" &&

          <div className="upload-section">

            <h1>
              Upload Learning Content
            </h1>

            <form onSubmit={handleUpload}>

              <input
                type="text"
                name="title"
                placeholder="Video Title"
                onChange={handleChange}
              />

              <textarea
                name="description"
                placeholder="Description"
                onChange={handleChange}
              ></textarea>

              <input
                type="text"
                name="category"
                placeholder="Category"
                onChange={handleChange}
              />

              <input
                type="text"
                name="creator"
                placeholder="Creator"
                onChange={handleChange}
              />

              <input
                type="text"
                name="duration"
                placeholder="Duration"
                onChange={handleChange}
              />

              <div className="input-group">

                  <label>
                    Upload Thumbnail
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setThumbnail(
                        e.target.files[0]
                      )
                    }
                  />

              </div>

              <div className="input-group">

                  <label>
                    Upload Video
                  </label>

                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) =>
                      setVideo(
                        e.target.files[0]
                      )
                    }
                  />

              </div>

              <button type="submit">
                Upload Video
              </button>

            </form>

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
        }

        {
          activeTab === "videos" &&

          <div>

            <h1>
              Manage Videos
            </h1>

            <p>
              Video management coming next...
            </p>

          </div>
        }

        {
          activeTab === "users" &&

          <div>

            <h1>
              Manage Users
            </h1>

            <p>
              User management coming next...
            </p>

          </div>
        }

        {
          activeTab === "analytics" &&

          <div>

            <h1>
              Analytics
            </h1>

            <p>
              Analytics dashboard coming next...
            </p>

          </div>
        }

      </div>

    </div>

  );

};

export default AdminDashboard;