'use client'
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';

const ThreeDPage = () => {
  const mountRef = useRef(null);
  const [selectedBox, setSelectedBox] = useState(null);  // Track selected box
  const [helperSprites, setHelperSprites] = useState([]);  // Store helper sprites
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Create the plane (10x10 grid)
    const planeGeometry = new THREE.PlaneGeometry(10, 10);
    const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x888888, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;  // Rotate the plane to be horizontal
    scene.add(plane);

    // Set the camera position
    camera.position.set(15, 10, 15);
    camera.lookAt(0, 0, 0);

    // Add orbit controls to move the camera
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Optional: Smooth camera movement
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false; // Disable panning
    controls.maxPolarAngle = Math.PI / 2; // Prevent camera from rotating upside down
    controls.enabled = true; // Enable by default

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    scene.add(ambientLight, directionalLight);

    // Create transform controls
    const transformControls = new TransformControls(camera, renderer.domElement);
    scene.add(transformControls);

    // Array to store the boxes
    const boxes = [];

    // Create sprite for UI helper
    const createSprite = (color) => {
      const spriteMaterial = new THREE.SpriteMaterial({ color });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(1, 1, 1);  // Set initial scale
      return sprite;
    };

    // Function to generate random boxes on the plane
    const createRandomBoxes = (numBoxes) => {
      for (let i = 0; i < numBoxes; i++) {
        const size = 1;
        const x = Math.floor(Math.random() * 10) - 5;  // Random x position on the plane
        const z = Math.floor(Math.random() * 10) - 5;  // Random z position on the plane
        const boxGeometry = new THREE.BoxGeometry(size, size, size);
        const boxMaterial = new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff });
        const box = new THREE.Mesh(boxGeometry, boxMaterial);

        box.position.set(x, size / 2, z); // Set position of the box
        scene.add(box);
        boxes.push(box);

        box.userData = { selected: false }; // Track selection state
      }
    };

    // Click handler to activate transform controls
    const onBoxClick = (event) => {
      // Update the mouse position
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Raycast to find intersections with objects in the scene
      raycaster.setFromCamera(mouse, camera);

      // Check for intersections with boxes
      const intersectsBox = raycaster.intersectObjects(boxes);

      // If an intersection occurs with a box, handle it
      if (intersectsBox.length > 0) {
        const clickedBox = intersectsBox[0].object;

        // Deselect all boxes
        boxes.forEach((b) => (b.userData.selected = false));

        // Select the clicked box
        clickedBox.userData.selected = true;
        setSelectedBox(clickedBox);  // Set the selected box state

        transformControls.detach();  // Detach any currently selected object
        transformControls.attach(clickedBox);  // Attach the selected box

        // Disable camera controls while interacting with an object
        controls.enabled = false;

        // Create and position sprites near the box for scale, rotate, and levitate
        createHelperSprites(clickedBox);
      } else {
        // If no box is clicked, clear helper sprites
        helperSprites.forEach(sprite => scene.remove(sprite));
        setHelperSprites([]);  // Clear the helper sprite list
      }
    };

    // Function to create helper sprites for scale, rotate, and levitate
    const createHelperSprites = (box) => {
      // Clear any existing helper sprites
      helperSprites.forEach(sprite => scene.remove(sprite));

      const scaleSprite = createSprite(0x00ff00);  // Green for scale
      const rotateSprite = createSprite(0x0000ff);  // Blue for rotate
      const levitateSprite = createSprite(0xff0000);  // Red for levitate

      // Positioning sprites near the box
      scaleSprite.position.set(box.position.x + 2, box.position.y + 1, box.position.z);
      rotateSprite.position.set(box.position.x + 4, box.position.y + 1, box.position.z);
      levitateSprite.position.set(box.position.x + 6, box.position.y + 1, box.position.z);

      // Add sprites to the scene
      scene.add(scaleSprite, rotateSprite, levitateSprite);

      // Update helperSprites state
      setHelperSprites([scaleSprite, rotateSprite, levitateSprite]);

      // Event handling for the sprites via raycasting
      const onSpriteClick = (sprite, mode) => {
        // Raycast to check if the sprite was clicked
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(sprite);
        if (intersects.length > 0) {
          transformControls.setMode(mode);  // Set the mode (scale, rotate, translate)
        }
      };

      // Event listeners for each sprite
      scaleSprite.onClick = () => onSpriteClick(scaleSprite, 'scale');
      rotateSprite.onClick = () => onSpriteClick(rotateSprite, 'rotate');
      levitateSprite.onClick = () => onSpriteClick(levitateSprite, 'translate');
    };

    // Listen for mouseup event to re-enable camera controls after interaction
    const onMouseUp = () => {
      // Re-enable camera controls after interaction ends
      controls.enabled = true;
    };

    // Add mouse click event listener
    window.addEventListener('click', onBoxClick);

    // Listen for mouseup to re-enable camera controls after drag or selection
    window.addEventListener('mouseup', onMouseUp);

    // Create random boxes
    createRandomBoxes(10);

    // Resize the renderer when the window is resized
    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Update orbit controls
      controls.update();  // Update orbit controls

      // Render the scene
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      // Clean up the scene and renderer when component is unmounted
      window.removeEventListener('resize', onResize);
      window.removeEventListener('click', onBoxClick);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.dispose();
    };
  }, [helperSprites]);

  return (
    <div
      ref={mountRef}
      style={{ width: '100vw', height: '100vh' }}
    />
  );
};

export default ThreeDPage;
