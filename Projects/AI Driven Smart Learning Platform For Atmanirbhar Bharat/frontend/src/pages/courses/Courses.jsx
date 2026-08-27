import React,
{
    useEffect,
    useState
}
from "react";

import axios from "axios";

import {
    useNavigate
}
from "react-router-dom";

import "../../components/courses/Courses.css";

const Courses = () => {

    const navigate =
    useNavigate();

    const [courses,
    setCourses] =
    useState([]);

    const [loading,
    setLoading] =
    useState(true);

    useEffect(() => {

        fetchCourses();

    }, []);

    const fetchCourses =
    async () => {

        try {

            const response =
            await axios.get(
                "http://localhost:5000/api/courses/all"
            );

            setCourses(
                response.data
            );

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="courses-page">

            <div className="courses-header">

                <h1>
                    Courses
                </h1>

                <p>
                    Learn industry-ready skills
                    through structured modules.
                </p>

            </div>

            {
                loading ?

                (
                    <div className="loading">
                        Loading Courses...
                    </div>
                )

                :

                (

                    <div className="courses-grid">

                        {
                            courses.length > 0 ?

                            (

                                courses.map(
                                (course) => (

                                    <div
                                        key={course._id}
                                        className="course-card"
                                    >

                                        <div className="course-top">

                                            <span>
                                                {course.level}
                                            </span>

                                        </div>

                                        <h2>
                                            {course.title}
                                        </h2>

                                        <p>
                                            {
                                                course.description
                                            }
                                        </p>

                                        <div className="course-meta">

                                            <div>

                                                <strong>
                                                    Duration
                                                </strong>

                                                <p>
                                                    {
                                                        course.duration
                                                    }
                                                </p>

                                            </div>

                                            <div>

                                                <strong>
                                                    Modules
                                                </strong>

                                                <p>
                                                    {
                                                        course.modules
                                                        ?.length || 0
                                                    }
                                                </p>

                                            </div>

                                        </div>

                                        <button
                                            onClick={() =>
                                            navigate(
                                            `/course/${course._id}`
                                            )}
                                        >
                                            Open Course
                                        </button>

                                    </div>

                                ))

                            )

                            :

                            (

                                <div className="no-courses">

                                    No Courses Available

                                </div>

                            )
                        }

                    </div>

                )
            }

        </div>

    );

};

export default Courses;