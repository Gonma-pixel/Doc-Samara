import React from 'react';

interface ToothSVGProps {
  /**
   * Root open factor: 0.0 (fully closed natural tooth) to 1.0 (roots parted open revealing the services)
   */
  openProgress: number;
  className?: string;
  showAnatomyLabels?: boolean;
}

export const ToothSVG: React.FC<ToothSVGProps> = ({
  openProgress,
  className = '',
  showAnatomyLabels = false
}) => {
  // Clamped progress between 0 and 1
  const t = Math.max(0, Math.min(1, openProgress));

  // Transformation for Left Root (Radix Mesialis)
  // Rotates outwards to the left and translates outward
  const leftAngle = -32 * t; // degrees
  const leftTranslateX = -48 * t; // px
  const leftTranslateY = -6 * t; // px

  // Transformation for Right Root (Radix Distalis)
  // Rotates outwards to the right and translates outward
  const rightAngle = 32 * t; // degrees
  const rightTranslateX = 48 * t; // px
  const rightTranslateY = -6 * t; // px

  // Light beam and service portal opacity inside parted roots
  const revealOpacity = Math.min(1, Math.max(0, (t - 0.15) / 0.85));

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 340 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-w-[340px] max-h-[400px] drop-shadow-2xl transition-transform duration-75"
        style={{
          filter: `drop-shadow(0 20px 35px rgba(14, 165, 233, ${0.12 + t * 0.18}))`
        }}
      >
        <defs>
          {/* Enamel Crown Gradient - Clean pure pearl white with subtle depth */}
          <linearGradient id="crownGrad" x1="50" y1="20" x2="290" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="45%" stopColor="#F8FAFC" />
            <stop offset="85%" stopColor="#EFF6FF" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>

          {/* Specular Gleam Highlight */}
          <linearGradient id="gleamGrad" x1="70" y1="30" x2="160" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Left Root Gradient */}
          <linearGradient id="rootLeftGrad" x1="120" y1="150" x2="60" y2="360" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="30%" stopColor="#F1F5F9" />
            <stop offset="80%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>

          {/* Right Root Gradient */}
          <linearGradient id="rootRightGrad" x1="220" y1="150" x2="280" y2="360" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="30%" stopColor="#F1F5F9" />
            <stop offset="80%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>

          {/* Inner Pulp & Energy Glow when roots open */}
          <radialGradient id="pulpCoreGlow" cx="170" cy="220" r="110" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#0EA5E9" stopOpacity="0.5" />
            <stop offset="75%" stopColor="#7DD3FC" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>

          {/* Translucent Root Canal Conduits */}
          <linearGradient id="canalGrad" x1="170" y1="150" x2="170" y2="340" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.1" />
          </linearGradient>

          {/* Filter for soft blur on glow */}
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ---------------- 1. INNER REVEAL PORTAL (Visible as roots open) ---------------- */}
        <g style={{ opacity: revealOpacity, transition: 'opacity 0.2s ease-out' }}>
          {/* Radiant back-light emerging between the roots */}
          <circle cx="170" cy="235" r={50 + t * 45} fill="url(#pulpCoreGlow)" filter="url(#softGlow)" />

          {/* Core pulse rings */}
          <circle
            cx="170"
            cy="235"
            r={30 + t * 25}
            stroke="#38BDF8"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className="animate-spin"
            style={{ animationDuration: '14s', transformOrigin: '170px 235px' }}
            opacity="0.6"
          />

          {/* Inner Light Beams branching out towards services */}
          <path
            d="M 170 180 L 140 280 M 170 180 L 200 280 M 170 180 L 170 300"
            stroke="#0EA5E9"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.5"
          />

          {/* Center Gem / Service Beacon */}
          <g transform={`translate(170, 235) scale(${0.7 + t * 0.4}) translate(-170, -235)`}>
            <polygon
              points="170,215 186,227 186,247 170,257 154,247 154,227"
              fill="#FFFFFF"
              stroke="#0EA5E9"
              strokeWidth="2"
              className="drop-shadow-md"
            />
            {/* Sparkle cross */}
            <path
              d="M 170 223 L 170 249 M 157 236 L 183 236"
              stroke="#0284C7"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="170" cy="236" r="3.5" fill="#38BDF8" />
          </g>

          {/* Floating light particles between open roots */}
          <circle cx="150" cy="215" r="2.5" fill="#38BDF8" opacity="0.8" />
          <circle cx="190" cy="220" r="2" fill="#7DD3FC" opacity="0.9" />
          <circle cx="160" cy="270" r="3" fill="#0EA5E9" opacity="0.75" />
          <circle cx="180" cy="275" r="2.5" fill="#38BDF8" opacity="0.85" />
        </g>

        {/* ---------------- 2. LEFT ROOT (RADIX MESIALIS) ---------------- */}
        <g
          id="root-left"
          style={{
            transformOrigin: '140px 165px',
            transform: `translate(${leftTranslateX}px, ${leftTranslateY}px) rotate(${leftAngle}deg)`,
            transition: 'transform 0.08s ease-out'
          }}
        >
          {/* Main Left Root Body */}
          <path
            d="M 130 155 
               C 120 185 105 230 92 275 
               C 83 305 78 335 84 352 
               C 87 358 96 359 101 353 
               C 112 338 122 295 136 245 
               C 146 210 156 182 165 170 
               Z"
            fill="url(#rootLeftGrad)"
            stroke="#CBD5E1"
            strokeWidth="1.2"
          />

          {/* Left Root Inner Canal (Radicular Conduit) */}
          <path
            d="M 142 165 
               C 132 205 118 255 108 295 
               C 101 320 95 340 93 348"
            stroke="url(#canalGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="2 3"
            opacity={0.4 + t * 0.4}
          />

          {/* Specular highlight along root ridge */}
          <path
            d="M 115 175 
               C 105 215 95 260 88 300
               C 85 320 84 335 86 345"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.75"
          />
        </g>

        {/* ---------------- 3. RIGHT ROOT (RADIX DISTALIS) ---------------- */}
        <g
          id="root-right"
          style={{
            transformOrigin: '200px 165px',
            transform: `translate(${rightTranslateX}px, ${rightTranslateY}px) rotate(${rightAngle}deg)`,
            transition: 'transform 0.08s ease-out'
          }}
        >
          {/* Main Right Root Body */}
          <path
            d="M 210 155 
               C 220 185 235 230 248 275 
               C 257 305 262 335 256 352 
               C 253 358 244 359 239 353 
               C 228 338 218 295 204 245 
               C 194 210 184 182 175 170 
               Z"
            fill="url(#rootRightGrad)"
            stroke="#CBD5E1"
            strokeWidth="1.2"
          />

          {/* Right Root Inner Canal */}
          <path
            d="M 198 165 
               C 208 205 222 255 232 295 
               C 239 320 245 340 247 348"
            stroke="url(#canalGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="2 3"
            opacity={0.4 + t * 0.4}
          />

          {/* Specular highlight along root ridge */}
          <path
            d="M 225 175 
               C 235 215 245 260 252 300
               C 255 320 256 335 254 345"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.75"
          />
        </g>

        {/* ---------------- 4. TOOTH CROWN (CORONA DENTAL) ---------------- */}
        {/* The crown remains anchored at the top with exquisite enamel sculpting */}
        <g id="crown" className="transition-transform duration-100">
          {/* Outer Crown Shadow & Base */}
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
            fill="url(#crownGrad)"
            stroke="#E2E8F0"
            strokeWidth="1.5"
          />

          {/* Occlusal Anatomical Fissures / Surcos y Cúspides */}
          <path
            d="M 100 48 
               C 125 55 145 68 170 68 
               C 195 68 215 55 240 48"
            stroke="#CBD5E1"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.6"
          />
          <path
            d="M 170 68 
               C 170 90 170 120 170 140"
            stroke="#CBD5E1"
            strokeWidth="1.3"
            strokeLinecap="round"
            opacity="0.45"
          />

          {/* Left Cusp Glow Accent */}
          <path
            d="M 72 75 
               C 70 52 86 38 110 38 
               C 124 38 136 46 150 50 
               C 130 62 90 85 72 75 Z"
            fill="url(#gleamGrad)"
          />

          {/* Right Cusp Glow Accent */}
          <path
            d="M 268 75 
               C 270 52 254 38 230 38 
               C 216 38 204 46 190 50 
               C 210 62 250 85 268 75 Z"
            fill="url(#gleamGrad)"
          />

          {/* Specular White Rim Shine on Upper Curve */}
          <path
            d="M 90 35 
               C 112 33 130 42 170 42 
               C 210 42 228 33 250 35"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.95"
          />

          {/* Cervical Margin Highlight (Neck of the tooth) */}
          <path
            d="M 95 150 
               C 125 162 150 164 170 164 
               C 190 164 215 162 245 150"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Center Enamel Diamond Sparkle */}
          <g transform="translate(170, 105)">
            <path
              d="M 0 -8 L 2.5 -2.5 L 8 0 L 2.5 2.5 L 0 8 L -2.5 2.5 L -8 0 L -2.5 -2.5 Z"
              fill="#FFFFFF"
              className="drop-shadow-sm"
              opacity="0.9"
            />
            <circle cx="0" cy="0" r="1.5" fill="#38BDF8" />
          </g>
        </g>
      </svg>

      {/* Anatomical Tag Badges (Toggled when active or hovering) */}
      {showAnatomyLabels && (
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-2 text-xs">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-medium text-slate-500 bg-white/90 px-2 py-0.5 rounded shadow-sm border border-slate-100">
              Esmalte & Corona 3D
            </span>
            <span className="text-[11px] font-medium text-cyan-600 bg-cyan-50/90 px-2 py-0.5 rounded shadow-sm border border-cyan-100">
              Blanco Natural 99.8%
            </span>
          </div>

          <div className="flex justify-between items-end pb-4">
            <span
              className="text-[11px] font-medium text-slate-500 bg-white/90 px-2 py-0.5 rounded shadow-sm border border-slate-100 transition-transform"
              style={{ transform: `translateX(${leftTranslateX * 0.4}px)` }}
            >
              Raíz Mesial (Guiada)
            </span>
            <span
              className="text-[11px] font-medium text-slate-500 bg-white/90 px-2 py-0.5 rounded shadow-sm border border-slate-100 transition-transform"
              style={{ transform: `translateX(${rightTranslateX * 0.4}px)` }}
            >
              Raíz Distal (Preservada)
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
