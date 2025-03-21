import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

class RotatingImage extends HTMLElement {
  constructor() {
    super();
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.earth = null;
    this.stars = null;
    this.sunLight = null;
    this.ambientLight = null; // Added ambient light
    this.imageSrc = this.getAttribute('src') || 'moon.jpg';

    this.init();
  }

  init() {
    // Scene & Renderer
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.appendChild(this.renderer.domElement); // append canvas

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );

    this.camera.position.set(0, 5, 5); // x, y, z

    // Load Earth Texture
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load(this.imageSrc);

    // Main Earth Sphere (Smoother Look)
    const earthGeometry = new THREE.SphereGeometry(2, 64, 64);
    const earthMaterial = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.5, // Adjust for reflectivity
      metalness: 0.1, // Slight metallic effect
      clearcoat: 0.3, // Adds a subtle sheen
      clearcoatRoughness: 0.2,
    });
    this.earth = new THREE.Mesh(earthGeometry, earthMaterial);
    this.scene.add(this.earth);

    // Add Ambient Light (Ensures Earth is never fully dark)
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // Soft global light
    this.scene.add(this.ambientLight);

    // Add Dynamic Sunlight (Day/Night Effect)
    this.sunLight = new THREE.PointLight(0xffffff, 50, 100);
    this.sunLight.position.set(5, 3, 5); // Initial position
    this.scene.add(this.sunLight);

    // Add Directional Light
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    this.directionalLight.position.set(10, 10, 0);
    this.scene.add(this.directionalLight);

    // Helpers
    this.axesHelper = new THREE.AxesHelper(5);
    this.lightHelper = new THREE.PointLightHelper(this.sunLight);
    this.directionalLightHelper = new THREE.DirectionalLightHelper(this.directionalLight);
    this.gridHelper = new THREE.GridHelper(200, 50);
    this.scene.add(this.axesHelper, this.lightHelper, this.directionalLightHelper, this.gridHelper);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

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
      size: 1.5, // Slightly bigger
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.9,
    });

    this.stars = new THREE.Points(starGeometry, starMaterial);
    this.scene.add(this.stars);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Rotate Earth
    this.earth.rotation.y += 0.005;

    // Move Sunlight Around Earth (Day/Night Effect)
    const time = Date.now() * 0.0005; // Time-based movement
    this.sunLight.position.x = Math.sin(time) * 6; // Slightly larger orbit
    this.sunLight.position.z = Math.cos(time) * 6;
    this.sunLight.position.y = Math.sin(time * 0.5) * 3; // Vertical movement for more dynamic lighting

    // Rotate Stars Slightly for Depth Effect
    this.stars.rotation.y += 0.0005;

    this.controls.update();
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
