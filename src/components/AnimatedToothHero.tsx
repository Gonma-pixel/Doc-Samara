import React, { useEffect, useState, useRef } from 'react';
import { ToothSVG } from './ToothSVG';
import { Sparkles, ChevronDown, ArrowDown, Volume2, VolumeX, Eye } from 'lucide-react';
import { DentalService } from '../types';

interface AnimatedToothHeroProps {
  onSelectService: (service: DentalService) => void;
  onBookAppointment: (serviceId?: string) => void;
  featuredServices: DentalService[];
}

export const AnimatedToothHero: React.FC<AnimatedToothHeroProps> = ({
  onSelectService,
  onBookAppointment,
  featuredServices
}) => {
  // openProgress ranges from 0.0 (closed) to 1.0 (fully open roots)
  const [openProgress, setOpenProgress] = useState<number>(0);
  const [manualScrub, setManualScrub] = useState<boolean>(false);
  const [showAnatomy, setShowAnatomy] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastSoundTimeRef = useRef<number>(0);

  // Play a soft pleasant harmonic chime using Web Audio API
  const playToothChime = (freq = 520) => {
    if (!soundEnabled) return;
    const now = Date.now();
    if (now - lastSoundTimeRef.current < 250) return; // rate limit
    lastSoundTimeRef.current = now;

    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch {
      // Audio not supported or blocked
    }
  };

  // Scroll listener tracking position relative to the hero section
  useEffect(() => {
    const handleScroll = () => {
      if (manualScrub) return; // if user is manually dragging slider, respect their input

      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight * 0.85; // calculate transition window
      
      // Calculate progress 0 -> 1 within the hero fold
      const computed = Math.min(1, Math.max(0, scrollY / (heroHeight * 0.65)));
      setOpenProgress(computed);

      if (computed > 0.4 && computed < 0.6) {
        playToothChime(640);
      } else if (computed > 0.85) {
        playToothChime(880);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [manualScrub, soundEnabled]);

  const handleManualSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    setManualScrub(true);
    const val = parseFloat(e.target.value);
    setOpenProgress(val);
    playToothChime(400 + val * 450);
  };

  const handleScrollToServices = () => {
    const el = document.getElementById('servicios');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-between pt-24 pb-12 px-4 sm:px-6 bg-gradient-to-b from-white via-[#FAFBFD] to-white overflow-hidden"
    >
      {/* Background ambient lighting - soft clinical white / pearl crystal */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-cyan-50/70 via-sky-50/40 to-slate-50/60 rounded-full blur-3xl opacity-80" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-50/40 rounded-full blur-2xl" />
        <div className="absolute top-20 right-10 w-80 h-80 bg-blue-50/40 rounded-full blur-2xl" />
        {/* Subtle grid pattern for clinical precision */}
        <div 
          className="absolute inset-0 opacity-[0.035]" 
          style={{
            backgroundImage: 'radial-gradient(#0284c7 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      {/* Hero Header Content */}
      <div className="relative z-10 text-center max-w-3xl mx-auto pt-4 pb-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-xs mb-4 text-xs font-medium text-slate-600">
          <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
          <span>Odontología de Precisión & Estética Biomimética</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 font-display text-balance">
          Dra. Samara
        </h1>
        <p className="mt-3 text-lg sm:text-xl text-slate-600 font-light max-w-xl mx-auto leading-relaxed">
          Cuidado dental sin dolor, estética natural y tecnología 3D en un espacio de pureza y bienestar.
        </p>
      </div>

      {/* Center Interactive Tooth Canvas */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center my-auto py-4">
        {/* Central Animated Tooth with floating physics */}
        <div className="relative group cursor-pointer" onClick={() => playToothChime(750)}>
          {/* Subtle gleam glow effect behind the tooth */}
          <div
            className="absolute inset-0 -inset-x-8 bg-cyan-100/40 rounded-full blur-2xl transition-opacity duration-300 pointer-events-none"
            style={{ opacity: 0.35 + openProgress * 0.45 }}
          />

          {/* Tooth Component */}
          <div className={`${openProgress < 0.15 ? 'animate-tooth-float' : ''} transition-transform`}>
            <ToothSVG
              openProgress={openProgress}
              showAnatomyLabels={showAnatomy}
              className="w-72 sm:w-80 h-80 sm:h-96"
            />
          </div>
        </div>

        {/* Dynamic Services Emergence: Revealed directly from parted roots */}
        <div
          className="w-full max-w-3xl mt-4 transition-all duration-300"
          style={{
            opacity: Math.max(0, (openProgress - 0.25) / 0.75),
            transform: `translateY(${(1 - openProgress) * 30}px)`,
            pointerEvents: openProgress > 0.35 ? 'auto' : 'none'
          }}
        >
          <div className="text-center mb-4">
            <span className="text-xs uppercase tracking-widest text-cyan-600 font-semibold">
              Servicios revelados desde la raíz
            </span>
            <p className="text-sm text-slate-600 mt-0.5">
              Haz clic en cualquiera de los tratamientos destacados para ver detalles o agendar
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {featuredServices.slice(0, 4).map((service) => (
              <div
                key={service.id}
                onClick={() => onSelectService(service)}
                className="group relative bg-white/95 backdrop-blur-sm p-4 rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-cyan-300 transition-all duration-200 cursor-pointer text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-medium text-cyan-700">
                    {service.categoryLabel}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {service.duration}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-cyan-700 transition-colors line-clamp-1">
                  {service.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {service.shortDesc}
                </p>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-cyan-600 font-medium">
                  <span>Ver tratamiento</span>
                  <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Scroll & Interactive Root Scrubber Control */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-4 bg-white/80 backdrop-blur-md px-5 py-3 rounded-2xl border border-slate-200/70 shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-medium text-slate-700 whitespace-nowrap">
              Apertura de raíces:
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={openProgress}
              onChange={handleManualSlider}
              className="w-32 sm:w-44 accent-cyan-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
              aria-label="Control deslizante de apertura de raíces"
            />
            <span className="text-xs font-mono text-cyan-700 font-semibold w-9 text-right tabular-nums">
              {Math.round(openProgress * 100)}%
            </span>
          </div>

          <div className="h-4 w-[1px] bg-slate-200 hidden sm:block" />

          {/* Interactive Feature Toggles */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAnatomy(!showAnatomy)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                showAnatomy
                  ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showAnatomy ? 'Ocultar anatomía' : 'Ver anatomía'}</span>
            </button>

            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) playToothChime(580);
              }}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                soundEnabled
                  ? 'text-cyan-700 bg-cyan-50 border border-cyan-200'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
              title={soundEnabled ? 'Desactivar sonido' : 'Activar sonido armónico'}
              aria-label="Alternar sonido"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Indicator & Direct Action */}
      <div className="relative z-10 flex flex-col items-center gap-3 pt-2">
        <button
          onClick={handleScrollToServices}
          className="group inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-cyan-700 transition-colors"
        >
          <span>Desliza para explorar todos los servicios</span>
          <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-1 transition-transform" />
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onBookAppointment()}
            className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-cyan-950 rounded-xl shadow-sm transition-all hover:shadow-md cursor-pointer whitespace-nowrap"
          >
            Agendar Cita con Dra. Samara
          </button>
          <button
            onClick={handleScrollToServices}
            className="px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
          >
            Ver Carta Completa
          </button>
        </div>
      </div>
    </section>
  );
};
