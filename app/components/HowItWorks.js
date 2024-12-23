import React from 'react'

const HowItWorks = () => {
  return (
    <div className='flex flex-col items-center h-screen text-white justify-evenly' style={{background: 'linear-gradient(90deg, #181818, #424242)'}}>
        <h2 className='font-bold text-[2.75rem]'>How It Works</h2>
        <div className="flex flex-col md:flex-row h-[70%] w-[75%] rounded-xl bg-[#222222] gap-5 justify-evenly items-center p-5">
            <div className="flex flex-col h-[70%] justify-evenly">
                <h3 className='border-b border-white hover:text-yellow-300 text-2xl'>Authenticate &#8594;</h3>
                <h3 className='border-b border-white hover:text-yellow-300 text-2xl'>Start A Project &#8594;</h3>
                <h3 className='border-b border-white hover:text-yellow-300 text-2xl'>Creating A Model &#8594;</h3>
                <h3 className='border-b border-white hover:text-yellow-300 text-2xl'>Exporting Model &#8594;</h3>
                <h3 className='border-b border-white hover:text-yellow-300 text-2xl'>Buy Subscription &#8594;</h3>
            </div>
            <div className='flex items-center justify-center font-bold text-black text-2xl h-[60%] lg:h-[80%] lg:w-[70%] rounded-xl bg-slate-300 text-center'>Video Demonstration Goes Here</div>
        </div>
    </div>
  )
}

export default HowItWorks