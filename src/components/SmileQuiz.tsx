import React, { useState } from 'react';
import { Sparkles, ArrowRight, RotateCcw, CheckCircle2 } from 'lucide-react';
import { DENTAL_SERVICES } from '../data/servicesData';
import { DentalService } from '../types';

interface SmileQuizProps {
  onBookService: (service: DentalService) => void;
}

export const SmileQuiz: React.FC<SmileQuizProps> = ({ onBookService }) => {
  const [step, setStep] = useState<number>(1);
  const [goal, setGoal] = useState<string>('');
  const [sensitivity, setSensitivity] = useState<string>('');
  const [urgency, setUrgency] = useState<string>('');

  const resetQuiz = () => {
    setStep(1);
    setGoal('');
    setSensitivity('');
    setUrgency('');
  };

  // Determine recommended service based on user's choices
  const getRecommendation = (): DentalService => {
    if (goal === 'blanqueamiento') {
      return DENTAL_SERVICES.find((s) => s.id === 'blanqueamiento-laser') || DENTAL_SERVICES[0];
    }
    if (goal === 'alineacion') {
      return DENTAL_SERVICES.find((s) => s.id === 'ortodoncia-invisible') || DENTAL_SERVICES[1];
    }
    if (goal === 'dientes-faltantes') {
      return DENTAL_SERVICES.find((s) => s.id === 'implantes-carga') || DENTAL_SERVICES[3];
    }
    if (goal === 'estetica-total') {
      return DENTAL_SERVICES.find((s) => s.id === 'carillas-estetica') || DENTAL_SERVICES[0];
    }
    return DENTAL_SERVICES.find((s) => s.id === 'limpieza-airflow') || DENTAL_SERVICES[5];
  };

  const rec = getRecommendation();

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm text-left">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-50 border border-cyan-100 rounded-full text-xs font-semibold text-cyan-800 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            <span>Diagnóstico Digital Orientativo</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
            Descubre el Plan Ideal para Tu Sonrisa
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Responde 3 breves preguntas para que el sistema clínico de la Dra. Samara oriente el tratamiento recomendado para tu caso.
          </p>

          {/* Progress Indicator */}
          {step <= 3 && (
            <div className="flex items-center justify-center gap-2 mt-5">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    s === step
                      ? 'w-10 bg-cyan-600'
                      : s < step
                      ? 'w-6 bg-slate-300'
                      : 'w-4 bg-slate-100'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Step 1: Goal */}
        {step === 1 && (
          <div className="space-y-4 max-w-lg mx-auto">
            <h3 className="text-base font-bold text-slate-900 text-center">
              1. ¿Cuál es tu prioridad principal hoy?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'blanqueamiento', label: 'Dientes más blancos y radiantes' },
                { id: 'alineacion', label: 'Alinear sin brackets metálicos' },
                { id: 'estetica-total', label: 'Diseño integral con carillas' },
                { id: 'dientes-faltantes', label: 'Reemplazar pieza ausente (Implante)' },
                { id: 'higiene', label: 'Limpieza profunda y chequeo preventivo' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setGoal(opt.id);
                    setStep(2);
                  }}
                  className={`p-4 rounded-xl border text-left text-sm font-medium transition-all cursor-pointer ${
                    goal === opt.id
                      ? 'border-cyan-600 bg-cyan-50/50 text-cyan-900 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-cyan-300 text-slate-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Sensitivity */}
        {step === 2 && (
          <div className="space-y-4 max-w-lg mx-auto">
            <h3 className="text-base font-bold text-slate-900 text-center">
              2. ¿Experimentas sensibilidad o molestia con frío/calor?
            </h3>
            <div className="space-y-2.5">
              {[
                { id: 'none', label: 'Ninguna molestia, mis dientes se sienten bien' },
                { id: 'mild', label: 'Ocasional con bebidas muy frías o helados' },
                { id: 'sharp', label: 'Sensibilidad frecuente o molestia al masticar' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setSensitivity(opt.id);
                    setStep(3);
                  }}
                  className={`w-full p-4 rounded-xl border text-left text-sm font-medium transition-all cursor-pointer ${
                    sensitivity === opt.id
                      ? 'border-cyan-600 bg-cyan-50/50 text-cyan-900 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-cyan-300 text-slate-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="flex justify-between pt-2">
              <button
                onClick={() => setStep(1)}
                className="text-xs text-slate-500 hover:text-slate-900 font-medium cursor-pointer"
              >
                ← Pregunta anterior
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Timing */}
        {step === 3 && (
          <div className="space-y-4 max-w-lg mx-auto">
            <h3 className="text-base font-bold text-slate-900 text-center">
              3. ¿Con qué tiempo te gustaría iniciar?
            </h3>
            <div className="space-y-2.5">
              {[
                { id: 'asap', label: 'Lo antes posible (esta misma semana)' },
                { id: 'this_month', label: 'En las próximas dos a tres semanas' },
                { id: 'planning', label: 'Solo estoy evaluando opciones y presupuestos' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setUrgency(opt.id);
                    setStep(4);
                  }}
                  className={`w-full p-4 rounded-xl border text-left text-sm font-medium transition-all cursor-pointer ${
                    urgency === opt.id
                      ? 'border-cyan-600 bg-cyan-50/50 text-cyan-900 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-cyan-300 text-slate-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="flex justify-between pt-2">
              <button
                onClick={() => setStep(2)}
                className="text-xs text-slate-500 hover:text-slate-900 font-medium cursor-pointer"
              >
                ← Pregunta anterior
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Customized Recommendation */}
        {step === 4 && (
          <div className="space-y-6 max-w-xl mx-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 bg-gradient-to-br from-cyan-50/70 via-white to-sky-50/50 border border-cyan-200 rounded-2xl">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-700">
                Plan Sugerido por la Dra. Samara
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                {rec.title}
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                {rec.shortDesc}
              </p>

              <div className="mt-4 pt-4 border-t border-cyan-100 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Duración promedio:</span>
                  <span className="font-semibold text-slate-800">{rec.duration}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Experiencia del paciente:</span>
                  <span className="font-semibold text-emerald-700">Protocolo Sin Dolor</span>
                </div>
              </div>

              <div className="mt-4 space-y-1.5">
                {rec.keyBenefits.slice(0, 2).map((b, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                onClick={resetQuiz}
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Repetir cuestionario</span>
              </button>

              <button
                onClick={() => onBookService(rec)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-cyan-950 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm cursor-pointer"
              >
                <span>Agendar Consulta de Valoración</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
