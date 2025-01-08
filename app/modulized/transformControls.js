import * as THREE from 'three';

export class TransformControls {
  static createModeSprites(box) {
    const group = new THREE.Group();
    const spriteScale = 0.5;
    const offset = 1;

    const sprites = [
      { text: 'Rotate', color: '#2196F3', position: [-offset, offset, 0], mode: 'rotate' },
      { text: 'Scale', color: '#F44336', position: [offset, offset, 0], mode: 'scale' },
      { text: 'Levitation', color: '#4CAF50', position: [0, offset * 1.5, 0], mode: 'levitate' }
    ];

    sprites.forEach(({ text, color, position, mode }) => {
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: this.createSpriteTexture(text, color) })
      );
      sprite.position.set(...position);
      sprite.scale.set(spriteScale, spriteScale, spriteScale);
      sprite.userData = { mode };
      group.add(sprite);
    });

    group.position.copy(box.position);
    return group;
  }

  static createTransformControls(box, mode) {
    const group = new THREE.Group();
    
    const controls = {
      move: () => [
        this.createArrow('x', 0xff0000),
        this.createArrow('y', 0x00ff00),
        this.createArrow('z', 0x0000ff)
      ],
      rotate: () => [
        this.createRotationRing('x', 0xff0000),
        this.createRotationRing('y', 0x00ff00),
        this.createRotationRing('z', 0x0000ff)
      ],
      scale: () => [
        this.createScaleHandle('x', 0xff0000),
        this.createScaleHandle('y', 0x00ff00),
        this.createScaleHandle('z', 0x0000ff)
      ],
      levitate: () => [this.createLevitationHandle()]
    };

    if (controls[mode]) {
      controls[mode]().forEach(control => group.add(control));
    }

    group.position.copy(box.position);
    return group;
  }

  // Helper methods would go here - createSpriteTexture, createArrow, createRotationRing, 
  // createScaleHandle, createLevitationHandle
  static createSpriteTexture(text, color) {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    
    context.beginPath();
    context.arc(32, 32, 30, 0, 2 * Math.PI);
    context.fillStyle = color;
    context.fill();
    
    context.font = 'bold 24px Arial';
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, 32, 32);
    
    return new THREE.CanvasTexture(canvas);
  }
  static createArrow (direction, color) {
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

  static createRotationRing (axis, color) {
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

  static createScaleHandle (axis, color) {
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
  static createLevitationHandle () {
    const size = 0.1;
    const handle = new THREE.Mesh(
        new THREE.BoxGeometry(size, size, size),
        new THREE.MeshBasicMaterial({ color: 0x4CAF50 })
    );
    const position = 1.5;
    handle.position.y = position; // Correct position assignment

    handle.userData = { type: 'levitate', position }; // Use position instead of undefined y

    return handle;
};
  // Other helper methods would follow...
}