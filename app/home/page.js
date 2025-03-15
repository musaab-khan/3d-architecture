'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import ProjectDetails from '../components/ProjectDetails'
import { useRouter } from 'next/navigation'

const Page = () => {
    const [projectDetails, setProjectDetails] = useState(false);
    const [step, setStep] = useState(1);
    const [models, setModels] = useState([]);
    const router = useRouter();

    function handleProjectDetailsClose() {
        setProjectDetails(!projectDetails);
        setStep(1);
        console.log(localStorage.token)
    }

    const decodeToken = (token) => {
        if (!token) return null;
        try {
            return JSON.parse(atob(token.split('.')[1])); // Decode Base64 payload
        } catch (e) {
            console.error("Invalid token: ",e);
            return null;
        }
    };

    useEffect(() => {
        const fetchModels = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + `project/models`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setModels(data.models);  // Store models data
                } else {
                    console.error('Error fetching models:', data.message);
                }
                console.log("Decoded Token:", decodeToken(token));
            } catch (error) {
                console.error('Error fetching models:', error);
            }
        };

        fetchModels();
    }, []);

    const handleModelClick = (id) => {
        // const [length, width] = dimensions;
        // router.push(`/project?projectID=${id}&projectDimsX=${length}&projectDimsY=${width}&load=true`);
        // router.push(`/project?projectID=${id}&projectDimsX=${length}&projectDimsY=${width}&load=true`);
        router.push(`/testNew?projectID=${id}`);
    };

    // Split models into two grids (first grid and second grid)
    const firstGridModels = models.slice(0, 2); // First two models (Create New + 1st Project, 2nd Project)
    const secondGridModels = models.slice(2); // Remaining models

    return (
        <div className='flex flex-col items-center text-white justify-evenly py-10' style={{ background: 'linear-gradient(90deg, #181818, #424242)' }}>

            <div className='flex w-[100%] pl-[8%] justify-center md:justify-start mb-10'>
                <div className='relative w-[25vh] h-[13vh]'>
                    <Image src='/assets/logo1.png' alt='' fill className='rounded-lg' />
                </div>
            </div>

            <div className='w-[90%] md:w-[85%] h-[35vh] bg-[#3D3D3D] rounded-xl flex flex-col px-[3%] pt-[1%] justify-between'>
                <h1 className='font-bold text-4xl'>My Projects</h1>
                <div className='h-[50%] w-full flex justify-between'>
                    <div className='relative h-full w-[22%] md:w-[7%]'>
                        <Image alt='' src='/assets/my-projects-asset1.svg' fill />
                    </div>
                    <div className='relative h-full w-[22%] md:w-[5%]'>
                        <Image alt='' src='/assets/my-projects-assets2.svg' fill />
                    </div>
                </div>
            </div>

            {/* First Grid (Create New + 1st and 2nd Project) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[2%] mb-4 mt-[-22%] md:mt-[-5%] w-[65%] relative text-2xl">
                {/* Create New Card */}
                <div className='w-[45vw] md:w-[20vw] h-[22vh] m-auto flex justify-center items-center rounded-xl cursor-pointer' onClick={setProjectDetails} style={{ background: "linear-gradient(#BFB145,#6D6BE3,#5F5FFF)" }}>
                    <div className='w-[98%] h-[95%] bg-[#444444] rounded-xl flex flex-col justify-center items-center text-2xl'>
                        <p className='text-5xl font-bold'>+</p>
                        <p>Create New</p>
                    </div>
                </div>

                {/* Dynamic Project Models (First 2 Models) */}
                {firstGridModels.length > 0 ? firstGridModels.map((model) => (
                    <div
                        key={model.id}
                        className='w-[45vw] md:w-[20vw] h-[22vh] border-[3px] border-[#5F5FFF] bg-[#444444] rounded-xl m-auto p-[5%]'
                        onClick={() => handleModelClick(model.id, model.dimensions)}
                        style={{ cursor: 'pointer' }}
                    >
                        <h2>{model.name}</h2>
                        <p className='text-xl'>Dimensions: {model.dimensions[0]} x {model.dimensions[1]}</p>
                    </div>
                )) : (

                    <div></div>
                )}
            </div>

            {/* Second Grid (Remaining Projects) */}
            <div className="grid grid-cols-1 md:grid-cols-4 w-[85%] gap-4 text-2xl pb-10">
                {secondGridModels.length > 0 ? secondGridModels.map((model) => (
                    <div
                        key={model.id}
                        className='w-[45vw] md:w-[20vw] h-[22vh] border-[3px] border-[#5F5FFF] bg-[#444444] rounded-xl m-auto p-[5%]'
                        onClick={() => handleModelClick(model.id, model.dimensions)}
                        style={{ cursor: 'pointer' }}
                    >
                        <h2>{model.name}</h2>
                        <p className='text-xl'>Dimensions: {model.dimensions[0]} x {model.dimensions[1]}</p>
                    </div>
                )) : (
                    <div className='opacity-0 w-[45vw] md:w-[20vw] h-[22vh] border-[3px] border-[#5F5FFF] bg-[#444444] rounded-xl m-auto p-[5%]'>
                        <p className="text-xl">No models available</p>
                    </div>
                )}
            </div>

            {projectDetails && (
                <ProjectDetails
                    step={step}
                    setStep={setStep}
                    handleProjectDetailsClose={handleProjectDetailsClose}
                />
            )}

        </div>
    )
}

export default Page;
