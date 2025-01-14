'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { GoogleLogin } from '@react-oauth/google'; // Import from @react-oauth/google
import Image from 'next/image';

const GoogleLoginComponent = () => {
  const router = useRouter();

  // Callback function to handle successful login
  const handleLoginSuccess = (response) => {
    const { credential } = response; // This is the Google token ID

    // Send the tokenId to your backend
    fetch(process.env.NEXT_PUBLIC_API_ENDPOINT+'auth/google-login', { // Change this URL to your backend API URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tokenId: credential }), // Pass the token to the backend
    })
      .then(res => res.json())
      .then(data => {
        // Handle successful authentication
        console.log('Login successful:', data);

        // Store the JWT token in localStorage (or cookies, as per your app's design)
        localStorage.setItem('token', data.token);

        // Redirect the user after successful login (optional)
        router.push('/home');
      })
      .catch((error) => {
        console.error('Login failed:', error);
      });
  };

  // Callback function to handle failed login
  const handleLoginFailure = (error) => {
    console.error('Login Failed:', error);
  };

  return (
       <GoogleLogin
      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID} // Your Google Client ID
      onSuccess={handleLoginSuccess}
      onFailure={handleLoginFailure}
      render={(renderProps) => (
        <button
          className='flex bg-white rounded-xl text-black w-[70%] md:w-[30%] p-8 md:p-4 items-center justify-center relative h-[15%]'
          onClick={renderProps.onClick} // This will trigger the Google Login popup
          disabled={renderProps.disabled} // Disable the button if the login popup is in progress
        >
          <Image
            src='/assets/google-iconz.svg'
            alt='Google Icon'
            width={20}
            height={20}
            className='absolute left-4'
          />
          <p className='text-lg 2xl:text-xl'>Continue with Google</p>
        </button>
      )}
    />
  );
};

export default GoogleLoginComponent;
