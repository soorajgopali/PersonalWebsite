import * as THREE from "three";
import { clamp, damp } from "../utils/math";

export interface SceneConfig {
  cameraPosition: THREE.Vector3;
  cameraTarget: THREE.Vector3;
  fogColor: number;
  fogDensity: number;
  ambientIntensity: number;
  particleCount: number;
  particleColor: number;
  accentColor: number;
}

export const SCENE_CONFIGS: SceneConfig[] = [
  // 01 - INTRO: Close, intimate
  {
    cameraPosition: new THREE.Vector3(0, 0, 6),
    cameraTarget: new THREE.Vector3(0, 0, 0),
    fogColor: 0x050505,
    fogDensity: 0.04,
    ambientIntensity: 0.3,
    particleCount: 300,
    particleColor: 0x00e5ff,
    accentColor: 0x00e5ff,
  },
  // 02 - ABOUT: Pull back, reveal
  {
    cameraPosition: new THREE.Vector3(0, 0, 10),
    cameraTarget: new THREE.Vector3(0, 0, 0),
    fogColor: 0x050505,
    fogDensity: 0.03,
    ambientIntensity: 0.4,
    particleCount: 400,
    particleColor: 0x7c3aed,
    accentColor: 0x7c3aed,
  },
  // 03 - EXPERIENCE: Travel through
  {
    cameraPosition: new THREE.Vector3(4, 1, 8),
    cameraTarget: new THREE.Vector3(0, 0, 0),
    fogColor: 0x050505,
    fogDensity: 0.035,
    ambientIntensity: 0.35,
    particleCount: 350,
    particleColor: 0x00e5ff,
    accentColor: 0x00e5ff,
  },
  // 04 - TECHNOLOGY: Enter digital space
  {
    cameraPosition: new THREE.Vector3(-3, 0, 7),
    cameraTarget: new THREE.Vector3(0, 0, 0),
    fogColor: 0x050505,
    fogDensity: 0.025,
    ambientIntensity: 0.5,
    particleCount: 500,
    particleColor: 0x7c3aed,
    accentColor: 0x7c3aed,
  },
  // 05 - PROJECTS: Approach
  {
    cameraPosition: new THREE.Vector3(0, 2, 9),
    cameraTarget: new THREE.Vector3(0, 0, 0),
    fogColor: 0x050505,
    fogDensity: 0.03,
    ambientIntensity: 0.4,
    particleCount: 400,
    particleColor: 0xff3cac,
    accentColor: 0xff3cac,
  },
  // 06 - EDUCATION: Settle
  {
    cameraPosition: new THREE.Vector3(0, -1, 11),
    cameraTarget: new THREE.Vector3(0, 0, 0),
    fogColor: 0x050505,
    fogDensity: 0.035,
    ambientIntensity: 0.35,
    particleCount: 300,
    particleColor: 0x00e5ff,
    accentColor: 0x00e5ff,
  },
  // 07 - CONTACT: Calm final
  {
    cameraPosition: new THREE.Vector3(0, 0, 14),
    cameraTarget: new THREE.Vector3(0, 0, 0),
    fogColor: 0x050505,
    fogDensity: 0.02,
    ambientIntensity: 0.6,
    particleCount: 200,
    particleColor: 0x00e5ff,
    accentColor: 0x00e5ff,
  },
];

export class SceneManager {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private container: HTMLElement;
  private clock: THREE.Clock;
  private animationId: number | null = null;

  private currentConfig: SceneConfig;
  private targetConfig: SceneConfig;

  private particles: THREE.Points | null = null;
  private particlePositions: Float32Array | null = null;
  private particleVelocities: Float32Array | null = null;

  private structures: THREE.Mesh[] = [];
  private gridHelper: THREE.GridHelper | null = null;
  private ambientLight: THREE.AmbientLight | null = null;
  private pointLights: THREE.PointLight[] = [];

