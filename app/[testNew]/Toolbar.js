import React from 'react';

const ToolBar = ({ selectedTool, onToolSelect }) => {
  const tools = [
    { id: 'ball', label: 'Ball', shape: <div className='w-5 h-5 rounded-full border border-black'></div> },
    { id: 'wall', label: 'Wall', shape: <div className='w-5 h-[1px] rounded-full border border-black'></div> },
    { id: 'box', label: 'Box', shape: <div className='w-5 h-5 border border-black'></div> },
    // { id: 'pyramid', label: 'Pyramid' }
  ];

  return (
    <div className="toolbar shadow-md shadow-black">
      <h3>Tools</h3>
      <div className="tool-buttons">
        {tools.map(tool => (
          <button 
            key={tool.id}
            className={`tool-button shadow-sm shadow-gray-950 ${selectedTool === tool.id ? 'selected shadow-green-950' : ''}`}
            onClick={() => onToolSelect(tool.id)}
          >
            {tool.shape || tool.label}
            {/* <div className='w-5 h-5 rounded-full border border-black'></div> */}
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