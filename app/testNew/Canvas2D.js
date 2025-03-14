'use client'
import React, { useRef, useEffect, useState } from 'react';
import { draw2DObject } from './CanvasUtils';

const Canvas2D = ({ objects, setObjects, selectedTool, onAddObject, selectedObject, setSelectedObject }) => {
  // const [selectedObject, setSelectedObject] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullScreen, setIsFullScreen] = useState(false);

  const canvasRef = useRef(null);
  useEffect(() => {
    if (selectedObject) {
      const updatedObject = objects.find(obj => obj.id === selectedObject.id);
      if (updatedObject) {
        setSelectedObject(updatedObject);
      }
    }
    console.log(objects);
  }, [objects, selectedObject]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply pan transformation
    ctx.save();
    ctx.translate(panOffset.x, panOffset.y);

    // Draw all objects with adjusted coordinates
    objects.forEach(object => {
      draw2DObject(ctx, { ...object, isSelected: object.id === (selectedObject?.id) });
    });

    ctx.restore();
  }, [objects, selectedObject, panOffset]);

  const handleClick = (e) => {
    if (!canvasRef.current || isDragging || isPanning) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - panOffset.x;
    const y = e.clientY - rect.top - panOffset.y;

    console.log(`Click coordinates: x=${x}, y=${y}`);

    if (selectedTool && !selectedObject) {
      onAddObject({ x, y });
    }
  };

  const handleMouseDown = (e) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - panOffset.x;
    const y = e.clientY - rect.top - panOffset.y;

    // Check if clicking on an object
    const clickedObject = objects.find(obj =>
      x >= obj.x - obj.width / 2 && x <= obj.x + obj.width / 2 &&
      y >= obj.y - obj.height / 2 && y <= obj.y + obj.height / 2
    );

    if (clickedObject) {
      setSelectedObject(clickedObject);
      setIsDragging(true);
      setOffset({ x: x - clickedObject.x, y: y - clickedObject.y });
    } else {
      setSelectedObject(null);
      setIsPanning(true);
      setDragStart({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();

    if (isDragging && selectedObject) {
      const x = e.clientX - rect.left - panOffset.x;
      const y = e.clientY - rect.top - panOffset.y;

      setObjects(prevObjects =>
        prevObjects.map(obj =>
          obj.id === selectedObject.id
            ? { ...obj, x: x - offset.x, y: y - offset.y }
            : obj
        )
      );
    } else if (isPanning) {
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      setPanOffset(prev => ({
        x: prev.x + (currentX - dragStart.x),
        y: prev.y + (currentY - dragStart.y)
      }));

      setDragStart({ x: currentX, y: currentY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsPanning(false);
  };

  // const handleFullScreen = () => {
  //   setIsFullScreen(prev => !prev);
  //   setTimeout(() => {
  //     if (canvasRef.current) {
  //       canvasRef.current.width = isFullScreen ? 500 : window.innerWidth;
  //       canvasRef.current.height = isFullScreen ? 500 : window.innerHeight;
  //     }
  //   }, 0);
  // };

  const handleFullScreen = () => {
    setIsFullScreen(prev => !prev);
    setTimeout(() => {
      if (canvasRef.current) {
        const newWidth = isFullScreen ? 500 : window.innerWidth;
        const newHeight = isFullScreen ? 500 : window.innerHeight;
        
        // Calculate scale factors
        // const widthRatio = newWidth / canvasRef.current.width;
        // const heightRatio = newHeight / canvasRef.current.height;
        
        canvasRef.current.width = newWidth;
        canvasRef.current.height = newHeight;
        
        // Scale objects
        setObjects(prevObjects => prevObjects.map(obj => ({
          ...obj,
          x: obj.x,
          y: obj.y
          // x: obj.x * widthRatio,
          // y: obj.y * heightRatio
        })));
        
        // Reset or scale panOffset
        // setPanOffset({ x: panOffset.x * widthRatio, y: panOffset.y * heightRatio });
        setPanOffset({ x: panOffset.x, y: panOffset.y });
      }
    }, 0);
  };

  return (
    <div className="canvas-container relative">
      <h2>2D Canvas</h2>
      {/* <button onClick={handleFullScreen} className="absolute top-0 right-0">
        {isFullScreen ? 'Exit Full Screen' : 'View in Full Screen'}
      </button> */}
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        className={`canvas-2dv ${isFullScreen ? 'fixed top-0 left-0' : ''}`}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseDown={handleMouseDown}
        style={{ border: '1px solid black', background: '#f5f5f5' }}
      ></canvas>
      {isFullScreen && (
        <button onClick={handleFullScreen} className="fixed top-4 right-1 ">
          Exit Full Screen
        </button>)}
      {/* {selectedTool && (
        <div className="tool-indicator">
          Selected tool: <strong>{selectedTool}</strong>.<br />
          Click on canvas to place.
        </div>
      )} */}
      {/* {selectedObject && (
        <div className="selected-object-info">
          <p>Selected: {selectedObject.name} at ({Math.round(selectedObject.x)}, {Math.round(selectedObject.y)})</p>
          <ObjectPropertiesEditor selectedObject={selectedObject} setObjects={setObjects} setSelected={setSelectedObject} />
        </div>
      )} */}
    </div>
  );
};

export default Canvas2D;
