'use client'
import React,{useState} from 'react'
import Image from 'next/image'
import Search from '../components/search-icon.js'
import AddPropertyIcon from '../components/add-propert-icon.js'
import CursorIcon from '../components/cursor-icon.js'
import {useRouter} from 'next/navigation'

const page = () => {

    const router = useRouter(); // Initialize the router
        
    const handleGoBack = (e) => {
      e.preventDefault();
      router.push('/home'); // Navigate to /login
    };

    const [cursorOptions,setCursorOptions]=useState(false);
    const [step, setStep] = useState(0);
    const [cursorStep, setCursorStep] = useState(0);
    const [addAsset, setAddAsset] = useState('interior');
    
    function toggleOption  (option) {
        setStep(option);
    }
  return (
    <div>
        <div className='h-screen w-screen bg-[#353535] text-white flex justify-evenly flex-col px-[2%]'>
            <div className='flex w-full px-[6%] justify-between items-center h-[10%] border-2'>
                <div className='relative w-[25vh] h-[10vh]'>
                    <Image src='/assets/logo1.png' alt='' fill className='rounded-lg' />
                </div>
                <button className='underline text-lg' onClick={handleGoBack}>Back to dashboard</button>
            </div>
            <div className="flex h-[80%] border-2 w-full justify-center p-1 cursor-pointer relative">
                <div className='flex justify-start items-center flex-col gap-4 border-2 px-2 bg-[#5a5a5a] rounded-xl absolute h-full left-1'>
                    <div onClick={()=>{toggleOption(1)}} className='border-b-[1px] w-full basis-[10%] flex justify-center items-center'>
                        <Search selected={step==1}></Search>
                    </div>
                    <div onClick={()=>{toggleOption(2)}} className='border-b-[1px] w-full basis-[10%] flex justify-center items-center relative'>
                        <AddPropertyIcon selected={step==2}></AddPropertyIcon>
                        {step==2&&
                            <div className='absolute left-full border-2 top-[-20%] flex flex-col h-[450%] pb-2 rounded-xl bg-[#5a5a5a]'>
                            <div className='flex border-b-2 mb-2'>
                                <button className={`p-2 border-r-[1px] cursor-pointer px-5 ${addAsset=='interior'?' bg-[#7b7b7b]':''}`} onClick={()=>setAddAsset('interior')}>Interior</button>
                                <button className={`p-2 border-r-[1px] cursor-pointer px-5 ${addAsset=='exterior'?' bg-[#7b7b7b]':''}`} onClick={()=>setAddAsset('exterior')}>Interior</button>
                            </div>
                            <div className="flex flex-col overflow-auto scrollbar-thin scrollbar-thumb-[#323232] scrollbar-thumb-rounded-full  scrollbar-track-[#808080]">
                                {addAsset=='interior'&&
                                    <ul id='interior-list' className='list-none w-full flex flex-col'>
                                    <li className="w-full text-center border-b-[1px] pt-2 pb-1">Room</li>
                                    <li className="w-full text-center border-b-[1px] pt-2 pb-1">Window</li>
                                    <li className="w-full text-center border-b-[1px] pt-2 pb-1">Switch</li>
                                    <li className="w-full text-center border-b-[1px] pt-2 pb-1">Button</li>
                                    <li className="w-full text-center border-b-[1px] pt-2 pb-1">Frame</li>
                                    <li className="w-full text-center border-b-[1px] pt-2 pb-1">Pipes</li>
                                    <li className="w-full text-center border-b-[1px] pt-2 pb-1">Wall</li>
                                </ul>}
                                {addAsset=='exterior'&&
                                    <ul id='exterior-list' className='list-none w-full'>
                                    <li className="w-full text-center border-b-[1px] pt-2 pb-1">Plant</li>
                                    <li className="w-full text-center border-b-[1px] pt-2 pb-1">Patio</li>
                                    <li className="w-full text-center border-b-[1px] pt-2 pb-1">Tree</li>
                                    <li className="w-full text-center border-b-[1px] pt-2 pb-1">Fence</li>
                                    <li className="w-full text-center border-b-[1px] pt-2 pb-1">Plant</li>
                                    <li className="w-full text-center border-b-[1px] pt-2 pb-1">Grass</li>
                                </ul>
                                }
                            </div>
                        </div>}
                    </div>
                    <div onClick={()=>{toggleOption(3)}} className='border-b-[1px] w-full basis-[10%] flex justify-center items-center'>
                        <CursorIcon selected={step==3}></CursorIcon>
                    </div>
                </div>
                <div className='flex justify-center items-center flex-col gap-4 border-2 basis-[80%] px-2 rounded-xl'>
                    <div className={`${(step==3&&cursorOptions)?'border-2':""} relative w-[40vh] h-[40vh] z-[10]`} onClick={()=>{setCursorOptions(!cursorOptions);}}>
                        <Image src='/assets/model.png' alt='' fill></Image>
                    </div>
                </div>
                {(step==3 && cursorOptions==true) &&
                 <div className='flex h-full justify-start items-center flex-col gap-4 border-2 w-[4%] px-2 bg-[#5a5a5a] rounded-xl absolute right-1'>
                    <div className='border-b-[1px] w-full basis-[10%] flex justify-center items-center' onClick={()=>setCursorStep(1)}>
                        <Image src='/assets/move.png' width={25} height={25} alt='' className={`${cursorStep==1?'scale-[135%] border-[1px] border-dotted':''}`}></Image>
                    </div>
                    <div className='border-b-[1px] w-full basis-[10%] flex justify-center items-center' onClick={()=>setCursorStep(2)}>
                        <Image src='/assets/rotate.png' width={25} height={25} alt=''  className={`${cursorStep==2?'scale-[135%] border-[1px] border-dotted':''}`}></Image>
                    </div>
                    <div className='border-b-[1px] w-full basis-[10%] flex justify-center items-center' onClick={()=>setCursorStep(3)}>
                        <Image src='/assets/resize.png' width={25} height={25} alt='' className={`${cursorStep==3?'scale-[135%] border-[1px] border-dotted':''}`}></Image>
                    </div>
                    <div className='border-b-[1px] w-full basis-[10%] flex justify-center items-center' onClick={()=>setCursorStep(4)}>
                        <Image src='/assets/color.png' width={25} height={25} alt='' className={`${cursorStep==4?'scale-[135%] border-[1px] border-dotted':''}`}></Image>
                    </div>
                </div> }
                {step==1 &&
                    <div className='flex h-full justify-start items-center flex-col gap-4 border-2 w-[20%] px-2 bg-[#5a5a5a] rounded-xl absolute right-1'>
                    <h1 className='pb-1 pt-2 border-b-2 w-[95%]'>Search</h1>
                </div>}
            </div>
        </div>
    </div>
  )
}

export default page