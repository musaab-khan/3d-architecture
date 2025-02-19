// 'use client'
// import React, { useRef, useEffect } from 'react';
// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// const Viewport3D = ({ objects }) => {
//   const mountRef = useRef(null);
//   const sceneRef = useRef(null);
//   const rendererRef = useRef(null);
//   const cameraRef = useRef(null);
//   const controlsRef = useRef(null);
//   const objectsRef = useRef({});

//   // Create text texture function
//   const createTextTexture = (text) => {
//     const canvas = document.createElement('canvas');
//     const context = canvas.getContext('2d');
//     canvas.width = 512;
//     canvas.height = 512;

//     // Fill background with a color that provides contrast
//     context.fillStyle = '#73f0ef';
//     context.fillRect(0, 0, canvas.width, canvas.height);

//     // Adjust font settings
//     context.font = 'bold 72px Arial';
//     context.fillStyle = 'black';
//     context.textAlign = 'center';
//     context.textBaseline = 'middle';

//     // Add text with stroke for better readability
//     context.strokeStyle = 'white';
//     context.lineWidth = 6;
//     context.strokeText(text, canvas.width / 2, canvas.height / 2);
//     context.fillText(text, canvas.width / 2, canvas.height / 2);

//     // Create and return texture
//     const texture = new THREE.CanvasTexture(canvas);
//     return texture;
//   };

//   // Initialize 3D scene
//   useEffect(() => {
//     if (!mountRef.current) return;

//     // Initialize scene, camera, and renderer
//     const scene = new THREE.Scene();
//     scene.background = new THREE.Color(0xf0f0f0);
//     sceneRef.current = scene;

//     const camera = new THREE.PerspectiveCamera(
//       75,
//       mountRef.current.clientWidth / mountRef.current.clientHeight,
//       0.1,
//       1000
//     );
//     camera.position.set(150, 150, 150);
//     camera.lookAt(0, 0, 0);
//     cameraRef.current = camera;

//     const renderer = new THREE.WebGLRenderer({ antialias: true });
//     renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
//     rendererRef.current = renderer;
//     mountRef.current.appendChild(renderer.domElement);

//     // Add controls
//     const controls = new OrbitControls(camera, renderer.domElement);
//     controlsRef.current = controls;

//     // Add grid helper
//     // const gridHelper = new THREE.GridHelper(200, 20);
//     // scene.add(gridHelper);

//     // Add ambient light
//     const ambientLight = new THREE.AmbientLight(0x404040);
//     scene.add(ambientLight);

//     // Add directional light
//     const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
//     directionalLight.position.set(1, 1, 1);
//     scene.add(directionalLight);

//     // Animation loop
//     const animate = () => {
//       requestAnimationFrame(animate);
//       controls.update();
//       renderer.render(scene, camera);
//     };
//     animate();

//     // Cleanup
//     return () => {
//       if (mountRef.current) {
//         mountRef.current.removeChild(renderer.domElement);
//       }
//       renderer.dispose();
//     };
//   }, []);

//   // Handle window resize
//   useEffect(() => {
//     const handleResize = () => {
//       if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;

//       const width = mountRef.current.clientWidth;
//       const height = mountRef.current.clientHeight;

//       cameraRef.current.aspect = width / height;
//       cameraRef.current.updateProjectionMatrix();
//       rendererRef.current.setSize(width, height);
//     };

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // Update 3D objects when objects state changes
//   useEffect(() => {
//     if (!sceneRef.current) return;

//     const scene = sceneRef.current;
//     const objectsMap = objectsRef.current;

//     // Remove objects that are no longer in the state
//     const currentIds = new Set(objects.map(obj => obj.id));
//     Object.keys(objectsMap).forEach(id => {
//       if (!currentIds.has(id)) {
//         // Remove all parts of the object (mesh and label)
//         if (objectsMap[id].group) {
//           scene.remove(objectsMap[id].group);
//         } else {
//           scene.remove(objectsMap[id]);
//         }
//         delete objectsMap[id];
//       }
//     });

//     // Add or update objects
//     objects.forEach(object => {      
//       // If object already exists in 3D scene, update its position
//       if (objectsMap[object.id]) {
//         if (objectsMap[object.id].group) {
//           objectsMap[object.id].group.position.x = object.x;
//           objectsMap[object.id].group.position.z = object.y;
//         } else {
//           objectsMap[object.id].position.x = object.x;
//           objectsMap[object.id].position.z = object.y;
//         }
//         return;
//       }

//       // Create text texture
//       const textTexture = createTextTexture(object.name);
//       const textMaterial = new THREE.MeshBasicMaterial({
//         map: textTexture,
//         transparent: true,
//         opacity: 0.9,
//         side: THREE.DoubleSide
//       });

//       // Create new 3D object based on type
//       let mesh;
//       let geometry;
//       const material = new THREE.MeshStandardMaterial({
//         color: 0x4444ff,
//         transparent: true,
//         opacity: 1,
//       });

//       // Create a group to hold both the object and its label
//       const group = new THREE.Group();
//       group.name = object.id;

