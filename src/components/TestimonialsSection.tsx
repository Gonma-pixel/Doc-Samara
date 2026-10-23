import React from 'react';
import { TESTIMONIALS } from '../data/servicesData';
import { Star, CheckCircle2 } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonios" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="max-w-2xl mx-auto text-center mb-14">
        <span className="text-xs uppercase tracking-widest text-cyan-700 font-bold">
          Experiencias Reales
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display mt-2">
          La Tranquilidad de Nuestros Pacientes
        </h2>
        <p className="mt-3 text-sm text-slate-600">
          Opiniones espontáneas de pacientes que confiaron su salud y estética dental a la Dra. Samara.
        </p>
      </div>

      {/* Testimonials Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TESTIMONIALS.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
          >
            <div>
              {/* Star Rating */}
              <div className="flex items-center gap-1 mb-4 text-amber-400">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-slate-700 leading-relaxed italic">
                &ldquo;{t.text}&rdquo;
              </p>
            </div>

            {/* Author Footer */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900 block">{t.patientName}</span>
                <span className="text-cyan-700 font-medium">{t.treatment}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[11px]">Paciente Verificado</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
