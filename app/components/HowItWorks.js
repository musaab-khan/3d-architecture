'use client'
import React from 'react'
import VideoModal from './VideoModal'

const HowItWorks = () => {
    

  return (
    <div className='flex flex-col items-center h-screen text-white justify-evenly' style={{background: 'linear-gradient(90deg, #181818, #424242)'}}>
        <h2 className='font-bold text-[2.75rem]'>How it works</h2>
        <div className="flex flex-col md:flex-row h-[70%] w-[75%] rounded-xl bg-[#222222] gap-5 justify-evenly items-center p-5">
            <div className="flex flex-col h-[70%] justify-evenly  text-2xl">
                <div className='flex justify-between border-b border-white hover:text-yellow-300 hover:border-yellow-300'>
                    <h3>Authenticate</h3>
                    <span> &#8594;</span>
                </div>
                <div className='flex justify-between border-b border-white hover:text-yellow-300 hover:border-yellow-300'>
                    <h3>Start a project</h3>
                    <span> &#8594;</span>
                </div>
                <div className='flex justify-between border-b border-white hover:text-yellow-300 hover:border-yellow-300'>
                    <h3>Creating a model</h3>
                    <span> &#8594;</span>
                </div>
                <div className='flex justify-between border-b border-white hover:text-yellow-300 hover:border-yellow-300'>
                    <h3>Exporting model</h3>
                    <span> &#8594;</span>
                </div>
                <div className='flex justify-between border-b border-white hover:text-yellow-300 hover:border-yellow-300'>
                    <h3>Buy subscription</h3>
                    <span> &#8594;</span>
                </div>
            </div>
            <div className='border-2 flex items-center justify-center font-bold text-black text-2xl h-[60%] lg:h-[80%] lg:w-[70%] rounded-xl bg-slate-300 text-center'><VideoModal></VideoModal></div>
        </div>
    </div>
  )
}

export default HowItWorks