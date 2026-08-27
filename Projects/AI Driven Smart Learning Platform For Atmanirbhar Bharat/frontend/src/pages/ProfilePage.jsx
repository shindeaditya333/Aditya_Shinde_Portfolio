import React from "react";

import "../components/ProfilePage.css";

const ProfilePage = () => {

  const user =
    JSON.parse(localStorage.getItem("user"));

  return (

    <div className="profile-page">

      <div className="profile-card">

        <div className="profile-top">

          <div className="profile-avatar">
            👤
          </div>

          <h1>
            {user?.name || "User"}
          </h1>

        </div>

        <div className="profile-details">

          <div className="profile-item">

            <span>
              Role
            </span>

            <strong>
              {user?.role || "user"}
            </strong>

          </div>

          <div className="profile-item">

            <span>
              Email
            </span>

            <strong>
              {user?.email || "user@gmail.com"}
            </strong>

          </div>

          <div className="profile-item">

            <span>
              Phone Number
            </span>

            <strong>
              {user?.phone || "+91 XXXXX XXXXX"}
            </strong>

          </div>

        </div>

      </div>

    </div>

  );

};

export default ProfilePage;