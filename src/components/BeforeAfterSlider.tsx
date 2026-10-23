import React, { useState, useRef } from 'react';
import { Sparkles, SlidersHorizontal } from 'lucide-react';
import smileResultImg from '../assets/images/smile_aesthetic_result_1792793564651.jpg';

export const BeforeAfterSlider: React.FC = () => {
  const [sliderPos, setSliderPos] = useState<number>(50); // percentage 0 to 100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!e.touches[0]) return;
    handleMove(e.touches[0].clientX);
  };

  return (
    <section id="resultados" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-gradient-to-br from-slate-50 via-white to-cyan-50/20 border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Context & Proof */}
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              <span>Resultados Clínicos Reales</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Transformación de Sonrisa & Luminosidad
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed">
              Desliza el comparador interactivo para apreciar el efecto del protocolo de blanqueamiento láser y microdiseño biomimético realizado por la Dra. Samara.
            </p>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100">
                <span className="text-slate-500 font-medium">Tiempo de tratamiento:</span>
                <span className="font-bold text-slate-900">1 sesión (55 minutos)</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100">
                <span className="text-slate-500 font-medium">Aclaramiento logrado:</span>
                <span className="font-bold text-cyan-700">6 tonos en escala VITA</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100">
                <span className="text-slate-500 font-medium">Sensibilidad post-tratamiento:</span>
                <span className="font-bold text-emerald-700">0% reportada</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-xs text-slate-400 italic">
                * Caso clínico real documentado en la clínica de la Dra. Samara con consentimiento del paciente.
              </span>
            </div>
          </div>

          {/* Right Column: Interactive Before / After Comparison */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div
              ref={containerRef}
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              onTouchStart={() => setIsDragging(true)}
              onTouchEnd={() => setIsDragging(false)}
              className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-slate-200 cursor-ew-resize select-none bg-slate-100"
            >
              {/* After Image (Full Background) */}
              <img
                src={smileResultImg}
                alt="Sonrisa después del blanqueamiento dental con la Dra. Samara"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Before Overlay Image (Clipped with sepia/warmer tint to demonstrate realistic staining before whitening) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPos}%` }}
              >
                <img
                  src={smileResultImg}
                  alt="Sonrisa antes del tratamiento"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover max-w-none"
                  style={{
                    filter: 'sepia(0.35) contrast(0.95) brightness(0.88) hue-rotate(-15deg)',
                    width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
                    height: '100%'
                  }}
                />
              </div>

              {/* Slider Divider Line */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-xl flex items-center justify-center pointer-events-none"
                style={{ left: `${sliderPos}%` }}
              >
                {/* Drag Handle Bubble */}
                <div className="w-9 h-9 bg-white text-slate-800 rounded-full shadow-lg border border-slate-200 flex items-center justify-center">
                  <SlidersHorizontal className="w-4 h-4 text-cyan-700" />
                </div>
              </div>

              {/* Corner Watermarks */}
              <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-md text-[11px] font-semibold text-white pointer-events-none">
                Antes (Pigmentación)
              </div>
              <div className="absolute top-3 right-3 px-2.5 py-1 bg-cyan-700/80 backdrop-blur-md rounded-md text-[11px] font-semibold text-white pointer-events-none">
                Después (Dra. Samara)
              </div>
            </div>

            {/* Instruction caption */}
            <div className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-600" />
              <span>Arrastra la barra central a la izquierda o derecha para comparar</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
