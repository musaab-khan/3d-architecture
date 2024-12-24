'use client'
import React from 'react'
import { useRouter } from 'next/navigation'; // Import Next.js router

const SignupForm = () => {

    const router = useRouter(); // Initialize the router
        
    const handleSignIn = (e) => {
      e.preventDefault();
      router.push('/login'); // Navigate to /login
    };

  return (
    <>
    <form className="flex flex-col w-[90vw] h-[70vh] md:w-[40vw] md:h-[70vh] bg-[#3D3D3D] rounded-xl text-white justify-evenly items-center text-lg  2xl:text-xl font-bold py-2">
                <input type="email" placeholder='Enter your email' className='px-4 bg-transparent border-2 border-black h-[12%] w-[85%] focus:border-yellow-300 outline-none rounded-xl'/>
                <input type="text" placeholder='Enter your organization name' className='px-4 bg-transparent border-2 border-black h-[12%] w-[85%] focus:border-yellow-300 outline-none rounded-xl'/>
                <input type="password" placeholder='Enter your password' className='px-4 bg-transparent border-2 border-black h-[12%] w-[85%] focus:border-yellow-300 outline-none rounded-xl'/>
                <input type="password" placeholder='Confirm your password' className='px-4 bg-transparent border-2 border-black h-[12%] w-[85%] focus:border-yellow-300 outline-none rounded-xl'/>
                <button className='flex gap-2 w-[85%] justify-center rounded-xl bg-blue-600 h-[12%] items-center  text-2xl 2xl:text-3xl'><p>Sign Up</p><span> &#8594;</span></button>
                <hr className='w-[60%] m-4'/>
                <div className='flex gap-4'>
                    <p>Already have an account?</p>
                    <button className='text-yellow-300' onClick={handleSignIn}>Sign In</button>
                </div>
            </form>
    </>
  )
}

export default SignupForm