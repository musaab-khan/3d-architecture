'use client'
import React,{useState,useLayoutEffect,useRef} from 'react'
import { VIDEO_LINKS, sections } from '../videoUtils'
import VideoModal from './VideoModal'

const HowItWorks = () => {
    const videoContainerRef = useRef(null); // Ref for the container div

  const [containerDimensions, setContainerDimensions] = useState({
    width: 0,
    height: 0,
  });

  const [currentVideo, setCurrentVideo] = useState('authenticate');

  useLayoutEffect(() => {
    const updateDimensions = () => {
        if (videoContainerRef.current) {
            const { width, height } = videoContainerRef.current.getBoundingClientRect();
            setContainerDimensions({ width, height });
            console.log("how it works: ",width,height)
        }
    };

    // Initial measurement
    updateDimensions();

    // Add resize listener
    window.addEventListener('resize', updateDimensions);

    // Cleanup
    return () => window.removeEventListener('resize', updateDimensions);
}, []); // Empty dependency array means this effect runs once on mount

  return (
    <div className='flex flex-col items-center h-screen text-white justify-evenly' style={{background: 'linear-gradient(90deg, #181818, #424242)'}}>
        <h2 className='font-bold text-[2.75rem]'>How it works</h2>
        <div className="flex flex-col md:flex-row h-[70vh] w-[75vw] rounded-xl bg-[#222222] gap-5 justify-evenly items-center p-5">
            <div className="flex flex-col h-[70%] justify-evenly  text-2xl">
            {sections.map((section) => (
            <div
              key={section.id}
              className='flex justify-between border-b border-white active:text-yellow-300 active:border-yellow-300 cursor-pointer'
              onClick={() => setCurrentVideo(section.id)}
            >
              <h3>{section.title}</h3>
              <span>&#8594;</span>
            </div>
          ))}
            </div>
            <div className='border-black flex items-center justify-center font-bold text-black text-2xl h-[60%] lg:h-[80%] lg:w-[70%] rounded-xl bg-transparent text-center' ref={videoContainerRef}><VideoModal videoHeight={containerDimensions.height} videoWidth={containerDimensions.width} videoSrc={VIDEO_LINKS[currentVideo]}></VideoModal></div>
        </div>
    </div>
  )
}

export default HowItWorks