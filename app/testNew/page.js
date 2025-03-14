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
        <button className='fixed top-[50%] right-0 px-1 py-4 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-l-md shadow-md' onClick={() => setObjectDetailsOpen(!objectDetailsOpen)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-180" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      )}
      {(selectedObject&&objectDetailsOpen) && (
        <div className="selected-object-info fixed top-0 right-0 p-4 bg-white shadow-md w-[30vw] h-[100vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <p>Selected: {selectedObject.name} at ({Math.round(selectedObject.x)}, {Math.round(selectedObject.y)})</p>
              <button className='p-1 mr-1 text-slate-500 rounded-md' onClick={() => {setObjectDetailsOpen(!objectDetailsOpen);}}>
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