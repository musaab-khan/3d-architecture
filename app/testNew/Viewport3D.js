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
     controls.enableDamping = true;
    // zoom controls disabled
  // controls.enableZoom=false;
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
      mesh.rotation.set(
        object.rotateX * Math.PI / 180,
        object.rotateY * Math.PI / 180,
        object.rotateZ * Math.PI / 180
      );
      scene.add(mesh);
      objectsMap[object.id] = mesh;
    });
  }, [objects]);

  return (
    // <div className="viewport-container">
    <div className="flex flex-col">
      <h2>3D Viewport</h2>
      <div 
        ref={mountRef} 
        style={{ width: '500px', height: '500px', border: '1px solid black' }}
      ></div>
    </div>
  );
};

export default Viewport3D;
