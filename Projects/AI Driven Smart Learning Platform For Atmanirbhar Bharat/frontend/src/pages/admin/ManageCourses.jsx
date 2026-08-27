import React from "react";

import { useNavigate }
from "react-router-dom";

import "../../components/admin/ManageCourses.css";

const ManageCourses = () => {

    const navigate =
    useNavigate();

    return (

        <div className="manage-courses">

            <div className="manage-header">

                <h1>
                    Course Management
                </h1>

            </div>

            <div className="course-options">

                <div
                    className="option-card"

                    onClick={() =>
                    navigate("/addcourse")
                    }
                >

                    <div className="option-icon">
                        ➕
                    </div>

                    <h2>
                        Add Course
                    </h2>

                    <p>
                        Create a new course with
                        modules, videos and code.
                    </p>

                </div>

                <div
                    className="option-card"

                    onClick={() =>
                    navigate("/updatecourse")
                    }
                >

                    <div className="option-icon">
                        ✏️
                    </div>

                    <h2>
                        Update Course
                    </h2>

                    <p>
                        Modify existing course
                        content and modules.
                    </p>

                </div>

                <div
                    className="option-card"

                    onClick={() =>
                    navigate("/deletecourse")
                    }
                >

                    <div className="option-icon">
                        🗑️
                    </div>

                    <h2>
                        Delete Course
                    </h2>

                    <p>
                        Remove unwanted courses
                        from the platform.
                    </p>

                </div>

            </div>

        </div>

    );

};

export default ManageCourses;