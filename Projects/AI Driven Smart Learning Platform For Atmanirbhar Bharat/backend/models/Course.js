const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({

    type: {
        type: String,
        enum: ["text", "video", "code"],
        required: true
    },

    value: {
        type: String,
        required: true
    }

});

const moduleSchema = new mongoose.Schema({

    moduleTitle: {
        type: String,
        required: true
    },

    content: [contentSchema]

});

const courseSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        default: ""
    },

    level: {
        type: String,
        default: "Beginner"
    },

    duration: {
        type: String,
        default: ""
    },

    modules: [moduleSchema]

},
{
    timestamps: true
});

module.exports =
mongoose.model(
    "Course",
    courseSchema
);