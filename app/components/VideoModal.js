import React from 'react';


const VideoModal = ({videoWidth,videoHeight,videoSrc}) => {

  return (
            <video
              width={videoWidth} // You can adjust this to your preferred size
              height={videoHeight}
              controls
              autoPlay={true}
              muted
              loop
              src={videoSrc} // Use the application/octet-stream link here
              className='rounded-xl'
            >
              Your browser does not support the video tag.
            </video>
  )
}

export default VideoModal
