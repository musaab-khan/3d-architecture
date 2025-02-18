// utils/threeUtils.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export const initScene = (container) => {
  // Scene setup
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);
  
  // Camera setup
  const camera = new THREE.PerspectiveCamera(
    75, 
    container.clientWidth / container.clientHeight, 
    0.1, 
    1000
  );
  camera.position.z = 5;
  camera.position.y = 2;
  
  // Renderer setup
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);
  
  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  // controls.enableDamping = true;
  //zoom controls disabled
  controls.enableZoom=false;
  
  // Add grid helper
  // const gridHelper = new THREE.GridHelper(10, 10);
  // scene.add(gridHelper);
  
  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  // Add directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
  
  // Animation loop
  const animate = () => {
    const animationId = requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
    return animationId;
  };
  const animationId = animate();
  
  // Handle resize
  const handleResize = () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  };
  window.addEventListener('resize', handleResize);
  
  return {
    scene,
    camera,
    renderer,
    controls,
    animationId,
    cleanup: () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    }
  };
};

export const renderObjects = (sceneData, objects) => {
  // Remove previous objects (except grid and lights)
  sceneData.scene.children.forEach(child => {
    if (child instanceof THREE.Mesh) {
      sceneData.scene.remove(child);
    }
  });
  
  // Add all objects
  objects.forEach(object => {
    add3DObject(sceneData.scene, object);
  });
};

// const add3DObject = (scene, object) => {
//   let mesh;
//   let geometry;
//   let material = new THREE.MeshStandardMaterial({ color: 0x73f0ec });
  
//   // Normalize coordinates
//   const normalizedX = (object.x / 500) * 10 - 5;
//   const normalizedY = -((object.y / 500) * 10 - 5);
  
//   switch(object.type) {
//     case 'wall':
//       geometry = new THREE.BoxGeometry(object.width / 20, object.height / 20 || 2, 0.1);
//       mesh = new THREE.Mesh(geometry, material);
//       mesh.position.set(normalizedX + (object.width / 40), normalizedY, 0);
//       break;
//     case 'ball':
//       geometry = new THREE.SphereGeometry(object.width / 40, 32, 32);
//       mesh = new THREE.Mesh(geometry, material);
//       mesh.position.set(normalizedX, normalizedY, 0);
//       break;
//     case 'pyramid':
//       geometry = new THREE.ConeGeometry(object.width / 40, object.height / 20, 4);
//       mesh = new THREE.Mesh(geometry, material);
//       mesh.position.set(normalizedX, normalizedY, 0);
//       break;
//     default:
//       return;
//   }
  
//   if (mesh) {
//     // Add text label
//     const label = createTextLabel(object.name);
//     label.position.y = 1;
//     mesh.add(label);
    
//     // Add mesh to scene
//     scene.add(mesh);
//   }
// };

const add3DObject = (scene, object) => {
  let mesh;
  let geometry;
  let material;
  
  // Normalize coordinates
  const normalizedX = (object.x / 500) * 10 - 5;
  const normalizedY = -((object.y / 500) * 10 - 5);
  
  switch(object.type) {
    case 'wall':
      // Create texture with text for the wall
      const texture = createTextTexture(object.name);
      
      // Create material with the texture
      material = new THREE.MeshStandardMaterial({ 
        map: texture,
        color: 0x73f0ec
      });
      
      // geometry = new THREE.BoxGeometry(object.width / 20, object.height / 20 || 2, 0.1);
      geometry = new THREE.BoxGeometry(object.width / 20, object.height / 20 || 2, object.depth / 20);
      mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(normalizedX + (object.width / 40), normalizedY, 0);
      break;
      
    case 'ball':
      material = new THREE.MeshStandardMaterial({ color: 0x73f0ec });
      geometry = new THREE.SphereGeometry(object.width / 40, 32, 32);
      mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(normalizedX, normalizedY, 0);
      
      // Add text decal to the sphere
      addTextDecal(mesh, object.name);
      break;
      
    case 'pyramid':
      material = new THREE.MeshStandardMaterial({ color: 0x73f0ec });
      geometry = new THREE.ConeGeometry(object.width / 40, object.height / 20, 4);
      mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(normalizedX, normalizedY, 0);
      
      // Add text decal to the pyramid
      addTextDecal(mesh, object.name);
      break;
      
    default:
      return;
  }
  
  if (mesh) {
    // Add mesh to scene
    scene.add(mesh);
  }
};

// const createTextTexture = (text) => {
//   const canvas = document.createElement('canvas');
//   const context = canvas.getContext('2d');
//   canvas.width = 512;
//   canvas.height = 512;
  
//   // Fill background
//   context.fillStyle = '#73f0ef';
//   context.fillRect(0, 0, canvas.width, canvas.height);
  
//   // Add text
//   context.font = 'bold 48px Arial';
//   context.fillStyle = 'white';
//   context.strokeStyle='white';
//   context.textAlign = 'center';
//   context.textBaseline = 'middle';
//   context.fillText(text, canvas.width / 2, canvas.height / 2);
  
//   // Create texture
//   const texture = new THREE.CanvasTexture(canvas);
//   return texture;
// };

// New function to add a text decal to a mesh

const createTextTexture = (text) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 512;
  canvas.height = 512;

  // Fill background with a color that provides contrast
  context.fillStyle = '#73f0ef'; // Light blue background
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Adjust font settings
  context.font = 'bold 72px Arial'; // Increased font size
  context.fillStyle = 'black'; // Change text color to black for better visibility
  context.textAlign = 'center';
  context.textBaseline = 'middle';

  // Add text with stroke for better readability
  context.strokeStyle = 'white'; // White stroke
  context.lineWidth = 6;
  context.strokeText(text, canvas.width / 2, canvas.height / 2);
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  // Create and return texture
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
};


const addTextDecal = (mesh, text) => {
  // Create a canvas with the text
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 256;
  canvas.height = 128;
  
  // Make background transparent
  context.fillStyle = 'rgba(255, 255, 255, 0.0)';
  context.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add text
  context.font = 'bold 32px Arial';
  context.fillStyle = 'white';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  
  // Create decal texture
  const texture = new THREE.CanvasTexture(canvas);
  const decalMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthTest: true,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -4
  });
  
  // Create a plane for the decal
  const decal = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 0.5),
    decalMaterial
  );
  
  // Position the decal on the front of the object
  if (mesh.geometry.type.includes('Sphere')) {
    decal.position.set(0, 0, mesh.geometry.parameters.radius + 0.01);
  } else if (mesh.geometry.type.includes('Cone')) {
    // For pyramid (cone), place at the center of the front face
    decal.position.set(0, 0, mesh.geometry.parameters.radius + 0.01);
  }
  
  // Add decal to mesh
  mesh.add(decal);
};


// const createTextLabel = (text) => {
//   const textCanvas = document.createElement('canvas');
//   const context = textCanvas.getContext('2d');
//   textCanvas.width = 256;
//   textCanvas.height = 128;
  
//   context.fillStyle = 'rgba(255, 255, 255, 0.7)';
//   context.fillRect(0, 0, textCanvas.width, textCanvas.height);
  
//   context.font = '24px Arial';
//   context.fillStyle = 'black';
//   context.textAlign = 'center';
//   context.fillText(text, textCanvas.width / 2, textCanvas.height / 2);
  
//   const texture = new THREE.CanvasTexture(textCanvas);
//   const material = new THREE.SpriteMaterial({ map: texture });
//   const sprite = new THREE.Sprite(material);
//   sprite.scale.set(2, 1, 1);
  
//   return sprite;
// };

