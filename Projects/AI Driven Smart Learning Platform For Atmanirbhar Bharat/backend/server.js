const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const videoRoutes = require("./routes/videoRoutes");
const courseRoutes = require("./routes/courseRoutes");
const chatRoutes = require("./routes/chatRoutes");
const internshipRoutes = require("./routes/internshipRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/internships", internshipRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});


