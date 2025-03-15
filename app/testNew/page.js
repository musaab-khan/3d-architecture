// 'use client'
// import React, { useState } from 'react';
// import ToolBar from './Toolbar';
// import Canvas2D from './Canvas2D';
// import Viewport3D from './Viewport3D';
// import ObjectDialog from './ObjectDialog';
// import ObjectsList from './ObjectsList';
// import ObjectPropertiesEditor from './ObjectPropertiesEditor';
// import './App.css';

// const App = () => {
//   const [selectedTool, setSelectedTool] = useState(null);
//   const [objectDetailsOpen, setObjectDetailsOpen] = useState(false);
//   const [objects, setObjects] = useState([]);
//   const [selectedObject, setSelectedObject] = useState(null);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });

//   const handleToolSelect = (tool) => {
//     setSelectedTool(tool);
//   };

//   const handleAddObject = (position) => {
//     setInitialPosition(position);
//     setIsDialogOpen(true);
//   };

//   const handleObjectCreate = (newObject) => {
//     setObjects([...objects, newObject]);
//     setIsDialogOpen(false);
//   };

//   const handleDialogClose = () => {
//     setIsDialogOpen(false);
//   };

//   return (
//     <div className="app-container">
//       <header className="app-header">
//         <h1>2D-to-3D Object Creator</h1>
//       </header>

//       <ToolBar 
//         selectedTool={selectedTool} 
//         onToolSelect={handleToolSelect} 
//       />

//       <div className="viewport-container justify-evenly">
//         <Canvas2D 
//           objects={objects}
//           setObjects={setObjects}
//           selectedTool={selectedTool}
//           onAddObject={handleAddObject}
//           selectedObject={selectedObject}
//           setSelectedObject={setSelectedObject}
//         />

//         <Viewport3D objects={objects} />
//       </div>
//       <ObjectsList objects={objects} selectedObject={selectedObject} setSelectedObject={setSelectedObject}></ObjectsList>
//       {isDialogOpen && (
//         <ObjectDialog 
//           selectedTool={selectedTool} 
//           setSelectedTool={setSelectedTool} 
//           initialPosition={initialPosition} 
//           onSubmit={handleObjectCreate}
//           onClose={handleDialogClose} 
//         />
//       )}
//       {(selectedObject&&!objectDetailsOpen) && (
//         <button className='fixed top-[50%] right-0 px-1 py-4 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-l-md shadow-md z-50' onClick={() => setObjectDetailsOpen(!objectDetailsOpen)}>
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-180" viewBox="0 0 20 20" fill="currentColor">
//             <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
//           </svg>
//         </button>
//       )}
//       {(selectedObject&&objectDetailsOpen) && (
//         <div className="selected-object-info fixed top-0 right-0 p-4 bg-white shadow-md w-[30vw] h-[100vh] overflow-y-auto z-50">
//             <div className="flex justify-between items-center">
//               <p>Selected: {selectedObject.name} at ({Math.round(selectedObject.x)}, {Math.round(selectedObject.y)})</p>
//               <button className='p-1 mr-1 text-slate-500 rounded-md' onClick={() => {setObjectDetailsOpen(!objectDetailsOpen);}}>
//                   &#10006;
//               </button>
//             </div>
//           <ObjectPropertiesEditor selectedObject={selectedObject} setObjects={setObjects} setSelected={setSelectedObject} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default App;


'use client'
import React, { useState, useEffect } from 'react';
import MoonLoader from "react-spinners/MoonLoader";
// import { useSearchParams } from 'next/navigation';
import ToolBar from './Toolbar';
import Canvas2D from './Canvas2D';
import Viewport3D from './Viewport3D';
import ObjectDialog from './ObjectDialog';
import ObjectsList from './ObjectsList';
import ObjectPropertiesEditor from './ObjectPropertiesEditor';
import './App.css';