//       switch (object.type) {
//         case 'ball':
//           geometry = new THREE.SphereGeometry(object.width / 2);
//           mesh = new THREE.Mesh(geometry, material);
          
//           // Add label above sphere
//           const labelPlane = new THREE.PlaneGeometry(object.width, object.width / 2);
//           const label = new THREE.Mesh(labelPlane, textMaterial);
//           label.position.y = object.width / 2 + 10;
//           label.rotation.x = -Math.PI / 2; // Rotate to face up
          
//           group.add(mesh);
//           group.add(label);
//           break;
          
//         case 'wall':
//           geometry = new THREE.BoxGeometry(object.width, object.height, object.depth);
//           mesh = new THREE.Mesh(geometry, material);
          
//           // Add label on top of the wall
//           const wallLabel = new THREE.PlaneGeometry(object.width, object.depth);
//           const wallLabelMesh = new THREE.Mesh(wallLabel, textMaterial);
//           wallLabelMesh.position.y = object.height / 2 + 1;
//           wallLabelMesh.rotation.x = -Math.PI / 2; // Rotate to face up
          
//           group.add(mesh);
//           group.add(wallLabelMesh);
//           break;
          
//         case 'pyramid':
//           geometry = new THREE.ConeGeometry(object.width / 2, object.height, 4);
//           mesh = new THREE.Mesh(geometry, material);
          
//           // Add label above pyramid
//           const pyramidLabel = new THREE.PlaneGeometry(object.width, object.width / 2);
//           const pyramidLabelMesh = new THREE.Mesh(pyramidLabel, textMaterial);
//           pyramidLabelMesh.position.y = object.height / 2 + 10;
//           pyramidLabelMesh.rotation.x = -Math.PI / 2; // Rotate to face up
          
//           group.add(mesh);
//           group.add(pyramidLabelMesh);
//           break;
          
//         default:
//           geometry = new THREE.BoxGeometry(object.width, object.depth, object.height);
//           mesh = new THREE.Mesh(geometry, material);
          
//           const defaultLabel = new THREE.PlaneGeometry(object.width, object.height / 2);
//           const defaultLabelMesh = new THREE.Mesh(defaultLabel, textMaterial);
//           defaultLabelMesh.position.y = object.depth / 2 + 5;
//           defaultLabelMesh.rotation.x = -Math.PI / 2; // Rotate to face up
          
//           group.add(mesh);
//           group.add(defaultLabelMesh);
//           break;
//       }

//       // Position group at 2D coordinates (x,y) → 3D (x,0,z)
//       group.position.set(object.x, 0, object.y);
      
//       // Add to scene and tracking map
//       scene.add(group);
//       objectsMap[object.id] = { group, mesh };
//     });
//   }, [objects]);

//   return (
//     <div className="viewport-container">
//       <h2>3D Viewport</h2>
//       <div 
//         ref={mountRef} 
//         style={{ 
//           width: '500px', 
//           height: '500px',
//           border: '1px solid black'
//         }}
//       ></div>
//     </div>
//   );
// };

// export default Viewport3D;

'use client'
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Viewport3D = ({ objects }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const objectsRef = useRef({});

  const createTextTexture = (text) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 512;
    
    context.fillStyle = '#73f0ef';
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

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;
    // const gridHelper = new THREE.GridHelper(200, 20);
    // scene.add(gridHelper);
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
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    //  controls.enableDamping = true;
    // zoom controls disabled
  controls.enableZoom=false;
    controlsRef.current = controls;

    const ambientLight = new THREE.AmbientLight(0xffffff,0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;
    const objectsMap = objectsRef.current;

    const currentIds = new Set(objects.map(obj => obj.id));
    Object.keys(objectsMap).forEach(id => {
      if (!currentIds.has(id)) {
        scene.remove(objectsMap[id]);
        delete objectsMap[id];
      }
    });

    objects.forEach(object => {
      if (objectsMap[object.id]) {
        objectsMap[object.id].position.set(object.x-250, 0, object.y-250);
        return;
      }

      const texture = createTextTexture(object.name);
      let geometry, material, mesh;
      material = new THREE.MeshStandardMaterial({ map: texture, color: 0x73f0ec });
      
      switch (object.type) {
        case 'wall':
          geometry = new THREE.BoxGeometry(object.width, object.height, object.depth);
          break;
        case 'ball':
          geometry = new THREE.SphereGeometry(object.width / 2, 32, 32);
        //   material = new THREE.MeshStandardMaterial({ color: 0x73f0ec });
          break;
        case 'pyramid':
          geometry = new THREE.ConeGeometry(object.width / 2, object.height, 4);
        //   material = new THREE.MeshStandardMaterial({ color: 0x73f0ec });
          break;
        default:
          return;
      }

      mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(object.x-250, object.height / 2, object.y-250);
      scene.add(mesh);
      objectsMap[object.id] = mesh;
    });
  }, [objects]);

  return (
    <div className="viewport-container">
      <h2>3D Viewport</h2>
      <div 
        ref={mountRef} 
        style={{ width: '500px', height: '500px', border: '1px solid black' }}
      ></div>
    </div>
  );
};

export default Viewport3D;
