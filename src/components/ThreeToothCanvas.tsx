import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Rotate3d, Sparkles, RefreshCw, Layers } from 'lucide-react';

interface ThreeToothCanvasProps {
  openProgress: number; // 0 (closed) to 1 (roots fully open)
  onInteraction?: () => void;
  className?: string;
}

export const ThreeToothCanvas: React.FC<ThreeToothCanvasProps> = ({
  openProgress,
  onInteraction,
  className = ''
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [materialStyle, setMaterialStyle] = useState<'liquid_glass' | 'pearl_enamel' | 'frosted_glass'>('liquid_glass');
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // References to keep across renders
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const toothGroupRef = useRef<THREE.Group | null>(null);
  const leftRootGroupRef = useRef<THREE.Group | null>(null);
  const rightRootGroupRef = useRef<THREE.Group | null>(null);
  const pulpCoreRef = useRef<THREE.Mesh | null>(null);
  const leftCanalRef = useRef<THREE.Line | null>(null);
  const rightCanalRef = useRef<THREE.Line | null>(null);
  const glassMaterialsRef = useRef<THREE.MeshPhysicalMaterial[]>([]);
  const requestRef = useRef<number>(0);

  // Drag rotation state
  const rotationVelocityRef = useRef<{ x: number; y: number }>({ x: 0, y: 0.005 });
  const isPointerDownRef = useRef<boolean>(false);
  const lastPointerPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Update root parting smoothly whenever openProgress changes
  useEffect(() => {
    const t = Math.max(0, Math.min(1, openProgress));
    if (leftRootGroupRef.current) {
      leftRootGroupRef.current.rotation.z = -t * 0.52;
      leftRootGroupRef.current.position.x = -0.5 - t * 0.65;
      leftRootGroupRef.current.position.y = -0.4 - t * 0.08;
    }
    if (rightRootGroupRef.current) {
      rightRootGroupRef.current.rotation.z = t * 0.52;
      rightRootGroupRef.current.position.x = 0.5 + t * 0.65;
      rightRootGroupRef.current.position.y = -0.4 - t * 0.08;
    }
    if (pulpCoreRef.current) {
      const scale = 1 + t * 0.35;
      pulpCoreRef.current.scale.set(scale, scale, scale);
      const mat = pulpCoreRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.emissiveIntensity = 1.4 + t * 1.8;
      }
    }
  }, [openProgress]);

  // Update material preset (Liquid Glass / Pearl Enamel / Frosted)
  useEffect(() => {
    glassMaterialsRef.current.forEach((mat) => {
      if (materialStyle === 'liquid_glass') {
        mat.transmission = 0.94;
        mat.roughness = 0.05;
        mat.ior = 1.54;
        mat.thickness = 1.8;
        mat.clearcoat = 1.0;
        mat.clearcoatRoughness = 0.03;
        mat.color.setHex(0xffffff);
        mat.attenuationColor.setHex(0xf0fdff);
        mat.iridescence = 0.45;
      } else if (materialStyle === 'pearl_enamel') {
        mat.transmission = 0.45;
        mat.roughness = 0.16;
        mat.ior = 1.48;
        mat.thickness = 1.2;
        mat.clearcoat = 0.9;
        mat.clearcoatRoughness = 0.08;
        mat.color.setHex(0xf8fafc);
        mat.attenuationColor.setHex(0xffffff);
        mat.iridescence = 0.7;
      } else {
        // frosted glass
        mat.transmission = 0.82;
        mat.roughness = 0.38;
        mat.ior = 1.42;
        mat.thickness = 2.0;
        mat.clearcoat = 0.3;
        mat.clearcoatRoughness = 0.2;
        mat.color.setHex(0xf1f5f9);
        mat.attenuationColor.setHex(0xe0f2fe);
        mat.iridescence = 0.2;
      }
      mat.needsUpdate = true;
    });
  }, [materialStyle]);

  // Setup Three.js scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL guard
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    const width = container.clientWidth || 380;
    const height = container.clientHeight || 420;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 7.2);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Studio Environment Reflection (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(5, 6, 7);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe0f2fe, 1.6);
    fillLight.position.set(-5, 2, -4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.0);
    rimLight.position.set(0, -5, -6);
    scene.add(rimLight);

    // 6. Liquid Glass Material
    const liquidGlassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.94,
      roughness: 0.05,
      metalness: 0.02,
      ior: 1.54,
      thickness: 1.8,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      attenuationColor: new THREE.Color(0xf0fdff),
      attenuationDistance: 1.5,
      iridescence: 0.45,
      iridescenceIOR: 1.35,
      transparent: true,
      opacity: 1
    });
    glassMaterialsRef.current = [liquidGlassMaterial];

    // 7. Master Tooth Group
    const toothMasterGroup = new THREE.Group();
    toothMasterGroup.position.set(0, 0.2, 0);
    scene.add(toothMasterGroup);
    toothGroupRef.current = toothMasterGroup;

    // -------------------------------------------------------------
    // PROCEDURAL HIGH-FIDELITY CROWN GEOMETRY (CORONA MOLAR 3D)
    // -------------------------------------------------------------
    const crownRadius = 1.35;
    const crownHeight = 1.55;
    const crownGeom = new THREE.CylinderGeometry(
      crownRadius * 1.05,
      crownRadius * 0.88,
      crownHeight,
      64,
      32
    );

    // Sculpt natural molar cusps and fissures directly on vertex positions
    const posAttr = crownGeom.attributes.position;
    const v = new THREE.Vector3();
    for (let i = 0; i < posAttr.count; i++) {
      v.fromBufferAttribute(posAttr, i);
      const normalizedY = v.y / (crownHeight / 2); // -1 (base) to +1 (top)

      // Occlusal chewing surface sculpting (top cap where y > 0.4)
      if (v.y > 0.4) {
        // 4 distinct anatomic cusps
        const d1 = Math.hypot(v.x - 0.65, v.z - 0.65); // Mesiobuccal cusp
        const d2 = Math.hypot(v.x + 0.65, v.z - 0.65); // Distobuccal cusp
        const d3 = Math.hypot(v.x - 0.65, v.z + 0.65); // Mesiolingual cusp
        const d4 = Math.hypot(v.x + 0.65, v.z + 0.65); // Distolingual cusp

        const cusp1Elev = Math.max(0, 0.38 * Math.exp(-d1 * 2.2));
        const cusp2Elev = Math.max(0, 0.35 * Math.exp(-d2 * 2.2));
        const cusp3Elev = Math.max(0, 0.38 * Math.exp(-d3 * 2.2));
        const cusp4Elev = Math.max(0, 0.33 * Math.exp(-d4 * 2.2));

        // Central developmental groove depression
        const centerDist = Math.hypot(v.x, v.z);
        const centralSulcus = -0.22 * Math.exp(-centerDist * 2.5);

        v.y += cusp1Elev + cusp2Elev + cusp3Elev + cusp4Elev + centralSulcus;
      }

      // Smooth biological bulging along the belly (axial curvature)
      const bellyBulge = Math.cos(normalizedY * Math.PI * 0.5) * 0.16;
      const angle = Math.atan2(v.z, v.x);
      // Subtle quad-molar square rounding
      const quadFactor = 1 + 0.08 * Math.cos(angle * 4);

      v.x *= (1 + bellyBulge) * quadFactor;
      v.z *= (1 + bellyBulge) * quadFactor;

      posAttr.setXYZ(i, v.x, v.y, v.z);
    }
    crownGeom.computeVertexNormals();

    const crownMesh = new THREE.Mesh(crownGeom, liquidGlassMaterial);
    crownMesh.position.y = 0.55;
    crownMesh.castShadow = true;
    toothMasterGroup.add(crownMesh);

    // -------------------------------------------------------------
    // PROCEDURAL ANATOMICAL ROOTS (RAÍZ MESIAL & DISTAL)
    // -------------------------------------------------------------
    // Helper to generate a curved, biologically tapered root
    const createCurvedRootGeom = (isLeft: boolean) => {
      const curvePoints = isLeft
        ? [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(-0.15, -0.6, 0.05),
            new THREE.Vector3(-0.35, -1.3, -0.05),
            new THREE.Vector3(-0.48, -1.9, 0.02),
            new THREE.Vector3(-0.52, -2.4, 0) // Apex tip
          ]
        : [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0.15, -0.6, -0.05),
            new THREE.Vector3(0.35, -1.3, 0.05),
            new THREE.Vector3(0.48, -1.9, -0.02),
            new THREE.Vector3(0.52, -2.4, 0)
          ];

      const curve = new THREE.CatmullRomCurve3(curvePoints);
      const tubeGeom = new THREE.TubeGeometry(curve, 36, 0.48, 24, false);

      // Taper the root geometry along length (thick at base, sharp round at apex)
      const pos = tubeGeom.attributes.position;
      const tempV = new THREE.Vector3();
      for (let i = 0; i < pos.count; i++) {
        tempV.fromBufferAttribute(pos, i);
        // Progress 0 (top) to 1 (bottom)
        const progress = Math.min(1, Math.max(0, -tempV.y / 2.4));
        // Taper factor
        const taper = 1.0 - progress * 0.72;
        // Keep center axis intact, scale radial distance
        tempV.x *= taper;
        tempV.z *= taper;
        pos.setXYZ(i, tempV.x, tempV.y, tempV.z);
      }
      tubeGeom.computeVertexNormals();
      return tubeGeom;
    };

    // Left Root Group (Articulates on scroll)
    const leftRootGroup = new THREE.Group();
    leftRootGroup.position.set(-0.5, -0.4, 0);
    const leftRootGeom = createCurvedRootGeom(true);
    const leftRootMesh = new THREE.Mesh(leftRootGeom, liquidGlassMaterial);
    leftRootGroup.add(leftRootMesh);
    toothMasterGroup.add(leftRootGroup);
    leftRootGroupRef.current = leftRootGroup;

    // Right Root Group (Articulates on scroll)
    const rightRootGroup = new THREE.Group();
    rightRootGroup.position.set(0.5, -0.4, 0);
    const rightRootGeom = createCurvedRootGeom(false);
    const rightRootMesh = new THREE.Mesh(rightRootGeom, liquidGlassMaterial);
    rightRootGroup.add(rightRootMesh);
    toothMasterGroup.add(rightRootGroup);
    rightRootGroupRef.current = rightRootGroup;

    // -------------------------------------------------------------
    // LUMINOUS PULP CORE (CÁMARA PULPAR EMISIVA INTERNA)
    // -------------------------------------------------------------
    const pulpGeom = new THREE.IcosahedronGeometry(0.55, 3);
    const pulpMaterial = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 1.5,
      roughness: 0.2,
      metalness: 0.1,
      transparent: true,
      opacity: 0.95
    });
    const pulpMesh = new THREE.Mesh(pulpGeom, pulpMaterial);
    pulpMesh.position.set(0, 0.4, 0);
    toothMasterGroup.add(pulpMesh);
    pulpCoreRef.current = pulpMesh;

    // Inner glowing root canal lines
    const leftCanalPoints = [
      new THREE.Vector3(0, 0.35, 0),
      new THREE.Vector3(-0.4, -0.2, 0),
      new THREE.Vector3(-0.65, -1.0, 0),
      new THREE.Vector3(-0.85, -2.0, 0)
    ];
    const leftCanalGeom = new THREE.BufferGeometry().setFromPoints(leftCanalPoints);
    const canalLineMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      linewidth: 3,
      transparent: true,
      opacity: 0.75
    });
    const leftCanalLine = new THREE.Line(leftCanalGeom, canalLineMat);
    toothMasterGroup.add(leftCanalLine);
    leftCanalRef.current = leftCanalLine;

    const rightCanalPoints = [
      new THREE.Vector3(0, 0.35, 0),
      new THREE.Vector3(0.4, -0.2, 0),
      new THREE.Vector3(0.65, -1.0, 0),
      new THREE.Vector3(0.85, -2.0, 0)
    ];
    const rightCanalGeom = new THREE.BufferGeometry().setFromPoints(rightCanalPoints);
    const rightCanalLine = new THREE.Line(rightCanalGeom, canalLineMat);
    toothMasterGroup.add(rightCanalLine);
    rightCanalRef.current = rightCanalLine;

    // -------------------------------------------------------------
    // AMBIENT CONTACT SHADOW PLANE & SPECULAR PARTICLES
    // -------------------------------------------------------------
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(64, 64, 10, 64, 64, 60);
      grad.addColorStop(0, 'rgba(14, 165, 233, 0.28)');
      grad.addColorStop(0.5, 'rgba(14, 165, 233, 0.08)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 128, 128);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowPlaneGeom = new THREE.PlaneGeometry(5, 5);
    const shadowPlaneMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false
    });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeom, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -2.8;
    scene.add(shadowPlane);

    // Initial root state sync
    const initialT = Math.max(0, Math.min(1, openProgress));
    leftRootGroup.rotation.z = -initialT * 0.52;
    leftRootGroup.position.x = -0.5 - initialT * 0.65;
    rightRootGroup.rotation.z = initialT * 0.52;
    rightRootGroup.position.x = 0.5 + initialT * 0.65;

    // -------------------------------------------------------------
    // RENDER LOOP & 360 ORBITAL ROTATION KINEMATICS
    // -------------------------------------------------------------
    let clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();

      if (toothMasterGroup) {
        if (!isPointerDownRef.current) {
          // If autoRotate enabled, apply constant smooth 360 yaw
          if (autoRotate) {
            toothMasterGroup.rotation.y += 0.012;
          } else {
            // Apply angular momentum decay
            toothMasterGroup.rotation.y += rotationVelocityRef.current.y;
            toothMasterGroup.rotation.x += rotationVelocityRef.current.x;

            rotationVelocityRef.current.x = THREE.MathUtils.damp(
              rotationVelocityRef.current.x,
              0,
              4,
              delta
            );
            rotationVelocityRef.current.y = THREE.MathUtils.damp(
              rotationVelocityRef.current.y,
              0,
              4,
              delta
            );
          }

          // Gentle floating levitation effect
          toothMasterGroup.position.y = 0.15 + Math.sin(clock.getElapsedTime() * 1.5) * 0.08;
        }

        // Keep vertical tilt within safe anatomical bounds
        toothMasterGroup.rotation.x = THREE.MathUtils.clamp(
          toothMasterGroup.rotation.x,
          -Math.PI * 0.28,
          Math.PI * 0.28
        );
      }

      renderer.render(scene, camera);
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(requestRef.current);
      renderer.dispose();
      crownGeom.dispose();
      leftRootGeom.dispose();
      rightRootGeom.dispose();
      pulpGeom.dispose();
      liquidGlassMaterial.dispose();
      pulpMaterial.dispose();
      shadowPlaneGeom.dispose();
      shadowPlaneMat.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [autoRotate]);

  // -------------------------------------------------------------
  // 360° DRAG / POINTER EVENT HANDLERS
  // -------------------------------------------------------------
  const handlePointerDown = (e: React.PointerEvent) => {
    isPointerDownRef.current = true;
    setIsDragging(true);
    lastPointerPosRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    if (onInteraction) onInteraction();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current || !toothGroupRef.current) return;

    const deltaX = e.clientX - lastPointerPosRef.current.x;
    const deltaY = e.clientY - lastPointerPosRef.current.y;

    lastPointerPosRef.current = { x: e.clientX, y: e.clientY };

    const rotateSpeed = 0.009;
    toothGroupRef.current.rotation.y += deltaX * rotateSpeed;
    toothGroupRef.current.rotation.x += deltaY * rotateSpeed;

    rotationVelocityRef.current = {
      x: deltaY * rotateSpeed * 0.4,
      y: deltaX * rotateSpeed * 0.4
    };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isPointerDownRef.current = false;
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const resetView = () => {
    if (toothGroupRef.current) {
      toothGroupRef.current.rotation.set(0, 0, 0);
      rotationVelocityRef.current = { x: 0, y: 0 };
    }
  };

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`w-[320px] sm:w-[380px] h-[380px] sm:h-[440px] touch-none cursor-grab active:cursor-grabbing transition-transform ${
          isDragging ? 'scale-[1.02]' : ''
        }`}
        title="Haz click y arrastra en cualquier dirección para girar el diente 360°"
      />

      {/* Floating 360° Interaction Hint */}
      <div className="absolute top-2 inset-x-0 flex justify-center pointer-events-none">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/85 backdrop-blur-md rounded-full text-[11px] font-semibold text-slate-700 border border-slate-200/80 shadow-xs">
          <Rotate3d className="w-3.5 h-3.5 text-cyan-600 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Arrastra en 360° para inspeccionar</span>
        </span>
      </div>

      {/* Unified Bottom Quick Bar for 3D Tooth Controls */}
      <div className="mt-2 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-200/80 shadow-xs text-xs">
        {/* Toggle Auto Rotation */}
        <button
          type="button"
          onClick={() => setAutoRotate(!autoRotate)}
          className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            autoRotate
              ? 'bg-cyan-50 text-cyan-700 border border-cyan-200 font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Alternar rotación continua automática"
        >
          <Rotate3d className="w-3.5 h-3.5" />
          <span>{autoRotate ? 'Giro 360° Activo' : 'Giro Manual'}</span>
        </button>

        {/* Reset View Button */}
        <button
          type="button"
          onClick={resetView}
          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          title="Restablecer a vista frontal"
          aria-label="Restablecer vista"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        <div className="h-3 w-[1px] bg-slate-200" />

        {/* Liquid Glass Finish Selector */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setMaterialStyle('liquid_glass')}
            className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${
              materialStyle === 'liquid_glass'
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Liquid Glass
          </button>
          <button
            type="button"
            onClick={() => setMaterialStyle('pearl_enamel')}
            className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${
              materialStyle === 'pearl_enamel'
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Esmalte Perla
          </button>
        </div>
      </div>
    </div>
  );
};
