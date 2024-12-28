import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation';

const ProjectDetails = ({ step, setStep, handleProjectDetailsClose }) => {

    const router = useRouter(); // Initialize the router
        
    const handleNewProject = (e) => {
      e.preventDefault();
      router.push('/project'); // Navigate to /login
    };

    function handleContinueClick() {
      if (step < 3) setStep(step + 1);
      handleProjectDetailsClose;
    }
    
    
  return (
    <div className="w-screen h-screen flex justify-center items-center fixed top-0" style={{background: 'rgba(0,0,0,0.5)'}}>
        <div className='w-[80vw] h-[80vh] bg-[#5A5A5A] flex flex-col md:flex-row text-white rounded-xl justify-evenly items-center relative'>
            <div className='w-[40%] h-[80%]'>{/* supposed to be a form */}
                <div className={`${step==1?'flex':'hidden'} flex-col h-full justify-between`}>
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
                <div className={`${step==2?'flex':'hidden'} flex-col h-full justify-between`}>
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
                <div className={`${step==3?'flex':'hidden'} flex-col h-full justify-between`}>
                    <h2 className='text-[2.125rem]'>Tell us more about your project</h2>
                    <div className="w-full space-y-4">
                        <div className='w-full mb-1'>
                            <label htmlFor="category" className='block'>Category</label>
                            <div className='flex text-2xl' style={{borderBottom: '1px solid white'}}>
                                <input type="text" id='category' className='bg-transparent w-[95%]'/>
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
                    
                    <button className='flex gap-2 justify-center rounded-xl bg-[#5F5FFF] h-[15%] items-center text-2xl' onClick={handleNewProject}><p>Continue</p><span className='w-[34px] h-[34px] rounded-full border-[1px] border-slate-700 text-slate-700'> &#10003;</span></button>
                </div>

            </div>
            <div className='w-[30%] h-[50%] relative'>
                <Image src='/assets/create-project-asset1.svg' alt='' fill></Image>
            </div>
            <div className='absolute top-[2%] right-[3%] font-sans text-[3vh] cursor-pointer' onClick={handleProjectDetailsClose}>&#10005;</div>
        </div>

    </div>
  )
}

export default ProjectDetails