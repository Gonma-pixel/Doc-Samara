import React, { useState, useRef, useEffect } from 'react';
import { Rotate3d, RefreshCw } from 'lucide-react';

interface LiquidGlassTooth3DProps {
  openProgress: number; // 0.0 (closed) to 1.0 (roots parted open)
  onInteraction?: () => void;
  className?: string;
}

export const LiquidGlassTooth3D: React.FC<LiquidGlassTooth3DProps> = ({
  openProgress,
  onInteraction,
  className = ''
}) => {
  // Direct front-facing initial angle so it is 100% visible immediately
  const [rotation, setRotation] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [glassStyle, setGlassStyle] = useState<'liquid_glass' | 'pure_crystal' | 'pearl_enamel'>('liquid_glass');

  const isPointerDownRef = useRef<boolean>(false);
  const lastPointerPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const velocityRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animFrameRef = useRef<number>(0);

  const t = Math.max(0, Math.min(1, openProgress));

  // Transformation for parted roots on scroll
  const leftAngle = -26 * t;
  const leftTranslateX = -46 * t;
  const rightAngle = 26 * t;
  const rightTranslateX = 46 * t;

  // Reveal intensity for internal light and core
  const revealOpacity = Math.min(1, Math.max(0, (t - 0.15) / 0.85));

  // Smooth orbital yaw oscillation in auto mode so the tooth NEVER collapses edge-on
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (!isPointerDownRef.current) {
        if (autoRotate) {
          // Graceful 3D swing between -32° and +32° showing liquid depth from all angles
          setRotation({
            x: 4 * Math.sin(now * 0.0014),
            y: Math.sin(now * 0.0011) * 32
          });
        } else {
          // Inertia damping during manual drag
          if (Math.abs(velocityRef.current.x) > 0.02 || Math.abs(velocityRef.current.y) > 0.02) {
            setRotation((prev) => ({
              x: Math.max(-28, Math.min(28, prev.x + velocityRef.current.x)),
              y: Math.max(-65, Math.min(65, prev.y + velocityRef.current.y))
            }));
            velocityRef.current.x *= 0.92;
            velocityRef.current.y *= 0.92;
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [autoRotate]);

  // Pointer drag event handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    isPointerDownRef.current = true;
    setIsDragging(true);
    lastPointerPosRef.current = { x: e.clientX, y: e.clientY };
    velocityRef.current = { x: 0, y: 0 };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    if (onInteraction) onInteraction();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;

    const dx = e.clientX - lastPointerPosRef.current.x;
    const dy = e.clientY - lastPointerPosRef.current.y;
    lastPointerPosRef.current = { x: e.clientX, y: e.clientY };

    const speed = 0.45;
    const newY = Math.max(-65, Math.min(65, rotation.y + dx * speed));
    const newX = Math.max(-26, Math.min(26, rotation.x - dy * speed));

    velocityRef.current = { x: -dy * speed * 0.35, y: dx * speed * 0.35 };
    setRotation({ x: newX, y: newY });
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
    setRotation({ x: 0, y: 0 });
    velocityRef.current = { x: 0, y: 0 };
  };

  // Specular gleam shifts dynamically with rotation
  const specularOffsetX = Math.sin((rotation.y * Math.PI) / 180) * 40;
  const specularOffsetY = (rotation.x / 26) * 16;

  // Glass styles
  const theme = {
    liquid_glass: {
      crownStart: '#FFFFFF',
      crownMid: '#E0F7FA',
      crownEnd: '#B2EBF2',
      stroke: '#0EA5E9',
      pulpGlow: '#0284C7',
      opacity: 0.94
    },
    pure_crystal: {
      crownStart: '#FFFFFF',
      crownMid: '#F0F9FF',
      crownEnd: '#E2E8F0',
      stroke: '#38BDF8',
      pulpGlow: '#0284C7',
      opacity: 0.88
    },
    pearl_enamel: {
      crownStart: '#FFFFFF',
      crownMid: '#F8FAFC',
      crownEnd: '#E2E8F0',
      stroke: '#94A3B8',
      pulpGlow: '#0EA5E9',
      opacity: 0.96
    }
  }[glassStyle];

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* 3D Perspective Canvas Container */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ perspective: 1200 }}
        className="w-[320px] sm:w-[380px] h-[360px] sm:h-[400px] flex items-center justify-center touch-none cursor-grab active:cursor-grabbing"
        title="Haz clic y arrastra para girar el diente 3D"
      >
        {/* Soft Radial Backlight */}
        <div
          className="absolute w-72 h-72 rounded-full bg-cyan-100/60 blur-3xl pointer-events-none transition-opacity duration-300"
          style={{ opacity: 0.7 + t * 0.3 }}
        />

        {/* 3D Rotating Tooth Structure */}
        <div
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transformStyle: 'preserve-3d',
            transition: isDragging ? 'none' : 'transform 0.08s ease-out'
          }}
          className="relative w-full h-full flex items-center justify-center pointer-events-none"
        >
          {/* Main Anatomical Liquid Glass Tooth */}
          <svg
            viewBox="0 0 340 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full max-w-[340px] max-h-[400px] drop-shadow-2xl"
            style={{
              filter: `drop-shadow(0 20px 30px rgba(14, 165, 233, ${0.18 + t * 0.2}))`
            }}
          >
            <defs>
              {/* Liquid Glass Crown Gradient */}
              <linearGradient id="molarGlassGrad" x1="40" y1="20" x2="300" y2="180" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor={theme.crownStart} stopOpacity={theme.opacity} />
                <stop offset="40%" stopColor={theme.crownMid} stopOpacity={theme.opacity * 0.96} />
                <stop offset="85%" stopColor={theme.crownEnd} stopOpacity={theme.opacity * 0.9} />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.95" />
              </linearGradient>

              {/* Dynamic Specular Gleam */}
              <linearGradient
                id="sheenShift"
                x1={100 + specularOffsetX}
                y1={30 + specularOffsetY}
                x2={240 + specularOffsetX}
                y2={150 + specularOffsetY}
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.65" />
                <stop offset="70%" stopColor="#38BDF8" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </linearGradient>

              {/* Left Root Gradient */}
              <linearGradient id="rootLeftGlass" x1="120" y1="150" x2="60" y2="360" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor={theme.crownMid} stopOpacity="0.95" />
                <stop offset="40%" stopColor={theme.crownEnd} stopOpacity="0.85" />
                <stop offset="85%" stopColor="#FFFFFF" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.75" />
              </linearGradient>

              {/* Right Root Gradient */}
              <linearGradient id="rootRightGlass" x1="220" y1="150" x2="280" y2="360" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor={theme.crownMid} stopOpacity="0.95" />
                <stop offset="40%" stopColor={theme.crownEnd} stopOpacity="0.85" />
                <stop offset="85%" stopColor="#FFFFFF" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.75" />
              </linearGradient>

              {/* Radiant Pulp Core */}
              <radialGradient id="pulpRadial" cx="170" cy="225" r="105" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.95" />
                <stop offset="45%" stopColor="#0EA5E9" stopOpacity="0.6" />
                <stop offset="80%" stopColor="#E0F2FE" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </radialGradient>

              {/* Root Canal Conduit */}
              <linearGradient id="canalConduit" x1="170" y1="150" x2="170" y2="340" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#0284C7" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.25" />
              </linearGradient>
            </defs>

            {/* ---------------- 1. INNER REVEAL PORTAL (Visible when roots open) ---------------- */}
            <g style={{ opacity: revealOpacity, transition: 'opacity 0.2s ease-out' }}>
              <circle cx="170" cy="235" r={50 + t * 40} fill="url(#pulpRadial)" />

              {/* Rotating energy rings */}
              <circle
                cx="170"
                cy="235"
                r={28 + t * 20}
                stroke="#38BDF8"
                strokeWidth="1.8"
                strokeDasharray="4 4"
                className="animate-spin"
                style={{ animationDuration: '12s', transformOrigin: '170px 235px' }}
                opacity="0.8"
              />

              {/* Center Service Diamond Beacon */}
              <g transform={`translate(170, 235) scale(${0.75 + t * 0.35}) translate(-170, -235)`}>
                <polygon
                  points="170,216 185,227 185,246 170,256 155,246 155,227"
                  fill="#FFFFFF"
                  stroke="#0284C7"
                  strokeWidth="2"
                  className="drop-shadow-md"
                />
                <circle cx="170" cy="236" r="3" fill="#38BDF8" />
              </g>
            </g>

            {/* ---------------- 2. LEFT ROOT (RADIX MESIALIS) ---------------- */}
            <g
              id="root-left"
              style={{
                transformOrigin: '140px 165px',
                transform: `translate(${leftTranslateX}px, 0px) rotate(${leftAngle}deg)`,
                transition: 'transform 0.08s ease-out'
              }}
            >
              <path
                d="M 130 155 
                   C 120 185 105 230 92 275 
                   C 83 305 78 335 84 352 
                   C 87 358 96 359 101 353 
                   C 112 338 122 295 136 245 
                   C 146 210 156 182 165 170 
                   Z"
                fill="url(#rootLeftGlass)"
                stroke={theme.stroke}
                strokeWidth="1.4"
                strokeOpacity="0.75"
              />

              {/* Glowing Inner Canal */}
              <path
                d="M 142 165 C 132 205 118 255 108 295 C 101 320 95 340 93 348"
                stroke="url(#canalConduit)"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeDasharray="2 3"
                opacity={0.6 + t * 0.4}
              />

              {/* Specular Edge Highlight */}
              <path
                d="M 115 175 C 105 215 95 260 88 300 C 85 320 84 335 86 345"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.9"
              />
            </g>

            {/* ---------------- 3. RIGHT ROOT (RADIX DISTALIS) ---------------- */}
            <g
              id="root-right"
              style={{
                transformOrigin: '200px 165px',
                transform: `translate(${rightTranslateX}px, 0px) rotate(${rightAngle}deg)`,
                transition: 'transform 0.08s ease-out'
              }}
            >
              <path
                d="M 210 155 
                   C 220 185 235 230 248 275 
                   C 257 305 262 335 256 352 
                   C 253 358 244 359 239 353 
                   C 228 338 218 295 204 245 
                   C 194 210 184 182 175 170 
                   Z"
                fill="url(#rootRightGlass)"
                stroke={theme.stroke}
                strokeWidth="1.4"
                strokeOpacity="0.75"
              />

              {/* Glowing Inner Canal */}
              <path
                d="M 198 165 C 208 205 222 255 232 295 C 239 320 245 340 247 348"
                stroke="url(#canalConduit)"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeDasharray="2 3"
                opacity={0.6 + t * 0.4}
              />

              {/* Specular Edge Highlight */}
              <path
                d="M 225 175 C 235 215 245 260 252 300 C 255 320 256 335 254 345"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.9"
              />
            </g>

            {/* ---------------- 4. ANATOMIC MOLAR CROWN (CORONA DENTAL) ---------------- */}
            <g id="crown">
              <path
                d="M 80 145 
                   C 65 130 52 105 55 75 
                   C 58 45 78 28 108 30 
                   C 126 31 142 42 170 42 
                   C 198 42 214 31 232 30 
                   C 262 28 282 45 285 75 
                   C 288 105 275 130 260 145 
                   C 246 158 226 166 170 166 
                   C 114 166 94 158 80 145 
                   Z"
                fill="url(#molarGlassGrad)"
                stroke={theme.stroke}
                strokeWidth="1.6"
                strokeOpacity="0.7"
              />

              {/* Anatomical Molar Grooves & 4 Cusps */}
              <path
                d="M 100 48 C 125 55 145 68 170 68 C 195 68 215 55 240 48"
                stroke="#0EA5E9"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.7"
              />
              <path
                d="M 170 68 C 170 92 170 120 170 142"
                stroke="#0EA5E9"
                strokeWidth="1.6"
                strokeLinecap="round"
                opacity="0.55"
              />

              {/* 4 Anatomical Cusp Volumetric Lights */}
              <ellipse cx="104" cy="48" rx="14" ry="9" fill="#FFFFFF" opacity="0.8" />
              <ellipse cx="236" cy="48" rx="14" ry="9" fill="#FFFFFF" opacity="0.8" />
              <ellipse cx="125" cy="72" rx="16" ry="10" fill="#FFFFFF" opacity="0.6" />
              <ellipse cx="215" cy="72" rx="16" ry="10" fill="#FFFFFF" opacity="0.6" />

              {/* Dynamic Liquid Glass Sheen */}
              <path
                d="M 72 75 C 70 52 86 38 110 38 C 124 38 136 46 150 50 C 130 62 90 85 72 75 Z"
                fill="url(#sheenShift)"
              />
              <path
                d="M 268 75 C 270 52 254 38 230 38 C 216 38 204 46 190 50 C 210 62 250 85 268 75 Z"
                fill="url(#sheenShift)"
              />

              {/* Upper Curvature Rim Glow */}
              <path
                d="M 90 35 C 112 33 130 42 170 42 C 210 42 228 33 250 35"
                stroke="#FFFFFF"
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.95"
              />

              {/* Cervical Neck Margin */}
              <path
                d="M 95 150 C 125 162 150 164 170 164 C 190 164 215 162 245 150"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.9"
              />

              {/* Internal Radiant Pulp Organ */}
              <g transform="translate(170, 105)">
                <circle cx="0" cy="0" r="18" fill="url(#pulpRadial)" opacity="0.85" />
                <path
                  d="M 0 -9 L 3 -3 L 9 0 L 3 3 L 0 9 L -3 3 L -9 0 L -3 -3 Z"
                  fill="#FFFFFF"
                  className="drop-shadow-sm"
                  opacity="0.95"
                />
                <circle cx="0" cy="0" r="2.2" fill="#0EA5E9" />
              </g>
            </g>
          </svg>
        </div>
      </div>

      {/* 3D Interaction Control Indicator */}
      <div className="relative z-10 -mt-2 mb-2 pointer-events-none">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/95 backdrop-blur-md rounded-full text-[11px] font-semibold text-slate-700 border border-slate-200/90 shadow-xs">
          <Rotate3d className="w-3.5 h-3.5 text-cyan-600 animate-spin" style={{ animationDuration: '8s' }} />
          <span>Haz clic y arrastra para rotar en 3D</span>
        </span>
      </div>

      {/* Interactive Quick Bar */}
      <div className="relative z-10 flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-200/90 shadow-xs text-xs">
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
          <span>{autoRotate ? 'Giro 3D Activo' : 'Giro Manual'}</span>
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
            onClick={() => setGlassStyle('liquid_glass')}
            className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${
              glassStyle === 'liquid_glass'
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
