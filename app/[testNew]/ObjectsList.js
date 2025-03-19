// import React, { useState } from 'react'

// const SlideOutObjectsList = ({objects, selectedObject, setSelectedObject}) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const togglePanel = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <div className="fixed left-0 top-1/4 flex h-auto z-10">
//       {/* Tab button that's always visible */}
//       <div 
//         className={`bg-white p-4 shadow-lg transition-all duration-300 ease-in-out w-64 border border-gray-200 rounded-l-md ${
//           isOpen ? '-translate-x-full' : 'translate-x-0'
//         }`}
//       >
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="font-medium text-lg">Objects List</h3>
//           <button 
//             onClick={togglePanel}
//             className={`text-gray-500 hover:text-gray-700 ${isOpen ? 'translate-x-full' : 'translate-x-0'}`}>
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//             </svg>
//           </button>
//         </div>

//         <ul className="space-y-2">
//           {objects.map((obj) => (
//             <li 
//               key={obj.id} 
//               className={`cursor-pointer p-2 rounded hover:bg-gray-100 transition ${
//                 obj.id === selectedObject?.id ? 'font-bold bg-blue-50' : ''
//               }`}
//               onClick={() => setSelectedObject(obj)}
//             >
//               {obj.name}
//             </li>
//           ))}
//         </ul>
//       </div>
//       <button 
//         onClick={togglePanel}
//         className="bg-blue-500 text-white p-2 rounded-r-md transition-all ease-in-out shadow-md hover:bg-blue-600 flex items-center"
//       >
//         {isOpen ? (
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//             <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
//           </svg>
//         ) : (
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//             <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
//           </svg>
//         )}
//         {/* <span className={isOpen ? "hidden" : "ml-1"}>Objects</span> */}
//       </button>

//       {/* Slide-out panel */}

//     </div>
//   );
// }

// export default SlideOutObjectsList

import React, { useState } from 'react'

const SlideOutObjectsList = ({ objects, selectedObject, setSelectedObject }) => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed left-0 top-1/2 flex h-auto z-50">
      {/* Slide-out panel with relative positioning */}
      <div
        className={`absolute left-0 bg-white p-4 shadow-lg  transition-all duration-300 ease-in-out w-64 border border-gray-200 rounded-r-md ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-lg">Objects List</h3>
          <button
            onClick={togglePanel}
            className={`text-gray-500 hover:text-gray-700`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <ul className="space-y-2 max-h-[30vh] overflow-y-auto">
          {objects.map((obj) => (
            <li
              key={obj.id}
              className={`cursor-pointer p-2 rounded hover:bg-gray-100 transition ${obj.id === selectedObject?.id ? 'font-bold bg-blue-50' : ''
                }`}
              onClick={() => setSelectedObject(obj)}
            >
              {obj.name}
            </li>
          ))}
        </ul>
      </div>

      {!isOpen && <button
        onClick={togglePanel}
        className={`relative z-20 bg-blue-500 text-white px-1 py-4 rounded-r-md shadow-md active:bg-blue-600 flex items-center  ${isOpen ? "rounded-0" : ""}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </button>}
    </div>
  );
}

export default SlideOutObjectsList