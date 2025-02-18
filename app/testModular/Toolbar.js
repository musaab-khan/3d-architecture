// components/ToolBar.jsx
import React from 'react';

const ToolBar = ({ selectedTool, onToolSelect }) => {
  // const tools = ['wall', 'ball', 'pyramid'];
  const tools = ['wall'];
  
  return (
    <div className="toolbar">
      {tools.map(tool => (
        <button 
          key={tool}
          className={`tool-button ${selectedTool === tool ? 'active' : ''}`}
          onClick={() => onToolSelect(tool)}
        >
          {tool.charAt(0).toUpperCase() + tool.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default ToolBar;
