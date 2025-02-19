// 'use client'
// import React, { useRef, useEffect, useState } from 'react';
// import { draw2DObject } from './canvasUtils';

// const Canvas2D = ({ objects, setObjects, selectedTool }) => {
//   const [selectedObject, setSelectedObject] = useState(null);
//   const [isDragging, setIsDragging] = useState(false);
//   const [offset, setOffset] = useState({ x: 0, y: 0 });

//   const canvasRef = useRef(null);

//   // Draw all objects whenever objects state changes
//   useEffect(() => {
//     if (!canvasRef.current) return;

//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');

//     // Clear canvas
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     // Draw all objects
//     objects.forEach(object => {
//       draw2DObject(ctx, { ...object, isSelected: object.id === (selectedObject?.id) });
//     });
//   }, [objects, selectedObject]);

//   const handleClick = (e) => {
//     if (!canvasRef.current) return;

//     const rect = canvasRef.current.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     // Only handle clicks that aren't for dragging
//     if (!isDragging) {
//       console.log(`Click coordinates: x=${x}, y=${y}`);
      
//       // If we have a selected tool, this is for creating new objects
//       if (selectedTool && !selectedObject) {
//         // Create a new object at click position
//         const newObject = {
//           id: `obj-${Date.now()}`,
//           type: selectedTool,
//           x: x,
//           y: y,
//           width: 50,
//           height: 50,
//           depth: 50,
//           name: `${selectedTool}-${objects.length + 1}`
//         };
        
//         setObjects(prev => [...prev, newObject]);
//       }
//     }
//   };

//   const handleMouseDown = (e) => {
//     if (!canvasRef.current) return;

//     const rect = canvasRef.current.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     // Check if the click is inside an object using center-based coordinates
//     const clickedObject = objects.find(obj => 
//       x >= obj.x - obj.width/2 && x <= obj.x + obj.width/2 &&
//       y >= obj.y - obj.height/2 && y <= obj.y + obj.height/2
//     );

//     if (clickedObject) {
//       setSelectedObject(clickedObject);
//       setIsDragging(true);
//       setOffset({ x: x - clickedObject.x, y: y - clickedObject.y });
//       e.preventDefault(); // Prevent default to avoid conflicts with click handler
//     } else {
//       setSelectedObject(null);
//     }
//   };

//   const handleMouseMove = (e) => {
//     if (!isDragging || !selectedObject || !canvasRef.current) return;

//     const rect = canvasRef.current.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     // Update object position in the shared state
//     setObjects(prevObjects =>
//       prevObjects.map(obj =>
//         obj.id === selectedObject.id
//           ? { ...obj, x: x - offset.x, y: y - offset.y }
//           : obj
//       )
//     );
//   };

//   const handleMouseUp = () => {
//     setIsDragging(false);
//   };

//   return (
//     <div className="canvas-container">
//       <h2>2D Canvas</h2>
//       <canvas
//         ref={canvasRef}
//         width={500}
//         height={500}
//         className="canvas-2d"
//         onClick={handleClick}
//         onMouseMove={handleMouseMove}
//         onMouseUp={handleMouseUp}
//         onMouseDown={handleMouseDown}
//         style={{ border: '1px solid black', background: '#f5f5f5' }}
//       ></canvas>
//       {selectedTool && (
//         <div className="tool-indicator">
//           Selected tool: <strong>{selectedTool}</strong>.<br />
//           Click on canvas to place.
//         </div>
//       )}
//       {selectedObject && (
//         <div className="selected-object-info">
//           Selected: {selectedObject.name} at ({Math.round(selectedObject.x)}, {Math.round(selectedObject.y)})
//         </div>
//       )}
//     </div>
//   );
// };

// export default Canvas2D;

'use client'
import React, { useRef, useEffect, useState } from 'react';
import { draw2DObject } from './CanvasUtils';

const Canvas2D = ({ objects, setObjects, selectedTool, onAddObject }) => {
  const [selectedObject, setSelectedObject] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const canvasRef = useRef(null);

  // Draw all objects whenever objects state changes
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all objects
    objects.forEach(object => {
      draw2DObject(ctx, { ...object, isSelected: object.id === (selectedObject?.id) });
    });
  }, [objects, selectedObject]);

  const handleClick = (e) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Only handle clicks that aren't for dragging
    if (!isDragging) {
      console.log(`Click coordinates: x=${x}, y=${y}`);
      
      // If we have a selected tool, trigger the object creation dialog
      if (selectedTool && !selectedObject) {
        onAddObject({ x, y });
      }
    }
  };

  const handleMouseDown = (e) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if the click is inside an object using center-based coordinates
    const clickedObject = objects.find(obj => 
      x >= obj.x - obj.width/2 && x <= obj.x + obj.width/2 &&
      y >= obj.y - obj.height/2 && y <= obj.y + obj.height/2
    );

    if (clickedObject) {
      setSelectedObject(clickedObject);
      setIsDragging(true);
      setOffset({ x: x - clickedObject.x, y: y - clickedObject.y });
      e.preventDefault(); // Prevent default to avoid conflicts with click handler
    } else {
      setSelectedObject(null);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !selectedObject || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Update object position in the shared state
    setObjects(prevObjects =>
      prevObjects.map(obj =>
        obj.id === selectedObject.id
          ? { ...obj, x: x - offset.x, y: y - offset.y }
          : obj
      )
    );
  };

  const handleMouseUp = () => {
    setIsDragging(false);
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
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseDown={handleMouseDown}
        style={{ border: '1px solid black', background: '#f5f5f5' }}
      ></canvas>
      {selectedTool && (
        <div className="tool-indicator">
          Selected tool: <strong>{selectedTool}</strong>.<br />
          Click on canvas to place.
        </div>
      )}
      {selectedObject && (
        <div className="selected-object-info">
          Selected: {selectedObject.name} at ({Math.round(selectedObject.x)}, {Math.round(selectedObject.y)})
        </div>
      )}
    </div>
  );
};

export default Canvas2D;