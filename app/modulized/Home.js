'use client';
import { useEffect, useRef, useState } from 'react';
import { ThreeSceneManager } from './threeSceneManager';
import { PlaneCreator } from './planeCreator';
import { TransformControls } from './transformControls';
import SelectedDetails from '../components/SelectedDetails';
import * as THREE from 'three';

export default function Home({ canvasLength, canvasHeight, width, height, selection, planeLength, planeWidth }) {
  // Keep all your state declarations and refs
  // ... (state and ref declarations remain the same)

  useEffect(() => {
    if (!planeSize) {
      const sceneManager = new ThreeSceneManager(mountRef.current, canvasLength, canvasHeight);
      const plane = PlaneCreator.create(planeLength, planeWidth);
      
      sceneManager.scene.add(plane);
      sceneManager.animate();

      // Store references
      sceneRef.current = sceneManager.scene;
      cameraRef.current = sceneManager.camera;
      rendererRef.current = sceneManager.renderer;
      controlsRef.current = sceneManager.controls;
      planeRef.current = plane;
      canvasRef.current = sceneManager.renderer.domElement;

      setPlaneSize({ length: planeLength, width: planeWidth });

      return () => sceneManager.dispose();
    }
  }, [planeSize, canvasLength, canvasHeight, planeLength, planeWidth]);

  // Keep your event handling useEffect and other functions
  // ... (rest of the component code remains the same)

  return (
    // ... (keep your existing return statement)
  );
}