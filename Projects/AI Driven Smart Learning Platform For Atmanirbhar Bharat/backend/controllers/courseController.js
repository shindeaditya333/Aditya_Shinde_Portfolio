const Course = require("../models/Course");

// Get All Courses

exports.getAllCourses = async (req, res) => {

    try {

        const courses = await Course.find();

        res.status(200).json(courses);

    }

    catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// Get Single Course

exports.getCourseById = async (req, res) => {

    try {

        const course =
        await Course.findById(
            req.params.id
        );

        if (!course) {

            return res.status(404).json({
                message: "Course not found"
            });

        }

        res.status(200).json(course);

    }

    catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// Create Course

exports.createCourse = async (req, res) => {

    try {

        const course =
        await Course.create(req.body);

        res.status(201).json(course);

    }

    catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// Update Course

exports.updateCourse = async (req, res) => {

    try {

        const course =
        await Course.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true
            }
        );

        if (!course) {

            return res.status(404).json({
                message: "Course not found"
            });

        }

        res.status(200).json(course);

    }

    catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// Delete Course

exports.deleteCourse = async (req, res) => {

    try {

        const course =
        await Course.findByIdAndDelete(
            req.params.id
        );

        if (!course) {

            return res.status(404).json({
                message: "Course not found"
            });

        }

        res.status(200).json({
            message: "Course deleted successfully"
        });

    }

    catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};