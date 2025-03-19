// import React, { useRef, useEffect, useState } from 'react';
// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// const Viewport3D = ({ objects }) => {
//   const [isFullScreen, setIsFullScreen] = useState(false);
//   const mountRef = useRef(null);
//   const sceneRef = useRef(null);
//   const rendererRef = useRef(null);
//   const cameraRef = useRef(null);
//   const controlsRef = useRef(null);
//   const objectsRef = useRef({});
//   const textureLoaderRef = useRef(new THREE.TextureLoader());
//   const animationFrameIdRef = useRef(null);

//   const createTextTexture = (text) => {
//     const canvas = document.createElement('canvas');
//     const context = canvas.getContext('2d');
//     canvas.width = 512;
//     canvas.height = 512;

//     context.fillStyle = '#FFFFFFff';
//     context.fillRect(0, 0, canvas.width, canvas.height);

//     context.font = 'bold 72px Arial';
//     context.fillStyle = 'black';
//     context.textAlign = 'center';
//     context.textBaseline = 'middle';
//     context.strokeStyle = 'white';
//     context.lineWidth = 6;
//     context.strokeText(text, canvas.width / 2, canvas.height / 2);
//     context.fillText(text, canvas.width / 2, canvas.height / 2);

//     return new THREE.CanvasTexture(canvas);
//   };

//   const createMaterial = async (object) => {
//     const material = new THREE.MeshStandardMaterial({
//       map: createTextTexture(object.name),
//       color: new THREE.Color(object.color)
//     });

//     if (object.textureUrl) {
//       try {
//         const texture = await new Promise((resolve, reject) => {
//           textureLoaderRef.current.load(
//             object.textureUrl,
//             resolve,
//             undefined,
//             reject
//           );
//         });

//         texture.wrapS = THREE.RepeatWrapping;
//         texture.wrapT = THREE.RepeatWrapping;
//         texture.repeat.set(object.textureRepeat || 1, object.textureRepeat || 1);

//         material.map = texture;
//         material.color.set(0xFFFFFF);
//         material.needsUpdate = true;
//       } catch (error) {
//         console.error('Error loading texture:', error);
//       }
//     }

//     return material;
//   };

//   const createGeometry = (object) => {
//     switch (object.type) {
//       case 'wall':
//       case 'box':
//         return new THREE.BoxGeometry(object.width, object.height, object.depth);
//       case 'ball':
//         return new THREE.SphereGeometry(object.width / 2, 32, 32);
//       case 'pyramid':
//         return new THREE.ConeGeometry(object.width / 2, object.height, 4);
//       default:
//         return null;
//     }
//   };

//   // Function to handle resize
//   const handleResize = () => {
//     if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;

//     const width = isFullScreen ? window.innerWidth : 500;
//     const height = isFullScreen ? window.innerHeight : 500;

//     // Update camera aspect ratio
//     cameraRef.current.aspect = width / height;
//     cameraRef.current.updateProjectionMatrix();

//     // Resize renderer
//     rendererRef.current.setSize(width, height);
//   };

//   const handleFullScreen = () => {
//     setIsFullScreen(prev => !prev);
//   };

//   useEffect(() => {
//     // This effect runs when isFullScreen changes
//     handleResize();
//   }, [isFullScreen]);

//   // Setup THREE.js scene - this should only run once
//   useEffect(() => {
//     // Only initialize if we haven't already
//     if (rendererRef.current || !mountRef.current) return;
    
//     console.log('Initializing THREE.js scene');

//     const scene = new THREE.Scene();
//     scene.background = new THREE.Color(0xf0f0f0);
//     sceneRef.current = scene;

//     const camera = new THREE.PerspectiveCamera(
//       75,
//       mountRef.current.clientWidth / mountRef.current.clientHeight,
//       0.1,
//       1000
//     );
//     camera.position.z = 5;
//     camera.position.y = 2;
//     cameraRef.current = camera;

//     const renderer = new THREE.WebGLRenderer({ antialias: true });
//     renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
//     rendererRef.current = renderer;
    
