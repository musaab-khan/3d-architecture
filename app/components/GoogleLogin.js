'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { GoogleLogin } from '@react-oauth/google'; // Import GoogleLogin

const GoogleLoginComponent = () => {
  const router = useRouter();

  // Handle successful login
  const handleLoginSuccess = (response) => {
    const { credential } = response;  // This is the Google token ID

    // Send the tokenId to your backend to verify the user
    fetch('http://localhost:5000/auth/google-login', { // Adjust to your backend API URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tokenId: credential }), // Send the token to backend
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Login successful:', data);
        // Save the JWT token to localStorage (or cookies) for further use
        localStorage.setItem('authToken', data.token);
        // Redirect the user to the dashboard or any other page
        router.push('/dashboard');
      })
      .catch((error) => {
        console.error('Login failed:', error);
      });
  };

  // Handle failed login attempt
  const handleLoginFailure = (error) => {
    console.error('Login Failed:', error);
  };

  return (
    <div className="flex justify-center items-center">
      <GoogleLogin
        onSuccess={handleLoginSuccess}  // Success callback
        onError={handleLoginFailure}    // Error callback
        useOneTap  // Optional: enables one-tap login
        theme="filled_blue"
        size="large"
        shape="circle"
      />
    </div>
  );
};

export default GoogleLoginComponent;
