// 'use client'
// import React, { useState } from 'react'
// import { useRouter } from 'next/navigation'; // Import Next.js router

// const SignupForm = () => {
//   const router = useRouter(); // Initialize the router
//   const [email, setEmail] = useState('');
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState('');

//   const handleSignIn = (e) => {
//     e.preventDefault();
//     router.push('/login'); // Navigate to /login
//   };

//   const handleHome = async (e) => {
//     e.preventDefault();

//     if (password !== confirmPassword) {
//       setError('Passwords do not match!');
//       return;
//     }

//     // Prepare user data for API request
//     const userData = {
//       email,
//       username,
//       password
//     };

//     try {
//       // Send data to the API
//       // const response = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT+'auth/signup', {
//       const response = await fetch('https://threed-architecture-backend.onrender.com/auth/signup', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(userData),
//       });

//       if (response.ok) {
//         // Redirect to login after successful signup
//         router.push('/login');
//       } else {
//         // Handle any errors from the API
//         const data = await response.json();
//         setError(data.message || 'Signup failed. Please try again.');
//       }
//     } catch (error) {
//       setError('An error occurred while signing up.');
//       console.log(error)
//     }
//   };

//   return (
//     <>
//       <form
//         className="flex flex-col w-[90vw] h-[70vh] md:w-[40vw] md:h-[70vh] bg-[#3D3D3D] rounded-xl text-white justify-evenly items-center text-lg 2xl:text-xl font-bold py-2"
//       >
//         <input
//           type="email"
//           placeholder="Enter your email"
//           className="px-4 bg-transparent border-2 border-black h-[12%] w-[85%] focus:border-yellow-300 outline-none rounded-xl"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="Enter your organization name"
//           className="px-4 bg-transparent border-2 border-black h-[12%] w-[85%] focus:border-yellow-300 outline-none rounded-xl"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//         />
//         <input
//           type="password"
//           placeholder="Enter your password"
//           className="px-4 bg-transparent border-2 border-black h-[12%] w-[85%] focus:border-yellow-300 outline-none rounded-xl"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <input
//           type="password"
//           placeholder="Confirm your password"
//           className="px-4 bg-transparent border-2 border-black h-[12%] w-[85%] focus:border-yellow-300 outline-none rounded-xl"
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//         />
//         {error && <p className="text-red-500 text-lg">{error}</p>}
//         <button
//           className="flex gap-2 w-[85%] justify-center rounded-xl bg-blue-600 h-[12%] items-center text-[20px] 2xl:text-2xl"
//           onClick={handleHome}
//         >
//           <p>Sign Up</p><span> &#8594;</span>
//         </button>
//         <hr className="w-[60%] m-4" />
//         <div className="flex gap-1">
//           <p>Already have an account?</p>
//           <button className="text-yellow-300" onClick={handleSignIn}>Sign In</button>
//         </div>
//       </form>
//     </>
//   );
// };

// export default SignupForm;

'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import MoonLoader from "react-spinners/MoonLoader";

const SignupForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = (e) => {
    e.preventDefault();
    router.push('/login');
  };

  const validateForm = () => {
    // Reset error state
    setError('');

    // Email validation
    if (!email) {
      setError('Email is required');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Username validation
    if (!username) {
      setError('Organization name is required');
      return false;
    }

    // Password validation
    if (!password) {
      setError('Password is required');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return false;
    }

    return true;
  };

  const handleHome = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Prepare user data for API request
    const userData = {
      email,
      username,
      password
    };

    // Log the request body
    console.log('Request body:', userData);

    try {
      // Send data to the API
      const response = await fetch('https://threed-architecture-backend.onrender.com/auth/signup', {
      // const response = await fetch('http:localhost:5000/auth/signup', {
        // const response = await fetch('http://localhost:5000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      console.log('Response status:', response.status);
      
      if (response.status === 201) {
        // Redirect to login after successful signup (status 201 Created)
        router.push('/login');
      } else {
        // Handle errors from the API
        const errorText = await response.text();
        console.log('Error response:', errorText);
        setError(errorText || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Network error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
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
          disabled={isLoading}
        />
        <input
          type="text"
          placeholder="Enter your organization name"
          className="px-4 bg-transparent border-2 border-black h-[12%] w-[85%] focus:border-yellow-300 outline-none rounded-xl"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
        />
        <input
          type="password"
          placeholder="Enter your password"
          className="px-4 bg-transparent border-2 border-black h-[12%] w-[85%] focus:border-yellow-300 outline-none rounded-xl"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
        <input
          type="password"
          placeholder="Confirm your password"
          className="px-4 bg-transparent border-2 border-black h-[12%] w-[85%] focus:border-yellow-300 outline-none rounded-xl"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
        />
        {error && <p className="text-red-500 text-sm md:text-lg">{error}</p>}
        <button
          className="flex gap-2 w-[85%] justify-center rounded-xl bg-blue-600 h-[12%] items-center text-[20px] 2xl:text-2xl disabled:bg-blue-400"
          onClick={handleHome}
          disabled={isLoading}
        >
          {isLoading ? (
            <MoonLoader size={24} color="#ffffff" />
          ) : (
            <>
              <p>Sign Up</p><span> &#8594;</span>
            </>
          )}
        </button>
        <hr className="w-[60%] m-4" />
        <div className="flex gap-1">
          <p>Already have an account?</p>
          <button 
            className="text-yellow-300" 
            onClick={handleSignIn}
            disabled={isLoading}
          >
            Sign In
          </button>
        </div>
      </form>
    </>
  );
};

export default SignupForm;