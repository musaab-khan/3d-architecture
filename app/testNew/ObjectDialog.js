import React, { useState } from 'react';

const ObjectDialog = ({ selectedTool, initialPosition, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: `${selectedTool}-${Date.now().toString().slice(-4)}`,
    width: 50,
    height: 50,
    depth: 30,
    x: initialPosition?.x || 0,
    y: initialPosition?.y || 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'name' ? value : Number(value)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      id: `obj-${Date.now()}`,
      type: selectedTool,
      ...formData
    });
  };

  return (
    <div className="object-dialog-overlay">
      <div className="object-dialog">
        <h3>Configure {selectedTool}</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="width">Width:</label>
            <input
              type="number"
              id="width"
              name="width"
              min="5"
              max="200"
              value={formData.width}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="height">Height:</label>
            <input
              type="number"
              id="height"
              name="height"
              min="5"
              max="200"
              value={formData.height}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="depth">Depth:</label>
            <input
              type="number"
              id="depth"
              name="depth"
              min="5"
              max="200"
              value={formData.depth}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="dialog-buttons">
            <button type="submit" className="submit-button">Create Object</button>
            <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ObjectDialog;