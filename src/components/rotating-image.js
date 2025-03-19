// import * as THREE from 'three';
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  TextureLoader,
  SphereGeometry,
  MeshStandardMaterial,
  Mesh,
  AmbientLight,
  BufferGeometry,
  Float32BufferAttribute,
  PointsMaterial,
  Points,
} from 'three';

class RotatingImage extends HTMLElement {
  constructor() {
    super();
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.earth = null;
    this.stars = null;
    this.imageSrc = this.getAttribute('src') || 'earth.jpg'; // Default Earth texture

    this.init();
  }

  init() {
    // Scene & Renderer
    this.scene = new Scene();
    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.appendChild(this.renderer.domElement);

    // Camera
    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 5;

    // Load Earth Texture
    const textureLoader = new TextureLoader();
    const earthTexture = textureLoader.load(this.imageSrc);

    // Main Earth Sphere (Smooth and Round)
    const earthGeometry = new SphereGeometry(2, 64, 64);
    const earthMaterial = new MeshStandardMaterial({ map: earthTexture });
    this.earth = new Mesh(earthGeometry, earthMaterial);
    this.scene.add(this.earth);

    // Create Starry Background
    this.addStars();

    // Lighting (Better 3D Look)
    const light = new AmbientLight(0xffffff, 1);
    this.scene.add(light);

    // Start Animation
    this.animate();

    // Handle Window Resize
    window.addEventListener('resize', () => this.onResize());
  }

  addStars() {
    const starGeometry = new BufferGeometry();
    const starVertices = [];

    // Generate 2000 stars in random positions
    for (let i = 0; i < 2000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starVertices.push(x, y, z);
    }

    starGeometry.setAttribute('position', new Float32BufferAttribute(starVertices, 3));
    const starMaterial = new PointsMaterial({
      color: 0xffffff,
      size: 1,
      sizeAttenuation: true,
    });

    this.stars = new Points(starGeometry, starMaterial);
    this.scene.add(this.stars);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.earth.rotation.y += 0.005; // Smooth spinning
    this.stars.rotation.y += 0.0005; // Slow drifting stars
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
