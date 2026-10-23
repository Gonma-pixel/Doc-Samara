import React, { useState } from 'react';
import { DentalService, AppointmentFormData } from '../types';
import { DENTAL_SERVICES } from '../data/servicesData';
import { X, Calendar as CalendarIcon, Clock, CheckCircle2, User, Phone, Mail, FileText, ArrowRight } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: DentalService | null;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  preselectedService
}) => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<AppointmentFormData>({
    serviceId: preselectedService ? preselectedService.id : DENTAL_SERVICES[0].id,
    serviceTitle: preselectedService ? preselectedService.title : DENTAL_SERVICES[0].title,
    date: '2026-10-27',
    timeSlot: '10:30 AM',
    fullName: '',
    phone: '',
    email: '',
    notes: '',
    isFirstVisit: true
  });
  const [confirmationCode, setConfirmationCode] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  // Available dates (simulated clinical slots for next days)
  const availableDates = [
    { label: 'Lun 27 Oct', value: '2026-10-27' },
    { label: 'Mar 28 Oct', value: '2026-10-28' },
    { label: 'Mié 29 Oct', value: '2026-10-29' },
    { label: 'Jue 30 Oct', value: '2026-10-30' },
    { label: 'Vie 31 Oct', value: '2026-10-31' },
    { label: 'Sáb 01 Nov', value: '2026-11-01' }
  ];

  const availableSlots = [
    '09:00 AM',
    '10:30 AM',
    '12:00 PM',
    '03:30 PM',
    '05:00 PM',
    '06:30 PM'
  ];

  const handleServiceChange = (id: string) => {
    const found = DENTAL_SERVICES.find((s) => s.id === id);
    setFormData((prev) => ({
      ...prev,
      serviceId: id,
      serviceTitle: found ? found.title : ''
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) return;
    const randomCode = `SAM-${Math.floor(1000 + Math.random() * 9000)}`;
    setConfirmationCode(randomCode);
    setStep(3); // Confirmation step
  };

  const generateGoogleCalendarLink = () => {
    const title = encodeURIComponent(`Cita Dental con Dra. Samara - ${formData.serviceTitle}`);
    const details = encodeURIComponent(
      `Cita médica con la Dra. Samara.\nTratamiento: ${formData.serviceTitle}\nCódigo de confirmación: ${confirmationCode}\nLlegar 10 minutos antes. Ubicación: Clínica Dra. Samara.`
    );
    const location = encodeURIComponent('Clínica Dental Dra. Samara');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  };

  const copyConfirmation = () => {
    const summary = `Cita Confirmada con la Dra. Samara:\nCódigo: ${confirmationCode}\nTratamiento: ${formData.serviceTitle}\nFecha: ${formData.date} a las ${formData.timeSlot}\nPaciente: ${formData.fullName}`;
    navigator.clipboard.writeText(summary);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 via-white to-cyan-50/40">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-700">
              Agenda Digital
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              {step === 3 ? '¡Cita Confirmada!' : 'Reserva tu Consulta con Dra. Samara'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <div className="p-6 overflow-y-auto">
          {step === 1 && (
            <div className="space-y-5">
              {/* Step indicator */}
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium pb-2 border-b border-slate-100">
                <span>Paso 1 de 2: Tratamiento y Horario</span>
                <span className="text-cyan-700 font-semibold">Siguiente: Datos personales</span>
              </div>

              {/* Service Select */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Selecciona el Tratamiento
                </label>
                <select
                  value={formData.serviceId}
                  onChange={(e) => handleServiceChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-hidden focus:border-cyan-500 focus:bg-white text-slate-800 cursor-pointer"
                >
                  {DENTAL_SERVICES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title} ({s.categoryLabel})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Select */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <CalendarIcon className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Día de Preferencia</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {availableDates.map((d) => (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, date: d.value })}
                      className={`p-2.5 text-xs font-medium rounded-xl border transition-all text-center cursor-pointer ${
                        formData.date === d.value
                          ? 'border-cyan-600 bg-cyan-50 text-cyan-900 font-bold shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hour Slot Select */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Horario Disponible</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setFormData({ ...formData, timeSlot: slot })}
                      className={`py-2 px-2 text-xs font-medium rounded-xl border transition-all text-center cursor-pointer ${
                        formData.timeSlot === slot
                          ? 'border-cyan-600 bg-cyan-50 text-cyan-900 font-bold shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full py-3 bg-slate-900 hover:bg-cyan-950 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Continuar con mis datos</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Step indicator */}
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium pb-2 border-b border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-cyan-700 hover:underline cursor-pointer"
                >
                  ← Modificar horario
                </button>
                <span>Paso 2 de 2: Datos de Contacto</span>
              </div>

              {/* Chosen summary */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-900">{formData.serviceTitle}</span>
                  <div className="text-slate-500">{formData.date} a las {formData.timeSlot}</div>
                </div>
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                  Sin costo previo
                </span>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Nombre Completo *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Sofia García"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-cyan-500 text-slate-900 placeholder:text-slate-400"
                />
              </div>

              {/* Phone / WhatsApp */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Teléfono o WhatsApp *</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+34 600 000 000 / +51 900 000 000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-cyan-500 text-slate-900 placeholder:text-slate-400"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Correo Electrónico (para confirmación)</span>
                </label>
                <input
                  type="email"
                  placeholder="sofia@ejemplo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-cyan-500 text-slate-900 placeholder:text-slate-400"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Motivo o molestia particular (opcional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="¿Tienes alguna molestia, duda o preferencia especial?"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-cyan-500 text-slate-900 placeholder:text-slate-400 resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-slate-900 hover:bg-cyan-950 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Confirmar Cita con la Dra. Samara</span>
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="space-y-6 text-center py-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 font-display">
                  ¡Reserva Exitosa, {formData.fullName.split(' ')[0]}!
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Tu espacio ha quedado agendado en la agenda privada de la Dra. Samara.
                </p>
              </div>

              {/* Digital Pass Card */}
              <div className="bg-slate-50/90 border border-slate-200 rounded-2xl p-5 text-left space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                    Código de Cita
                  </span>
                  <span className="font-mono font-bold text-cyan-800 text-sm">
                    {confirmationCode}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Tratamiento:</span>
                    <span className="font-semibold text-slate-800">{formData.serviceTitle}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Especialista:</span>
                    <span className="font-semibold text-slate-800">Dra. Samara</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Fecha:</span>
                    <span className="font-semibold text-slate-800">{formData.date}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Hora:</span>
                    <span className="font-semibold text-slate-800">{formData.timeSlot}</span>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-slate-500 bg-white/70 p-2.5 rounded-lg border border-slate-100">
                  Te enviaremos un recordatorio por WhatsApp unas horas antes. Recuerda llegar 10 minutos antes para registrar tu historia clínica digital.
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <a
                  href={generateGoogleCalendarLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-1/2 py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors"
                >
                  <CalendarIcon className="w-4 h-4 text-cyan-600" />
                  <span>Añadir a Google Calendar</span>
                </a>

                <button
                  type="button"
                  onClick={copyConfirmation}
                  className="w-full sm:w-1/2 py-2.5 px-4 bg-slate-900 hover:bg-cyan-950 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  {isCopied ? '¡Copiado al portapapeles!' : 'Copiar comprobante'}
                </button>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="text-xs text-slate-500 hover:text-slate-900 font-medium cursor-pointer"
              >
                Cerrar ventana
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
