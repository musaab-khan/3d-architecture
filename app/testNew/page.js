'use client'
import React, { useState } from 'react';
import ToolBar from './Toolbar';
import Canvas2D from './Canvas2D';
import Viewport3D from './Viewport3D';
import ObjectDialog from './ObjectDialog';
import ObjectsList from './ObjectsList';
import ObjectPropertiesEditor from './ObjectPropertiesEditor';
import './App.css';

const App = () => {
  const [selectedTool, setSelectedTool] = useState(null);
  const [objectDetailsOpen, setObjectDetailsOpen] = useState(false);
  const [objects, setObjects] = useState([]);
  const [selectedObject, setSelectedObject] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
  
  const handleToolSelect = (tool) => {
    setSelectedTool(tool);
  };
  
  const handleAddObject = (position) => {
    setInitialPosition(position);
    setIsDialogOpen(true);
  };
  
  const handleObjectCreate = (newObject) => {
    setObjects([...objects, newObject]);
    setIsDialogOpen(false);
  };
  
  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };
  
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>2D-to-3D Object Creator</h1>
      </header>
      
      <ToolBar 
        selectedTool={selectedTool} 
        onToolSelect={handleToolSelect} 
      />
      
      <div className="viewport-container">
        <Canvas2D 
          objects={objects}
          setObjects={setObjects}
          selectedTool={selectedTool}
          onAddObject={handleAddObject}
          selectedObject={selectedObject}
          setSelectedObject={setSelectedObject}
        />
        
        <Viewport3D objects={objects} />
      </div>
      <ObjectsList objects={objects} selectedObject={selectedObject} setSelectedObject={setSelectedObject}></ObjectsList>
      {isDialogOpen && (
        <ObjectDialog 
          selectedTool={selectedTool} 
          setSelectedTool={setSelectedTool} 
          initialPosition={initialPosition} 
          onSubmit={handleObjectCreate}
          onClose={handleDialogClose} 
        />
      )}
      {(selectedObject&&!objectDetailsOpen) && (
        <button className='fixed top-[50%] right-0 p-2 bg-blue-500 text-white rounded-l-md shadow-md' onClick={() => setObjectDetailsOpen(!objectDetailsOpen)}>
          {
            objectDetailsOpen ?
            <span>&gt;</span>
            :<span>&lt;</span>
          }
        </button>
      )}
      {(selectedObject&&objectDetailsOpen) && (
        <div className="selected-object-info fixed top-0 right-0 p-4 bg-white shadow-md w-[30vw] h-[100vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <p>Selected: {selectedObject.name} at ({Math.round(selectedObject.x)}, {Math.round(selectedObject.y)})</p>
              <button className='p-1 mr-1 bg-slate-400 text-white rounded-md shadow-md' onClick={() => setObjectDetailsOpen(!objectDetailsOpen)}>
                  &#10006;
              </button>
            </div>
          <ObjectPropertiesEditor selectedObject={selectedObject} setObjects={setObjects} setSelected={setSelectedObject} />
        </div>
      )}
    </div>
  );
};

export default App;