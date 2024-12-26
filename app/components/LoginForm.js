'use client'
import React from 'react'
import { useRouter } from 'next/navigation'; // Import Next.js router

const LoginForm = () => {

    const router = useRouter(); // Initialize the router
    
      const handleJoinUs = (e) => {
        e.preventDefault();
        router.push('/signup'); // Navigate to /login
      };
      
      const handleForgotPassword = (e) => {
        e.preventDefault();
        router.push('/forgot-password'); // Navigate to /login
      };
      
      const handleHome = (e) => {
        e.preventDefault();
        router.push('/home'); // Navigate to /login
      };

  return (
    <>
    <form className="flex flex-col w-[90%] h-[60%] md:w-[40%] md:h-[55%] bg-[#3D3D3D] rounded-xl text-white justify-evenly items-center text-lg  2xl:text-xl font-bold py-2">
            <input type="email" placeholder='Enter your email' className='px-4 bg-transparent border-2 border-black h-[15%] w-[85%] focus:border-yellow-300 outline-none rounded-xl'/>
            <input type="password" placeholder='Enter your password' className='px-4 bg-transparent border-2 border-black h-[15%] w-[85%] focus:border-yellow-300 outline-none rounded-xl'/>
            <button className='text-right hover:underline cursor-pointer w-[85%]' onClick={handleForgotPassword}>Forgot Password?</button>
            <button className='flex gap-2 w-[85%] justify-center rounded-xl bg-blue-600 h-[15%] items-center  text-2xl 2xl:text-3xl' onClick={handleHome}><p>Login</p><span> &#8594;</span></button>
            <hr className='w-[60%]'/>
            <div className='flex gap-4'>
                <p>New member?</p>
                <button className='text-yellow-300' onClick={handleJoinUs}>Join us today</button>
            </div>
        </form>
    </>
  )
}

export default LoginForm