//     // Check if mountRef element already has a canvas child
//     if (mountRef.current.querySelector('canvas')) {
//       console.warn('Canvas already exists in mount ref, cleaning up first');
//       mountRef.current.innerHTML = '';
//     }
    
//     mountRef.current.appendChild(renderer.domElement);

//     const controls = new OrbitControls(camera, renderer.domElement);
//     controls.enableDamping = true;
//     controlsRef.current = controls;

//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
//     scene.add(ambientLight);

//     const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
//     directionalLight.position.set(1, 1, 1);
//     scene.add(directionalLight);

//     // Add window resize listener
//     window.addEventListener('resize', handleResize);

//     const animate = () => {
//       animationFrameIdRef.current = requestAnimationFrame(animate);
//       controls.update();
//       renderer.render(scene, camera);
//     };
//     animate();

//     return () => {
//       console.log('Cleaning up THREE.js');
//       window.removeEventListener('resize', handleResize);
      
//       // Cancel animation frame
//       if (animationFrameIdRef.current) {
//         cancelAnimationFrame(animationFrameIdRef.current);
//         animationFrameIdRef.current = null;
//       }
      
//       // Clean up scene objects
//       if (sceneRef.current) {
//         sceneRef.current.traverse((object) => {
//           if (object.geometry) object.geometry.dispose();
//           if (object.material) {
//             if (object.material.map) object.material.map.dispose();
//             object.material.dispose();
//           }
//         });
//       }
      
//       // Clean up renderer
//       if (rendererRef.current) {
//         rendererRef.current.dispose();
//         rendererRef.current = null;
//       }
      
//       // Clean up controls
//       if (controlsRef.current) {
//         controlsRef.current.dispose();
//         controlsRef.current = null;
//       }
      
//       // Clear mount element
//       if (mountRef.current) {
//         mountRef.current.innerHTML = '';
//       }
      
//       // Reset all refs
//       sceneRef.current = null;
//       cameraRef.current = null;
//       objectsRef.current = {};
//     };
//   }, []);

//   // Update objects
//   useEffect(() => {
//     if (!sceneRef.current) return;
    
//     const scene = sceneRef.current;
//     const objectsMap = objectsRef.current;

//     const currentIds = new Set(objects.map(obj => obj.id));
//     Object.keys(objectsMap).forEach(id => {
//       if (!currentIds.has(id)) {
//         const mesh = objectsMap[id];
//         if (mesh.material.map) {
//           mesh.material.map.dispose();
//         }
//         mesh.material.dispose();
//         mesh.geometry.dispose();
//         scene.remove(mesh);
//         delete objectsMap[id];
//       }
//     });

//     objects.forEach(async (object) => {
//       const updateExistingMesh = async (mesh) => {
//         // Check if dimensions have changed
//         const currentGeometry = mesh.geometry;
//         const needsNewGeometry = (
//           (object.type === 'wall' || object.type === 'box') && (
//             currentGeometry.parameters.width !== object.width ||
//             currentGeometry.parameters.height !== object.height ||
//             currentGeometry.parameters.depth !== object.depth
//           ) ||
//           (object.type === 'ball' && currentGeometry.parameters.radius !== object.width / 2) ||
//           (object.type === 'pyramid' && (
//             currentGeometry.parameters.radius !== object.width / 2 ||
//             currentGeometry.parameters.height !== object.height
//           ))
//         );

//         // Update geometry if dimensions changed
//         if (needsNewGeometry) {
//           const newGeometry = createGeometry(object);
//           mesh.geometry.dispose();
//           mesh.geometry = newGeometry;
//         }

//         // Update material (includes texture updates)
//         if (mesh.material) {
//           if (mesh.material.map) {
//             mesh.material.map.dispose();
//           }
//           mesh.material.dispose();
//         }
//         mesh.material = await createMaterial(object);

