// 'use client'
// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';

// const LoginForm = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const router = useRouter(); // Initialize the router

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT+'auth/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         // Save the token in localStorage
//         localStorage.setItem('token', data.token);

//         // Redirect to the home page
//         router.push('/home');
//       } else {
//         // Display error message
//         setError(data.message || 'Login failed. Please try again.');
//       }
//     } catch (err) {
//       console.error(err);
//       setError('Something went wrong. Please try again later.');
//     }
//   };

//   const handleJoinUs = (e) => {
//     e.preventDefault();
//     router.push('/signup');
//   };

//   const handleForgotPassword = (e) => {
//     e.preventDefault();
//     router.push('/forgot-password');
//   };

//   return (
//     <form
//       className="flex flex-col w-[90%] h-[60%] md:w-[40%] md:h-[55%] bg-[#3D3D3D] rounded-xl text-white justify-evenly items-center text-lg 2xl:text-xl font-bold py-2"
//       onSubmit={handleLogin}
//     >
//       <input
//         type="email"
//         placeholder="Enter your email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         className="px-4 bg-transparent border-2 border-black h-[15%] w-[85%] focus:border-yellow-300 outline-none rounded-xl"
//         required
//       />
//       <input
//         type="password"
//         placeholder="Enter your password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         className="px-4 bg-transparent border-2 border-black h-[15%] w-[85%] focus:border-yellow-300 outline-none rounded-xl"
//         required
//       />
//       {error && <p className="text-red-500">{error}</p>}
//       <button
//         type="button"
//         className="text-right hover:underline cursor-pointer w-[85%] -mt-[3vh]"
//         onClick={handleForgotPassword}
//       >
//         Forgot Password?
//       </button>
//       <button
//         type="submit"
//         className="flex gap-2 w-[85%] justify-center rounded-xl bg-blue-600 h-[15%] items-center text-[20px] 2xl:text-2xl"
//       >
//         <p>Login</p>
//         <span> &#8594;</span>
//       </button>
//       <hr className="w-[60%]" />
//       <div className="flex gap-1">
//         <p>New member?</p>
//         <button
//           type="button"
//           className="text-yellow-300"
//           onClick={handleJoinUs}
//         >
//           Join us today
//         </button>
//       </div>
//     </form>
//   );
// };

// export default LoginForm;


'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MoonLoader } from 'react-spinners';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}auth/login`, {
      // const response = await fetch(`http://localhost:5000/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save the token in localStorage
        localStorage.setItem('token', data.token);

        // Redirect to the home page
        router.push('/home');
      } else if(response.status === 401) {
        // Display error message
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error(err);
      setError('Invalid credentials');
      // setError('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinUs = (e) => {
    e.preventDefault();
    router.push('/signup');
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    router.push('/forgot-password');
  };

  return (
    <form
      className="flex flex-col w-[90%] h-[60%] md:w-[40%] md:h-[55%] bg-[#3D3D3D] rounded-xl text-white justify-evenly items-center text-lg 2xl:text-xl font-bold py-2"
      onSubmit={handleLogin}
    >
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="px-4 bg-transparent border-2 border-black h-[15%] w-[85%] focus:border-yellow-300 outline-none rounded-xl"
        required
        disabled={isLoading}
      />
      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="px-4 bg-transparent border-2 border-black h-[15%] w-[85%] focus:border-yellow-300 outline-none rounded-xl"
        required
        disabled={isLoading}
      />
      <button
        type="button"
        className="text-right hover:underline cursor-pointer w-[85%] -mt-[3vh]"
        onClick={handleForgotPassword}
        disabled={isLoading}
        >
        Forgot Password?
      </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        className="flex gap-2 w-[85%] justify-center rounded-xl bg-blue-600 h-[15%] items-center text-[20px] 2xl:text-2xl disabled:bg-blue-400"
        disabled={isLoading}
      >
        {isLoading ? (
          <MoonLoader color="#ffffff" size={20} />
        ) : (
          <>
            <p>Login</p>
            <span> &#8594;</span>
          </>
        )}
      </button>
      <hr className="w-[60%]" />
      <div className="flex gap-1">
        <p>New member?</p>
        <button
          type="button"
          className="text-yellow-300"
          onClick={handleJoinUs}
          disabled={isLoading}
        >
          Join us today
        </button>
      </div>
    </form>
  );
};

export default LoginForm;