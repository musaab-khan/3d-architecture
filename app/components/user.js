"use client"
import React, { useRef, useState } from "react";

export default User= (props) => {
    const videoEl = useRef(null);
    const [isPlaying, setPlaying] = useState(false);

    const playVideo = () => {
        videoEl.current.play();
        videoEl.current.addEventListener("ended", myHandler, false);
        setPlaying(true);
    };

    const myHandler = () => {
        setPlaying(false);
    };

    let data = props.data;

    return (
        <div className="text-center">
            <div className="text-3xl font-semibold">{data.username}</div>
            <div>
                {data.tags &&
                    data.tags.map((elem, index) => (
                        <span className="inline-flex mx-3 mt-1" key={index}>
                            {elem}
                        </span>
                    ))}
            </div>
            <div className="inline-flex items-center mt-2">
                <span className="text-lg font-bold">♬</span>
                <span className="ml-1">{data.music}</span>
            </div>
            <div className="mt-5">
                <div className="relative inline-block w-full max-w-5xl mx-auto">
                    <video
                        playsInline={true}
                        className="w-full h-screen"
                        ref={videoEl}
                        width={360}
                        height={1200}
                        src={data.videoUrl?data.videoUrl:"https://caretsffmpeg.s3.amazonaws.com/promosvideos/caretsintrodesktop.mp4"}
                        // src="https://caretsffmpeg.s3.amazonaws.com/promosvideos/caretsintrodesktop.mp4"
                    />
                    {!isPlaying && (
                        <button className="playBtn" onClick={playVideo}>
                            {/* <Image src={triangle} alt="Play" /> */}
                            Play
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
