import React from 'react';
import { Award, HeartHandshake, Sparkles, CheckCircle2 } from 'lucide-react';
import samaraPortrait from '../assets/images/samara_portrait_1792793564353.jpg';
import clinicInterior from '../assets/images/dental_clinic_interior_1792793564246.jpg';

interface AboutSectionProps {
  onBookAppointment: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onBookAppointment }) => {
  return (
    <section id="filosofia" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Portrait & Credentials Imagery */}
        <div className="lg:col-span-5 relative">
          <div className="relative mx-auto max-w-md rounded-3xl overflow-hidden shadow-xl border border-slate-200/90 bg-white">
            <img
              src={samaraPortrait}
              alt="Dra. Samara en su clínica dental"
              referrerPolicy="no-referrer"
              className="w-full aspect-[3/4] object-cover object-top"
            />
            {/* Overlay trust caption */}
            <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-slate-950/90 via-slate-900/60 to-transparent text-white">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-300">
                Directora Médica & Especialista
              </span>
              <h3 className="text-xl font-bold font-display">
                Dra. Samara
              </h3>
              <p className="text-xs text-slate-200 mt-0.5">
                Especialista en Odontología Estética & Rehabilitación Biomimética
              </p>
            </div>
          </div>

          {/* Experience badge */}
          <div className="absolute -bottom-5 -right-2 sm:right-6 bg-white border border-slate-200 rounded-2xl p-4 shadow-lg flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-700">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 block font-mono">
                +12 Años
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Transformando sonrisas
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Narrative & Values */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-700">
            <HeartHandshake className="w-3.5 h-3.5 text-cyan-600" />
            <span>Filosofía de Cuidado Integral</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight text-balance">
            La Odontología que Mereces: Precisa, Respetuosa y Totalmente Libre de Miedo
          </h2>

          <p className="text-base text-slate-600 leading-relaxed">
            &ldquo;Creo firmemente que nadie debería sentir temor al acudir al dentista. Mi compromiso es tratar a cada paciente como a un miembro de mi propia familia, combinando la máxima precisión médica con una atmósfera de calma y confort.&rdquo;
          </p>

          {/* Pillars List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 text-cyan-700 font-bold text-sm mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Protocolo Cero Dolor</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Anestesia computarizada indolora, ultrasonido de agua tibia y música ambiental relajante.
              </p>
            </div>

            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 text-cyan-700 font-bold text-sm mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Odontología Biomimética</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Preservamos al máximo tu estructura dental natural mediante adhesión química avanzada.
              </p>
            </div>
          </div>

          {/* Clinic Photo & Atmosphere */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden shrink-0 border border-slate-100">
              <img
                src={clinicInterior}
                alt="Instalaciones de la clínica dental de Dra. Samara"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900">Instalaciones de Máxima Pureza</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Gabinetes diseñados bajo arquitectura biofílica, purificación de aire de grado hospitalario y tecnología de esterilización clase B certificada.
              </p>
              <div className="pt-1">
                <button
                  onClick={onBookAppointment}
                  className="text-xs font-semibold text-cyan-700 hover:text-cyan-900 inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Conocer la clínica en tu primera cita →</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
