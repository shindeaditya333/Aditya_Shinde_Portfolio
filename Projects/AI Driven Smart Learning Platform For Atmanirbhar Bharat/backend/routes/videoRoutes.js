const express = require("express");

const router = express.Router();

const multer = require("multer");

const path = require("path");

const Video = require("../models/Video");

const axios = require("axios");

const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    if (
      file.fieldname === "video"
    ) {

      cb(
        null,
        "uploads/videos"
      );

    }

    else if (
      file.fieldname === "thumbnail"
    ) {

      cb(
        null,
        "uploads/thumbnails"
      );

    }

  },

  filename: (req, file, cb) => {

    cb(

      null,

      Date.now() +
      "-" +
      path.extname(file.originalname)

    );

  }

});

const upload = multer({
  storage
});


// UPLOAD VIDEO API

router.post(

  "/upload",

  upload.fields([

    {
      name: "video",
      maxCount: 1
    },

    {
      name: "thumbnail",
      maxCount: 1
    }

  ]),

  async (req, res) => {

    try {

      const {

        title,
        description,
        category,
        creator,
        duration

      } = req.body;

      const newVideo = new Video({

        title,

        description,

        category,

        creator,

        duration,

        thumbnail:
          req.files.thumbnail[0].path,

        videoUrl:
          req.files.video[0].path

      });

      await newVideo.save();

      res.status(201).json({

        message:
          "Video Uploaded Successfully"

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          "Server Error"

      });

    }

  }

);


// GET ALL VIDEOS

router.get(
  "/all",
  async (req, res) => {

    try {

      const videos =
        await Video.find()
        .sort({ uploadedAt: -1 });

      res.json(videos);

    } catch (error) {

      res.status(500).json({
        message: "Server Error"
      });

    }

  }
);


// SEARCH VIDEOS

router.get(
  "/search",
  async (req, res) => {

    try {

      const query =
        req.query.query;

      const videos =
        await Video.find({

          title: {

            $regex: query,

            $options: "i"

          }

        });

      res.json(videos);

    } catch (error) {

      res.status(500).json({

        message:
          "Server Error"

      });

    }

  }
);

// YOUTUBE SEARCH

router.get(
  "/youtube/search",
  async (req, res) => {

    try {

      const query = req.query.query;

      const response = await axios.get(
        "https://www.googleapis.com/youtube/v3/search",
        {
          params: {
            part: "snippet",
            q: query,
            maxResults: 20,
            type: "video",
            key: process.env.YOUTUBE_API_KEY_3
          }
        }
      );

      const videos =
      response.data.items.map(video => ({

        videoId: video.id.videoId,

        title: video.snippet.title,

        thumbnail:
        video.snippet.thumbnails.high.url,

        channelTitle:
        video.snippet.channelTitle

      }));

      res.json(videos);

    }

    catch (error) {

      console.log(error);

      res.status(500).json({
        message: "YouTube Search Error"
      });

    }

  }
);

// GET SINGLE VIDEO

router.get(
  "/:id",
  async (req, res) => {

    try {

      const video =
      await Video.findById(
        req.params.id
      );

      res.json(video);

    }

    catch(error) {

      res.status(500).json({
        message: "Server Error"
      });

    }

  }
);

module.exports = router;