  private mousePos = { x: 0, y: 0 };
  private scrollProgress = 0;
  private activeScene = 0;
  private onResize: () => void;
  private onMouseMove: (e: MouseEvent) => void;

  constructor(container: HTMLElement) {
    this.container = container;
    this.clock = new THREE.Clock();
    this.currentConfig = SCENE_CONFIGS[0];
    this.targetConfig = SCENE_CONFIGS[0];

    // Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(this.currentConfig.fogColor, this.currentConfig.fogDensity);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.copy(this.currentConfig.cameraPosition);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x050505, 1);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    container.appendChild(this.renderer.domElement);

    // Lighting
    this.ambientLight = new THREE.AmbientLight(0x404040, this.currentConfig.ambientIntensity);
    this.scene.add(this.ambientLight);

    const pointLight1 = new THREE.PointLight(this.currentConfig.accentColor, 2, 30);
    pointLight1.position.set(5, 5, 5);
    this.scene.add(pointLight1);
    this.pointLights.push(pointLight1);

    const pointLight2 = new THREE.PointLight(0x7c3aed, 1.5, 30);
    pointLight2.position.set(-5, -5, 5);
    this.scene.add(pointLight2);
    this.pointLights.push(pointLight2);

    // Grid
    this.gridHelper = new THREE.GridHelper(80, 80, 0x00e5ff, 0x1a1a2e);
    this.gridHelper.position.y = -6;
    (this.gridHelper.material as THREE.Material).transparent = true;
    (this.gridHelper.material as THREE.Material).opacity = 0.08;
    this.scene.add(this.gridHelper);

    // Particles
    this.createParticles();

    // Floating structures
    this.createStructures();

    // Events
    this.onResize = this.handleResize.bind(this);
    this.onMouseMove = this.handleMouseMove.bind(this);
    window.addEventListener("resize", this.onResize);
    window.addEventListener("mousemove", this.onMouseMove);

  }

