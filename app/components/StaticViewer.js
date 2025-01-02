// 'use client'; // Required for Next.js App Router if using app directory

// import React, { useEffect, useRef } from 'react';
// import * as THREE from 'three';
// import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

// function StaticViewer() {
//     // Ref for the container div
//     const mountRef = useRef(null);

//     useEffect(() => {
//         // Scene setup
//         const scene = new THREE.Scene();
//         scene.background = new THREE.Color(0xf0f0f0); // Light gray background

//         // Camera
//         const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000); // Aspect ratio will be updated later
//         camera.position.z = 5;

//         // Renderer
//         const renderer = new THREE.WebGLRenderer({ antialias: true });
//         renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
//         mountRef.current.appendChild(renderer.domElement);

//         // Lighting
//         const light = new THREE.AmbientLight(0xffffff, 1); // White light
//         scene.add(light);

//         // Load 3D Model
//         const loader = new OBJLoader();
//         loader.load(
//             'https://firebasestorage.googleapis.com/v0/b/siwa-genuine-parts.appspot.com/o/3DModels%2Fwardrobecloset-in-low-poly.obj?alt=media&token=24b8c085-d309-457f-8fb7-5bfaa810b471',
//             (object) => {
//                 scene.add(object);
//             }
//         );

//         // Animation Loop
//         function animate() {
//             requestAnimationFrame(animate);
//             renderer.render(scene, camera);
//         }
//         animate();

//         // Resize Handler
//         const handleResize = () => {
//             const width = mountRef.current.clientWidth;
//             const height = mountRef.current.clientHeight;
//             camera.aspect = width / height;
//             camera.updateProjectionMatrix();
//             renderer.setSize(width, height);
//         };
//         window.addEventListener('resize', handleResize);

//         // Cleanup
//         return () => {
//             window.removeEventListener('resize', handleResize);
//             if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
//         mountRef.current.removeChild(renderer.domElement);
//     }
//         };
//     }, []); // Run only once after the component is mounted

//     // Attach the ref to the div
//     return <div className='border-2 border-black' ref={mountRef} style={{ width: '100%', height: '100%' }} />;
// }

// export default StaticViewer;
