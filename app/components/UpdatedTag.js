import React from 'react'

const UpdatedTag = () => {
return (
    <>
    <div className=' animate-pulse-scale fixed top-10 right-20 pointer-events-none'>
        <div className=' bg-green-500 text-white font-bold p-2 rounded-lg'>
            Last updated <br /><span className='font-medium'>12/28/2024 <br /> 12:42 AM PKT</span>
        </div>
    </div>
    <style jsx>{`
        @keyframes pulseScale {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.1);
            }
        }
        .animate-pulse-scale {
            animation: pulseScale 1.5s infinite;
        }
    `}</style>
    </>
)
}

export default UpdatedTag