//         // Update position and rotation
//         mesh.position.set(
//           object.x - 250,
//           object.z + object.height / 2,
//           object.y - 250
//         );
//         mesh.rotation.set(
//           object.rotateX * Math.PI / 180,
//           object.rotateY * Math.PI / 180,
//           object.rotateZ * Math.PI / 180
//         );
//       };

//       const createNewMesh = async () => {
//         const geometry = createGeometry(object);
//         if (!geometry) return;

//         const material = await createMaterial(object);
//         const mesh = new THREE.Mesh(geometry, material);

//         mesh.position.set(
//           object.x - 250,
//           object.z + object.height / 2,
//           object.y - 250
//         );
//         mesh.rotation.set(
//           object.rotateX * Math.PI / 180,
//           object.rotateY * Math.PI / 180,
//           object.rotateZ * Math.PI / 180
//         );

//         scene.add(mesh);
//         objectsMap[object.id] = mesh;
//       };

//       if (objectsMap[object.id]) {
//         await updateExistingMesh(objectsMap[object.id]);
//       } else {
//         await createNewMesh();
//       }
//     });
//   }, [objects]);

//   return (
//     <div className="flex flex-col relative">
//       <h2>3D Viewport</h2>
//       <button
//         onClick={handleFullScreen}
//         className="absolute top-0 right-0 z-10 bg-white border border-gray-300 rounded"
//       >
//         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//           <path d="M5 5H9V3H3V9H5V5Z" strokeWidth={0.5} stroke='black' fill='white' />
//           <path d="M19 5V9H21V3H15V5H19Z" strokeWidth={0.5} stroke='black' fill='white' />
//           <path d="M9 19H5V15H3V21H9V19Z" strokeWidth={0.5} stroke='black' fill='white' />
//           <path d="M15 19V21H21V15H19V19H15Z" strokeWidth={0.5} stroke='black' fill='white' />
//         </svg>
//       </button>
//       <div
//         ref={mountRef}
//         className={isFullScreen ? "fixed top-0 left-0 w-screen h-screen z-50" : ""}
//         style={{
//           width: isFullScreen ? '100vw' : '501px',
//           height: isFullScreen ? '100vh' : '501px',
//           border: '1px solid black'
//         }}
//       ></div>
//       {isFullScreen && (
//         <button
//           onClick={handleFullScreen}
//           className="fixed top-4 right-4 z-50 bg-white border border-gray-300 rounded"
//         >
//           <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//             <path d="M5 5H9V3H3V9H5V5Z" strokeWidth={0.5} stroke='black' fill='white' />
//             <path d="M19 5V9H21V3H15V5H19Z" strokeWidth={0.5} stroke='black' fill='white' />
//             <path d="M9 19H5V15H3V21H9V19Z" strokeWidth={0.5} stroke='black' fill='white' />
//             <path d="M15 19V21H21V15H19V19H15Z" strokeWidth={0.5} stroke='black' fill='white' />
//           </svg>
//         </button>
//       )}
//     </div>
//   );
// };

// export default Viewport3D;

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';

