// components/ObjectDialog.jsx
'use client'
import React, { useState } from 'react';

const ObjectDialog = ({ selectedTool, initialDimensions, onSubmit, onClose }) => {
  const [dimensions, setDimensions] = useState(initialDimensions);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDimensions({
      ...dimensions,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newObject = {
      id: Date.now(),
      type: selectedTool,
      name: dimensions.name,
      x: dimensions.x,
      y: dimensions.y,
      width: parseFloat(dimensions.width),
      height: parseFloat(dimensions.height),
      depth: parseFloat(dimensions.depth)
    };
    
    onSubmit(newObject);
  };
  
  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <h2>Configure {selectedTool}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input 
              type="text" 
              name="name"
              value={dimensions.name} 
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Width:</label>
            <input 
              type="number" 
              name="width"
              value={dimensions.width} 
              onChange={handleChange}
              min="0.1"
              step="0.1"
              required
            />
          </div>
          
          {selectedTool !== 'ball' && (
            <div className="form-group">
              <label>Height:</label>
              <input 
                type="number" 
                name="height"
                value={dimensions.height} 
                onChange={handleChange}
                min="0.1"
                step="0.1"
                required
              />
            </div>
          )}
          
          {selectedTool === 'wall' && (
            <div className="form-group">
              <label>Depth:</label>
              <input 
                type="number" 
                name="depth"
                value={dimensions.depth} 
                onChange={handleChange}
                min="0.1"
                step="0.1"
                required
              />
            </div>
          )}
          
          <div className="dialog-buttons">
            <button 
              type="button" 
              className="button-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="button-create"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ObjectDialog;