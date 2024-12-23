import React from 'react'
import Image from 'next/image'
// import whatWeDo from '../utilsData'

const Features = () => {
  return (
    <div className='w-[80%] m-auto space-y-10 my-20'>
        <div className='text-center'>
        <h2 className='font-bold text-[2.75rem]'>What We Do</h2>
        <p className='text-xl'>At 3D Model, we empower you to transform your home design ideas into reality with our intuitive 3D modeling platform. Our suite of tools and resources is designed to make the process seamless and enjoyable.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4 md:gap-14">
            <div className='flex gap-2'>
                <div className='basis-[15%]'>
                    <div className='relative w-[33px] h-[33px]'>
                        <Image src='/assets/3d-modeling.svg' alt='' fill></Image>
                    </div>
                </div>
                <div>
                    <h3 className='text-xl font-bold'>Interactive 3D Modeling</h3>
                    <p className='text-lg'>Easily create detailed 3D models of your home designs using our user-friendly interface, suitable for both beginners and professionals</p>
                </div>
            </div>
            
            <div className='flex gap-2'>
                <div className='basis-[15%]'>
                    <div className='relative w-[33px] h-[33px]'>
                        <Image src='/assets/3d-modeling.svg' alt='' fill></Image>
                    </div>
                </div>
                <div>
                    <h3 className='text-xl font-bold'>Interactive 3D Modeling</h3>
                    <p className='text-lg'>Easily create detailed 3D models of your home designs using our user-friendly interface, suitable for both beginners and professionals</p>
                </div>
            </div>
            
            <div className='flex gap-2'>
                <div className='basis-[15%]'>
                    <div className='relative w-[33px] h-[33px]'>
                        <Image src='/assets/3d-modeling.svg' alt='' fill></Image>
                    </div>
                </div>
                <div>
                    <h3 className='text-xl font-bold'>Interactive 3D Modeling</h3>
                    <p className='text-lg'>Easily create detailed 3D models of your home designs using our user-friendly interface, suitable for both beginners and professionals</p>
                </div>
            </div>
            
            <div className='flex gap-2'>
                <div className='basis-[15%]'>
                    <div className='relative w-[33px] h-[33px]'>
                        <Image src='/assets/3d-modeling.svg' alt='' fill></Image>
                    </div>
                </div>
                <div>
                    <h3 className='text-xl font-bold'>Interactive 3D Modeling</h3>
                    <p className='text-lg'>Easily create detailed 3D models of your home designs using our user-friendly interface, suitable for both beginners and professionals</p>
                </div>
            </div>
            
            <div className='flex gap-2'>
                <div className='basis-[15%]'>
                    <div className='relative w-[33px] h-[33px]'>
                        <Image src='/assets/3d-modeling.svg' alt='' fill></Image>
                    </div>
                </div>
                <div>
                    <h3 className='text-xl font-bold'>Interactive 3D Modeling</h3>
                    <p className='text-lg'>Easily create detailed 3D models of your home designs using our user-friendly interface, suitable for both beginners and professionals</p>
                </div>
            </div>
            
        </div>
    </div>
  )
}

export default Features