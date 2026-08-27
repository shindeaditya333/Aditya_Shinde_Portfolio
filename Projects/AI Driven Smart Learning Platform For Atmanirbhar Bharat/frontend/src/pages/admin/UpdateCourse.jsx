import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../components/admin/UpdateCourse.css";

const UpdateCourse = () => {

    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {

        try {

            const response = await axios.get(
                "http://localhost:5000/api/courses/all"
            );

            setCourses(response.data);

        } catch (error) {

            console.log(error);

        }

    };

    const saveCourse = async () => {

        try {

            await axios.put(

                `http://localhost:5000/api/courses/${selectedCourse._id}`,

                selectedCourse

            );

            alert("Course Updated Successfully");

            fetchCourses();

        } catch (error) {

            console.log(error);

        }

    };

    return (

        <div className="update-course">

            <h1>Update Courses</h1>

            <div className="course-list">

                {
                    courses.map((course) => (

                        <div
                            key={course._id}
                            className="course-card"
                        >

                            <div>

                                <h3>
                                    {course.title}
                                </h3>

                                <p>
                                    {course.level}
                                </p>

                            </div>

                            <button
                                onClick={() =>
                                    setSelectedCourse(course)
                                }
                            >
                                Update
                            </button>

                        </div>

                    ))
                }

            </div>

            {
                selectedCourse &&

                <div className="edit-form">

                    <h2>
                        Edit Course
                    </h2>

                    <input
                        type="text"
                        value={selectedCourse.title}
                        onChange={(e) =>
                            setSelectedCourse({
                                ...selectedCourse,
                                title: e.target.value
                            })
                        }
                    />

                    <textarea
                        value={selectedCourse.description}
                        onChange={(e) =>
                            setSelectedCourse({
                                ...selectedCourse,
                                description: e.target.value
                            })
                        }
                    />

                    <input
                        type="text"
                        value={selectedCourse.level}
                        onChange={(e) =>
                            setSelectedCourse({
                                ...selectedCourse,
                                level: e.target.value
                            })
                        }
                    />

                    <input
                        type="text"
                        value={selectedCourse.duration}
                        onChange={(e) =>
                            setSelectedCourse({
                                ...selectedCourse,
                                duration: e.target.value
                            })
                        }
                    />

                    <button
                        className="save-btn"
                        onClick={saveCourse}
                    >
                        Save Changes
                    </button>

                </div>

            }

        </div>

    );

};

export default UpdateCourse;