import React from 'react';

const ObjectPropertiesEditor = ({ selectedObject, setObjects, setSelected }) => {
  const handlePropertyChange = (property, value) => {
    // Convert string values to numbers for numeric properties
    const numericValue = !isNaN(parseFloat(value)) ? parseFloat(value) : value;
    
    setObjects(prevObjects =>
      prevObjects.map(obj =>
        obj.id === selectedObject.id
          ? { ...obj, [property]: numericValue }
          : obj
      )
    );
  };

  const handleDelete = () => {
    setObjects(prevObjects => 
      prevObjects.filter(obj => obj.id !== selectedObject.id)
    );
    setSelected(null);
  };

  if (!selectedObject) return null;

  return (
    <div className="object-properties-editor p-4 border rounded-md bg-white shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Object Properties</h3>
        <button
          onClick={handleDelete}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
        >
          Delete
        </button>
      </div>
      <div className="flex flex-col">
          <label className="text-sm text-gray-600">Name</label>
          <input 
            type="text" 
            value={selectedObject.name}
            onChange={(e) => handlePropertyChange('name', e.target.value)}
            className="border rounded p-1 text-sm"
          />
        </div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="flex flex-col">
          <label className="text-sm text-gray-600">X Position</label>
          <input 
            type="number" 
            value={selectedObject.x || 0}
            onChange={(e) => handlePropertyChange('x', e.target.value)}
            className="border rounded p-1 text-sm"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-600">Y Position</label>
          <input 
            type="number" 
            value={selectedObject.y || 0}
            onChange={(e) => handlePropertyChange('y', e.target.value)}
            className="border rounded p-1 text-sm"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-600">Z Position</label>
          <input 
            type="number" 
            value={selectedObject.z || 0}
            onChange={(e) => handlePropertyChange('z', e.target.value)}
            className="border rounded p-1 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="flex flex-col">
          <label className="text-sm text-gray-600">Rotate X</label>
          <input 
            type="number" 
            value={selectedObject.rotateX || 0}
            onChange={(e) => handlePropertyChange('rotateX', e.target.value)}
            className="border rounded p-1 text-sm"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-600">Rotate Y</label>
          <input 
            type="number" 
            value={selectedObject.rotateY || 0}
            onChange={(e) => handlePropertyChange('rotateY', e.target.value)}
            className="border rounded p-1 text-sm"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-600">Rotate Z</label>
          <input 
            type="number" 
            value={selectedObject.rotateZ || 0}
            onChange={(e) => handlePropertyChange('rotateZ', e.target.value)}
            className="border rounded p-1 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col">
          <label className="text-sm text-gray-600">Width</label>
          <input 
            type="number" 
            value={selectedObject.width || 0}
            onChange={(e) => handlePropertyChange('width', e.target.value)}
            className="border rounded p-1 text-sm"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-600">Height</label>
          <input 
            type="number" 
            value={selectedObject.height || 0}
            onChange={(e) => handlePropertyChange('height', e.target.value)}
            className="border rounded p-1 text-sm"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-600">Depth</label>
          <input 
            type="number" 
            value={selectedObject.depth || 0}
            onChange={(e) => handlePropertyChange('depth', e.target.value)}
            className="border rounded p-1 text-sm"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-600">Color</label>
          <input 
            type="text" 
            value={selectedObject.color || '#3B82F6'}
            onChange={(e) => handlePropertyChange('color', e.target.value)}
            pattern="^#([A-Fa-f0-9]{6})$"
            placeholder="#RRGGBB"
            className="border rounded p-1 text-sm w-24 border-gray-300"
          />
          <input
            type="color"
            id="color"
            name="color"
            value={selectedObject.color}
            onChange={(e) => handlePropertyChange('color', e.target.value)}
            className='h-8 w-10 border-0 cursor-pointer'
          />
        </div>
      </div>
    </div>
  );
};

export default ObjectPropertiesEditor;