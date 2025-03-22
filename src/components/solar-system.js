import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

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
    this.sun = null;
    this.stars = null;
    this.ambientLight = null;
    this.lightFromSun = null;
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
    this.controls.update();

    this.ambientLight = new THREE.AmbientLight(0x333333, 5);
    this.scene.add(this.ambientLight);

    // Earth
    const sunGeo = new THREE.SphereGeometry(16, 30, 30);
    const sunMat = new THREE.MeshBasicMaterial({
      map: this.textureLoader.load(sunTexture),
      emissive: 0xffff00, // Make it glow yellow
      emissiveIntensity: 5, // Adjust brightness
    });
    this.sun = new THREE.Mesh(sunGeo, sunMat);
    this.scene.add(this.sun);

    // Add Planets
    this.mercury = this.createPlanet(mercuryTexture, 3.2, 28);
    this.venus = this.createPlanet(venusTexture, 5.8, 44);
    this.earth = this.createPlanet(earthTexture, 6, 62);
    this.mars = this.createPlanet(marsTexture, 4, 78);
    this.jupiter = this.createPlanet(jupiterTexture, 12, 100);
    this.saturn = this.createPlanet(saturnTexture, 10, 138, {
      innerRadius: 10,
      outerRadius: 20,
      texture: saturnRingTexture,
    });
    this.uranus = this.createPlanet(uranusTexture, 7, 176, {
      innerRadius: 7,
      outerRadius: 12,
      texture: uranusRingTexture,
    });
    this.neptune = this.createPlanet(neptuneTexture, 7, 200);
    this.pluto = this.createPlanet(plutoTexture, 2.8, 216);

    // const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    // directionalLight.position.set(100, 100, 100);
    // this.scene.add(directionalLight);

    this.lightFromSun = new THREE.PointLight(0xffffff, 5000, 50000);
    this.lightFromSun.position.set(0, 0, 0);
    this.scene.add(this.lightFromSun);
    this.lightFromSun.castShadow = true;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Helpers
    // this.axesHelper = new THREE.AxesHelper(5);
    // this.scene.add(this.axesHelper);

    // this.lightHelper = new THREE.PointLightHelper(this.lightFromSun, 10);
    // this.scene.add(this.lightHelper);

    // this.gridHelper = new THREE.GridHelper(200, 50);
    // this.scene.add(this.gridHelper);

    // Create Colorful Stars (Nebula Effect)
    this.addNebulaStars();

    // Start Animation
    this.animate();

    // Handle Window Resize
    window.addEventListener('resize', () => this.onResize());
  }

  createPlanet(texture, size, position, ring) {
    const geo = new THREE.SphereGeometry(size, 30, 30);
    const mat = new THREE.MeshStandardMaterial({
      map: this.textureLoader.load(texture),
      roughness: 0.5,
      metalness: 0.1,
    });
    const mesh = new THREE.Mesh(geo, mat);
    const obj = new THREE.Object3D();
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    obj.add(mesh);
    if (ring) {
      const ringGeo = new THREE.RingGeometry(ring.innerRadius, ring.outerRadius, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        map: this.textureLoader.load(ring.texture),
        side: THREE.DoubleSide,
        transparent: true,
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
    this.sun.rotateY(0.004);
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
