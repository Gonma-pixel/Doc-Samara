import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Rotate3d, RefreshCw } from 'lucide-react';
import { ToothSVG } from './ToothSVG';

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
  const [glassStyle, setGlassStyle] = useState<'liquid_cyan' | 'pure_crystal' | 'pearl_enamel'>('liquid_cyan');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [webGlSupported, setWebGlSupported] = useState<boolean>(true);

  // References across render ticks
  const toothMasterGroupRef = useRef<THREE.Group | null>(null);
  const leftRootGroupRef = useRef<THREE.Group | null>(null);
  const rightRootGroupRef = useRef<THREE.Group | null>(null);
  const pulpCoreRef = useRef<THREE.Mesh | null>(null);
  const glassMaterialsRef = useRef<THREE.MeshPhysicalMaterial[]>([]);
  const requestRef = useRef<number>(0);

  // Drag rotation kinematics
  const rotationVelocityRef = useRef<{ x: number; y: number }>({ x: 0, y: 0.007 });
  const isPointerDownRef = useRef<boolean>(false);
  const lastPointerPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Update root parting smoothly whenever openProgress changes
  useEffect(() => {
    const t = Math.max(0, Math.min(1, openProgress));
    if (leftRootGroupRef.current) {
      leftRootGroupRef.current.rotation.z = -t * 0.45;
      leftRootGroupRef.current.position.x = -0.32 - t * 0.48;
      leftRootGroupRef.current.position.y = -0.12 - t * 0.04;
    }
    if (rightRootGroupRef.current) {
      rightRootGroupRef.current.rotation.z = t * 0.45;
      rightRootGroupRef.current.position.x = 0.32 + t * 0.48;
      rightRootGroupRef.current.position.y = -0.12 - t * 0.04;
    }
    if (pulpCoreRef.current) {
      const scale = 1 + t * 0.35;
      pulpCoreRef.current.scale.set(scale, scale, scale);
      const mat = pulpCoreRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.emissiveIntensity = 1.6 + t * 2.2;
      }
    }
  }, [openProgress]);

  // Update glass style
  useEffect(() => {
    glassMaterialsRef.current.forEach((mat) => {
      if (glassStyle === 'liquid_cyan') {
        mat.color.setHex(0xe0f7fa);
        mat.opacity = 0.85;
        mat.roughness = 0.04;
        mat.clearcoat = 1.0;
        mat.clearcoatRoughness = 0.02;
        mat.iridescence = 0.55;
      } else if (glassStyle === 'pure_crystal') {
        mat.color.setHex(0xffffff);
        mat.opacity = 0.88;
        mat.roughness = 0.02;
        mat.clearcoat = 1.0;
        mat.clearcoatRoughness = 0.01;
        mat.iridescence = 0.35;
      } else {
        // Pearl Enamel
        mat.color.setHex(0xffffff);
        mat.opacity = 0.95;
        mat.roughness = 0.16;
        mat.clearcoat = 0.95;
        mat.clearcoatRoughness = 0.08;
        mat.iridescence = 0.75;
      }
      mat.needsUpdate = true;
    });
  }, [glassStyle]);

  // Three.js scene setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check basic WebGL support without destructive loseContext
    const canvasTest = document.createElement('canvas');
    const gl = canvasTest.getContext('webgl2') || canvasTest.getContext('webgl');
    if (!gl) {
      setWebGlSupported(false);
      return;
    }

    const width = container.clientWidth || 340;
    const height = container.clientHeight || 360;

    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera: Framed perfectly so the whole tooth is visible without clipping
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, -0.15, 8.2);
    camera.lookAt(0, -0.25, 0);

    // 3. Renderer with alpha
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'default'
      });
    } catch {
      setWebGlSupported(false);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Studio Lighting Rig for Liquid Glass Specular Shimmer
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xffffff, 3.0);
    mainKeyLight.position.set(4, 5, 6);
    scene.add(mainKeyLight);

    const fillCyanLight = new THREE.DirectionalLight(0x38bdf8, 2.4);
    fillCyanLight.position.set(-5, 3, 4);
    scene.add(fillCyanLight);

    const backRimLight = new THREE.DirectionalLight(0x0284c7, 3.4);
    backRimLight.position.set(0, -3, -6);
    scene.add(backRimLight);

    const bottomGlowLight = new THREE.PointLight(0x0ea5e9, 2.0, 10);
    bottomGlowLight.position.set(0, -1.8, 1);
    scene.add(bottomGlowLight);

    // 5. Liquid Glass Physical Material
    // High-performance glass optics (zero GPU ReadPixels stall, works on mobile & desktop)
    const liquidGlassMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xe0f7fa),
      transparent: true,
      opacity: 0.85,
      roughness: 0.04,
      metalness: 0.05,
      ior: 1.54,
      reflectivity: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      iridescence: 0.55,
      iridescenceIOR: 1.35,
      specularColor: new THREE.Color(0xffffff)
    });
    glassMaterialsRef.current = [liquidGlassMat];

    // 6. Master Tooth Group
    const toothMasterGroup = new THREE.Group();
    toothMasterGroup.scale.set(0.72, 0.72, 0.72);
    toothMasterGroup.position.set(0, 0.35, 0);
    scene.add(toothMasterGroup);
    toothMasterGroupRef.current = toothMasterGroup;

    // -------------------------------------------------------------
    // ANATOMIC MOLAR CROWN (CORONA REDONDEADA ORGÁNICA)
    // -------------------------------------------------------------
    const crownHeight = 1.35;
    const crownGeom = new THREE.CylinderGeometry(1.18, 0.88, crownHeight, 48, 32);
    const crownPos = crownGeom.attributes.position;
    const p = new THREE.Vector3();

    for (let i = 0; i < crownPos.count; i++) {
      p.fromBufferAttribute(crownPos, i);
      const ny = p.y / (crownHeight / 2);
      const radialDist = Math.hypot(p.x, p.z);

      // Round the sharp top rim edge
      if (p.y > 0.35 && radialDist > 0.82) {
        const rimDist = radialDist - 0.82;
        p.y -= rimDist * 0.45;
      }

      // Occlusal chewing table sculpting
      if (p.y > 0.25) {
        const dMB = Math.hypot(p.x - 0.52, p.z - 0.52);
        const dDB = Math.hypot(p.x + 0.52, p.z - 0.52);
        const dML = Math.hypot(p.x - 0.52, p.z + 0.52);
        const dDL = Math.hypot(p.x + 0.52, p.z + 0.52);

        const cuspMB = Math.max(0, 0.38 * Math.exp(-dMB * 3.2));
        const cuspDB = Math.max(0, 0.36 * Math.exp(-dDB * 3.2));
        const cuspML = Math.max(0, 0.40 * Math.exp(-dML * 3.2));
        const cuspDL = Math.max(0, 0.35 * Math.exp(-dDL * 3.2));
        const centralFossa = -0.22 * Math.exp(-radialDist * 3.0);

        p.y += cuspMB + cuspDB + cuspML + cuspDL + centralFossa;
      }

      // Smooth biological belly convexity
      const bellyFactor = Math.cos(ny * Math.PI * 0.48) * 0.16;
      const angle = Math.atan2(p.z, p.x);
      const quadShape = 1.0 + 0.07 * Math.cos(angle * 4);

      p.x *= (1.0 + bellyFactor) * quadShape;
      p.z *= (1.0 + bellyFactor) * quadShape;

      crownPos.setXYZ(i, p.x, p.y, p.z);
    }
    crownGeom.computeVertexNormals();

    const crownMesh = new THREE.Mesh(crownGeom, liquidGlassMat);
    crownMesh.position.y = 0.5;
    crownMesh.castShadow = true;
    toothMasterGroup.add(crownMesh);

    // -------------------------------------------------------------
    // ANATOMIC ROOTS (RAÍCES BIOLÓGICAS MESIAL & DISTAL)
    // -------------------------------------------------------------
    const createAnatomicRoot = (isLeft: boolean) => {
      const points = isLeft
        ? [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(-0.06, -0.35, 0.02),
            new THREE.Vector3(-0.16, -0.85, -0.02),
            new THREE.Vector3(-0.28, -1.4, 0.02),
            new THREE.Vector3(-0.34, -1.9, 0)
          ]
        : [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0.06, -0.35, -0.02),
            new THREE.Vector3(0.16, -0.85, 0.02),
            new THREE.Vector3(0.28, -1.4, -0.02),
            new THREE.Vector3(0.34, -1.9, 0)
          ];

      const curve = new THREE.CatmullRomCurve3(points);
      const geom = new THREE.TubeGeometry(curve, 32, 0.38, 20, false);
      const pos = geom.attributes.position;
      const v = new THREE.Vector3();

      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        const progress = Math.min(1, Math.max(0, -v.y / 1.9));
        const taper = 1.0 - progress * 0.74;

        v.x *= taper * 0.88;
        v.z *= taper * 1.12;

        pos.setXYZ(i, v.x, v.y, v.z);
      }
      geom.computeVertexNormals();
      return geom;
    };

    // Left Root (Mesial)
    const leftRootGroup = new THREE.Group();
    leftRootGroup.position.set(-0.32, -0.12, 0);
    const leftRootGeom = createAnatomicRoot(true);
    const leftRootMesh = new THREE.Mesh(leftRootGeom, liquidGlassMat);
    leftRootGroup.add(leftRootMesh);
    toothMasterGroup.add(leftRootGroup);
    leftRootGroupRef.current = leftRootGroup;

    // Right Root (Distal)
    const rightRootGroup = new THREE.Group();
    rightRootGroup.position.set(0.32, -0.12, 0);
    const rightRootGeom = createAnatomicRoot(false);
    const rightRootMesh = new THREE.Mesh(rightRootGeom, liquidGlassMat);
    rightRootGroup.add(rightRootMesh);
    toothMasterGroup.add(rightRootGroup);
    rightRootGroupRef.current = rightRootGroup;

    // -------------------------------------------------------------
    // LUMINOUS PULP CORE & CANALS (VISIBLES A TRAVÉS DEL VIDRIO)
    // -------------------------------------------------------------
    const pulpGeom = new THREE.SphereGeometry(0.44, 20, 20);
    pulpGeom.scale(1.1, 0.85, 1.1);
    const pulpMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 1.8,
      roughness: 0.15,
      metalness: 0.1,
      transparent: true,
      opacity: 0.95
    });
    const pulpMesh = new THREE.Mesh(pulpGeom, pulpMat);
    pulpMesh.position.set(0, 0.35, 0);
    toothMasterGroup.add(pulpMesh);
    pulpCoreRef.current = pulpMesh;

    // Root canal pathways
    const canalMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      linewidth: 3,
      transparent: true,
      opacity: 0.85
    });

    const leftCanalPoints = [
      new THREE.Vector3(0, 0.3, 0),
      new THREE.Vector3(-0.3, -0.2, 0),
      new THREE.Vector3(-0.45, -0.9, 0),
      new THREE.Vector3(-0.6, -1.8, 0)
    ];
    const leftCanalGeom = new THREE.BufferGeometry().setFromPoints(leftCanalPoints);
    const leftCanal = new THREE.Line(leftCanalGeom, canalMat);
    toothMasterGroup.add(leftCanal);

    const rightCanalPoints = [
      new THREE.Vector3(0, 0.3, 0),
      new THREE.Vector3(0.3, -0.2, 0),
      new THREE.Vector3(0.45, -0.9, 0),
      new THREE.Vector3(0.6, -1.8, 0)
    ];
    const rightCanalGeom = new THREE.BufferGeometry().setFromPoints(rightCanalPoints);
    const rightCanal = new THREE.Line(rightCanalGeom, canalMat);
    toothMasterGroup.add(rightCanal);

    // -------------------------------------------------------------
    // CONTACT SHADOW
    // -------------------------------------------------------------
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(64, 64, 5, 64, 64, 60);
      grad.addColorStop(0, 'rgba(2, 132, 199, 0.28)');
      grad.addColorStop(0.5, 'rgba(56, 189, 248, 0.1)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 128, 128);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(3.6, 3.6),
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -2.15;
    scene.add(shadowPlane);

    // Initial root setup
    const initialT = Math.max(0, Math.min(1, openProgress));
    leftRootGroup.rotation.z = -initialT * 0.45;
    leftRootGroup.position.x = -0.32 - initialT * 0.48;
    rightRootGroup.rotation.z = initialT * 0.45;
    rightRootGroup.position.x = 0.32 + initialT * 0.48;

    // -------------------------------------------------------------
    // RENDER LOOP & 360 KINEMATICS
    // -------------------------------------------------------------
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      if (toothMasterGroup) {
        if (!isPointerDownRef.current) {
          if (autoRotate) {
            toothMasterGroup.rotation.y += 0.012;
          } else {
            toothMasterGroup.rotation.y += rotationVelocityRef.current.y;
            toothMasterGroup.rotation.x += rotationVelocityRef.current.x;

            rotationVelocityRef.current.x = THREE.MathUtils.damp(
              rotationVelocityRef.current.x,
              0,
              4.5,
              dt
            );
            rotationVelocityRef.current.y = THREE.MathUtils.damp(
              rotationVelocityRef.current.y,
              0,
              4.5,
              dt
            );
          }

          toothMasterGroup.position.y = 0.35 + Math.sin(currentTime * 0.0018) * 0.05;
        }

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
      liquidGlassMat.dispose();
      pulpMat.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [autoRotate]);

  // Fallback to SVG if WebGL is unavailable on device
  if (!webGlSupported) {
    return (
      <div className={`relative flex flex-col items-center select-none ${className}`}>
        <ToothSVG openProgress={openProgress} showAnatomyLabels={false} className="w-72 sm:w-80 h-80 sm:h-96" />
      </div>
    );
  }

  // -------------------------------------------------------------
  // 360° POINTER INTERACTION (DRAG & ROTATE)
  // -------------------------------------------------------------
  const handlePointerDown = (e: React.PointerEvent) => {
    isPointerDownRef.current = true;
    setIsDragging(true);
    lastPointerPosRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    if (onInteraction) onInteraction();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current || !toothMasterGroupRef.current) return;

    const deltaX = e.clientX - lastPointerPosRef.current.x;
    const deltaY = e.clientY - lastPointerPosRef.current.y;

    lastPointerPosRef.current = { x: e.clientX, y: e.clientY };

    const rotateSpeed = 0.01;
    toothMasterGroupRef.current.rotation.y += deltaX * rotateSpeed;
    toothMasterGroupRef.current.rotation.x += deltaY * rotateSpeed;

    rotationVelocityRef.current = {
      x: deltaY * rotateSpeed * 0.5,
      y: deltaX * rotateSpeed * 0.5
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

  const resetFrontView = () => {
    if (toothMasterGroupRef.current) {
      toothMasterGroupRef.current.rotation.set(0, 0, 0);
      rotationVelocityRef.current = { x: 0, y: 0 };
    }
  };

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Visual Radial Halo backdrop */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[280px] sm:w-[340px] h-[280px] sm:h-[340px] rounded-full bg-gradient-to-tr from-cyan-100/60 via-sky-100/35 to-blue-50/25 blur-2xl opacity-90" />
      </div>

      {/* 3D WebGL Canvas */}
      <div
        ref={mountRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`relative z-10 w-[280px] sm:w-[350px] h-[320px] sm:h-[370px] touch-none cursor-grab active:cursor-grabbing transition-transform ${
          isDragging ? 'scale-[1.02]' : ''
        }`}
        title="Haz clic y arrastra en 360° para rotar el diente"
      />

      {/* 360° Instruction pill */}
      <div className="relative z-10 -mt-2 mb-2 pointer-events-none">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/95 backdrop-blur-md rounded-full text-[11px] font-semibold text-slate-700 border border-slate-200/90 shadow-xs">
          <Rotate3d className="w-3.5 h-3.5 text-cyan-600 animate-spin" style={{ animationDuration: '8s' }} />
          <span>Haz clic y arrastra en 360°</span>
        </span>
      </div>

      {/* Interactive Quick Bar */}
      <div className="relative z-10 flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/90 shadow-xs text-xs">
        <button
          type="button"
          onClick={() => setAutoRotate(!autoRotate)}
          className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            autoRotate
              ? 'bg-cyan-50 text-cyan-700 border border-cyan-200 font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Alternar rotación automática"
        >
          <Rotate3d className="w-3.5 h-3.5" />
          <span>{autoRotate ? 'Giro Activo' : 'Giro Manual'}</span>
        </button>

        <button
          type="button"
          onClick={resetFrontView}
          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          title="Restablecer a vista frontal"
          aria-label="Restablecer vista"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        <div className="h-3 w-[1px] bg-slate-200" />

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setGlassStyle('liquid_cyan')}
            className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${
              glassStyle === 'liquid_cyan'
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Liquid Glass
          </button>
          <button
            type="button"
            onClick={() => setGlassStyle('pure_crystal')}
            className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${
              glassStyle === 'pure_crystal'
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Cristal
          </button>
          <button
            type="button"
            onClick={() => setGlassStyle('pearl_enamel')}
            className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${
              glassStyle === 'pearl_enamel'
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Esmalte
          </button>
        </div>
      </div>
    </div>
  );
};
