import React from 'react'
import Image from 'next/image'

const page = () => {
  return (
    <div className='flex flex-col items-center h-screen text-white justify-evenly' style={{background: 'linear-gradient(90deg, #181818, #424242)'}}>
        <div className='relative w-[25vh] h-[13vh]'>
            <Image src='/assets/logo1.png' alt='' fill className='rounded-lg'/>
        </div>
        <form className="flex flex-col w-[90%] h-[60%] md:w-[40%] md:h-[55%] bg-[#3D3D3D] rounded-xl text-white justify-start py-8 gap-[2vh] items-center text-lg  2xl:text-xl font-bold">
            <p className='text-left w-[85%] h-[15%]  text-2xl 2xl:text-3xl'>Forgot Password</p>
            <input type="email" placeholder='Enter your email' className='px-4 bg-transparent border-2 border-black h-[15%] w-[85%] focus:border-yellow-300 outline-none rounded-xl'/>
            <p className='text-sm  2xl:text-xl cursor-pointer italic w-[80%] text-slate-400 -mt-2'>An email with reset password link will be sent on provided email.</p>
            <button className='flex gap-2 w-[85%] justify-center rounded-xl bg-blue-600 h-[15%] items-center  text-[20px] 2xl:text-2xl'><p>Login</p><span> &#8594;</span></button>
        </form>
    </div>
  )
}

export default page