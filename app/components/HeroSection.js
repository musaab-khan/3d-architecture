'use client'
import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'; // Import Next.js router


const HeroSection = () => {

  const router = useRouter(); // Initialize the router

  const handleGetStarted = () => {
    router.push('/login'); // Navigate to /login
  };

  return (
    <div className='flex flex-col items-center h-screen text-white justify-evenly' style={{background: 'linear-gradient(90deg, #181818, #424242)'}}>
      <div className='relative w-[25vh] h-[13vh]'>
        <Image src='/assets/logo1.png' alt='' fill className='rounded-lg'/>
      </div>
      <div className='text-center sp sm:space-y-10 w-[85%]'>
        <h1 className='text-4xl lg:text-6xl font-bold'>Design your dream home in 3D</h1>
        <p className='text-white text-xl lg:text-3xl'>Unleash your creativity and bring your architectural visions to life with our intuitive 3D modeling tool.</p>
      </div>
      <div className="flex flex-col sm:flex-row text-xl md:text-2xl space-y-3 sm:space-x-10 justify-center items-center">
        <button className='py-2 px-4 md:py-3 md:px-14 border-2 border-[#BFB145] rounded-full hover:scale-110 transition-all ease-in-out' onClick={handleGetStarted}>Get started</button>
        <button className='hover:underline'>Know more about us</button>
      </div>
    </div>
  )
}

export default HeroSection