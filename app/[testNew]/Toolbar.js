import React from 'react';

const ToolBar = ({ selectedTool, onToolSelect }) => {
  const tools = [
    { id: 'ball', label: 'Ball' },
    { id: 'wall', label: 'Wall' },
    { id: 'box', label: 'Box' },
    // { id: 'pyramid', label: 'Pyramid' }
  ];

  return (
    <div className="toolbar">
      <h3>Tools</h3>
      <div className="tool-buttons">
        {tools.map(tool => (
          <button 
            key={tool.id}
            className={`tool-button ${selectedTool === tool.id ? 'selected' : ''}`}
            onClick={() => onToolSelect(tool.id)}
          >
            {tool.label}
          </button>
        ))}
        {selectedTool && (
          <button 
            className="clear-selection"
            onClick={() => onToolSelect(null)}
          >
            Clear Selection
          </button>
        )}
      </div>
    </div>
  );
};

export default ToolBar;