import React from 'react';
import { DentalService } from '../types';
import { X, CheckCircle2, Clock, Calendar, ShieldCheck, Cpu } from 'lucide-react';

interface ServiceModalProps {
  service: DentalService | null;
  onClose: () => void;
  onBookService: (service: DentalService) => void;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({
  service,
  onClose,
  onBookService
}) => {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 via-white to-cyan-50/30">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-700">
              {service.categoryLabel}
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">
              {service.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50/80 rounded-xl border border-slate-100 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <Clock className="w-4 h-4 text-cyan-600 shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Duración</span>
                <span className="font-medium">{service.duration}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Calendar className="w-4 h-4 text-cyan-600 shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Sesiones</span>
                <span className="font-medium">{service.sessions}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Molestia</span>
                <span className="font-medium text-emerald-700">Cero Dolor</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Descripción del Procedimiento</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {service.fullDesc}
            </p>
          </div>

          {/* Key Benefits */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3">Beneficios Principales</h3>
            <ul className="space-y-2.5">
              {service.keyBenefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Technology Employed */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-600" />
              <span>Tecnología de Vanguardia Utilizada</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {service.techUsed.map((tech, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-lg border border-slate-200/60 font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Ideal For Note */}
          <div className="p-3.5 bg-cyan-50/60 border border-cyan-100 rounded-xl text-xs text-cyan-900">
            <span className="font-bold">Indicado para: </span>
            <span>{service.idealFor}</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Volver a servicios
          </button>
          <button
            onClick={() => {
              onBookService(service);
              onClose();
            }}
            className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-cyan-950 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            Agendar este tratamiento
          </button>
        </div>
      </div>
    </div>
  );
};
