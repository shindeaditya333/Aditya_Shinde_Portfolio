const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema({

  educationType: String,

  collegeName: String,

  specialization: String,

  cgpa: String,

  admissionYear: String,

  passingYear: String

});

const experienceSchema = new mongoose.Schema({

  experienceType: String,

  role: String,

  companyName: String,

  duration: String,

  description: String

});

const profileSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  profilePic: String,
  
  phone: String,

  dob: String,

  gender: String,

  address: String,

  skills: [
    {
      type: String
    }
  ],

  languages: [
    {
      type: String
    }
  ],

  resume: String,

  linkedin: String,

  github: String,

  portfolio: String,

  leetcode: String,

  education: [educationSchema],

  experience: [experienceSchema]

});

module.exports = mongoose.model("Profile", profileSchema);