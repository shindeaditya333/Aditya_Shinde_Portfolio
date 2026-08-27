const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Profile = require("../models/Profile");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const adminEmails = [
  "admin@gmail.com",
  "owner@gmail.com"
];

const storage = multer.diskStorage({

  destination: function (req, file, cb) {

    if (file.fieldname === "profilePic") {
      cb(null, "uploads/profilePics");
    }

    else if (file.fieldname === "resume") {
      cb(null, "uploads/resumes");
    }

  },

  filename: function (req, file, cb) {

    cb(
      null,
      Date.now() +
      path.extname(file.originalname)
    );

  }

});

const upload = multer({ storage });

router.post("/signup", async (req, res) => {

  try {

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const role = adminEmails.includes(email)
      ? "admin"
      : "user";

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();

    res.status(201).json({
      message: "Account created successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: "Server Error"
    });

  }

});

router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Credentials"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Credentials"
      });
    }

    const token = jwt.sign(
      { id: user._id },
      "SECRET_KEY",
      { expiresIn: "7d" }
    );

    const profile =
await Profile.findOne({

  userId: user._id

});

res.json({

    message:
      user.role === "admin"
        ? "Admin Login Successful"
        : "User Login Successful",

    token,

    hasProfile:
      profile ? true : false,

    user: {

      _id: user._id,

      name: user.name,

      email: user.email,

      role: user.role

    }

  });

  } catch (error) {

    res.status(500).json({
      message: "Server Error"
    });

  }

});

router.post("/save-profile", upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "resume", maxCount: 1 }]), async (req, res) => {

  try {

    const {

      userId,
      phone,
      dob,
      gender,
      address,

      skills,
      languages,

      linkedin,
      github,
      portfolio,
      leetcode,

      education,
      experience

    } = req.body;

    const profilePic =
      req.files?.profilePic?.[0]?.path || "";

    const resume =
      req.files?.resume?.[0]?.path || "";

    let profile = await Profile.findOne({ userId });

    if (profile) {

      profile.phone = phone;
      profile.dob = dob;
      profile.gender = gender;
      profile.address = address;

      profile.skills = JSON.parse(skills);
      profile.languages = JSON.parse(languages);

      profile.linkedin = linkedin;
      profile.github = github;
      profile.portfolio = portfolio;
      profile.leetcode = leetcode;

      profile.education = JSON.parse(education);
      profile.experience = JSON.parse(experience);

      profile.profilePic = profilePic;
      profile.resume = resume;
      await profile.save();

    } else {

      profile = new Profile({
        profilePic,

        userId,

        phone,
        dob,
        gender,
        address,

        skills: JSON.parse(skills),
        languages: JSON.parse(languages),

        linkedin,
        github,
        portfolio,
        leetcode,

        education: JSON.parse(education),
        experience: JSON.parse(experience),

        resume
      });

      await profile.save();

    }

    res.status(200).json({
      message: "Profile Saved Successfully"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });

  }

});

module.exports = router;