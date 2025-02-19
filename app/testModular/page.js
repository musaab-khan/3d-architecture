'use client'
import React, { useState } from 'react';
import ToolBar from './Toolbar';
import Canvas2D from './Canvas2D';
import Viewport3D from './Viewport3D';
import ObjectDialog from './ObjectDialog';
import './App.css';

const App = () => {
  const [selectedTool, setSelectedTool] = useState(null);
  const [objects, setObjects] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [objectDimensions, setObjectDimensions] = useState({
    name: '',
    width: 1,
    height: 1,
    depth: 1,
    x: 0,
    y: 0
  });
  
  const handleToolSelect = (tool) => {
    setSelectedTool(tool);
  };
  
  const handleCanvasClick = (x, y) => {
    if (!selectedTool) return;
    
    setObjectDimensions({
      ...objectDimensions,
      x,
      y
    });
    
    setIsDialogOpen(true);
  };
  
  const handleObjectCreate = (newObject) => {
    setObjects([...objects, newObject]);
    setIsDialogOpen(false);
    setObjectDimensions({
      name: '',
      width: 1,
      height: 1,
      depth: 1,
      x: 0,
      y: 0
    });
  };
  
  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };
  
  return (
    <div className="app-container">
      {/* {<header className="app-header">
        <h1>2D-to-3D Object Creator</h1>
      </header>} */}
      
      <ToolBar 
        selectedTool={selectedTool} 
        onToolSelect={handleToolSelect} 
      />
      
      <div className="viewport-container">
        <Canvas2D 
          objects={objects}
          setObjects={setObjects}
          selectedTool={selectedTool} 
          onCanvasClick={handleCanvasClick} 
        />
        
        <Viewport3D objects={objects} />
      </div>
      
      {isDialogOpen && (
        <ObjectDialog 
          selectedTool={selectedTool} 
          initialDimensions={objectDimensions} 
          onSubmit={handleObjectCreate}
          onClose={handleDialogClose} 
        />
      )}
    </div>
  );
};

export default App;