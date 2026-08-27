import React,
{
  useEffect,
  useState
}
from "react";

import axios from "axios";

import {
  useParams,
  useLocation
}
from "react-router-dom";

import "../components/VideoPlayer.css";

const VideoPlayer = () => {

  const { id } =
  useParams();

  const location =
  useLocation();

  const onlineVideo =
  location.state?.video;

  const mode =
  location.state?.mode;

  const [video,
  setVideo] =
  useState(null);

  useEffect(() => {

    if (
      mode === "offline"
    ) {

      fetchVideo();

    }

  }, []);

  const fetchVideo =
  async () => {

    try {

      const response =
      await axios.get(
        `http://localhost:5000/api/videos/${id}`
      );

      setVideo(
        response.data
      );

    }

    catch(error) {

      console.log(error);

    }

  };

  if (
    mode === "offline"
    &&
    !video
  ) {

    return (

      <h2>
        Loading...
      </h2>

    );

  }

  return (

    <div className="video-player-page">

      {

        mode === "online"

        ?

        <iframe
          className="main-video"
          src={`https://www.youtube.com/embed/${onlineVideo.videoId}`}
          title={onlineVideo.title}
          allowFullScreen
        />

        :

        <video
          controls
          autoPlay
          className="main-video"
        >

          <source
            src={`http://localhost:5000/${video.videoUrl}`}
          />

        </video>

      }

      <h1>

        {

          mode === "online"

          ?

          onlineVideo.title

          :

          video.title

        }

      </h1>

      <div className="video-info-box">

        <div className="meta-label">
          Channel
        </div>

        <div className="channel-name">

          {

            mode === "online"

            ?

            onlineVideo.channelTitle

            :

            video.creator

          }

        </div>

        <div className="desc-title">
          Description
        </div>

        <div className="desc-content">

          {

            mode === "online"

            ?

            "Playing from YouTube"

            :

            video.description

          }

        </div>

      </div>

    </div>

  );

};

export default VideoPlayer;