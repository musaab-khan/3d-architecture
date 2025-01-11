import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const GLTFViewer = () => {
  const mountRef = useRef(null);

  modelPath=

  useEffect(() => {
    // Basic Three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 2); // Ambient light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    // Set up OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;

    // Load the GLTF model
    const loader = new GLTFLoader();
    loader.load(
      modelPath, // Path to the GLTF model
      (gltf) => {
        scene.add(gltf.scene); // Add the loaded model to the scene
        camera.position.set(0, 1, 3); // Position the camera to view the model
      },
      undefined, // Progress callback
      (error) => {
        console.error('Error loading GLTF model:', error);
      }
    );

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Update controls
      controls.update();

      // Render the scene
      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', () => {});
      renderer.dispose();
    };
  }, [modelPath]); // Dependency on modelPath to reload the model if it changes

  return <div ref={mountRef} />;
};

export default GLTFViewer;
