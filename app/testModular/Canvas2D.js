// components/Canvas2D.jsx
'use client'
import React, { useRef, useEffect, useState } from 'react';
import { draw2DObject } from './canvasUtils';

const Canvas2D = ({ objects, setObjects, selectedTool, onCanvasClick }) => {
  const [selectedObject, setSelectedObject] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

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
  
  // const handleClick = (e) => {
  //   if (!selectedTool || !canvasRef.current) return;
    
  //   const rect = canvasRef.current.getBoundingClientRect();
  //   const x = e.clientX - rect.left;
  //   const y = e.clientY - rect.top;
    
  //   onCanvasClick(x, y);
  // };


  const handleClick = (e) => {
    if (!canvasRef.current) return;
  
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
  
    console.log(`Click coordinates: x=${x}, y=${y}`);
    console.log('Objects array:', JSON.stringify(objects));

    // Check if the click is inside an object
    const clickedObject = objects.find(obj => 
      x >= obj.x - obj.width/2 && x <= obj.x + obj.width/2 &&
      y >= obj.y-obj.height/2 && y <= obj.y + obj.height/2
    );

    objects.forEach((obj, index) => {
      console.log(`Object ${index} check:`, 
        // `x=${x} >= obj.x=${obj.x} && x=${x} <= obj.x+width=${obj.x + obj.width} && ` +
        "x:", x >= obj.x - obj.width/2 && x <= obj.x + obj.width/2
        // `y=${y} >= obj.y=${obj.y} && y=${y} <= obj.y+height=${obj.y + obj.height}`
      );
      console.log(
        "y:", y >= obj.y-obj.height/2 && y <= obj.y + obj.height/2
      )
    });

    clickedObject?console.log('clicked on object'):console.log('clicked on canvas');
    if (clickedObject) {
      setSelectedObject(clickedObject);
      setIsDragging(true);
      setOffset({ x: x - clickedObject.x, y: y - clickedObject.y });
    } else if (selectedTool) {
      // onCanvasClick(x, y);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !selectedObject) return;
  
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
  
    // Update object position
    setObjects((prevObjects) =>
      prevObjects.map((obj) =>
        obj === selectedObject ? { ...obj, x: x - offset.x, y: y - offset.y } : obj
      )
    );
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleMouseDown = (e) => {
    if (!canvasRef.current) return;
  
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
  
    // Check if the click is inside an object
    const clickedObject = objects.find(obj => 
      x >= obj.x && x <= obj.x + obj.width &&
      y >= obj.y && y <= obj.y + obj.height
    );
    
    if (clickedObject) {
      setSelectedObject(clickedObject);
      setIsDragging(true);
      setOffset({ x: x - clickedObject.x, y: y - clickedObject.y });
      e.preventDefault(); // Prevent default to avoid conflicts with click handler
    }
  };

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
  }, [objects, selectedObject, isDragging]); // Add selectedObject and isDragging as dependencies
  
  return (
    <div className="canvas-container">
      <h2>2D Canvas</h2>
      <canvas 
        ref={canvasRef} 
        width={500}
        height={500} 
        className="canvas-2d"
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseDown={handleMouseDown}
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