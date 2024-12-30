'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const GoogleLogin = () => {
  const router = useRouter();

  // Dynamically load Google API client script
  useEffect(() => {
    const loadGoogleApi = () => {
      if (typeof window !== "undefined" && !window.gapi) {
        const script = document.createElement('script');
        script.src = "https://apis.google.com/js/platform.js";
        script.async = true;
        script.onload = () => {
          // Initialize the Google API after the script has loaded
          window.gapi.load('auth2', () => {
            window.gapi.auth2.init({
              client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            });
          });
        };
        document.body.appendChild(script);
      }
    };

    loadGoogleApi();
  }, []); // Empty dependency array ensures this runs once on component mount

  const handleGoogleLogin = async () => {
    const auth2 = window.gapi.auth2.getAuthInstance();
    try {
      const googleUser = await auth2.signIn();
      const id_token = googleUser.getAuthResponse().id_token;

      // Send the ID token to your backend for verification
      const res = await fetch('http://localhost:5000/auth/google/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_token }),
      });

      const data = await res.json();
      if (res.ok) {
        // Save the JWT token in local storage
        localStorage.setItem('token', data.token);
        router.push('/dashboard'); // Redirect to the dashboard (or wherever you want)
      } else {
        console.error('Google login failed', data);
      }
    } catch (error) {
      console.error('Error during Google login:', error);
    }
  };

  return (
    <button
      className='flex bg-white rounded-xl text-black w-[70vw] md:w-[30vw] p-2 md:p-4 items-center justify-center relative'
      onClick={handleGoogleLogin}
    >
      <Image src='/assets/google-icon.svg' alt='' width={20} height={20} className='absolute left-4' />
      <span className='text-lg 2xl:text-xl'>Continue with Google</span>
    </button>
  );
};

export default GoogleLogin;
