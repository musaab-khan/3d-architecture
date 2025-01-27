import React from 'react';


const VideoModal = ({videoWidth,videoHeight}) => {
  console.log(videoHeight,videoWidth)
  return (
            <video
              width={videoWidth} // You can adjust this to your preferred size
              height={videoHeight}
              controls
              autoPlay
              loop
              src={'https://firebasestorage.googleapis.com/v0/b/siwa-genuine-parts.appspot.com/o/3D_CRO_Sample_videos%2FGitHub%20Desktop%202025-01-27%2019-28-49.mp4?alt=media&token=fc7aef2c-2990-4b02-9a44-1edc92888eb0'} // Use the application/octet-stream link here
            >
              Your browser does not support the video tag.
            </video>
  )
}

export default VideoModal
