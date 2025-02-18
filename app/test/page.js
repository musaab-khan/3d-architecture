'use client'
import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const App = () => {
  const [selectedTool, setSelectedTool] = useState(null);
  const [objects, setObjects] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [objectDimensions, setObjectDimensions] = useState({
    name: '',
    width: 1,
    height: 1,
    depth: 1,
    x: 0,
    y: 0
  });
  
  const canvasRef = useRef(null);
  const threeContainerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  
  // Initialize Three.js scene
  useEffect(() => {
    if (!threeContainerRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75, 
      threeContainerRef.current.clientWidth / threeContainerRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.z = 5;
    camera.position.y = 2;
    cameraRef.current = camera;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(threeContainerRef.current.clientWidth, threeContainerRef.current.clientHeight);
    threeContainerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controlsRef.current = controls;
    
    // Add grid helper
    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
    
    // Handle resize
    const handleResize = () => {
      if (!threeContainerRef.current) return;
      camera.aspect = threeContainerRef.current.clientWidth / threeContainerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(threeContainerRef.current.clientWidth, threeContainerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);
    
    return () => {
      if (threeContainerRef.current && renderer.domElement) {
        threeContainerRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Handle tool selection
  const handleToolSelect = (tool) => {
    setSelectedTool(tool);
  };
  
  // Handle canvas click to place objects
  const handleCanvasClick = (e) => {
    if (!selectedTool || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setObjectDimensions({
      ...objectDimensions,
      x,
      y
    });
    
    setIsDialogOpen(true);
  };
  
  // Add object to 2D canvas
  const draw2DObject = (ctx, object) => {
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'rgba(0, 0, 255, 0.2)';
    
    switch(object.type) {
      case 'wall':
        ctx.beginPath();
        ctx.moveTo(object.x, object.y);
        ctx.lineTo(object.x + object.width, object.y);
        ctx.stroke();
        break;
      case 'ball':
        ctx.beginPath();
        ctx.arc(object.x, object.y, object.width / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        break;
      case 'pyramid':
        ctx.beginPath();
        ctx.moveTo(object.x, object.y);
        ctx.lineTo(object.x - object.width / 2, object.y + object.height);
        ctx.lineTo(object.x + object.width / 2, object.y + object.height);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
      default:
        break;
    }
  };
  
  // Handle 2D canvas drawing
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw all objects
    objects.forEach(object => {
      draw2DObject(ctx, object);
    });
  }, [objects]);
  
  // Add object to 3D scene
  const add3DObject = (object) => {
    if (!sceneRef.current) return;
    
    let mesh;
    let geometry;
    let material = new THREE.MeshStandardMaterial({ color: 0x3366ff });
    
    // Normalize coordinates from 2D canvas to 3D scene
    const canvasWidth = canvasRef.current.width;
    const canvasHeight = canvasRef.current.height;
    const normalizedX = (object.x / canvasWidth) * 10 - 5;
    const normalizedY = -((object.y / canvasHeight) * 10 - 5);
    
    switch(object.type) {
      case 'wall':
        geometry = new THREE.BoxGeometry(object.width / 20, object.height / 20 || 2, 0.1);
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(normalizedX + (object.width / 40), normalizedY, 0);
        break;
      case 'ball':
        geometry = new THREE.SphereGeometry(object.width / 40, 32, 32);
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(normalizedX, normalizedY, 0);
        break;
      case 'pyramid':
        geometry = new THREE.ConeGeometry(object.width / 40, object.height / 20, 4);
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(normalizedX, normalizedY, 0);
        break;
      default:
        return;
    }
    
    if (mesh) {
      // Add text label
      const textCanvas = document.createElement('canvas');
      const context = textCanvas.getContext('2d');
      textCanvas.width = 256;
      textCanvas.height = 128;
      
      context.fillStyle = 'rgba(255, 255, 255, 0.7)';
      context.fillRect(0, 0, textCanvas.width, textCanvas.height);
      
      context.font = '24px Arial';
      context.fillStyle = 'black';
      context.textAlign = 'center';
      context.fillText(object.name, textCanvas.width / 2, textCanvas.height / 2);
      
      const texture = new THREE.CanvasTexture(textCanvas);
      const labelMaterial = new THREE.SpriteMaterial({ map: texture });
      const label = new THREE.Sprite(labelMaterial);
      label.scale.set(2, 1, 1);
      label.position.y = 1;
      
      // Add label to mesh
      mesh.add(label);
      
      // Add mesh to scene
      sceneRef.current.add(mesh);
    }
  };
  
  // Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    const newObject = {
      id: Date.now(),
      type: selectedTool,
      name: objectDimensions.name,
      x: objectDimensions.x,
      y: objectDimensions.y,
      width: parseFloat(objectDimensions.width),
      height: parseFloat(objectDimensions.height),
      depth: parseFloat(objectDimensions.depth)
    };
    
    setObjects([...objects, newObject]);
    add3DObject(newObject);
    setIsDialogOpen(false);
    setObjectDimensions({
      name: '',
      width: 1,
      height: 1,
      depth: 1,
      x: 0,
      y: 0
    });
  };
  
  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 bg-blue-700 text-white">
        <h1 className="text-xl font-bold">2D-to-3D Object Creator</h1>
      </div>
      
      <div className="p-4 flex gap-4">
        <button 
          className={`px-4 py-2 rounded ${selectedTool === 'wall' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => handleToolSelect('wall')}
        >
          Wall
        </button>
        <button 
          className={`px-4 py-2 rounded ${selectedTool === 'ball' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => handleToolSelect('ball')}
        >
          Ball
        </button>
        <button 
          className={`px-4 py-2 rounded ${selectedTool === 'pyramid' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => handleToolSelect('pyramid')}
        >
          Pyramid
        </button>
      </div>
      
      <div className="flex flex-1 p-4 gap-4">
        <div className="w-1/2 border border-gray-300 rounded relative">
          <h2 className="p-2 bg-gray-100 font-semibold">2D Canvas</h2>
          <canvas 
            ref={canvasRef} 
            width={500} 
            height={500} 
            className="w-full bg-white"
            onClick={handleCanvasClick}
          ></canvas>
          {selectedTool && (
            <div className="absolute top-12 right-4 bg-blue-100 p-2 rounded text-sm">
              Selected tool: <strong>{selectedTool}</strong>.<br/>
              Click on canvas to place.
            </div>
          )}
        </div>
        
        <div className="w-1/2 border border-gray-300 rounded">
          <h2 className="p-2 bg-gray-100 font-semibold">3D Viewport</h2>
          <div ref={threeContainerRef} className="w-full h-full"></div>
        </div>
      </div>
      
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">Configure {selectedTool}</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block mb-1">Name:</label>
                <input 
                  type="text" 
                  className="w-full border rounded p-2" 
                  value={objectDimensions.name} 
                  onChange={(e) => setObjectDimensions({...objectDimensions, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-1">Width:</label>
                <input 
                  type="number" 
                  className="w-full border rounded p-2" 
                  value={objectDimensions.width} 
                  onChange={(e) => setObjectDimensions({...objectDimensions, width: e.target.value})}
                  min="0.1"
                  step="0.1"
                  required
                />
              </div>
              
              {selectedTool !== 'ball' && (
                <div className="mb-4">
                  <label className="block mb-1">Height:</label>
                  <input 
                    type="number" 
                    className="w-full border rounded p-2" 
                    value={objectDimensions.height} 
                    onChange={(e) => setObjectDimensions({...objectDimensions, height: e.target.value})}
                    min="0.1"
                    step="0.1"
                    required
                  />
                </div>
              )}
              
              {selectedTool === 'wall' && (
                <div className="mb-4">
                  <label className="block mb-1">Depth:</label>
                  <input 
                    type="number" 
                    className="w-full border rounded p-2" 
                    value={objectDimensions.depth} 
                    onChange={(e) => setObjectDimensions({...objectDimensions, depth: e.target.value})}
                    min="0.1"
                    step="0.1"
                    required
                  />
                </div>
              )}
              
              <div className="flex justify-end gap-2 mt-6">
                <button 
                  type="button" 
                  className="px-4 py-2 rounded bg-gray-200"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 rounded bg-blue-600 text-white"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;