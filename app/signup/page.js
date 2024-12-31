import React from 'react'
import Image from 'next/image'
import SignupForm from '../components/SignupForm'
import GoogleLogin from '../components/GoogleLogin'

const page = () => {

  return (
    <div className='flex flex-col items-center h-screen text-white justify-evenly' style={{background: 'linear-gradient(90deg, #181818, #424242)'}}>
        <div className='relative w-[25vh] h-[13vh]'>
            <Image src='/assets/logo1.png' alt='' fill className='rounded-lg'/>
        </div>
        <div className='flex flex-col md:flex-row justify-evenly w-screen items-center'>
            <SignupForm></SignupForm>
            <p>OR</p>
            {/* <button className='flex bg-white rounded-xl text-black w-[70vw] md:w-[30vw] p-2 md:p-4 items-center justify-center relative'>
                <Image src='/assets/google-icon.svg' alt='' width={20} height={20} className='absolute left-4'/>
                <p className='text-lg 2xl:text-xl'>Contine with Google</p>
            </button> */}
            <GoogleLogin></GoogleLogin>
        </div>
    </div>
  )
}

export default page