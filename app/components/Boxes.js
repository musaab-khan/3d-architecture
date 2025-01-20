'use client';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import SelectedDetails from '../components/SelectedDetails'
import AssetsDisplay from '../components/AssetsDisplay'
// import { useRouter } from 'next/navigation';

export default function Home({canvasLength,canvasHeight, width, height, selection, planeLength, planeWidth,assets,selectedCategory,projectID,load}) {
  console.log(load)
  const [selectionAllowed,setSelectionAllowed]=useState(selection)
  useEffect(() => {
    setSelectionAllowed(!selection);
    console.log('useEffect',selectionAllowed)
      }, [selection]);
  
  const mountRef = useRef(null);
  const [selectedBox, setSelectedBox] = useState(null);
  const [boxDimensions, setBoxDimensions] = useState({ x: 1, y: 1, z: 1 });
  const [boxRotation, setBoxRotation] = useState({ x: 0, y: 0, z: 0 });
  const [planeSize, setPlaneSize] = useState(null);
  const [activeControl, setActiveControl] = useState(null);
  const [transformMode, setTransformMode] = useState(null);
  const sceneRef = useRef(null);
  const planeRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const boxesRef = useRef([]);
  const controlsGroupRef = useRef(null);
  const spritesGroupRef = useRef(null);
  const canvasRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const dragOffsetRef = useRef({ x: 0, z: 0 });
  const [selectedBoxProperties, setSelectedBoxProperties] = useState({
    width: 0,
    height: 0,
    depth: 0,
    elevation: 0,
    rotation: { rotX: 0, rotY: 0, rotZ: 0 },
    modelURL:''
  });

  const createModeSprites = (box) => {
    if (spritesGroupRef.current) {
      sceneRef.current.remove(spritesGroupRef.current);
    }

    const group = new THREE.Group();
    const spriteScale = 0.5;
    const offset = 1;

    // Create canvas for each sprite
    const createSpriteTexture = (text, color) => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const context = canvas.getContext('2d');
      
      // Draw circle background
      context.beginPath();
      context.arc(32, 32, 30, 0, 2 * Math.PI);
      context.fillStyle = color;
      context.fill();
      
      // Draw text
      context.font = 'bold 16px Arial';
      context.fillStyle = 'white';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(text, 32, 32);
      
      const texture = new THREE.CanvasTexture(canvas);
      return texture;
    };

    // Only create rotate and scale sprites
    const rotateSprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: createSpriteTexture('Rotate', '#2196F3') })
    );
    rotateSprite.position.set(-offset, offset, 0);
    rotateSprite.scale.set(spriteScale, spriteScale, spriteScale);
    rotateSprite.userData = { mode: 'rotate' };

    const scaleSprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: createSpriteTexture('Scale', '#F44336') })
    );
    scaleSprite.position.set(offset, offset, 0);
    scaleSprite.scale.set(spriteScale, spriteScale, spriteScale);
    scaleSprite.userData = { mode: 'scale' };

    const levitateSprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: createSpriteTexture('Levitate', '#4CAF50') })
    );
    levitateSprite.position.set(0, offset * 1.5, 0);
    levitateSprite.scale.set(spriteScale, spriteScale, spriteScale);
    levitateSprite.userData = { mode: 'levitate' };

    const deleteSprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: createSpriteTexture('Delete', '#FF0000') })
    );
    deleteSprite.position.set(0, offset * 2.2, 0);
    deleteSprite.scale.set(spriteScale, spriteScale, spriteScale);
    deleteSprite.userData = { mode: 'delete' };
    
    group.add(rotateSprite, scaleSprite, levitateSprite, deleteSprite);

    group.position.copy(box.position);
    
    sceneRef.current.add(group);
    spritesGroupRef.current = group;
  };

  const createArrow = (direction, color) => {
    const arrowGroup = new THREE.Group();
    
    // Create arrow line
    const lineGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1, 8);
    const lineMaterial = new THREE.MeshBasicMaterial({ color });
    const line = new THREE.Mesh(lineGeometry, lineMaterial);
    
    // Create arrow head
    const headGeometry = new THREE.ConeGeometry(0.05, 0.2, 8);
    const headMaterial = new THREE.MeshBasicMaterial({ color });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    
    head.position.y = 0.6;
    line.position.y = 0.3;
    
    arrowGroup.add(line);
    arrowGroup.add(head);
    
    if (direction === 'x') {
      arrowGroup.rotateZ(-Math.PI / 2);
    } else if (direction === 'z') {
      arrowGroup.rotateX(Math.PI / 2);
    }
    
    arrowGroup.userData = { type: 'translate', axis: direction };
    return arrowGroup;
  };

  const createRotationRing = (axis, color) => {
    const radius = 1.2;
    const tubeRadius = 0.02;
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(radius, tubeRadius, 8, 32, Math.PI * 2),
      new THREE.MeshBasicMaterial({ color })
    );
    
    if (axis === 'x') ring.rotation.y = Math.PI / 2;
    if (axis === 'y') ring.rotation.x = Math.PI / 2;
    
    ring.userData = { type: 'rotate', axis };
    return ring;
  };

  const createScaleHandle = (axis, color) => {
    const size = 0.1;
    const handle = new THREE.Mesh(
      new THREE.BoxGeometry(size, size, size),
      new THREE.MeshBasicMaterial({ color })
    );
    
    const position = 1.5;
    if (axis === 'x') handle.position.x = position;
    if (axis === 'y') handle.position.y = position;
    if (axis === 'z') handle.position.z = position;
    
    handle.userData = { type: 'scale', axis };
    return handle;
  };
  const createLevitationHandle = () => {
    const size = 0.1;
    const handle = new THREE.Mesh(
        new THREE.BoxGeometry(size, size, size),
        new THREE.MeshBasicMaterial({ color: 0x4CAF50 })
    );
    const position = 1.5;
    handle.position.y = position; // Correct position assignment

    handle.userData = { type: 'levitate', position }; // Use position instead of undefined y

    return handle;
};


  const createTransformControls = (box, mode) => {
    if (controlsGroupRef.current) {
      sceneRef.current.remove(controlsGroupRef.current);
    }

    const group = new THREE.Group();
    
    switch (mode) {
      case 'move':
        group.add(
          createArrow('x', 0xff0000),
          createArrow('y', 0x00ff00),
          createArrow('z', 0x0000ff)
        );
        break;
      case 'rotate':
        group.add(
          createRotationRing('x', 0xff0000),
          createRotationRing('y', 0x00ff00),
          createRotationRing('z', 0x0000ff)
        );
        break;
      case 'scale':
        group.add(
          createScaleHandle('x', 0xff0000),
          createScaleHandle('y', 0x00ff00),
          createScaleHandle('z', 0x0000ff)
        );
        break;
        case 'levitate':
          group.add(createLevitationHandle());
          break;
    }

    group.position.copy(box.position);
    sceneRef.current.add(group);
    controlsGroupRef.current = group;
  };

  // ... (keep the createPlane function and first useEffect the same)
  // const createPlane = (length, width) => {
  //       if (sceneRef.current) {
  //         if (planeRef.current) {
  //           sceneRef.current.remove(planeRef.current);
  //         }
    
  //         const geometry = new THREE.PlaneGeometry(length, width);
  //         const material = new THREE.MeshBasicMaterial({
  //           color: 0xd3d3d3,
  //           side: THREE.DoubleSide,
  //         });
  //         const plane = new THREE.Mesh(geometry, material);
  //         plane.rotateX(-Math.PI / 2);
    
  //         const grid = new THREE.GridHelper(Math.max(length, width), 20);
  //         grid.position.y = 0.0001;
    
  //         const planeGroup = new THREE.Group();
  //         planeGroup.add(plane);
  //         planeGroup.add(grid);
    
  //         sceneRef.current.add(planeGroup);
  //         // sceneRef.current.add(plane);
  //         planeRef.current = planeGroup;
  //         // planeRef.current = plane;
  //         setPlaneSize({ length, width });
    
  //         const maxDim = Math.max(length, width);
  //         cameraRef.current.position.set(maxDim, maxDim * 0.7, maxDim);
  //         cameraRef.current.lookAt(0, 0, 0);
  //       }
  //     };

  const createPlane = (length, width) => {
    if (sceneRef.current) {
      if (planeRef.current) {
        sceneRef.current.remove(planeRef.current);
      }
  
      // Create the plane
      const geometry = new THREE.PlaneGeometry(length, width);
      const material = new THREE.MeshBasicMaterial({
        color: 0xe0e0e0,
        side: THREE.DoubleSide,
      });
      const plane = new THREE.Mesh(geometry, material);
      plane.rotateX(-Math.PI / 2);
  
      // Create a custom rectangular grid
      const gridLines = new THREE.Group();
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
      const divisionsX = 10; // Number of divisions along length
      const divisionsZ = 10; // Number of divisions along width
  
      // Add lines along X-axis
      for (let i = 0; i <= divisionsX; i++) {
        const x = (i / divisionsX) * length - length / 2;
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(x, 0.01, -width / 2),
          new THREE.Vector3(x, 0.01, width / 2),
        ]);
        const line = new THREE.Line(lineGeometry, lineMaterial);
        gridLines.add(line);
      }
  
      // Add lines along Z-axis
      for (let i = 0; i <= divisionsZ; i++) {
        const z = (i / divisionsZ) * width - width / 2;
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-length / 2, 0.01, z),
          new THREE.Vector3(length / 2, 0.01, z),
        ]);
        const line = new THREE.Line(lineGeometry, lineMaterial);
        gridLines.add(line);
      }
  
      // Group the plane and grid together
      const planeGroup = new THREE.Group();
      planeGroup.add(plane);
      planeGroup.add(gridLines);
  
      // Add the group to the scene
      sceneRef.current.add(planeGroup);
      planeRef.current = planeGroup;
  
      // Update plane size state
      setPlaneSize({ length, width });
  
      // Adjust camera position to fit the plane
      const maxDim = Math.max(length, width);
      cameraRef.current.position.set(maxDim, maxDim * 0.7, maxDim);
      cameraRef.current.lookAt(0, 0, 0);
    }
  };
    
      useEffect( () => {
        if (!planeSize) {
          // const length = parseFloat(prompt('Enter plane length:', '10'));
          const length = planeLength;
          // const width = parseFloat(prompt('Enter plane width:', '10'));
          const width = planeWidth;
          if (isNaN(length) || isNaN(width)) return;
    
          while (mountRef.current.firstChild) {
            mountRef.current.removeChild(mountRef.current.firstChild);
          }

          const scene = new THREE.Scene();
          scene.background = new THREE.Color(0x353535);
          sceneRef.current = scene;
    
          const camera = new THREE.PerspectiveCamera(
            75,
            // window.innerWidth / window.innerHeight,
             canvasLength / canvasHeight,
            0.1,
            1000
          );
          cameraRef.current = camera;
    
          const renderer = new THREE.WebGLRenderer({ antialias: true });
          // renderer.setSize(window.innerWidth, window.innerHeight);
          renderer.setSize(canvasLength?canvasLength:500, canvasHeight?canvasHeight:500);
          mountRef.current.appendChild(renderer.domElement);
          canvasRef.current = renderer.domElement;
          rendererRef.current = renderer;
    
          const controls = new OrbitControls(camera, renderer.domElement);
          controls.enableDamping = true;
          controls.dampingFactor = 0.05;
          controlsRef.current = controls;
    
          const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
          scene.add(ambientLight);
          const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
          directionalLight.position.set(1, 1, 1);
          scene.add(directionalLight);
          // if(!load){

          //   createPlane(length, width);
          // }
          createPlane(length, width);
        }
    
        const animate = () => {
          requestAnimationFrame(animate);
          if (controlsRef.current) controlsRef.current.update();
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        };
        animate();
      }, [planeSize]);
    
      

      useEffect(() => {
        if (!canvasRef.current) return;
    
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
    
        const getIntersection = (event) => {
          const rect = canvasRef.current.getBoundingClientRect();
          mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
          mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
          raycaster.setFromCamera(mouse, cameraRef.current);
          
          const objects = [...boxesRef.current];
          if (spritesGroupRef.current) {
            objects.push(...spritesGroupRef.current.children);
          }
          if (controlsGroupRef.current) {
            objects.push(...controlsGroupRef.current.children);
          }
          return raycaster.intersectObjects(objects);
        };
    
        const handleMouseDown = (event) => {
          const intersects = getIntersection(event);
          if (intersects.length > 0) {
            const object = intersects[0].object;
            if (boxesRef.current.includes(object)) {
                setSelectedBox(object);
              
                const { width, height, depth } = object.geometry.parameters;

      // Get rotation angles (in radians)
      const { x: rotX, y: rotY, z: rotZ } = object.rotation;

      // Get elevation (position on Y-axis)
      const elevation = object.position.y;

      // Create an object with all the data
      const boxProperties = {
        width,
        height,
        depth,
        elevation,
        rotation: { rotX, rotY, rotZ },
      };

      // Store this data in a state (e.g., selectedBoxProperties)
      setSelectedBoxProperties(boxProperties);


              
              // If no transform mode is active, prepare for dragging
              if (!transformMode) {
                isDraggingRef.current = true;
                const intersectionPoint = intersects[0].point;
                dragOffsetRef.current = {
                  x: object.position.x - intersectionPoint.x,
                  z: object.position.z - intersectionPoint.z,
                };
                controlsRef.current.enabled = false;
              } else {
                // If a mode is active, clear it and show sprites
                setTransformMode(null);
                if (controlsGroupRef.current) {
                  sceneRef.current.remove(controlsGroupRef.current);
                }
              }
              createModeSprites(object);
            } 
            else if (object.material instanceof THREE.SpriteMaterial) {
              if (object.userData.mode === 'delete') {
                // Remove the box from the scene
                sceneRef.current.remove(selectedBox);
                
                // Remove from boxes array
                boxesRef.current = boxesRef.current.filter(box => box !== selectedBox);
                
                // Remove sprites
                if (spritesGroupRef.current) {
                  sceneRef.current.remove(spritesGroupRef.current);
                }
                
                // Remove transform controls if they exist
                if (controlsGroupRef.current) {
                  sceneRef.current.remove(controlsGroupRef.current);
                }
                
                // Clear selection states
                setSelectedBox(null);
                setSelectedBoxProperties(null);
                setTransformMode(null);
                
              } 
              else{
                setTransformMode(object.userData.mode);
                sceneRef.current.remove(spritesGroupRef.current);
                createTransformControls(selectedBox, object.userData.mode);
              }
            }
            else if (object.userData.type) {
              isDraggingRef.current = true;
              setActiveControl(object);
              dragStartRef.current = { x: event.clientX, y: event.clientY };
              controlsRef.current.enabled = false;
            }
          }
        };
    
        const handleMouseMove = (event) => {
          if (isDraggingRef.current && selectedBox) {
            if (!transformMode) {
              // Direct box dragging
              const rect = canvasRef.current.getBoundingClientRect();
              mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
              mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
              raycaster.setFromCamera(mouse, cameraRef.current);
    
              const intersects = raycaster.intersectObject(planeRef.current.children[0]);
              if (intersects.length > 0) {
                const newPoint = intersects[0].point;
                const halfLength = planeSize.length / 2;
                const halfWidth = planeSize.width / 2;
    
                selectedBox.position.x = Math.max(
                  -halfLength + 0.5,
                  Math.min(halfLength - 0.5, newPoint.x + dragOffsetRef.current.x)
                );
                selectedBox.position.z = Math.max(
                  -halfWidth + 0.5,
                  Math.min(halfWidth - 0.5, newPoint.z + dragOffsetRef.current.z)
                );
    
                if (spritesGroupRef.current) {
                  spritesGroupRef.current.position.copy(selectedBox.position);
                }
              }
            }
            else if (activeControl) {
              const rect = canvasRef.current.getBoundingClientRect();
              const deltaX = ((event.clientX - dragStartRef.current.x) / rect.width) * 10;
              const deltaY = ((event.clientY - dragStartRef.current.y) / rect.height) * 10;
              
              if (activeControl.userData.type === 'rotate') {
                console.log('rotate')
                const axis = activeControl.userData.axis;
                const rotationSpeed = 2;
                
                if (axis === 'y') {
                  selectedBox.rotation.y += deltaX * rotationSpeed;
                  boxRotation.y = selectedBox.rotation.y;
                } else if (axis === 'x') {
                  selectedBox.rotation.x -= deltaY * rotationSpeed;
                  boxRotation.x = selectedBox.rotation.x;
                } else if (axis === 'z') {
                  selectedBox.rotation.z += deltaX * rotationSpeed;
                  boxRotation.z = selectedBox.rotation.z;
                }
                setBoxRotation({ ...boxRotation });
              }
              else if (activeControl.userData.type === 'scale') {
                const axis = activeControl.userData.axis;
                const scaleFactor = 1 + (deltaX - deltaY);
                const minScale = 0.1;
                const newScale = Math.max(minScale, selectedBox.scale[axis] * scaleFactor);
                
                selectedBox.scale[axis] = newScale;
                const newDimensions = { ...boxDimensions };
                newDimensions[axis] = newScale;
                setBoxDimensions(newDimensions);
                
                if (axis === 'y') {
                  const heightDiff = (newScale - selectedBox.scale[axis]) / 2;
                  selectedBox.position.y += heightDiff;
                  controlsGroupRef.current.position.copy(selectedBox.position);
                  
                
                // Update control group position
                if (controlsGroupRef.current) {
                  controlsGroupRef.current.position.copy(selectedBox.position);
                }
                }
              }
              else if (activeControl.userData.type === 'levitate') {
                const levitationSpeed = 1;
                const minHeight = selectedBox.scale.y / 2;
                const maxHeight = 10;
                const newY = selectedBox.position.y - deltaY * levitationSpeed;
                selectedBox.position.y = Math.max(minHeight, Math.min(maxHeight, newY));

                if (controlsGroupRef.current) {
                  controlsGroupRef.current.position.copy(selectedBox.position);
                }
              }
              
              dragStartRef.current = { x: event.clientX, y: event.clientY };
            }
          }
        };
    
        const handleMouseUp = () => {
          isDraggingRef.current = false;
          setActiveControl(null);
          controlsRef.current.enabled = true;
        };
    
        canvasRef.current.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    
        return () => {
          canvasRef.current?.removeEventListener('mousedown', handleMouseDown);
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('mouseup', handleMouseUp);
        };
      }, [selectedBox, activeControl, transformMode, planeSize]);
      
  const addBox = () => {
        if (!planeSize) return;
    
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshPhongMaterial({
          color: new THREE.Color(Math.random(), Math.random(), Math.random()),
        });
        const box = new THREE.Mesh(geometry, material);
    
        box.position.x = (Math.random() - 0.5) * (planeSize.length - 1);
        box.position.z = (Math.random() - 0.5) * (planeSize.width - 1);
        box.position.y = 0.5;
    
        sceneRef.current.add(box);
        boxesRef.current.push(box);
      };
    
      // const updateBoxDimension = (dimension, delta) => {
      //   if (selectedBox) {
      //     const newScale = { ...boxDimensions };
      //     newScale[dimension] = Math.max(0.1, newScale[dimension] + delta);
      //     setBoxDimensions(newScale);
          
      //     selectedBox.scale[dimension] = newScale[dimension];
      //     if (dimension === 'y') {
      //       selectedBox.position.y = newScale[dimension] / 2;
      //     }
      //   }
      // };
    
      // const updateBoxRotation = (axis, delta) => {
      //   if (selectedBox) {
      //     const newRotation = { ...boxRotation };
      //     newRotation[axis] = (newRotation[axis] + delta) % (2 * Math.PI);
      //     setBoxRotation(newRotation);
          
      //     selectedBox.rotation[axis] = newRotation[axis];
      //   }
      // };

      function addGLBURL(url) {
        const loader = new GLTFLoader();
      
        loader.load(
          url,
          function (gltf) {
            const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
            const boxMaterial = new THREE.MeshBasicMaterial({
              color: new THREE.Color(0x00ff00),
              transparent: true,
              opacity: 0.2,
              wireframe: true,
            });
            const box = new THREE.Mesh(boxGeometry, boxMaterial);
            
            // Store the URL for later use in save/load
            box.userData.glbURL = url;
      
            const box3 = new THREE.Box3().setFromObject(gltf.scene);
            const objectSize = new THREE.Vector3();
            box3.getSize(objectSize);
      
            const scaleFactor = Math.min(1 / objectSize.x, 1 / objectSize.y, 1 / objectSize.z);
            gltf.scene.scale.set(scaleFactor, scaleFactor, scaleFactor);
      
            gltf.scene.position.set(0, -0.5, 0);
      
            gltf.scene.traverse((child) => {
              if (child.isMesh) {
                // Additional mesh transformations if needed
              }
            });
      
            box.add(gltf.scene);
            box.position.set(0, 0.5, 0);
            sceneRef.current.add(box);
            boxesRef.current.push(box);
            
            // Update selectedBoxProperties with the URL
            setSelectedBoxProperties(prev => ({
              ...prev,
              modelURL: url
            }));
          },
          function (xhr) {
            console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
          },
          function (error) {
            console.error('An error happened loading the GLB model:', error);
          }
        );
      }
      
      const saveScene = async () => {
        if (!sceneRef.current) return;
        console.log(projectID)
        const sceneData = {
          boxes: boxesRef.current.map(box => ({
            position: {
              x: box.position.x,
              y: box.position.y,
              z: box.position.z
            },
            rotation: {
              x: box.rotation.x,
              y: box.rotation.y,
              z: box.rotation.z
            },
            scale: {
              x: box.scale.x,
              y: box.scale.y,
              z: box.scale.z
            },
            type: box.children.length > 0 ? 'GLB' : 'BOX',
            color: box.children.length === 0 ? box.material.color.getHex() : null,
            glbURL: box.userData.glbURL || null // Save the GLB URL
          })),
          planeSize: planeSize
        };
      
        const sceneJSON = JSON.stringify(sceneData);
        try {
          // Get token from local storage
          const token = localStorage.getItem('token');
          if (!token) {
            console.error('Access token not found. User might not be authenticated.');
            return;
          }
      
          // Send JSON data to the API
          const response = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + 'idk/update-model-json', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              projectID,
              modelJSON: sceneJSON,
            }),
          });
      
          if (response.ok) {
            console.log('Scene sent successfully.');
          } else {
            console.error('Failed to send scene:', response.statusText);
          }
        } catch (error) {
          console.error('An error occurred while sending the scene:', error);
        }
      };
      
      const loadScene = async () => {
        
          console.log('loading scene...')
        try {
          // Fetch the model JSON using GET request
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}project/get-model-json/${projectID}`);
          if (!response.ok) {
            console.error('Failed to load model JSON:', response.statusText);
            return;
          }
      
          const responseData = await response.json();
      
          // Log the response data to verify its structure
          console.log(responseData);
      
          // Ensure modelJSON exists and parse it
          if (!responseData.model || !responseData.model.modelJSON) {
            // console.error('Model JSON is missing in the response');
            return;
          }
      
          const sceneData = JSON.parse(responseData.model.modelJSON);
      
          // Log the parsed scene data for debugging
          console.log('scene data: ',sceneData.boxes);
      
          // Ensure the boxes are available and are an array
          if (!Array.isArray(sceneData.boxes)) {
            console.error('Invalid scene data: boxes is not an array');
            return;
          }
      
          // Remove existing boxes from the scene
          boxesRef.current.forEach(box => {
            sceneRef.current.remove(box);
          });
          boxesRef.current = [];
      
          // Create the plane from the received scene data
          createPlane(sceneData.planeSize.length,sceneData.planeSize.width);
      
          // Load the boxes from the sceneData
          for (const boxData of sceneData.boxes) {
            let box;
      
            if (boxData.type === 'BOX') {
              const geometry = new THREE.BoxGeometry(1, 1, 1);
              const material = new THREE.MeshPhongMaterial({
                color: boxData.color
              });
              box = new THREE.Mesh(geometry, material);
            } else if (boxData.type === 'GLB') {
              await new Promise((resolve) => {
                const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
                const boxMaterial = new THREE.MeshBasicMaterial({
                  color: 0x00ff00,
                  transparent: true,
                  opacity: 0.2,
                  wireframe: true,
                });
                box = new THREE.Mesh(boxGeometry, boxMaterial);
      
                // Store the GLB URL in userData
                box.userData.glbURL = boxData.glbURL;
      
                const gltfLoader = new GLTFLoader();
                gltfLoader.load(
                  boxData.glbURL,
                  (gltf) => {
                    const box3 = new THREE.Box3().setFromObject(gltf.scene);
                    const objectSize = new THREE.Vector3();
                    box3.getSize(objectSize);
                    const scaleFactor = Math.min(1 / objectSize.x, 1 / objectSize.y, 1 / objectSize.z);
                    gltf.scene.scale.set(scaleFactor, scaleFactor, scaleFactor);
                    gltf.scene.position.set(0, -0.5, 0);
                    box.add(gltf.scene);
                    resolve();
                  }
                );
              });
            }
      
            // Set box position, rotation, and scale
            box.position.set(boxData.position.x, boxData.position.y, boxData.position.z);
            box.rotation.set(boxData.rotation.x, boxData.rotation.y, boxData.rotation.z);
            box.scale.set(boxData.scale.x, boxData.scale.y, boxData.scale.z);
      
            // Add box to the scene
            sceneRef.current.add(box);
            boxesRef.current.push(box);
          }
        } catch (error) {
          console.error('Error loading scene:', error);
        }
      };
      
// {commented this}

      useEffect(() => {
          loadScene();
      
      }, []);


      const exportSceneToGLB = () => {
        if (!sceneRef.current) return;
      
        try {
          // Create a new group to hold all meshes
          const exportGroup = new THREE.Group();
          
          // Add all boxes and their children to the export group
          boxesRef.current.forEach(box => {
            if (box.children.length > 0) {
              // This is a container box with an OBJ/GLB inside
              const child = box.children[0];
              
              // Create a new container box with the same dimensions as the original
              const containerGeometry = new THREE.BoxGeometry(
                box.geometry.parameters.width * box.scale.x,
                box.geometry.parameters.height * box.scale.y,
                box.geometry.parameters.depth * box.scale.z
              );
              const containerMaterial = new THREE.MeshBasicMaterial({
                color: 0x00ff00,
                transparent: true,
                opacity: 0.2,
                wireframe: true
              });
              const containerBox = new THREE.Mesh(containerGeometry, containerMaterial);
              
              // Copy the box's world position and rotation
              containerBox.position.copy(box.position);
              containerBox.rotation.copy(box.rotation);
              
              // Clone the contained model
              const modelClone = child.clone(true);
              
              // Calculate the correct scale for the model within the new container
              const box3 = new THREE.Box3().setFromObject(modelClone);
              const modelSize = new THREE.Vector3();
              box3.getSize(modelSize);
              
              // Scale the model to fit the container box
              const containerSize = new THREE.Vector3(
                containerGeometry.parameters.width,
                containerGeometry.parameters.height,
                containerGeometry.parameters.depth
              );
              
              const scaleFactor = Math.min(
                containerSize.x / modelSize.x,
                containerSize.y / modelSize.y,
                containerSize.z / modelSize.z
              );
              
              modelClone.scale.multiplyScalar(scaleFactor);
              
              // Position the model correctly within the container
              if (child.userData.type === 'GLB') {
                modelClone.position.y = -containerSize.y / 2;
              } else {
                modelClone.position.y = -containerSize.y / 2;
              }
              
              // Add both container and model to the export group
              containerBox.add(modelClone);
              exportGroup.add(containerBox);
            } else {
              // For simple boxes without children, just clone and add them
              const boxClone = box.clone(true);
              exportGroup.add(boxClone);
            }
          });
      
          // Add the ground plane if needed
          if (planeRef.current) {
            const planeClone = planeRef.current.clone(true);
            exportGroup.add(planeClone);
          }
      
          // Create the exporter
          const exporter = new GLTFExporter();
      
          // Parse the scene
          exporter.parse(
            exportGroup,
            (gltf) => {
              // Create and download the file
              const blob = new Blob([gltf], { type: 'application/octet-stream' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = 'scene.glb';
              link.click();
              URL.revokeObjectURL(url);
            },
            (error) => {
              console.error('Error during GLB export:', error);
            },
            // Options for GLB export
            {
              binary: true,
              includeCustomExtensions: true,
              animations: [],
              onlyVisible: true
            }
          );
        } catch (error) {
          console.error('Error exporting to GLB:', error);
        }
      };
      
      

      // const checkUnsavedChanges = async () => {
      //   console.log("Checking for unsaved changes...");
      //   // Get current scene JSON
      //   const currentSceneData = {
      //     boxes: boxesRef.current.map(box => ({
      //       position: {
      //         x: box.position.x,
      //         y: box.position.y,
      //         z: box.position.z
      //       },
      //       rotation: {
      //         x: box.rotation.x,
      //         y: box.rotation.y,
      //         z: box.rotation.z
      //       },
      //       scale: {
      //         x: box.scale.x,
      //         y: box.scale.y,
      //         z: box.scale.z
      //       },
      //       type: box.children.length > 0 ? 'GLB' : 'BOX',
      //       color: box.children.length === 0 ? box.material.color.getHex() : null,
      //       glbURL: box.userData.glbURL || null
      //     })),
      //     planeSize: planeSize
      //   };
    
      //   try {
      //     // Fetch saved scene JSON from DB
      //     const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}project/get-model-json/${projectID}`);
      //     if (!response.ok) return true;
    
      //     const responseData = await response.json();
      //     if (!responseData.model || !responseData.model.modelJSON) return true;
    
      //     const savedSceneData = JSON.parse(responseData.model.modelJSON);
    
      //     // Compare the JSONs
      //     const currentJSON = JSON.stringify(currentSceneData);
      //     const savedJSON = JSON.stringify(savedSceneData);
    
      //     return currentJSON !== savedJSON;
      //   } catch (error) {
      //     console.error('Error checking for unsaved changes:', error);
      //     return true;
      //   }
      // };
    

      
    
  return (
    <div className={` w-[${width?width:500}] h-[${height?height:500}] relative`}>
      <div ref={mountRef} className={`${selection?'':'pointer-events-none'}  flex justify-center items-center`} />
      <button
        className="hidden absolute top-4 left-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={addBox}
      >
        Add Box
      </button>
      
      <button
        className=" absolute top-[11rem] left-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        // onClick={addObject}
        onClick={saveScene}
      >
        Save Scene
      </button>
      <button
        className="hidden absolute top-[14rem] left-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        // onClick={addObject}
        onClick={()=>loadScene}
      >
        Load Scene
      </button>
      <button
        className="hidden absolute top-[17rem] left-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        // onClick={addObject}
        onClick={exportSceneToGLB}
      >
        Export To GLB
      </button>

      {selectedBox&&
      <>
      <SelectedDetails  boxProperties={selectedBoxProperties}></SelectedDetails>
      </>}
      <AssetsDisplay assets={assets} selectedAssets={selectedCategory} addAsset={addGLBURL}></AssetsDisplay>
    </div>
  );
}