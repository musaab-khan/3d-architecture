import React from 'react'
import StaticViewer from '../components/StaticViewer'
import { div } from 'three/webgpu'


const page = () => {
  return (
    <>
    <div className='w-[500px] h-[500px]'>
        <StaticViewer></StaticViewer>
    </div>
    </>
  )
}

export default page