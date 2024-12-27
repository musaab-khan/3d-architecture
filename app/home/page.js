'use client'
import React,{useState} from 'react'
import Image from 'next/image'


const Page = () => {

    const [projectDetails, setProjectDetails] = useState(false);
    const [step, setStep] = useState(1);

    function handleProjectDetailsClose (){
        setProjectDetails(!projectDetails);
        setStep(setStep);

    }

    function handleContinueClick() {
        if (step < 3) setStep(step + 1); // Increment step until the last one
      }

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
                        <Image alt='' src='/assets/my-projects-asset1.svg' fill></Image>
                    </div>
                    <div className='relative h-full w-[22%] md:w-[5%]'>
                        <Image alt='' src='/assets/my-projects-assets2.svg' fill></Image>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[2%] mb-4 mt-[-22%] md:mt-[-5%] w-[65%] relative text-2xl">
                <div className='w-[45vw] md:w-[20vw] h-[22vh] m-auto flex justify-center items-center rounded-xl cursor-pointer' onClick={setProjectDetails} style={{background: "linear-gradient(#BFB145,#6D6BE3,#5F5FFF)"}}>
                    <div className='w-[98%] h-[95%] bg-[#444444] rounded-xl flex flex-col justify-center items-center text-2xl'>
                        <p className='text-5xl font-bold'>+</p>
                        <p>Create New</p>
                    </div>
                </div>
                <div className='w-[45vw] md:w-[20vw] h-[22vh] border-[3px] border-[#5F5FFF] bg-[#444444]  rounded-xl m-auto p-[5%]'>
                    <h2>Hospital</h2>
                    <p className='text-xl'>Dimensions: 200 x 150</p>
                </div>
                <div className='w-[45vw] md:w-[20vw] h-[22vh] border-[3px] border-[#5F5FFF] bg-[#444444]  rounded-xl m-auto p-[5%]'>
                    <h2>Hospital</h2>
                    <p className='text-xl'>Dimensions: 200 x 150</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 w-[85%] gap-4 text-2xl pb-10">
                <div className='w-[45vw] md:w-[20vw] h-[22vh] border-[3px] border-[#5F5FFF] bg-[#444444]  rounded-xl m-auto p-[5%]'>
                    <h2>Hospital</h2>
                    <p className='text-xl'>Dimensions: 200 x 150</p>
                </div>
                <div className='w-[45vw] md:w-[20vw] h-[22vh] border-[3px] border-[#5F5FFF] bg-[#444444]  rounded-xl m-auto p-[5%]'>
                    <h2>Hospital</h2>
                    <p className='text-xl'>Dimensions: 200 x 150</p>
                </div>
                <div className='w-[45vw] md:w-[20vw] h-[22vh] border-[3px] border-[#5F5FFF] bg-[#444444]  rounded-xl m-auto p-[5%]'>
                    <h2>Hospital</h2>
                    <p className='text-xl'>Dimensions: 200 x 150</p>
                </div>
                <div className='w-[45vw] md:w-[20vw] h-[22vh] border-[3px] border-[#5F5FFF] bg-[#444444]  rounded-xl m-auto p-[5%]'>
                    <h2>Hospital</h2>
                    <p className='text-xl'>Dimensions: 200 x 150</p>
                </div>
            </div>
    <div className={`${projectDetails?'fixed':'hidden'} w-screen h-screen flex justify-center items-center top-0`} style={{background: 'rgba(0,0,0,0.5)'}}>
        <div className='w-[80vw] h-[80vh] bg-[#5A5A5A] flex flex-col md:flex-row text-white rounded-xl justify-evenly items-center relative'>
            <div className='w-[40%] h-[80%]'>{/* supposed to be a form */}
                <div className={`${step === 1 ? 'flex' : 'hidden'} flex-col h-full justify-between`}>
                    <h2 className='text-[2.125rem]'>Lets start with your projects basics</h2>
                    <input type="text" placeholder='Enter your project name' className='text-2xl bg-transparent' style={{borderBottom: '1px solid white'}}/>
                    <h2 className='text-[2.125rem]'>Dimensions</h2>
                    <div className='flex h-[15%] gap-8 items-center'>
                        <input type="text" placeholder='' className='bg-transparent border-2 h-full rounded-2xl'/>
                        <p>X</p>
                        <input type="text" placeholder='' className='bg-transparent border-2 h-full rounded-2xl'/>
                    </div>
                    <button className='flex gap-2 justify-center rounded-xl bg-[#5F5FFF] h-[15%] items-center text-2xl' onClick={handleContinueClick}><p>Continue</p><span> &#8594;</span></button>
                </div>
                <div className={`${step === 2 ? 'flex' : 'hidden'} flex-col h-full justify-between`}>
                    <h2 className='text-[2.125rem]'>Tell us more about your project</h2>
                    <div className="w-full">
                        <div className='w-full mb-1'>
                            <label htmlFor="category" className='block'>Category</label>
                            <div className='flex text-2xl' style={{borderBottom: '1px solid white'}}>
                                <input type="text" id='category' className='bg-transparent w-[95%]'/>
                                <p className='font-sans mx-2'>X</p>
                            </div>
                        </div>
                        <div className='py-1 px-2 bg-[#9c9c9c] w-full h-[25vh] rounded-b-lg'>
                            <p className='h-[21%] border-b-2 flex items-center text-[18px]'>Police Station</p>
                            <p className='h-[21%] border-b-2 flex items-center text-[18px]'>Police Station</p>
                            <p className='h-[21%] border-b-2 flex items-center text-[18px]'>Police Station</p>
                            <p className='h-[21%] border-b-2 flex items-center text-[18px]'>Police Station</p>
                        </div>
                    </div>
                    
                    <button className='flex gap-2 justify-center rounded-xl bg-[#5F5FFF] h-[15%] items-center text-2xl' onClick={handleContinueClick}><p>Continue</p><span> &#8594;</span></button>
                </div>
                <div className={`${step === 3 ? 'flex' : 'hidden'} flex-col h-full justify-between`}>
                    <h2 className='text-[2.125rem]'>Tell us more about your project</h2>
                    <div className="w-full space-y-4">
                        <div className='w-full mb-1'>
                            <label htmlFor="category" className='block'>Category</label>
                            <div className='flex text-2xl' style={{borderBottom: '1px solid white'}}>
                                <input type="text" id='category' placeholder='Search' className='bg-transparent w-[95%]'/>
                                <p className='font-sans mx-2'><span>&#10005;</span></p>
                            </div>
                        </div>
                        <div className='py-1 w-full space-y-2'>
                            <label htmlFor="recommendations" className='block'>Select any suggestion to customise, or press continue to create your own</label>
                            <div id="recommendations" className='flex overflow-hidden gap-2'>
                                <Image width={150} height={150} alt='' src='/assets/project-recommendation1.png'></Image>
                                <Image width={150} height={150} alt='' src='/assets/project-recommendation2.png'></Image>
                                <Image width={150} height={150} alt='' src='/assets/project-recommendation2.png'></Image>
                                <Image width={150} height={150} alt='' src='/assets/project-recommendation4.png'></Image>
                            </div>
                        </div>
                    </div>
                    
                    <button className='flex gap-2 justify-center rounded-xl bg-[#5F5FFF] h-[15%] items-center text-2xl' onClick={handleProjectDetailsClose}><p>Continue</p><span className='w-[34px] h-[34px] rounded-full border-[1px] border-slate-700 text-slate-700'> &#10003;</span></button>
                </div>

            </div>
            <div className='w-[30%] h-[50%] relative'>
                <Image src='/assets/create-project-asset1.svg' alt='' fill></Image>
            </div>
            <div className='absolute top-[2%] right-[3%] font-sans text-[3vh] cursor-pointer' onClick={handleProjectDetailsClose}>&#10005;</div>
        </div>

    </div>
  
        </div>
    )
}

export default Page