'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { GoogleLogin } from '@react-oauth/google'; // Import from @react-oauth/google

const GoogleLoginComponent = () => {
  const router = useRouter();

  // Callback function to handle successful login
  const handleLoginSuccess = (response) => {
    const { credential } = response; // This is the Google token ID

    // Send the tokenId to your backend
    fetch(process.env.NEXT_PUBLIC_API_ENDPOINT+'/auth/google-login', { // Change this URL to your backend API URL
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
        localStorage.setItem('authToken', data.token);

        // Redirect the user after successful login (optional)
        router.push('/dashboard');
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
    <div className="flex justify-center items-center">
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={handleLoginFailure}
        useOneTap // optional: enables one-tap login
        theme="filled_blue"
        size="large"
        shape="circle"
      />
    </div>
  );
};

export default GoogleLoginComponent;
