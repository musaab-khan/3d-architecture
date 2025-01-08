import * as THREE from 'three';

export class PlaneCreator {
  static create(length, width) {
    const planeGroup = new THREE.Group();
    
    // Create base plane
    const geometry = new THREE.PlaneGeometry(length, width);
    const material = new THREE.MeshBasicMaterial({
      color: 0xe0e0e0,
      side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(geometry, material);
    plane.rotateX(-Math.PI / 2);
    
    // Create grid lines
    const gridLines = this.createGridLines(length, width);
    
    planeGroup.add(plane);
    planeGroup.add(gridLines);
    
    return planeGroup;
  }

  static createGridLines(length, width) {
    const gridLines = new THREE.Group();
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    const divisionsX = 10;
    const divisionsZ = 10;

    // X-axis lines
    for (let i = 0; i <= divisionsX; i++) {
      const x = (i / divisionsX) * length - length / 2;
      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x, 0.01, -width / 2),
        new THREE.Vector3(x, 0.01, width / 2),
      ]);
      gridLines.add(new THREE.Line(lineGeometry, lineMaterial));
    }

    // Z-axis lines
    for (let i = 0; i <= divisionsZ; i++) {
      const z = (i / divisionsZ) * width - width / 2;
      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-length / 2, 0.01, z),
        new THREE.Vector3(length / 2, 0.01, z),
      ]);
      gridLines.add(new THREE.Line(lineGeometry, lineMaterial));
    }

    return gridLines;
  }
}