'use client'
import React from 'react'
import Image from 'next/image'


const Page = () => {

    return (
        <div className='flex flex-col items-center text-white justify-evenly py-10' style={{ background: 'linear-gradient(90deg, #181818, #424242)' }}>
            <div className='flex w-[100%] pl-[8%] justify-center md:justify-start mb-10'>
                <div className='relative w-[25vh] h-[13vh]'>
                    <Image src='/assets/logo1.png' alt='' fill className='rounded-lg' />
                </div>
            </div>
            <div className='w-[90%] md:w-[85%] h-[35vh] bg-[#3D3D3D] rounded-xl flex flex-col px-[3%] pt-[1%] justify-between'>
                <h1 className='font-bold text-4xl'>My Projects</h1>
                <div className='h-[50%] w-full flex justify-between'>
                    <div className='relative h-full w-[22%] md:w-[7%]'>
                        <Image alt='' src='/assets/my-projects-asset1.svg' fill></Image>
                    </div>
                    <div className='relative h-full w-[22%] md:w-[5%]'>
                        <Image alt='' src='/assets/my-projects-assets2.svg' fill></Image>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[2%] mb-4 mt-[-22%] md:mt-[-5%] w-[65%] relative text-2xl">
                <div className='w-[45vw] md:w-[20vw] h-[22vh] m-auto flex justify-center items-center rounded-xl' style={{background: "linear-gradient(#BFB145,#6D6BE3,#5F5FFF)"}}>
                    <div className='w-[98%] h-[95%] bg-[#444444] rounded-xl flex flex-col justify-center items-center text-2xl'>
                        <p className='text-5xl font-bold'>+</p>
                        <p>Create New</p>
                    </div>
                </div>
                <div className='w-[45vw] md:w-[20vw] h-[22vh] border-[3px] border-[#5F5FFF] bg-[#444444]  rounded-xl m-auto p-[5%]'>
                    <h2>Hospital</h2>
                    <p className='text-xl'>Dimensions: 200 x 150</p>
                </div>
                <div className='w-[45vw] md:w-[20vw] h-[22vh] border-[3px] border-[#5F5FFF] bg-[#444444]  rounded-xl m-auto p-[5%]'>
                    <h2>Hospital</h2>
                    <p className='text-xl'>Dimensions: 200 x 150</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 w-[85%] gap-4 text-2xl pb-10">
                <div className='w-[45vw] md:w-[20vw] h-[22vh] border-[3px] border-[#5F5FFF] bg-[#444444]  rounded-xl m-auto p-[5%]'>
                    <h2>Hospital</h2>
                    <p className='text-xl'>Dimensions: 200 x 150</p>
                </div>
                <div className='w-[45vw] md:w-[20vw] h-[22vh] border-[3px] border-[#5F5FFF] bg-[#444444]  rounded-xl m-auto p-[5%]'>
                    <h2>Hospital</h2>
                    <p className='text-xl'>Dimensions: 200 x 150</p>
                </div>
                <div className='w-[45vw] md:w-[20vw] h-[22vh] border-[3px] border-[#5F5FFF] bg-[#444444]  rounded-xl m-auto p-[5%]'>
                    <h2>Hospital</h2>
                    <p className='text-xl'>Dimensions: 200 x 150</p>
                </div>
                <div className='w-[45vw] md:w-[20vw] h-[22vh] border-[3px] border-[#5F5FFF] bg-[#444444]  rounded-xl m-auto p-[5%]'>
                    <h2>Hospital</h2>
                    <p className='text-xl'>Dimensions: 200 x 150</p>
                </div>
            </div>
        </div>
    )
}

export default Page