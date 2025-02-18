// components/Canvas2D.jsx
'use client'
import React, { useRef, useEffect } from 'react';
import { draw2DObject } from './canvasUtils';

const Canvas2D = ({ objects, selectedTool, onCanvasClick }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw all objects
    objects.forEach(object => {
      draw2DObject(ctx, object);
    });
  }, [objects]);
  
  const handleClick = (e) => {
    if (!selectedTool || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    onCanvasClick(x, y);
  };
  
  return (
    <div className="canvas-container">
      <h2>2D Canvas</h2>
      <canvas 
        ref={canvasRef} 
        width={500} 
        height={500} 
        className="canvas-2d"
        onClick={handleClick}
      ></canvas>
      {selectedTool && (
        <div className="tool-indicator">
          Selected tool: <strong>{selectedTool}</strong>.<br/>
          Click on canvas to place.
        </div>
      )}
    </div>
  );
};

export default Canvas2D;