'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'; // Import Next.js router

const SignupForm = () => {
  const router = useRouter(); // Initialize the router
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = (e) => {
    e.preventDefault();
    router.push('/login'); // Navigate to /login
  };

  const handleHome = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    // Prepare user data for API request
    const userData = {
      email,
      username,
      password
    };

    try {
      // Send data to the API
      const response = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT+'auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        // Redirect to login after successful signup
        router.push('/login');
      } else {
        // Handle any errors from the API
        const data = await response.json();
        setError(data.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      setError('An error occurred while signing up.');
    }
  };

  return (
    <>
      <form
        className="flex flex-col w-[90vw] h-[70vh] md:w-[40vw] md:h-[70vh] bg-[#3D3D3D] rounded-xl text-white justify-evenly items-center text-lg 2xl:text-xl font-bold py-2"
      >
        <input
          type="email"
          placeholder="Enter your email"
          className="px-4 bg-transparent border-2 border-black h-[12%] w-[85%] focus:border-yellow-300 outline-none rounded-xl"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter your organization name"
          className="px-4 bg-transparent border-2 border-black h-[12%] w-[85%] focus:border-yellow-300 outline-none rounded-xl"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter your password"
          className="px-4 bg-transparent border-2 border-black h-[12%] w-[85%] focus:border-yellow-300 outline-none rounded-xl"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm your password"
          className="px-4 bg-transparent border-2 border-black h-[12%] w-[85%] focus:border-yellow-300 outline-none rounded-xl"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-lg">{error}</p>}
        <button
          className="flex gap-2 w-[85%] justify-center rounded-xl bg-blue-600 h-[12%] items-center text-2xl 2xl:text-3xl"
          onClick={handleHome}
        >
          <p>Sign Up</p><span> &#8594;</span>
        </button>
        <hr className="w-[60%] m-4" />
        <div className="flex gap-4">
          <p>Already have an account?</p>
          <button className="text-yellow-300" onClick={handleSignIn}>Sign In</button>
        </div>
      </form>
    </>
  );
};

export default SignupForm;
