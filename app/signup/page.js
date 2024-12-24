'use client'
import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'; // Import Next.js router

const page = () => {

     const router = useRouter(); // Initialize the router
        
          const handleSignIn = (e) => {
            e.preventDefault();
            router.push('/login'); // Navigate to /login
          };

  return (
    <div className='flex flex-col items-center h-screen text-white justify-evenly' style={{background: 'linear-gradient(90deg, #181818, #424242)'}}>
        <div className='relative w-[25vh] h-[13vh]'>
            <Image src='/assets/logo1.png' alt='' fill className='rounded-lg'/>
        </div>
        <div className='flex flex-col md:flex-row justify-evenly w-screen items-center'>
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
            <p>OR</p>
            <button className='flex bg-white rounded-xl text-black w-[70vw] md:w-[30vw] p-2 md:p-4 items-center justify-center relative'>
                <Image src='/assets/google-icon.svg' alt='' width={20} height={20} className='absolute left-4'/>
                <p className='text-lg 2xl:text-xl'>Contine with Google</p>
            </button>
        </div>
    </div>
  )
}

export default page