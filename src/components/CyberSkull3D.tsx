import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Eye, Shield, Zap, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { soundFX } from '../utils/audio';

export type EyeColorMode = 'cyan' | 'red' | 'gold';

interface CyberSkull3DProps {
  className?: string;
  onAssemblyComplete?: () => void;
}

interface AssemblyComponent {
  mesh: THREE.Object3D;
  targetPos: THREE.Vector3;
  targetRot: THREE.Euler;
  explodedPos: THREE.Vector3;
  explodedRot: THREE.Euler;
  delay: number;
}

class CyberSkullErrorBoundary extends React.Component<
  { children: React.ReactNode; className?: string },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; className?: string }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.warn('CyberSkull3D caught render error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={`relative w-full h-[520px] rounded-3xl bg-space-950/80 border border-white/10 flex flex-col items-center justify-center p-8 text-center ${this.props.className || ''}`}>
          <div className="w-20 h-20 rounded-full bg-space-900 border border-luxury-gold/40 flex items-center justify-center mb-4">
            <Shield className="w-10 h-10 text-luxury-gold" />
          </div>
          <div className="font-display font-bold text-lg text-white">SKILLNOVA AI COGNITIVE CORE</div>
          <p className="text-xs text-slate-400 mt-2 max-w-sm">
            High-performance cognitive engine active. Hardware 3D rendering unavailable in current environment.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

const CyberSkull3DContent: React.FC<CyberSkull3DProps> = ({
  className = '',
  onAssemblyComplete
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // UI state
  const [activeScene, setActiveScene] = useState<'intro' | 'assembly' | 'reveal' | 'interactive'>('intro');
  const [eyeColor, setEyeColor] = useState<EyeColorMode>('cyan');
  const [wireframeMode, setWireframeMode] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(soundFX.isEnabled());
  const [telemetryOpen, setTelemetryOpen] = useState<boolean>(false);
  const [webGLSupported, setWebGLSupported] = useState<boolean>(true);

  // References for Three.js instance
  const threeRefs = useRef<{
    renderer: THREE.WebGLRenderer | null;
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    rootGroup: THREE.Group | null;
    headGroup: THREE.Group | null;
    mandibleGroup: THREE.Group | null;
    leftPistonRod: THREE.Object3D | null;
    rightPistonRod: THREE.Object3D | null;
    leftPistonBase: THREE.Object3D | null;
    rightPistonBase: THREE.Object3D | null;
    eyeMaterials: THREE.MeshStandardMaterial[];
    eyeLights: THREE.PointLight[];
    sparkPoints: THREE.Points | null;
    assemblyParts: AssemblyComponent[];
    allMaterials: THREE.Material[];
    animationFrameId: number;
    assemblyProgress: number; // 0 (exploded) to 1 (assembled)
    targetAssemblyProgress: number;
    sceneState: 'intro' | 'assembly' | 'reveal' | 'interactive';
    sceneTimer: number;
    targetRotation: { x: number; y: number };
    mousePos: { x: number; y: number };
    isHovered: boolean;
    jawOpenAngle: number;
    targetJawAngle: number;
  }>({
    renderer: null,
    scene: null,
    camera: null,
    rootGroup: null,
    headGroup: null,
    mandibleGroup: null,
    leftPistonRod: null,
    rightPistonRod: null,
    leftPistonBase: null,
    rightPistonBase: null,
    eyeMaterials: [],
    eyeLights: [],
    sparkPoints: null,
    assemblyParts: [],
    allMaterials: [],
    animationFrameId: 0,
    assemblyProgress: 0,
    targetAssemblyProgress: 0,
    sceneState: 'intro',
    sceneTimer: 0,
    targetRotation: { x: 0, y: 0 },
    mousePos: { x: 0, y: 0 },
    isHovered: false,
    jawOpenAngle: 0,
    targetJawAngle: 0
  });

  const getEyeColorHex = useCallback((mode: EyeColorMode) => {
    switch (mode) {
      case 'red': return 0xff1a40;
      case 'gold': return 0xd4af37;
      case 'cyan':
      default:
        return 0x00f0ff;
    }
  }, []);

  // Trigger assembly sequence
  const startSequence = useCallback(() => {
    const refs = threeRefs.current;
    refs.sceneState = 'intro';
    refs.sceneTimer = 0;
    refs.assemblyProgress = 0;
    refs.targetAssemblyProgress = 0;
    refs.jawOpenAngle = 0;
    refs.targetJawAngle = 0;
    setActiveScene('intro');
  }, []);

  // Toggle wireframe on all materials
  const toggleWireframe = () => {
    soundFX.click();
    const next = !wireframeMode;
    setWireframeMode(next);
    threeRefs.current.allMaterials.forEach((mat) => {
      if ('wireframe' in mat) {
        (mat as THREE.MeshStandardMaterial).wireframe = next;
      }
    });
  };

  // Switch eye color
  const changeEyeColor = (mode: EyeColorMode) => {
    soundFX.click();
    setEyeColor(mode);
    const colorHex = getEyeColorHex(mode);
    threeRefs.current.eyeMaterials.forEach((mat) => {
      mat.emissive.setHex(colorHex);
    });
    threeRefs.current.eyeLights.forEach((light) => {
      light.color.setHex(colorHex);
    });
  };

  // Test jaw hydraulic articulation
  const articulateJaw = () => {
    soundFX.servo();
    const refs = threeRefs.current;
    refs.targetJawAngle = 0.28; // ~16 degrees
    setTimeout(() => {
      refs.targetJawAngle = 0;
      soundFX.mechLock();
    }, 450);
  };

  useEffect(() => {
    const container = mountRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
    } catch (e) {
      console.warn('WebGL context creation failed, enabling fallback:', e);
      setWebGLSupported(false);
      return;
    }

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 560;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x06080d, 0.08);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 0.2, 5.0);
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    // 2. Procedural Studio Reflection Map via PMREMGenerator
    try {
      const pmremGen = new THREE.PMREMGenerator(renderer);
      pmremGen.compileEquirectangularShader();
      const envCanvas = document.createElement('canvas');
      envCanvas.width = 512;
      envCanvas.height = 256;
      const envCtx = envCanvas.getContext('2d');
      if (envCtx) {
        const grad = envCtx.createLinearGradient(0, 0, 0, 256);
        grad.addColorStop(0, '#1a2234');
        grad.addColorStop(0.35, '#2b3954');
        grad.addColorStop(0.5, '#05070a');
        grad.addColorStop(0.65, '#090e18');
        grad.addColorStop(1, '#020305');
        envCtx.fillStyle = grad;
        envCtx.fillRect(0, 0, 512, 256);

        // Studio softboxes highlights
        envCtx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        envCtx.fillRect(60, 40, 140, 60);
        envCtx.fillStyle = 'rgba(0, 240, 255, 0.45)';
        envCtx.fillRect(320, 50, 120, 70);

        const envTexture = new THREE.CanvasTexture(envCanvas);
        envTexture.mapping = THREE.EquirectangularReflectionMapping;
        const envMap = pmremGen.fromEquirectangular(envTexture).texture;
        scene.environment = envMap;
        envTexture.dispose();
        pmremGen.dispose();
      }
    } catch (e) {
      console.warn('Environment map generation skipped:', e);
    }

    // 3. Cinematic Lighting Setup
    const ambientLight = new THREE.AmbientLight(0x0e1422, 0.8);
    scene.add(ambientLight);

    // Key front-top light
    const keyLight = new THREE.DirectionalLight(0xf4f7ff, 2.8);
    keyLight.position.set(2.5, 4.0, 3.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    // Cyan high-angle rim backlight
    const rimLightCyan = new THREE.DirectionalLight(0x00d4ff, 4.2);
    rimLightCyan.position.set(-3.0, 2.5, -3.0);
    scene.add(rimLightCyan);

    // Subtle crimson/purple side fill
    const rimLightPurple = new THREE.DirectionalLight(0x7928ca, 2.2);
    rimLightPurple.position.set(3.0, -1.0, -2.5);
    scene.add(rimLightPurple);

    // Soft chin spotlight
    const chinLight = new THREE.PointLight(0x22385a, 2.0, 6, 2);
    chinLight.position.set(0, -2.2, 1.8);
    scene.add(chinLight);

    // 4. Materials Library
    const mats: THREE.Material[] = [];

    // Polished Black Titanium Armor
    const blackTitaniumMat = new THREE.MeshStandardMaterial({
      color: 0x0c0f16,
      roughness: 0.2,
      metalness: 0.94,
      envMapIntensity: 1.6
    });
    mats.push(blackTitaniumMat);

    // Polished Chrome / Mirrored Steel
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xdde3ea,
      roughness: 0.08,
      metalness: 1.0,
      envMapIntensity: 2.2
    });
    mats.push(chromeMat);

    // Brushed Dark Gunmetal Chassis Frame
    const gunmetalMat = new THREE.MeshStandardMaterial({
      color: 0x181e28,
      roughness: 0.45,
      metalness: 0.88,
      envMapIntensity: 1.2
    });
    mats.push(gunmetalMat);

    // High-Tech Carbon Core
    const carbonMat = new THREE.MeshStandardMaterial({
      color: 0x08090d,
      roughness: 0.65,
      metalness: 0.4
    });
    mats.push(carbonMat);

    // Copper Heat Exchange Accents
    const copperMat = new THREE.MeshStandardMaterial({
      color: 0xb87333,
      roughness: 0.28,
      metalness: 0.95
    });
    mats.push(copperMat);

    // Ocular Lenses
    const eyeMat = new THREE.MeshStandardMaterial({
      color: 0x020508,
      emissive: getEyeColorHex(eyeColor),
      emissiveIntensity: 3.2,
      roughness: 0.1,
      metalness: 0.6,
      transparent: true,
      opacity: 0.95
    });
    mats.push(eyeMat);

    // Inner Laser Pupil Core
    const eyeCoreMat = new THREE.MeshBasicMaterial({
      color: 0xffffff
    });
    mats.push(eyeCoreMat);

    // 5. Constructing Anatomical Robot Skull Assembly
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const headGroup = new THREE.Group();
    rootGroup.add(headGroup);

    const assemblyParts: AssemblyComponent[] = [];

    // Helper: Register assembly part with exploded vectors
    const registerPart = (
      mesh: THREE.Object3D,
      explodedOffset: THREE.Vector3,
      explodedRotOffset: THREE.Euler,
      delay: number
    ) => {
      assemblyParts.push({
        mesh,
        targetPos: mesh.position.clone(),
        targetRot: mesh.rotation.clone(),
        explodedPos: mesh.position.clone().add(explodedOffset),
        explodedRot: new THREE.Euler(
          mesh.rotation.x + explodedRotOffset.x,
          mesh.rotation.y + explodedRotOffset.y,
          mesh.rotation.z + explodedRotOffset.z
        ),
        delay
      });
    };

    // A. CRANIUM DOME & CROWN ARMOR
    // 1. Central Frontal Forehead Armor Plate
    const frontalGeo = new THREE.BoxGeometry(1.05, 0.72, 0.28, 4, 4, 2);
    // Bevel front curve
    const frontalPos = frontalGeo.attributes.position;
    for (let i = 0; i < frontalPos.count; i++) {
      const z = frontalPos.getZ(i);
      const x = frontalPos.getX(i);
      const y = frontalPos.getY(i);
      if (z > 0) {
        frontalPos.setZ(i, z - (x * x * 0.22) - (y > 0 ? y * y * 0.15 : 0));
      }
    }
    frontalGeo.computeVertexNormals();
    const frontalMesh = new THREE.Mesh(frontalGeo, blackTitaniumMat);
    frontalMesh.position.set(0, 0.88, 0.52);
    frontalMesh.rotation.set(-0.18, 0, 0);
    headGroup.add(frontalMesh);
    registerPart(
      frontalMesh,
      new THREE.Vector3(0, 1.6, 2.2),
      new THREE.Euler(-0.4, 0, 0),
      0.05
    );

    // 2. Left & Right Parietal Armor Shells (Crown Lobes)
    const parietalGeo = new THREE.BoxGeometry(0.68, 0.85, 0.95, 3, 3, 3);
    const pPos = parietalGeo.attributes.position;
    for (let i = 0; i < pPos.count; i++) {
      const x = pPos.getX(i);
      const y = pPos.getY(i);
      const z = pPos.getZ(i);
      pPos.setX(i, x * (1 - y * 0.18));
      pPos.setZ(i, z * (1 - y * 0.15));
    }
    parietalGeo.computeVertexNormals();

    const leftParietal = new THREE.Mesh(parietalGeo, blackTitaniumMat);
    leftParietal.position.set(-0.54, 0.98, -0.05);
    leftParietal.rotation.set(0.1, 0, 0.14);
    headGroup.add(leftParietal);
    registerPart(
      leftParietal,
      new THREE.Vector3(-2.2, 1.4, 0.5),
      new THREE.Euler(0, 0.6, 0.4),
      0.1
    );

    const rightParietal = new THREE.Mesh(parietalGeo, blackTitaniumMat);
    rightParietal.position.set(0.54, 0.98, -0.05);
    rightParietal.rotation.set(0.1, 0, -0.14);
    headGroup.add(rightParietal);
    registerPart(
      rightParietal,
      new THREE.Vector3(2.2, 1.4, 0.5),
      new THREE.Euler(0, -0.6, -0.4),
      0.12
    );

    // 3. Central Sagittal Cyber-Spine Runner (Dorsal crest)
    const crestGeo = new THREE.BoxGeometry(0.18, 1.1, 1.35, 2, 8, 8);
    const crestMesh = new THREE.Mesh(crestGeo, chromeMat);
    crestMesh.position.set(0, 1.1, -0.05);
    crestMesh.rotation.set(0.1, 0, 0);
    headGroup.add(crestMesh);
    registerPart(
      crestMesh,
      new THREE.Vector3(0, 2.5, -0.6),
      new THREE.Euler(-0.5, 0, 0),
      0.15
    );

    // 4. Occipital Rear Heat Sink Cowl (Back of Head)
    const occipitalGroup = new THREE.Group();
    for (let fin = 0; fin < 5; fin++) {
      const finMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.88 - fin * 0.08, 0.04, 0.35),
        chromeMat
      );
      finMesh.position.set(0, 0.5 + fin * 0.12, -0.7 - fin * 0.04);
      occipitalGroup.add(finMesh);
    }
    headGroup.add(occipitalGroup);
    registerPart(
      occipitalGroup,
      new THREE.Vector3(0, 0.5, -2.6),
      new THREE.Euler(0.4, 0, 0),
      0.18
    );

    // B. TEMPLE ROTARY NODES (Left & Right)
    const templeGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.38, 24);
    const leftTemple = new THREE.Group();
    const leftTempleCyl = new THREE.Mesh(templeGeo, blackTitaniumMat);
    leftTempleCyl.rotation.z = Math.PI / 2;
    leftTemple.add(leftTempleCyl);
    const leftCoil = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.035, 12, 24), copperMat);
    leftCoil.rotation.y = Math.PI / 2;
    leftTemple.add(leftCoil);
    leftTemple.position.set(-0.84, 0.45, 0.05);
    headGroup.add(leftTemple);
    registerPart(
      leftTemple,
      new THREE.Vector3(-2.8, 0.2, 0.2),
      new THREE.Euler(0, 0, 0.8),
      0.2
    );

    const rightTemple = new THREE.Group();
    const rightTempleCyl = new THREE.Mesh(templeGeo, blackTitaniumMat);
    rightTempleCyl.rotation.z = Math.PI / 2;
    rightTemple.add(rightTempleCyl);
    const rightCoil = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.035, 12, 24), copperMat);
    rightCoil.rotation.y = Math.PI / 2;
    rightTemple.add(rightCoil);
    rightTemple.position.set(0.84, 0.45, 0.05);
    headGroup.add(rightTemple);
    registerPart(
      rightTemple,
      new THREE.Vector3(2.8, 0.2, 0.2),
      new THREE.Euler(0, 0, -0.8),
      0.2
    );

    // C. FACIAL ARTIFACTS: BROW, ORBITAL CAVITIES, OCULAR UNITS
    // 1. Aggressive Supraorbital Brow Ridge (Sharp titanium bar)
    const browGeo = new THREE.BoxGeometry(1.28, 0.22, 0.42, 4, 2, 2);
    const bPos = browGeo.attributes.position;
    for (let i = 0; i < bPos.count; i++) {
      const x = bPos.getX(i);
      const y = bPos.getY(i);
      // Sweep back at temples and angle down menacingly toward nose center
      bPos.setZ(i, bPos.getZ(i) - Math.abs(x) * 0.25);
      if (Math.abs(x) < 0.25 && y < 0) {
        bPos.setY(i, y - 0.08); // center nasion drop
      }
    }
    browGeo.computeVertexNormals();
    const browMesh = new THREE.Mesh(browGeo, blackTitaniumMat);
    browMesh.position.set(0, 0.52, 0.68);
    headGroup.add(browMesh);
    registerPart(
      browMesh,
      new THREE.Vector3(0, 1.2, 1.8),
      new THREE.Euler(-0.35, 0, 0),
      0.22
    );

    // 2. Dual Ocular Eye Units
    const eyeLights: THREE.PointLight[] = [];
    const eyeMaterials: THREE.MeshStandardMaterial[] = [eyeMat];

    const createEyeUnit = (isLeft: boolean) => {
      const eyeGroup = new THREE.Group();

      // Orbital socket rim
      const socketRim = new THREE.Mesh(
        new THREE.TorusGeometry(0.24, 0.04, 16, 24),
        gunmetalMat
      );
      eyeGroup.add(socketRim);

      // Gimbal ring
      const gimbalRing = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.22, 0.08, 16),
        chromeMat
      );
      gimbalRing.rotation.x = Math.PI / 2;
      eyeGroup.add(gimbalRing);

      // Glowing lens sphere
      const lensSphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 24, 24),
        eyeMat
      );
      lensSphere.position.z = 0.04;
      eyeGroup.add(lensSphere);

      // Inner laser diode core
      const coreDiode = new THREE.Mesh(
        new THREE.SphereGeometry(0.045, 16, 16),
        eyeCoreMat
      );
      coreDiode.position.z = 0.12;
      eyeGroup.add(coreDiode);

      // Point Light from eye
      const pLight = new THREE.PointLight(getEyeColorHex(eyeColor), 3.0, 4.5, 2);
      pLight.position.set(0, 0, 0.35);
      eyeGroup.add(pLight);
      eyeLights.push(pLight);

      eyeGroup.position.set(isLeft ? -0.38 : 0.38, 0.34, 0.62);
      eyeGroup.rotation.y = isLeft ? 0.08 : -0.08;
      headGroup.add(eyeGroup);

      registerPart(
        eyeGroup,
        new THREE.Vector3(isLeft ? -1.4 : 1.4, 0.8, 2.0),
        new THREE.Euler(0, isLeft ? 0.4 : -0.4, 0),
        0.26
      );
    };

    createEyeUnit(true);  // Left Eye
    createEyeUnit(false); // Right Eye

    // 3. Nasal Bridge & Air Intake Honeycomb
    const nasalGeo = new THREE.ConeGeometry(0.22, 0.48, 4);
    nasalGeo.rotateX(Math.PI);
    const nasalMesh = new THREE.Mesh(nasalGeo, blackTitaniumMat);
    nasalMesh.position.set(0, 0.15, 0.74);
    nasalMesh.scale.set(0.85, 1, 0.45);
    headGroup.add(nasalMesh);
    registerPart(
      nasalMesh,
      new THREE.Vector3(0, -0.4, 1.8),
      new THREE.Euler(0.2, 0, 0),
      0.28
    );

    // 4. Zygomatic Cheekbone Arches (Left & Right)
    const cheekGeo = new THREE.BoxGeometry(0.48, 0.22, 0.65);
    const leftCheek = new THREE.Mesh(cheekGeo, blackTitaniumMat);
    leftCheek.position.set(-0.62, 0.14, 0.42);
    leftCheek.rotation.set(-0.15, -0.35, -0.2);
    headGroup.add(leftCheek);
    registerPart(
      leftCheek,
      new THREE.Vector3(-2.2, -0.5, 1.2),
      new THREE.Euler(0.3, -0.5, 0),
      0.3
    );

    const rightCheek = new THREE.Mesh(cheekGeo, blackTitaniumMat);
    rightCheek.position.set(0.62, 0.14, 0.42);
    rightCheek.rotation.set(-0.15, 0.35, 0.2);
    headGroup.add(rightCheek);
    registerPart(
      rightCheek,
      new THREE.Vector3(2.2, -0.5, 1.2),
      new THREE.Euler(0.3, 0.5, 0),
      0.3
    );

    // 5. Upper Maxilla & Upper Dental Grill
    const maxillaMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.82, 0.22, 0.52),
      gunmetalMat
    );
    maxillaMesh.position.set(0, -0.14, 0.58);
    headGroup.add(maxillaMesh);
    registerPart(
      maxillaMesh,
      new THREE.Vector3(0, -1.2, 1.5),
      new THREE.Euler(0.3, 0, 0),
      0.32
    );

    // Upper Teeth Bank
    const upperTeethGroup = new THREE.Group();
    for (let t = -4; t <= 4; t++) {
      const tooth = new THREE.Mesh(
        new THREE.BoxGeometry(0.065, 0.14, 0.09),
        chromeMat
      );
      const angle = (t / 4) * 0.45;
      tooth.position.set(Math.sin(angle) * 0.32, -0.22, Math.cos(angle) * 0.32 + 0.32);
      tooth.rotation.y = angle;
      upperTeethGroup.add(tooth);
    }
    headGroup.add(upperTeethGroup);
    registerPart(
      upperTeethGroup,
      new THREE.Vector3(0, -1.5, 1.6),
      new THREE.Euler(0.2, 0, 0),
      0.34
    );

    // D. ARTICULATED MANDIBLE (LOWER JAW) & HYDRAULIC PISTONS
    const mandibleGroup = new THREE.Group();
    // Pivot located at temporal-mandibular joint
    mandibleGroup.position.set(0, 0.1, -0.05);

    // Lower Jaw Chin & Body
    const chinMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.38, 0.55),
      blackTitaniumMat
    );
    chinMesh.position.set(0, -0.52, 0.58);
    mandibleGroup.add(chinMesh);

    // Lower Jaw Lateral Rami (Arm bars reaching back to pivot)
    const leftRamus = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.45, 0.65),
      gunmetalMat
    );
    leftRamus.position.set(-0.48, -0.32, 0.18);
    leftRamus.rotation.set(-0.35, 0.2, 0);
    mandibleGroup.add(leftRamus);

    const rightRamus = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.45, 0.65),
      gunmetalMat
    );
    rightRamus.position.set(0.48, -0.32, 0.18);
    rightRamus.rotation.set(-0.35, -0.2, 0);
    mandibleGroup.add(rightRamus);

    // Lower Teeth Bank
    for (let t = -4; t <= 4; t++) {
      const tooth = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 0.13, 0.08),
        chromeMat
      );
      const angle = (t / 4) * 0.42;
      tooth.position.set(Math.sin(angle) * 0.3, -0.34, Math.cos(angle) * 0.3 + 0.3);
      tooth.rotation.y = angle;
      mandibleGroup.add(tooth);
    }

    headGroup.add(mandibleGroup);
    registerPart(
      mandibleGroup,
      new THREE.Vector3(0, -2.8, 1.2),
      new THREE.Euler(0.65, 0, 0),
      0.36
    );

    // Bilateral Hydraulic Pistons connecting cranium to mandible
    const pistonGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.38, 12);
    const rodGeo = new THREE.CylinderGeometry(0.024, 0.024, 0.42, 12);

    // Left Piston
    const leftPistonBase = new THREE.Mesh(pistonGeo, gunmetalMat);
    leftPistonBase.position.set(-0.68, 0.22, 0.02);
    headGroup.add(leftPistonBase);

    const leftPistonRod = new THREE.Mesh(rodGeo, chromeMat);
    leftPistonRod.position.set(-0.64, -0.24, 0.15);
    mandibleGroup.add(leftPistonRod);

    // Right Piston
    const rightPistonBase = new THREE.Mesh(pistonGeo, gunmetalMat);
    rightPistonBase.position.set(0.68, 0.22, 0.02);
    headGroup.add(rightPistonBase);

    const rightPistonRod = new THREE.Mesh(rodGeo, chromeMat);
    rightPistonRod.position.set(0.64, -0.24, 0.15);
    mandibleGroup.add(rightPistonRod);

    // E. CERVICAL SPINE BASE & INDUSTRIAL CONDUITS
    const spineGroup = new THREE.Group();
    spineGroup.position.set(0, -0.45, -0.25);

    // C1 & C2 Vertebrae Rings
    for (let v = 0; v < 3; v++) {
      const vert = new THREE.Mesh(
        new THREE.TorusGeometry(0.32 - v * 0.03, 0.08, 12, 24),
        chromeMat
      );
      vert.rotation.x = Math.PI / 2;
      vert.position.y = -v * 0.22;
      spineGroup.add(vert);
    }

    // Central Hydraulic Spine Cylinder
    const centralColumn = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.14, 0.8, 16),
      blackTitaniumMat
    );
    centralColumn.position.y = -0.3;
    spineGroup.add(centralColumn);

    // Base Chassis Collar Ring with Status Glow
    const collarMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.72, 0.82, 0.16, 32),
      blackTitaniumMat
    );
    collarMesh.position.y = -0.75;
    spineGroup.add(collarMesh);

    const collarGlowRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.74, 0.025, 8, 32),
      new THREE.MeshBasicMaterial({ color: getEyeColorHex(eyeColor) })
    );
    collarGlowRing.rotation.x = Math.PI / 2;
    collarGlowRing.position.y = -0.74;
    spineGroup.add(collarGlowRing);

    headGroup.add(spineGroup);
    registerPart(
      spineGroup,
      new THREE.Vector3(0, -2.5, -1.0),
      new THREE.Euler(-0.4, 0, 0),
      0.38
    );

    // F. SPARK PARTICLES SYSTEM (for dock connection moments)
    const sparkCount = 75;
    const sparkGeo = new THREE.BufferGeometry();
    const sparkPositions = new Float32Array(sparkCount * 3);
    const sparkVelocities = new Float32Array(sparkCount * 3);

    for (let i = 0; i < sparkCount; i++) {
      sparkPositions[i * 3] = (Math.random() - 0.5) * 1.5;
      sparkPositions[i * 3 + 1] = (Math.random() - 0.5) * 1.5 + 0.3;
      sparkPositions[i * 3 + 2] = (Math.random() - 0.5) * 1.5;

      sparkVelocities[i * 3] = (Math.random() - 0.5) * 0.03;
      sparkVelocities[i * 3 + 1] = Math.random() * 0.04;
      sparkVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.03;
    }
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));

    const sparkMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.045,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });
    const sparkPoints = new THREE.Points(sparkGeo, sparkMat);
    scene.add(sparkPoints);

    // Store references
    const refs = threeRefs.current;
    refs.renderer = renderer;
    refs.scene = scene;
    refs.camera = camera;
    refs.rootGroup = rootGroup;
    refs.headGroup = headGroup;
    refs.mandibleGroup = mandibleGroup;
    refs.leftPistonRod = leftPistonRod;
    refs.rightPistonRod = rightPistonRod;
    refs.leftPistonBase = leftPistonBase;
    refs.rightPistonBase = rightPistonBase;
    refs.eyeMaterials = eyeMaterials;
    refs.eyeLights = eyeLights;
    refs.sparkPoints = sparkPoints;
    refs.assemblyParts = assemblyParts;
    refs.allMaterials = mats;

    // Set initial exploded positions for Scene 1
    assemblyParts.forEach((part) => {
      part.mesh.position.copy(part.explodedPos);
      part.mesh.rotation.copy(part.explodedRot);
    });

    // 6. Interactive Mouse & Parallax Handling
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      refs.mousePos = { x, y };

      if (refs.sceneState === 'interactive') {
        refs.targetRotation.x = y * 0.32; // Pitch ±18 deg
        refs.targetRotation.y = x * 0.48; // Yaw ±28 deg
      }
    };

    const handleMouseEnter = () => {
      refs.isHovered = true;
    };

    const handleMouseLeave = () => {
      refs.isHovered = false;
      if (refs.sceneState === 'interactive') {
        refs.targetRotation.x = 0;
        refs.targetRotation.y = 0;
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    // 7. Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (w > 0 && h > 0 && refs.renderer && refs.camera) {
          refs.camera.aspect = w / h;
          refs.camera.updateProjectionMatrix();
          refs.renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    // 8. Main Real-time Animation Loop (60 FPS Target)
    let lastTime = performance.now();

    const animate = () => {
      refs.animationFrameId = requestAnimationFrame(animate);

      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      refs.sceneTimer += delta;

      const timer = refs.sceneTimer;

      // ─── SCENE STATE MACHINE ───
      // Scene 1: Dark Cinematic Introduction (0s - 1.8s)
      if (refs.sceneState === 'intro') {
        keyLight.intensity = Math.min(timer * 1.2, 1.4);
        rimLightCyan.intensity = Math.min(timer * 1.8, 2.5);
        camera.position.z = 4.8 - timer * 0.15;
        camera.position.y = 0.2 + Math.sin(timer * 0.8) * 0.05;

        // Gentle floating drift of exploded parts
        assemblyParts.forEach((part, idx) => {
          const wobble = Math.sin(timer * 1.5 + idx) * 0.03;
          part.mesh.position.y = part.explodedPos.y + wobble;
        });

        // Trigger Assembly Transition
        if (timer >= 1.6) {
          refs.sceneState = 'assembly';
          refs.sceneTimer = 0;
          setActiveScene('assembly');
          soundFX.servo();
        }
      }

      // Scene 2: Mechanical Assembly (0s - 3.2s)
      else if (refs.sceneState === 'assembly') {
        const progress = Math.min(timer / 2.6, 1.0);
        // Custom cubic ease [0.22, 1, 0.36, 1]
        const eased = 1 - Math.pow(1 - progress, 3);
        refs.assemblyProgress = eased;

        // Move camera closer into hero framing
        camera.position.z = 4.5 - eased * 0.75;
        camera.position.x = Math.sin(eased * Math.PI) * 0.35;
        camera.lookAt(0, 0.15, 0);

        // Interpolate every part with staggered delay
        assemblyParts.forEach((part) => {
          const partProgress = Math.max(0, Math.min(1, (eased - part.delay) / (1 - part.delay)));
          part.mesh.position.lerpVectors(part.explodedPos, part.targetPos, partProgress);
          part.mesh.rotation.x = part.explodedRot.x + (part.targetRot.x - part.explodedRot.x) * partProgress;
          part.mesh.rotation.y = part.explodedRot.y + (part.targetRot.y - part.explodedRot.y) * partProgress;
          part.mesh.rotation.z = part.explodedRot.z + (part.targetRot.z - part.explodedRot.z) * partProgress;
        });

        // Spark emission as parts snap together
        if (progress > 0.75 && sparkMat.opacity < 0.85) {
          sparkMat.opacity = Math.min(1, (progress - 0.75) * 4);
          const p = sparkPositions;
          for (let i = 0; i < sparkCount; i++) {
            p[i * 3] += sparkVelocities[i * 3];
            p[i * 3 + 1] += sparkVelocities[i * 3 + 1];
            p[i * 3 + 2] += sparkVelocities[i * 3 + 2];
          }
          sparkGeo.attributes.position.needsUpdate = true;
        }

        // Transition to Hero Reveal
        if (progress >= 1.0) {
          refs.sceneState = 'reveal';
          refs.sceneTimer = 0;
          setActiveScene('reveal');
          sparkMat.opacity = 0;
          soundFX.mechLock();
          soundFX.ocularIgnite();
        }
      }

      // Scene 3: Hero Reveal & Eye Ignition (0s - 3.0s)
      else if (refs.sceneState === 'reveal') {
        const revealP = Math.min(timer / 2.8, 1.0);

        // Ocular flare pulse
        const pulse = Math.sin(revealP * Math.PI) * 5.0 + 2.8;
        eyeMat.emissiveIntensity = pulse;
        eyeLights.forEach((light) => {
          light.intensity = pulse * 1.2;
        });

        // Presentation showcase head rotation (glances left, right, then centers)
        const rotY = Math.sin(revealP * Math.PI * 2) * 0.38;
        const rotX = Math.cos(revealP * Math.PI) * 0.12 - 0.05;
        if (headGroup) {
          headGroup.rotation.y = rotY;
          headGroup.rotation.x = rotX;
        }

        // Hydraulic jaw test flex at peak of reveal
        if (revealP > 0.35 && revealP < 0.7) {
          const jawP = Math.sin((revealP - 0.35) / 0.35 * Math.PI);
          refs.targetJawAngle = jawP * 0.22;
        } else {
          refs.targetJawAngle = 0;
        }

        // Complete reveal sequence
        if (revealP >= 1.0) {
          refs.sceneState = 'interactive';
          refs.sceneTimer = 0;
          setActiveScene('interactive');
          if (onAssemblyComplete) onAssemblyComplete();
        }
      }

      // Scene 4: Interactive Living State (Ongoing)
      else if (refs.sceneState === 'interactive') {
        // Natural micro-breathing & idle pulse
        const breath = Math.sin(timer * 1.8) * 0.015;
        const microScan = Math.sin(timer * 0.6) * 0.035;

        // Smooth damping toward mouse target
        if (headGroup) {
          headGroup.rotation.y += (refs.targetRotation.y + microScan - headGroup.rotation.y) * 0.08;
          headGroup.rotation.x += (refs.targetRotation.x + breath - headGroup.rotation.x) * 0.08;
        }

        // Eye ambient respiration glow
        eyeMat.emissiveIntensity = 2.8 + Math.sin(timer * 2.5) * 0.6;

        // Parallax camera drift
        camera.position.x += ((refs.mousePos.x * 0.35) - camera.position.x) * 0.05;
        camera.position.y += ((0.2 + refs.mousePos.y * 0.25) - camera.position.y) * 0.05;
        camera.lookAt(0, 0.15, 0);
      }

      // ─── HYDRAULIC MANDIBLE UPDATE ───
      // Smooth jaw rotation
      refs.jawOpenAngle += (refs.targetJawAngle - refs.jawOpenAngle) * 0.18;
      if (mandibleGroup) {
        mandibleGroup.rotation.x = refs.jawOpenAngle;
      }

      // Dynamic hydraulic piston sliding alignment
      if (leftPistonBase && leftPistonRod && rightPistonBase && rightPistonRod) {
        // Offset rod extension according to jaw angle
        leftPistonRod.position.y = -0.24 - refs.jawOpenAngle * 0.35;
        rightPistonRod.position.y = -0.24 - refs.jawOpenAngle * 0.35;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(refs.animationFrameId);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      resizeObserver.disconnect();

      // Dispose Three.js resources
      mats.forEach((mat) => mat.dispose());
      scene.clear();
      renderer.dispose();
    };
  }, [getEyeColorHex, onAssemblyComplete]);

  // Fallback for non-WebGL environments
  if (!webGLSupported) {
    return (
      <div className={`relative w-full h-[520px] rounded-3xl bg-space-950/80 border border-white/10 flex flex-col items-center justify-center p-8 text-center ${className}`}>
        <div className="w-24 h-24 rounded-full bg-space-900 border border-luxury-gold/40 flex items-center justify-center mb-4">
          <Shield className="w-12 h-12 text-luxury-gold" />
        </div>
        <div className="font-display font-bold text-xl text-white">SKILLNOVA AI COGNITIVE CORE</div>
        <p className="text-xs text-slate-400 mt-2 max-w-sm">
          WebGL acceleration unavailable on current device. High-performance cognitive profiler active in standard viewport mode.
        </p>
      </div>
    );
  }

  return (
    <div 
      ref={mountRef}
      className={`relative w-full h-[540px] sm:h-[580px] lg:h-[620px] rounded-3xl overflow-hidden bg-gradient-to-b from-[#06080e]/60 via-[#030408]/90 to-[#020204] border border-white/[0.08] shadow-[0_10px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl group select-none ${className}`}
    >
      {/* 3D Canvas Mount */}
      <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />

      {/* Top Status & Telemetry HUD Overlay */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-20">
        
        {/* State Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-space-950/80 border border-white/10 backdrop-blur-md text-[10px] font-mono tracking-widest text-slate-300">
          <span 
            className="w-2 h-2 rounded-full animate-ping"
            style={{ backgroundColor: eyeColor === 'cyan' ? '#00f0ff' : eyeColor === 'red' ? '#ff1a40' : '#d4af37' }}
          />
          <span className="uppercase text-white font-semibold">
            {activeScene === 'intro' && 'SYS-INIT // SILHOUETTE SCAN'}
            {activeScene === 'assembly' && 'ASSEMBLING TITANIUM CHASSIS'}
            {activeScene === 'reveal' && 'CORE SYNAPSE REVEAL'}
            {activeScene === 'interactive' && 'COGNITIVE ROBOTIC CORE ACTIVE'}
          </span>
        </div>

        {/* Quick HUD Action Buttons */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Replay Assembly Sequence */}
          <button
            onClick={startSequence}
            className="p-2 rounded-xl bg-space-900/80 hover:bg-space-800 border border-white/10 text-slate-300 hover:text-white transition-all shadow-sm group"
            title="Replay cinematic assembly sequence"
            aria-label="Replay 3D assembly animation"
          >
            <RotateCcw className="w-3.5 h-3.5 group-hover:-rotate-90 transition-transform duration-300" />
          </button>

          {/* Wireframe Toggle */}
          <button
            onClick={toggleWireframe}
            className={`p-2 rounded-xl border transition-all text-xs font-mono flex items-center gap-1.5 ${
              wireframeMode 
                ? 'bg-luxury-gold/20 border-luxury-gold text-luxury-gold' 
                : 'bg-space-900/80 hover:bg-space-800 border-white/10 text-slate-300 hover:text-white'
            }`}
            title="Toggle holographic wireframe mode"
            aria-label="Toggle wireframe mode"
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[10px] font-bold uppercase">
              {wireframeMode ? 'Wire' : 'Armor'}
            </span>
          </button>
        </div>

      </div>

      {/* Floating Bottom Control Bar */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row items-center justify-between gap-3 pointer-events-none z-20">
        
        {/* Eye Core Color Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-space-950/85 border border-white/10 backdrop-blur-md pointer-events-auto">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2 flex items-center gap-1">
            <Eye className="w-3 h-3 text-slate-400" />
            <span className="hidden sm:inline">Optics:</span>
          </span>

          {/* Cyan */}
          <button
            onClick={() => changeEyeColor('cyan')}
            className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              eyeColor === 'cyan'
                ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/50 font-bold shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]" />
            <span>Cyan</span>
          </button>

          {/* Red */}
          <button
            onClick={() => changeEyeColor('red')}
            className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              eyeColor === 'red'
                ? 'bg-[#ff1a40]/20 text-[#ff1a40] border border-[#ff1a40]/50 font-bold shadow-[0_0_12px_rgba(255,26,64,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff1a40]" />
            <span>Crimson</span>
          </button>

          {/* Gold */}
          <button
            onClick={() => changeEyeColor('gold')}
            className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              eyeColor === 'gold'
                ? 'bg-luxury-gold/20 text-luxury-gold border border-luxury-gold/50 font-bold shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold" />
            <span>Gold</span>
          </button>
        </div>

        {/* Interactive Speech / Jaw Test & Audio Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={articulateJaw}
            className="px-3 py-1.5 rounded-full bg-space-900/80 hover:bg-space-800 border border-white/10 hover:border-luxury-gold/40 text-slate-300 hover:text-white text-[11px] font-mono transition-all flex items-center gap-1.5 shadow-sm"
            title="Trigger hydraulic jaw articulation test"
          >
            <Zap className="w-3 h-3 text-luxury-gold" />
            <span>Jaw Servo</span>
          </button>
        </div>

      </div>

      {/* Subtle bottom indicator note */}
      <div className="absolute bottom-16 left-0 right-0 text-center pointer-events-none">
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
          Drag / Move pointer to rotate 3D robot head in real time
        </span>
      </div>

    </div>
  );
};

export const CyberSkull3D: React.FC<CyberSkull3DProps> = (props) => {
  return (
    <CyberSkullErrorBoundary className={props.className}>
      <CyberSkull3DContent {...props} />
    </CyberSkullErrorBoundary>
  );
};
