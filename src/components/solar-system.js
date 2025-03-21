import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// import starsTexture from '/images/solar/stars.jpg';
import sunTexture from '/images/solar/sun.jpg';
import mercuryTexture from '/images/solar/mercury.jpg';
import venusTexture from '/images/solar/venus.jpg';
import earthTexture from '/images/solar/earth.jpg';
import marsTexture from '/images/solar/mars.jpg';
import jupiterTexture from '/images/solar/jupiter.jpg';
import saturnTexture from '/images/solar/saturn.jpg';
import saturnRingTexture from '/images/solar/saturn ring.png';
import uranusTexture from '/images/solar/uranus.jpg';
import uranusRingTexture from '/images/solar/uranus ring.png';
import neptuneTexture from '/images/solar/neptune.jpg';
import plutoTexture from '/images/solar/pluto.jpg';

class SolarSystem extends HTMLElement {
  constructor() {
    super();
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.textureLoader = null;
    // this.earth = null;
    this.sun = null;
    this.stars = null;
    this.sunLight = null;
    this.ambientLight = null;
    this.imageSrc = this.getAttribute('src') || '/images/moon.jpg';
    this.init();
  }

  init() {
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.appendChild(this.renderer.domElement);
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    this.textureLoader = new THREE.TextureLoader();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.camera.position.set(-90, 140, 140); // x, y, z
    // this.controls.update();

    this.ambientLight = new THREE.AmbientLight(0xffffff);
    this.scene.add(this.ambientLight);

    // Earth
    const sunGeo = new THREE.SphereGeometry(16, 30, 30);
    const sunMat = new THREE.MeshBasicMaterial({
      map: this.textureLoader.load(sunTexture),
    });
    this.sun = new THREE.Mesh(sunGeo, sunMat);
    this.scene.add(this.sun);

    // Add Planets
    this.mercury = this.createPlanet(3.2, mercuryTexture, 28);
    this.venus = this.createPlanet(5.8, venusTexture, 44);
    this.earth = this.createPlanet(6, earthTexture, 62);
    this.mars = this.createPlanet(4, marsTexture, 78);
    this.jupiter = this.createPlanet(12, jupiterTexture, 100);
    this.saturn = this.createPlanet(10, saturnTexture, 138, {
      innerRadius: 10,
      outerRadius: 20,
      texture: saturnRingTexture,
    });
    this.uranus = this.createPlanet(7, uranusTexture, 176, {
      innerRadius: 7,
      outerRadius: 12,
      texture: uranusRingTexture,
    });
    this.neptune = this.createPlanet(7, neptuneTexture, 200);
    this.pluto = this.createPlanet(2.8, plutoTexture, 216);

    this.sunLight = new THREE.PointLight(0xffffff, 2, 300);
    this.scene.add(this.sunLight);

    // Helpers
    // this.axesHelper = new THREE.AxesHelper(5);
    // this.lightHelper = new THREE.PointLightHelper(this.sunLight);
    // this.gridHelper = new THREE.GridHelper(200, 50);
    // this.scene.add(this.axesHelper, this.lightHelper, this.gridHelper);

    // Create Colorful Stars (Nebula Effect)
    this.addNebulaStars();

    // Start Animation
    this.animate();

    // Handle Window Resize
    window.addEventListener('resize', () => this.onResize());
  }

  createPlanet(size, texture, position, ring) {
    const geo = new THREE.SphereGeometry(size, 30, 30);
    const mat = new THREE.MeshStandardMaterial({
      map: this.textureLoader.load(texture),
    });
    const mesh = new THREE.Mesh(geo, mat);
    const obj = new THREE.Object3D();
    obj.add(mesh);
    if (ring) {
      const ringGeo = new THREE.RingGeometry(ring.innerRadius, ring.outerRadius, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        map: this.textureLoader.load(ring.texture),
        side: THREE.DoubleSide,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      obj.add(ringMesh);
      ringMesh.position.x = position;
      ringMesh.rotation.x = -0.5 * Math.PI;
    }
    this.scene.add(obj);
    mesh.position.x = position;
    return { mesh, obj };
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

    //Self-rotation
    this.sun.rotation.y += 0.004;
    this.mercury.mesh.rotateY(0.004);
    this.venus.mesh.rotateY(0.002);
    this.earth.mesh.rotateY(0.02);
    this.mars.mesh.rotateY(0.018);
    this.jupiter.mesh.rotateY(0.04);
    this.saturn.mesh.rotateY(0.038);
    this.uranus.mesh.rotateY(0.03);
    this.neptune.mesh.rotateY(0.032);
    this.pluto.mesh.rotateY(0.008);

    // Rotation Around Sun
    this.mercury.obj.rotateY(0.04);
    this.venus.obj.rotateY(0.015);
    this.earth.obj.rotateY(0.01);
    this.mars.obj.rotateY(0.008);
    this.jupiter.obj.rotateY(0.002);
    this.saturn.obj.rotateY(0.0009);
    this.uranus.obj.rotateY(0.0004);
    this.neptune.obj.rotateY(0.0001);
    this.pluto.obj.rotateY(0.00007);

    // Stars Rotation for Depth Effect
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
customElements.define('solar-system', SolarSystem);
