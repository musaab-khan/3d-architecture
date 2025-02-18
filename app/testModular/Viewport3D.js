// components/Viewport3D.jsx
'use client'
import React, { useRef, useEffect } from 'react';
import { initScene, renderObjects } from './threeUtils';

const Viewport3D = ({ objects }) => {
  const threeContainerRef = useRef(null);
  const sceneRef = useRef(null);
  
  useEffect(() => {
    if (!threeContainerRef.current) return;
    
    // Initialize the scene if it doesn't exist
    if (!sceneRef.current) {
      sceneRef.current = initScene(threeContainerRef.current);
    }
    
    // Clean up on unmount
    return () => {
      if (threeContainerRef.current && sceneRef.current?.renderer?.domElement) {
        threeContainerRef.current.removeChild(sceneRef.current.renderer.domElement);
      }
      if (sceneRef.current?.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId);
      }
    };
  }, []);
  
  // Render objects whenever they change
  useEffect(() => {
    if (sceneRef.current) {
      renderObjects(sceneRef.current, objects);
    }
  }, [objects]);
  
  return (
    <div className="viewport-container">
      <h2>3D Viewport</h2>
      <div ref={threeContainerRef} className="viewport-3d"></div>
    </div>
  );
};

export default Viewport3D;