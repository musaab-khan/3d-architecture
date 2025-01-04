import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
// import StaticViewer from './StaticViewer';

const ProjectDetails = ({ step, setStep, handleProjectDetailsClose }) => {
  const router = useRouter(); // Initialize the router
  const [searchQuery, setSearchQuery] = useState(''); // State to manage the input value
  const [searchResults, setSearchResults] = useState([]); // State to store API search results
  const [isSearching, setIsSearching] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [dimensions, setDimensions] = useState({ width: '', height: '' });
  const [selectedImage, setSelectedImage] = useState(null); // Track selected image
//   const [loading, setLoading] = useState(false); // Track loading state for the submission

//   const handleNewProject = (e) => {
//     e.preventDefault();
//     router.push('/project'); // Navigate to /project
//   };

  const handleContinueClick = () => {
    if (step < 3) setStep(step + 1);
  };

  // Function to handle search and fetch data from the API
  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query); // Update the input value

    if (query.length > 2) { // Only search when input length is greater than 2
      setIsSearching(true); // Set loading state to true
    } else {
      setSearchResults([]); // Clear results if input is too short
      setIsSearching(false); // Reset loading state if query is cleared
    }
  };

  // Debounce the API call to avoid constant hitting of the endpoint
  useEffect(() => {
    const debounceTimeout = setTimeout(async () => {
      if (searchQuery.length > 2) {
        try {
          const response = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT+`idk/search?query=${searchQuery}`);
          const data = await response.json();
          setSearchResults(data); // Update search results
          setIsSearching(false); // Set loading state to false
        } catch (error) {
          console.error("Error fetching search results:", error);
          setSearchResults([]); // Reset if error occurs
          setIsSearching(false); // Set loading state to false
        }
      }
    }, 500); // Delay of 500ms

    return () => clearTimeout(debounceTimeout); // Cleanup timeout on component unmount or when query changes
  }, [searchQuery]);

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion); // Set the clicked suggestion as the query
    setIsSearching(false); // Stop loading state
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Collect form data
    const projectData = {
      name: projectName,
      dimensions:[dimensions.width,dimensions.height],
      imageUrl: selectedImage || '', // If no image selected, it remains empty
    };
    console.log(projectData)
    // Get JWT token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found");
      return;
    }

    // setLoading(true); // Set loading state to true

    try {
      // Send data to the API
      const response = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT+'idk/create-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include JWT token
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        console.log('Project created successfully');
        // Handle success (e.g., redirect or show success message)
        router.push(`/project?imgUrl=${encodeURIComponent(selectedImage)}&projectDimsX=${projectData.dimensions[0]}&projectDimsY=${projectData.dimensions[1]}`); // Example redirect
      } else {
        console.error('Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
    //   setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center fixed top-0" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className='w-[80vw] h-[80vh] bg-[#5A5A5A] flex flex-col md:flex-row text-white rounded-xl justify-evenly items-center relative'>
        <div className='w-[40%] h-[80%]'>
          {/* Form for Step 1 */}
          <div className={`${step === 1 ? 'flex' : 'hidden'} flex-col h-full justify-between`}>
            <h2 className='text-[2.125rem] text-yellow-300'>Lets start with your project&apos;s basics</h2>
            <input
              type="text"
              placeholder='Enter your project name'
              className='outline-none text-2xl bg-transparent '
              style={{ borderBottom: '1px solid white' }}
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)} // Handle input change
            />
            <h2 className='text-[2.125rem]'>Dimensions</h2>
            <div className='flex h-[15%] gap-8 items-center'>
              <input
                type="text"
                placeholder='Width'
                className='bg-transparent border-2 h-full rounded-2xl pl-2  focus:outline-yellow-300'
                value={dimensions.width}
                onChange={(e) => setDimensions({ ...dimensions, width: e.target.value })}
              />
              <p>&#10005;</p>
              <input
                type="text"
                placeholder='Height'
                className='bg-transparent border-2 h-full rounded-2xl pl-2 focus:outline-yellow-300'
                value={dimensions.height}
                onChange={(e) => setDimensions({ ...dimensions, height: e.target.value })}
              />
            </div>
            <button className='flex gap-2 justify-center rounded-xl bg-[#5F5FFF] h-[15%] items-center text-[20px]' onClick={handleContinueClick}>
              <p>Start creating now</p><span> &#8594;</span>
            </button>
          </div>

          {/* Form for Step 2 */}
          <div className={`${step === 2 ? 'flex' : 'hidden'} flex-col h-full justify-between`}>
            <h2 className='text-[2.125rem]'>Tell us more about your project</h2>
            <div className="w-full">
              <div className='w-full mb-1'>
                <label htmlFor="category" className='block'>Category</label>
                <div className='flex text-2xl' style={{ borderBottom: '1px solid white' }}>
                  <input
                    type="text"
                    id='category'
                    className='bg-transparent w-[95%] outline-none'
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                  <p className='font-sans mx-2' onClick={()=>{setSearchResults([]);setSearchQuery('')}}>&#10005;</p>
                </div>
              </div>
              <div className='z-opacity-0 z-pointer-events-none py-1 px-2 bg-[#9c9c9c] w-full h-[25vh] rounded-b-lg overflow-y-auto'>
                {isSearching ? (
                  <p>Loading...</p>
                ) : searchResults.length > 0 ? (
                  searchResults.map((result, index) => (
                    <p
                      key={index}
                      className='h-[21%] border-b-2 flex items-center text-[18px]'
                      onClick={() => handleSuggestionClick(result.name)}
                    >
                      {result.name}
                    </p>
                  ))
                ) : (
                  <p className='text-center'>No results found</p>
                )}
              </div>
            </div>

            <button className='flex gap-2 justify-center rounded-xl bg-[#5F5FFF] h-[15%] items-center text-2xl' onClick={handleContinueClick}>
              <p>Continue</p><span> &#8594;</span>
            </button>
          </div>

          {/* Form for Step 3 */}
          <div className={`${step === 3 ? 'flex' : 'hidden'} flex-col h-full justify-between`}>
            <h2 className='text-[2.125rem]'>Tell us more about your project</h2>
            <div className="w-full space-y-4">
              <div className='w-full mb-1'>
                <label htmlFor="category" className='block'>Category</label>
                <div className='flex text-2xl' style={{ borderBottom: '1px solid white' }}>
                  <input
                    type="text"
                    id='category'
                    className='bg-transparent w-[95%]'
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                  <p className='font-sans mx-2'><span>&#10005;</span></p>
                </div>
              </div>
              <div className='py-1 w-full space-y-2'>
                <label htmlFor="recommendations" className='block'>Select any suggestion to customise, or press continue to create your own</label>
                <div id="recommendations" className='flex overflow-hidden gap-2'>
                  {searchResults.length > 0 ? (
                    searchResults.map((result, index) => (
                      <div
                        key={index}
                        className="cursor-pointer"
                        onClick={() => setSelectedImage(result.imageUrl)} // Set selected image URL
                      >
                        <img
                          width={150}
                          height={150}
                          alt={result.name}
                          src={result.imageUrl || '/default-image-placeholder.png'}
                        />
                        {/* <div className='w-[150px] h-[150px]'>
                          <StaticViewer></StaticViewer>
                        </div> */}
                      </div>
                    ))
                  ) : (
                    <p>No recommendations available</p>
                  )}
                </div>
              </div>
            </div>

            <button className='flex gap-2 justify-center rounded-xl bg-[#5F5FFF] h-[15%] items-center text-2xl' onClick={handleSubmit}>
              <p>Continue</p><span className='w-[34px] h-[34px] rounded-full border-[1px] border-slate-700 text-slate-700'> &#10003;</span>
            </button>
          </div>
        </div>

        <div className='w-[30%] h-[50%] relative'>
          <Image src='/assets/create-project-asset1.svg' alt='' fill />
        </div>
        <div className='absolute top-[2%] right-[3%] font-sans text-[3vh] cursor-pointer' onClick={handleProjectDetailsClose}>
          &#10005;
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
