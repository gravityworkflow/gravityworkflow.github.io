import * as THREE from 'three';

class RotatingImage extends HTMLElement {
  constructor() {
    super();
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.earth = null;
    this.stars = null;
    this.sunLight = null;
    this.imageSrc = this.getAttribute('src') || 'earth.jpg';

    this.init();
  }

  init() {
    // Scene & Renderer
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.appendChild(this.renderer.domElement);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    this.camera.position.z = 5;

    // Load Earth Texture
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load(this.imageSrc);

    // Main Earth Sphere (Smoother Look)
    const earthGeometry = new THREE.SphereGeometry(2, 64, 64);
    const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture });
    this.earth = new THREE.Mesh(earthGeometry, earthMaterial);
    this.scene.add(this.earth);

    // Add Dynamic Sunlight (Day/Night Effect)
    this.sunLight = new THREE.PointLight(0xffffff, 1.5);
    this.sunLight.position.set(5, 0, 5); // Start Position
    this.scene.add(this.sunLight);

    // Create Colorful Stars (Nebula Effect)
    this.addNebulaStars();

    // Start Animation
    this.animate();

    // Handle Window Resize
    window.addEventListener('resize', () => this.onResize());
  }

  addNebulaStars() {
    const starGeometry = new THREE.BufferGeometry();
    const starVertices = [];
    const starColors = [];

    // Generate 2000 colorful stars
    for (let i = 0; i < 2000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starVertices.push(x, y, z);

      // Random star colors (Blue, White, Purple)
      const color = new THREE.Color();
      color.setHSL(Math.random(), 1.0, 0.7); // Vibrant hues
      starColors.push(color.r, color.g, color.b);
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    starGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      vertexColors: true,
      size: 1,
      sizeAttenuation: true,
    });

    this.stars = new THREE.Points(starGeometry, starMaterial);
    this.scene.add(this.stars);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Rotate Earth
    this.earth.rotation.y += 0.005;

    // Move Sunlight Around Earth (Day/Night Effect)
    const time = Date.now() * 0.001; // Time-based movement
    this.sunLight.position.x = Math.sin(time) * 5;
    this.sunLight.position.z = Math.cos(time) * 5;

    // Rotate Stars Slightly for Depth Effect
    this.stars.rotation.y += 0.0005;

    this.renderer.render(this.scene, this.camera);
  }

  onResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }
}

// Define the custom element
customElements.define('rotating-image', RotatingImage);
