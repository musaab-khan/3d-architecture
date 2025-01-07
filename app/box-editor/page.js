'use client';
import { create } from 'domain';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default function Home() {
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
      context.font = 'bold 24px Arial';
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
      new THREE.SpriteMaterial({ map: createSpriteTexture('Levitation', '#4CAF50') })
    );
    levitateSprite.position.set(0, offset * 1.5, 0);
    levitateSprite.scale.set(spriteScale, spriteScale, spriteScale);
    levitateSprite.userData = { mode: 'levitate' };
    
    group.add(rotateSprite, scaleSprite, levitateSprite);

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

    // const handle = createArrow('y',0x4CA550)
  
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
          // const arrow = createArrow('y', 0x4CAF50);
          // arrow.scale.set(1, 2, 1);
          // arrow.userData = { type: 'levitate', axis: 'y' }; // Add this line
          // group.add(arrow);
          group.add(createLevitationHandle());
          break;
    }

    group.position.copy(box.position);
    sceneRef.current.add(group);
    controlsGroupRef.current = group;
  };

  // ... (keep the createPlane function and first useEffect the same)
  const createPlane = (length, width) => {
        if (sceneRef.current) {
          if (planeRef.current) {
            sceneRef.current.remove(planeRef.current);
          }
    
          const geometry = new THREE.PlaneGeometry(length, width);
          const material = new THREE.MeshBasicMaterial({
            color: 0xd3d3d3,
            side: THREE.DoubleSide,
          });
          const plane = new THREE.Mesh(geometry, material);
          plane.rotateX(-Math.PI / 2);
    
          const grid = new THREE.GridHelper(Math.max(length, width), 20);
          grid.position.y = 0.0001;
    
          const planeGroup = new THREE.Group();
          planeGroup.add(plane);
          planeGroup.add(grid);
    
          sceneRef.current.add(planeGroup);
          // sceneRef.current.add(plane);
          planeRef.current = planeGroup;
          // planeRef.current = plane;
          setPlaneSize({ length, width });
    
          const maxDim = Math.max(length, width);
          cameraRef.current.position.set(maxDim, maxDim * 0.7, maxDim);
          cameraRef.current.lookAt(0, 0, 0);
        }
      };
    
      useEffect(() => {
        if (!planeSize) {
          // const length = parseFloat(prompt('Enter plane length:', '10'));
          const length = 10;
          // const width = parseFloat(prompt('Enter plane width:', '10'));
          const width = 10;
          if (isNaN(length) || isNaN(width)) return;
    
          const scene = new THREE.Scene();
          scene.background = new THREE.Color(0xf0f0f0);
          sceneRef.current = scene;
    
          const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
          );
          cameraRef.current = camera;
    
          const renderer = new THREE.WebGLRenderer({ antialias: true });
          renderer.setSize(window.innerWidth, window.innerHeight);
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
              setTransformMode(object.userData.mode);
              sceneRef.current.remove(spritesGroupRef.current);
              createTransformControls(selectedBox, object.userData.mode);
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
              console.log(activeControl.userData.type)
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
                // selectedBox.position.y = 10;
                
                // Update control group position
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

  // ... (keep the addBox, updateBoxDimension, updateBoxRotation functions the same)
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
    
  return (
    <div className="relative w-full h-screen">
      <div ref={mountRef} className="w-full h-full" />
      <button
        className="absolute top-4 left-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={addBox}
      >
        Add Box
      </button>
    </div>
  );
}