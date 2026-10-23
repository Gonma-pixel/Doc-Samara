import React, { useState } from 'react';
import { FAQ_ITEMS } from '../data/servicesData';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-700 mb-2">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-600" />
          <span>Dudas Frecuentes</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
          Resolvemos tus Preguntas
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Transparencia absoluta en cada procedimiento y paso de tu tratamiento.
        </p>
      </div>

      <div className="space-y-3">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden transition-all shadow-xs"
            >
              <button
                onClick={() => toggleIndex(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 hover:text-cyan-800 transition-colors cursor-pointer"
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-cyan-600' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/40 animate-in fade-in duration-150">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
