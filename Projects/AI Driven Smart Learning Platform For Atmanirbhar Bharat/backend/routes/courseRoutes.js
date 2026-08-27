const express = require("express");

const router = express.Router();

const {

    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse

} = require(
    "../controllers/courseController"
);

// Get all courses

router.get(
    "/all",
    getAllCourses
);

// Get single course

router.get(
    "/:id",
    getCourseById
);

// Create course

router.post(
    "/create",
    createCourse
);

// Update course

router.put(
    "/:id",
    updateCourse
);

// Delete course

router.delete(
    "/:id",
    deleteCourse
);

module.exports = router;