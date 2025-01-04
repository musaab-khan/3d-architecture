'use client';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default function Home({planeLength,planeWidth}) {
  const mountRef = useRef(null);
  const [selectedBox, setSelectedBox] = useState(null);
//   const [boxDimensions, setBoxDimensions] = useState({ x: 1, y: 1, z: 1 });
//   const [boxRotation, setBoxRotation] = useState({ x: 0, y: 0, z: 0 });

  const [planeSize, setPlaneSize] = useState(null);
  const sceneRef = useRef(null);
  const planeRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const boxesRef = useRef([]);
  const canvasRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, z: 0 });

  // const createPlane = (length, width) => {
  //   if (sceneRef.current) {
  //     if (planeRef.current) {
  //       sceneRef.current.remove(planeRef.current);
  //     }

  //     const geometry = new THREE.PlaneGeometry(length, width);
  //     const material = new THREE.MeshBasicMaterial({
  //       color: 0xd3d3d3,
  //       side: THREE.DoubleSide,
  //     });
  //     const plane = new THREE.Mesh(geometry, material);
  //     plane.rotateX(-Math.PI / 2);

  //     const grid = new THREE.GridHelper(Math.max(length, width), 20);
  //     grid.position.y = 0.01;

  //     const planeGroup = new THREE.Group();
  //     planeGroup.add(plane);
  //     planeGroup.add(grid);

  //     sceneRef.current.add(planeGroup);
  //     planeRef.current = planeGroup;
  //     setPlaneSize({ length, width });

  //     const maxDim = Math.max(length, width);
  //     cameraRef.current.position.set(maxDim, maxDim * 0.7, maxDim);
  //     cameraRef.current.lookAt(0, 0, 0);
  //   }
  // };

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


  useEffect(() => {
    if (!planeSize) {
      // const length = parseFloat(prompt('Enter plane length:', '10'));
      const length = planeLength;
      console.log(planeLength)
      console.log(planeWidth)
      // const width = parseFloat(prompt('Enter plane width:', '10'));
      const width = planeWidth;
      if (isNaN(length) || isNaN(width)) return;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf0f0f0);
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(
        75,
        500 / 500,
        0.1,
        1000
      );
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(500, 500);
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
      return raycaster.intersectObjects(boxesRef.current.concat(planeRef.current.children));
    };

    const handleMouseDown = (event) => {
      const intersects = getIntersection(event);
      if (intersects.length > 0) {
        const object = intersects[0].object;
        if (boxesRef.current.includes(object)) {
          isDraggingRef.current = true;
          setSelectedBox(object);
        //   setBoxDimensions(object.scale);
        //   setBoxRotation({
        //     x: object.rotation.x,
        //     y: object.rotation.y,
        //     z: object.rotation.z,
        //   });

          const intersectionPoint = intersects[0].point;
          dragOffsetRef.current = {
            x: object.position.x - intersectionPoint.x,
            z: object.position.z - intersectionPoint.z,
          };

          controlsRef.current.enabled = false;
        }
      }
    };

    const handleMouseMove = (event) => {
      if (isDraggingRef.current && selectedBox) {
        const rect = canvasRef.current.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, cameraRef.current);

        const intersects = raycaster.intersectObject(planeRef.current.children[0]);

        if (intersects.length > 0) {
          const newPoint = intersects[0].point;
          const halfLength = planeSize.length / 2;
          const halfWidth = planeSize.width / 2;

          const newX = newPoint.x + dragOffsetRef.current.x;
          const newZ = newPoint.z + dragOffsetRef.current.z;

          selectedBox.position.x = Math.max(
            -halfLength + 0.5,
            Math.min(halfLength - 0.5, newX)
          );
          selectedBox.position.z = Math.max(
            -halfWidth + 0.5,
            Math.min(halfWidth - 0.5, newZ)
          );
        }
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
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
  }, [selectedBox, planeSize]);

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

  return (
    <div className=" w-[500px] h-[500px] relative">
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