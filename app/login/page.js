import React from 'react'
import Image from 'next/image'

const page = () => {
  return (
    <div className='flex flex-col items-center h-screen text-white justify-evenly' style={{background: 'linear-gradient(90deg, #181818, #424242)'}}>
        <div className='relative w-[25vh] h-[13vh]'>
            <Image src='/assets/logo1.png' alt='' fill className='rounded-lg'/>
        </div>
        <form className="flex flex-col w-[90%] h-[60%] md:w-[40%] md:h-[55%] bg-[#3D3D3D] rounded-xl text-white justify-evenly items-center text-lg  2xl:text-xl font-bold py-2">
            <input type="email" placeholder='Enter your email' className='px-4 bg-transparent border-2 border-black h-[15%] w-[85%] focus:border-yellow-300 outline-none rounded-xl'/>
            <input type="password" placeholder='Enter your password' className='px-4 bg-transparent border-2 border-black h-[15%] w-[85%] focus:border-yellow-300 outline-none rounded-xl'/>
            <button className='text-right hover:underline cursor-pointer w-[85%]'>Forgot Password?</button>
            <button className='flex gap-2 w-[85%] justify-center rounded-xl bg-blue-600 h-[15%] items-center  text-2xl 2xl:text-3xl'><p>Login</p><span> &#8594;</span></button>
            <hr className='w-[60%]'/>
            <div className='flex gap-6'>
                <p>New member?</p>
                <button className='text-yellow-300'>Join us today</button>
            </div>
        </form>
        <p>OR</p>
        <button className='flex bg-white rounded-xl text-black w-[70%] md:w-[30%] p-2 md:p-4 items-center justify-center relative'>
            <Image src='/assets/google-icon.svg' alt='' width={20} height={20} className='absolute left-4'/>
            <p className='text-lg 2xl:text-xl'>Login with Google</p>
        </button>
    </div>
  )
}

export default page