  private createParticles() {
    const count = this.currentConfig.particleCount;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    this.particleVelocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30 - 5;

      const t = Math.random();
      const color = new THREE.Color();
      color.setHSL(0.5 + t * 0.2, 0.8, 0.5 + t * 0.3);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      this.particleVelocities[i * 3] = (Math.random() - 0.5) * 0.02;
      this.particleVelocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      this.particleVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    this.particlePositions = geometry.attributes.position.array as Float32Array;

    const material = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  private createStructures() {
    const geometries = [
      new THREE.IcosahedronGeometry(0.6, 0),
      new THREE.OctahedronGeometry(0.5, 0),
      new THREE.TetrahedronGeometry(0.4, 0),
      new THREE.BoxGeometry(0.5, 0.5, 0.5),
      new THREE.TorusGeometry(0.4, 0.15, 8, 16),
    ];

    for (let i = 0; i < 20; i++) {
      const geo = geometries[i % geometries.length];
      const mat = new THREE.MeshBasicMaterial({
        color: i % 3 === 0 ? 0x00e5ff : i % 3 === 1 ? 0x7c3aed : 0xff3cac,
        wireframe: true,
        transparent: true,
        opacity: 0.12,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        (Math.random() - 0.5) * 35,
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 20 - 5
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      mesh.userData = {
        rotSpeed: { x: 0.002 + Math.random() * 0.003, y: 0.001 + Math.random() * 0.002 },
        floatSpeed: 0.3 + Math.random() * 0.5,
        floatOffset: Math.random() * Math.PI * 2,
        originalY: mesh.position.y,
      };
      this.scene.add(mesh);
      this.structures.push(mesh);
    }
  }

  private handleResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private handleMouseMove(e: MouseEvent) {
    this.mousePos.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mousePos.y = (e.clientY / window.innerHeight) * 2 - 1;
  }

  updateScrollProgress(progress: number) {
    this.scrollProgress = clamp(progress, 0, 1);
  }

  updateActiveScene(scene: number) {
    this.activeScene = clamp(scene, 0, SCENE_CONFIGS.length - 1);
    this.targetConfig = SCENE_CONFIGS[this.activeScene];
  }

  updateMousePos(x: number, y: number) {
    this.mousePos.x = x;
    this.mousePos.y = y;
  }

  start() {
    const animate = () => {
      this.animationId = requestAnimationFrame(animate);
      const dt = Math.min(this.clock.getDelta(), 0.1);
      const elapsed = this.clock.getElapsedTime();

      // Interpolate fog
      if (this.scene.fog instanceof THREE.FogExp2) {
        this.scene.fog.density = damp(this.scene.fog.density, this.targetConfig.fogDensity, 0.01, dt);
      }

      // Interpolate camera
      const targetPos = this.targetConfig.cameraPosition;
      const targetLook = this.targetConfig.cameraTarget;

      // Add scroll-based offset
      const scrollOffset = this.scrollProgress * 3;
      const mouseOffsetX = this.mousePos.x * 0.5;
      const mouseOffsetY = -this.mousePos.y * 0.3;

      this.camera.position.x = damp(this.camera.position.x, targetPos.x + scrollOffset * 0.3 + mouseOffsetX, 0.02, dt);
      this.camera.position.y = damp(this.camera.position.y, targetPos.y + mouseOffsetY, 0.02, dt);
      this.camera.position.z = damp(this.camera.position.z, targetPos.z + scrollOffset, 0.02, dt);

      // Camera look target
      const currentLook = new THREE.Vector3();
      this.camera.getWorldDirection(currentLook);
      const lookTarget = new THREE.Vector3(targetLook.x, targetLook.y, targetLook.z);
      this.camera.lookAt(lookTarget);

      // Animate particles
      if (this.particles && this.particlePositions && this.particleVelocities) {
        const positions = this.particles.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < positions.length; i += 3) {
          positions[i] += this.particleVelocities[i];
          positions[i + 1] += this.particleVelocities[i + 1];
          positions[i + 2] += this.particleVelocities[i + 2];

          // Wrap around
          if (positions[i] > 25) positions[i] = -25;
          if (positions[i] < -25) positions[i] = 25;
          if (positions[i + 1] > 25) positions[i + 1] = -25;
          if (positions[i + 1] < -25) positions[i + 1] = 25;
          if (positions[i + 2] > 10) positions[i + 2] = -10;
          if (positions[i + 2] < -15) positions[i + 2] = 10;
        }
        this.particles.geometry.attributes.position.needsUpdate = true;
        this.particles.rotation.y = elapsed * 0.015;
        this.particles.rotation.x = elapsed * 0.008;
      }

      // Animate structures
      this.structures.forEach((mesh) => {
        const { rotSpeed, floatSpeed, floatOffset, originalY } = mesh.userData;
        mesh.rotation.x += rotSpeed.x;
        mesh.rotation.y += rotSpeed.y;
        mesh.position.y = originalY + Math.sin(elapsed * floatSpeed + floatOffset) * 0.5;
      });

      // Grid pulse
      if (this.gridHelper) {
        (this.gridHelper.material as THREE.Material).opacity =
          0.06 + Math.sin(elapsed * 0.4) * 0.03;
      }

      // Light animation
      this.pointLights.forEach((light, i) => {
        light.position.x = Math.sin(elapsed * 0.3 + i * 2) * 6;
        light.position.y = Math.cos(elapsed * 0.4 + i * 2) * 4;
      });

      this.renderer.render(this.scene, this.camera);
    };

    animate();
  }

  stop() {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  dispose() {
    this.stop();
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("mousemove", this.onMouseMove);
    this.renderer.dispose();
    if (this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
  }

  getScene() {
    return this.scene;
  }

  getCamera() {
    return this.camera;
  }

  getRenderer() {
    return this.renderer;
  }
}
