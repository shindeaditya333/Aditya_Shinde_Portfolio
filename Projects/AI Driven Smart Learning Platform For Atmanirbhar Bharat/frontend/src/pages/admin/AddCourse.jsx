import React,
{
    useState
}
from "react";

import axios from "axios";

import {
    useNavigate
}
from "react-router-dom";

import "../../components/admin/AddCourse.css";

const AddCourse = () => {

    const navigate =
    useNavigate();

    const [course,
    setCourse] =
    useState({

        title:"",
        description:"",
        level:"",
        duration:""

    });

    const [modules,
    setModules] =
    useState([]);

    const addModule = () => {

        setModules([
            ...modules,
            {
                moduleTitle:"",
                content:[]
            }
        ]);

    };

    const updateModuleTitle =
    (index,value)=>{

        const updated =
        [...modules];

        updated[index]
        .moduleTitle = value;

        setModules(updated);

    };

    const addContent =
    (moduleIndex)=>{

        const updated =
        [...modules];

        updated[moduleIndex]
        .content.push({

            type:"text",
            value:""

        });

        setModules(updated);

    };

    const updateContent =
    (
        moduleIndex,
        contentIndex,
        field,
        value
    )=>{

        const updated =
        [...modules];

        updated[moduleIndex]
        .content[contentIndex]
        [field] = value;

        setModules(updated);

    };

    const saveCourse =
    async()=>{

        try{

            await axios.post(

            "http://localhost:5000/api/courses/create",

            {
                ...course,
                modules
            }

            );

            alert(
            "Course Created Successfully"
            );

            navigate(
            "/managecourses"
            );

        }

        catch(error){

            console.log(error);

        }

    };

    return(

        <div className="add-course">

            <h1>
                Create Course
            </h1>

            <input
                type="text"
                placeholder="Course Title"
                value={course.title}
                onChange={(e)=>
                setCourse({
                    ...course,
                    title:e.target.value
                })}
            />

            <textarea
                placeholder="Description"
                value={course.description}
                onChange={(e)=>
                setCourse({
                    ...course,
                    description:e.target.value
                })}
            />

            <input
                type="text"
                placeholder="Level"
                value={course.level}
                onChange={(e)=>
                setCourse({
                    ...course,
                    level:e.target.value
                })}
            />

            <input
                type="text"
                placeholder="Duration"
                value={course.duration}
                onChange={(e)=>
                setCourse({
                    ...course,
                    duration:e.target.value
                })}
            />

            <button
            onClick={addModule}
            >
                Add Module
            </button>

            {
                modules.map(
                (module,moduleIndex)=>(
                <div
                key={moduleIndex}
                className="module-box"
                >

                    <input
                        type="text"
                        placeholder="Module Title"
                        value={
                        module.moduleTitle
                        }
                        onChange={(e)=>
                        updateModuleTitle(
                        moduleIndex,
                        e.target.value
                        )}
                    />

                    <button
                    onClick={()=>
                    addContent(
                    moduleIndex
                    )}
                    >
                        Add Content
                    </button>

                    {
                        module.content.map(
                        (item,contentIndex)=>(
                        <div
                        key={contentIndex}
                        className="content-box"
                        >

                            <select
                            value={item.type}
                            onChange={(e)=>
                            updateContent(
                            moduleIndex,
                            contentIndex,
                            "type",
                            e.target.value
                            )}
                            >

                                <option>
                                    text
                                </option>

                                <option>
                                    video
                                </option>

                                <option>
                                    code
                                </option>

                            </select>

                            <textarea
                            placeholder="Content"
                            value={item.value}
                            onChange={(e)=>
                            updateContent(
                            moduleIndex,
                            contentIndex,
                            "value",
                            e.target.value
                            )}
                            />

                        </div>
                        ))
                    }

                </div>
                ))
            }

            <button
            className="save-btn"
            onClick={saveCourse}
            >
                Save Course
            </button>

        </div>

    );

};

export default AddCourse;