import React from 'react'
import LoginForm from '../components/LoginForm'
import Image from 'next/image'

const page = () => {


  return (
    <div className='flex flex-col items-center h-screen text-white justify-evenly' style={{background: 'linear-gradient(90deg, #181818, #424242)'}}>
        <div className='relative w-[25vh] h-[13vh]'>
            <Image src='/assets/logo1.png' alt='' fill className='rounded-lg'/>
        </div>
        <LoginForm/>
        <p>OR</p>
        <button className='flex bg-white rounded-xl text-black w-[70%] md:w-[30%] p-2 md:p-4 items-center justify-center relative'>
            <Image src='/assets/google-icon.svg' alt='' width={20} height={20} className='absolute left-4'/>
            <p className='text-lg 2xl:text-xl'>Continue with Google</p>
        </button>
    </div>
  )
}

export default page