const App = () => {
  // const router = useRouter();
  // const searchParams = useSearchParams();

  const [selectedTool, setSelectedTool] = useState(null);
  const [objectDetailsOpen, setObjectDetailsOpen] = useState(false);
  const [objects, setObjects] = useState([]);
  const [selectedObject, setSelectedObject] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
  // const [projectName, setProjectName] = useState('Untitled Project');
  // const [dimensions, setDimensions] = useState([800, 600]);
  // const [isLoading, setIsLoading] = useState(true);
  const isLoading = False;

  // Extract projectId from URL on component mount
  useEffect(() => {
    loadProjectData();
  }, []);

  // const loadProjectData = async () => {
  //   setIsLoading(true);
  //   try {
  //     const projectId = searchParams.get('projectID');

  //     if (!projectId) {
  //       setIsLoading(false);
  //       return; // No project to load
  //     }

  //     // Get token from local storage
  //     const token = localStorage.getItem('token');

  //     if (!token) {
  //       console.error('No authentication token found');
  //       setIsLoading(false);
  //       return;
  //     }

  //     const apiUrl = `${process.env.NEXT_PUBLIC_API_ENDPOINT}project/get-model-json/${projectId}`;

  //     const response = await fetch(apiUrl);

  //     if (!response.ok) {
  //       throw new Error(`Failed to load project: ${response.status}`);
  //     }

  //     const responseData = await response.json();

  //     // The actual project data is nested inside a "model" property
  //     const projectData = responseData.model;

  //     if (!projectData) {
  //       console.error('No model data found in response');
  //       setIsLoading(false);
  //       return;
  //     }

  //     // Update state with project data
  //     setProjectName(projectData.name || 'Untitled Project');
  //     setDimensions(projectData.dimensions || [800, 600]);

  //     // Parse modelJSON into objects array
  //     if (projectData.modelJSON) {
  //       const parsedObjects = JSON.parse(projectData.modelJSON);
  //       setObjects(parsedObjects);
  //     } else {
  //       // console.error('modelJSON is missing in model data');
  //       setObjects([]);
  //     }
  //   } catch (error) {
  //     console.error('Error loading project:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const saveProject = async () => {
  //   try {
  //     const projectId = searchParams.get('projectID');

  //     if (!projectId) {
  //       console.error('No project ID found');
  //       return;
  //     }

  //     // Get token from local storage
  //     const token = localStorage.getItem('token');

  //     if (!token) {
  //       console.error('No authentication token found');
  //       return;
  //     }

  //     // Convert objects array to JSON string
  //     const modelJSON = JSON.stringify(objects);

  //     const response = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + 'idk/update-model-json', {
  //       method: 'POST',
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({
  //         projectID: projectId,
  //         modelJSON: modelJSON
  //       })
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to save project');
  //     }

  //     alert('Project saved successfully!');

  //   } catch (error) {
  //     console.error('Error saving project:', error);
  //     alert('Failed to save project. Please try again.');
  //   }
  // };

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

  if (isLoading) {
    return (
      <div className='fixed top-[50%] left-[50%]'>
        <MoonLoader />
      </div>)
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="flex justify-between items-center w-full">
          <h1>2D-to-3D Object Creator</h1>
          {/* <div className="project-controls flex gap-4">
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="px-2 py-1 border rounded"
              placeholder="Project Name"
            />
            <button
              onClick={saveProject}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded shadow-md"
            >
              Save Project
            </button>
            <button
              onClick={loadProjectData}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded shadow-md"
            >
              Reload Project
            </button>
          </div> */}
        </div>
      </header>

      <ToolBar
        selectedTool={selectedTool}
        onToolSelect={handleToolSelect}
      />

      <div className="viewport-container justify-evenly">
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
      {(selectedObject && !objectDetailsOpen) && (
        <button className='fixed top-[50%] right-0 px-1 py-4 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-l-md shadow-md z-50' onClick={() => setObjectDetailsOpen(!objectDetailsOpen)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-180" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      )}
      {(selectedObject && objectDetailsOpen) && (
        <div className="selected-object-info fixed top-0 right-0 p-4 bg-white shadow-md w-[30vw] h-[100vh] overflow-y-auto z-50">
          <div className="flex justify-between items-center">
            <p>Selected: {selectedObject.name} at ({Math.round(selectedObject.x)}, {Math.round(selectedObject.y)})</p>
            <button className='p-1 mr-1 text-slate-500 rounded-md' onClick={() => { setObjectDetailsOpen(!objectDetailsOpen); }}>
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