import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

interface FooterProps {
  onBookAppointment: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onBookAppointment }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800 text-left">
          {/* Brand Col */}
          <div className="space-y-4">
            <span className="text-xl font-bold tracking-tight text-white font-display block">
              Dra. Samara
            </span>
            <p className="text-xs text-slate-400 leading-relaxed">
              Clínica de odontología avanzada, estética dental biomimética y rehabilitación integral. Cuidado de precisión sin dolor.
            </p>
            <div className="pt-2">
              <button
                onClick={onBookAppointment}
                className="px-4 py-2 text-xs font-semibold bg-white text-slate-900 hover:bg-cyan-50 rounded-xl transition-colors cursor-pointer"
              >
                Solicitar Cita Previa
              </button>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Navegación
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#servicios" className="hover:text-white transition-colors">Carta de Tratamientos</a></li>
              <li><a href="#filosofia" className="hover:text-white transition-colors">La Dra. Samara</a></li>
              <li><a href="#resultados" className="hover:text-white transition-colors">Casos Clínicos de Antes y Después</a></li>
              <li><a href="#testimonios" className="hover:text-white transition-colors">Testimonios Verificados</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Preguntas Frecuentes</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Contacto Directo
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Av. de las Sonrisas 104, Edificio Médico Platinum, Suite 4B</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <a href="tel:+34912345678" className="hover:text-white transition-colors">+34 912 345 678</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <a href="mailto:citas@drasamara.com" className="hover:text-white transition-colors">citas@drasamara.com</a>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Horario de Atención
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-300 font-medium">Lunes a Viernes:</span>
                  <span>08:30 – 20:00</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-300 font-medium">Sábados:</span>
                  <span>09:00 – 14:00 (Citas programadas)</span>
                </div>
              </div>
              <div className="pt-1 text-[11px] text-emerald-400">
                Atención preferencial de urgencias dentales
              </div>
            </div>
          </div>
        </div>

        {/* Quiet Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Dra. Samara · Odontología Avanzada. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="#" className="hover:text-slate-400 transition-colors">Aviso Legal</a>
            <span>·</span>
            <a href="#" className="hover:text-slate-400 transition-colors">Política de Privacidad</a>
            <span>·</span>
            <a href="#" className="hover:text-slate-400 transition-colors">Registro Sanitario Colegiado</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
