import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../components/admin/DeleteCourse.css";

const DeleteCourse = () => {

    const [courses, setCourses] = useState([]);

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

    const deleteCourse = async (id) => {

        const confirmDelete =
            window.confirm(
                "Delete this course?"
            );

        if (!confirmDelete)
            return;

        try {

            await axios.delete(
                `http://localhost:5000/api/courses/${id}`
            );

            fetchCourses();

        } catch (error) {

            console.log(error);

        }

    };

    return (

        <div className="delete-course">

            <h1>
                Delete Courses
            </h1>

            {
                courses.map((course) => (

                    <div
                        key={course._id}
                        className="delete-card"
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
                                deleteCourse(
                                    course._id
                                )
                            }
                        >
                            Delete
                        </button>

                    </div>

                ))
            }

        </div>

    );

};

export default DeleteCourse;