const Viewport3D = ({ objects }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const objectsRef = useRef({});
  const textureLoaderRef = useRef(new THREE.TextureLoader());
  const animationFrameIdRef = useRef(null);

  // Export scene as GLB function
  const exportSceneAsGLB = (filename = 'scene.glb') => {
    if (!sceneRef.current) {
      console.error('No scene to export');
      return;
    }
    
    // Create GLTFExporter instance
    const exporter = new GLTFExporter();
    
    // Configure export options
    const options = {
      binary: true, // Export as binary GLB (instead of JSON-based GLTF)
      includeCustomExtensions: true,
      trs: false, // Use matrix transforms instead of TRS
      onlyVisible: true, // Only export visible objects
      truncateDrawRange: true,
      animations: [], // No animations in this example
      forceIndices: false
    };
    
    // Start the export process
    exporter.parse(
      sceneRef.current,
      (buffer) => {
        // Create a Blob from the buffer
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        
        // Create a download URL for the Blob
        const url = URL.createObjectURL(blob);
        
        // Create a temporary link element for downloading
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        
        // Append to the document, click, and remove
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('An error occurred during GLB export:', error);
      },
      options
    );
  };

  const createTextTexture = (text) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 512;

    context.fillStyle = '#FFFFFFff';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.font = 'bold 72px Arial';
    context.fillStyle = 'black';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.strokeStyle = 'white';
    context.lineWidth = 6;
    context.strokeText(text, canvas.width / 2, canvas.height / 2);
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    return new THREE.CanvasTexture(canvas);
  };

  const createMaterial = async (object) => {
    const material = new THREE.MeshStandardMaterial({
      map: createTextTexture(object.name),
      color: new THREE.Color(object.color)
    });

    if (object.textureUrl) {
      try {
        const texture = await new Promise((resolve, reject) => {
          textureLoaderRef.current.load(
            object.textureUrl,
            resolve,
            undefined,
            reject
          );
        });

        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(object.textureRepeat || 1, object.textureRepeat || 1);

        material.map = texture;
        material.color.set(0xFFFFFF);
        material.needsUpdate = true;
      } catch (error) {
        console.error('Error loading texture:', error);
      }
    }

    return material;
  };

  const createGeometry = (object) => {
    switch (object.type) {
      case 'wall':
      case 'box':
        return new THREE.BoxGeometry(object.width, object.height, object.depth);
      case 'ball':
        return new THREE.SphereGeometry(object.width / 2, 32, 32);
      case 'pyramid':
        return new THREE.ConeGeometry(object.width / 2, object.height, 4);
      default:
        return null;
    }
  };

  // Function to handle resize
  const handleResize = () => {
    if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;

    const width = isFullScreen ? window.innerWidth : 500;
    const height = isFullScreen ? window.innerHeight : 500;

    // Update camera aspect ratio
    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();

    // Resize renderer
    rendererRef.current.setSize(width, height);
  };

  const handleFullScreen = () => {
    setIsFullScreen(prev => !prev);
  };

  useEffect(() => {
    // This effect runs when isFullScreen changes
    handleResize();
  }, [isFullScreen]);

  // Setup THREE.js scene - this should only run once
  useEffect(() => {
    // Only initialize if we haven't already
    if (rendererRef.current || !mountRef.current) return;
    
    console.log('Initializing THREE.js scene');

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    camera.position.y = 2;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    rendererRef.current = renderer;
    
    // Check if mountRef element already has a canvas child
    if (mountRef.current.querySelector('canvas')) {
      console.warn('Canvas already exists in mount ref, cleaning up first');
      mountRef.current.innerHTML = '';
    }
    
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controlsRef.current = controls;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Add window resize listener
    window.addEventListener('resize', handleResize);

    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      console.log('Cleaning up THREE.js');
      window.removeEventListener('resize', handleResize);
      
      // Cancel animation frame
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
      
      // Clean up scene objects
      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (object.material.map) object.material.map.dispose();
            object.material.dispose();
          }
        });
      }
      
      // Clean up renderer
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current = null;
      }
      
      // Clean up controls
      if (controlsRef.current) {
        controlsRef.current.dispose();
        controlsRef.current = null;
      }
      
      // Clear mount element
      if (mountRef.current) {
        mountRef.current.innerHTML = '';
      }
      
      // Reset all refs
      sceneRef.current = null;
      cameraRef.current = null;
      objectsRef.current = {};
    };
  }, []);

  // Update objects
  useEffect(() => {
    if (!sceneRef.current) return;
    
    const scene = sceneRef.current;
    const objectsMap = objectsRef.current;

    const currentIds = new Set(objects.map(obj => obj.id));
    Object.keys(objectsMap).forEach(id => {
      if (!currentIds.has(id)) {
        const mesh = objectsMap[id];
        if (mesh.material.map) {
          mesh.material.map.dispose();
        }
        mesh.material.dispose();
        mesh.geometry.dispose();
        scene.remove(mesh);
        delete objectsMap[id];
      }
    });

    objects.forEach(async (object) => {
      const updateExistingMesh = async (mesh) => {
        // Check if dimensions have changed
        const currentGeometry = mesh.geometry;
        const needsNewGeometry = (
          (object.type === 'wall' || object.type === 'box') && (
            currentGeometry.parameters.width !== object.width ||
            currentGeometry.parameters.height !== object.height ||
            currentGeometry.parameters.depth !== object.depth
          ) ||
          (object.type === 'ball' && currentGeometry.parameters.radius !== object.width / 2) ||
          (object.type === 'pyramid' && (
            currentGeometry.parameters.radius !== object.width / 2 ||
            currentGeometry.parameters.height !== object.height
          ))
        );

        // Update geometry if dimensions changed
        if (needsNewGeometry) {
          const newGeometry = createGeometry(object);
          mesh.geometry.dispose();
          mesh.geometry = newGeometry;
        }

        // Update material (includes texture updates)
        if (mesh.material) {
          if (mesh.material.map) {
            mesh.material.map.dispose();
          }
          mesh.material.dispose();
        }
        mesh.material = await createMaterial(object);

        // Update position and rotation
        mesh.position.set(
          object.x - 250,
          object.z + object.height / 2,
          object.y - 250
        );
        mesh.rotation.set(
          object.rotateX * Math.PI / 180,
          object.rotateY * Math.PI / 180,
          object.rotateZ * Math.PI / 180
        );
      };

      const createNewMesh = async () => {
        const geometry = createGeometry(object);
        if (!geometry) return;

        const material = await createMaterial(object);
        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.set(
          object.x - 250,
          object.z + object.height / 2,
          object.y - 250
        );
        mesh.rotation.set(
          object.rotateX * Math.PI / 180,
          object.rotateY * Math.PI / 180,
          object.rotateZ * Math.PI / 180
        );

        scene.add(mesh);
        objectsMap[object.id] = mesh;
      };

      if (objectsMap[object.id]) {
        await updateExistingMesh(objectsMap[object.id]);
      } else {
        await createNewMesh();
      }
    });
  }, [objects]);

  return (
    <div className="flex flex-col relative">
      <h2 className='m-1 text-xl text-white'>3D Viewport</h2>
      <div className="flex gap-2 mb-2 absolute top-0 right-0">
        <button
          onClick={() => exportSceneAsGLB('scene.glb')}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600" style={{display:'none'}}
        >
          Export as GLB
        </button>
        <button
          onClick={handleFullScreen}
          className=" z-10  border-2 rounded-md mt-1"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 5H9V3H3V9H5V5Z" strokeWidth={0.5} stroke='black' fill='white' />
            <path d="M19 5V9H21V3H15V5H19Z" strokeWidth={0.5} stroke='black' fill='white' />
            <path d="M9 19H5V15H3V21H9V19Z" strokeWidth={0.5} stroke='black' fill='white' />
            <path d="M15 19V21H21V15H19V19H15Z" strokeWidth={0.5} stroke='black' fill='white' />
          </svg>
        </button>
      </div>
      <div
        ref={mountRef}
        className={isFullScreen ? "fixed top-0 left-0 w-screen h-screen z-50" : "shadow-md shadow-slate-600"}
        style={{
          width: isFullScreen ? '100vw' : '501px',
          height: isFullScreen ? '100vh' : '501px',
          // border: '2px solid white'
        }}
      ></div>
      {isFullScreen && (
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <button style={{display:'none'}}
            onClick={() => exportSceneAsGLB('scene.glb')}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Export as GLB
          </button>
          <button
            onClick={handleFullScreen}
            className="bg-white border border-gray-300 rounded"
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 5H9V3H3V9H5V5Z" strokeWidth={0.5} stroke='black' fill='white' />
              <path d="M19 5V9H21V3H15V5H19Z" strokeWidth={0.5} stroke='black' fill='white' />
              <path d="M9 19H5V15H3V21H9V19Z" strokeWidth={0.5} stroke='black' fill='white' />
              <path d="M15 19V21H21V15H19V19H15Z" strokeWidth={0.5} stroke='black' fill='white' />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default Viewport3D;