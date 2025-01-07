'use client'
import React,{useEffect} from 'react'


const SelectedDetails = ({ boxProperties }) => {
    const { width, height, depth, elevation, rotation } = boxProperties;
    useEffect(() => {
        // This code will run whenever boxProperties changes
    
        console.log("Selected Box Properties updated:", boxProperties);
    
        // You can also perform other side effects like updating internal state,
        // making API calls, etc., based on the updated boxProperties.
    
      }, [boxProperties]); // Dependency array, useEffect runs when boxProperties change
  return (
    <div className='hidden bg-slate-900 absolute top-8 right-4'>
    <h3>Box Properties</h3>
    <p>Width: {Math.ceil(width)}</p>
    <p>Height: {Math.ceil(height)}</p>
    <p>Depth: {Math.ceil(depth)}</p>
    <p>Elevation: {Math.ceil(elevation)}</p>
    <p>Rotation X: {Math.ceil(rotation.rotX)}</p>
    <p>Rotation Y: {Math.ceil(rotation.rotY)}</p>
    <p>Rotation Z: {Math.ceil(rotation.rotZ)}</p>
  </div>
  )
}

export default SelectedDetails
  