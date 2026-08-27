const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  category: {
    type: String,
    required: true
  },

  creator: {
    type: String,
    default: "SmartLearn"
  },

  duration: {
    type: String
  },

  videoUrl: {
    type: String,
    required: true
  },

  thumbnail: {
    type: String,
    required: true
  },

  views: {
    type: Number,
    default: 0
  },

  likes: {
    type: Number,
    default: 0
  },

  uploadedAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model(
  "Video",
  videoSchema
);