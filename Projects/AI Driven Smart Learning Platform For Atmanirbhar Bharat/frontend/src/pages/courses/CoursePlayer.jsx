import React,
{
    useEffect,
    useState
}
from "react";

import axios from "axios";

import {
    useParams
}
from "react-router-dom";

import "../../components/courses/CoursePlayer.css";

const CoursePlayer = () => {

    const { id } =
    useParams();

    const [course,
    setCourse] =
    useState(null);

    const [selectedModule,
    setSelectedModule] =
    useState(null);

    useEffect(() => {

        fetchCourse();

    }, []);

    const fetchCourse =
    async () => {

        try {

            const response =
            await axios.get(
                `http://localhost:5000/api/courses/${id}`
            );

            setCourse(
                response.data
            );

            if (
                response.data.modules &&
                response.data.modules.length > 0
            ) {

                setSelectedModule(
                    response.data.modules[0]
                );

            }

        }

        catch (error) {

            console.log(error);

        }

    };

    if (!course) {

        return (

            <div className="loading-course">

                Loading Course...

            </div>

        );

    }

    return (

        <div className="course-player">

            {/* SIDEBAR */}

            <div className="course-sidebar">

                <div className="sidebar-header">

                    <h2>
                        {course.title}
                    </h2>

                    <p>
                        {course.level}
                    </p>

                </div>

                <div className="modules-list">

                    {
                        course.modules?.map(
                        (module,index) => (

                            <div
                                key={index}
                                className={
                                    selectedModule?.moduleTitle ===
                                    module.moduleTitle

                                    ?

                                    "module-item active-module"

                                    :

                                    "module-item"
                                }

                                onClick={() =>
                                setSelectedModule(
                                    module
                                )}
                            >

                                <span>

                                    Module
                                    {" "}
                                    {index + 1}

                                </span>

                                <h4>
                                    {
                                        module.moduleTitle
                                    }
                                </h4>

                            </div>

                        ))
                    }

                </div>

            </div>

            {/* CONTENT AREA */}

            <div className="course-content">

                <div className="content-header">

                    <h1>
                        {
                            selectedModule?.
                            moduleTitle
                        }
                    </h1>

                </div>

                <div className="module-content">

                    <div className="theory-section">

                        {
                        selectedModule?.content
                            ?.filter(item => item.type === "text")
                            ?.slice(0,-1)
                            ?.map((item,index)=>(
                            <p key={index}>{item.value}</p>
                        ))
                        }

                    </div>

                    {
                        selectedModule?.content
                        ?.filter(item => item.type === "video")
                        ?.map((item,index)=>(
                            <div key={index} className="video-block">
                            <iframe
                                src={item.value}
                                title={`video-${index}`}
                                allowFullScreen
                            />
                            </div>
                        ))
                    }

                    {
                        selectedModule?.content
                        ?.filter(item => item.type === "code")
                        ?.map((item,index)=>(
                            <div key={index} className="code-block">
                            <pre>{item.value}</pre>
                            </div>
                        ))
                    }

                    <div className="theory-section">
                        <p>
                        {
                        selectedModule?.content
                        ?.filter(item => item.type === "text")
                        ?.slice(-1)[0]?.value
                        ?.replace(/\\n/g, "\n")
                        }
                        </p>
                    </div>

                    </div>

            </div>

        </div>

    );

};

export default CoursePlayer;