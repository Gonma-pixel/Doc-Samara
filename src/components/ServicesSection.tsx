import React, { useState } from 'react';
import { DENTAL_SERVICES } from '../data/servicesData';
import { DentalService } from '../types';
import { Sparkles, ArrowRight, ShieldCheck, Clock, Check } from 'lucide-react';

interface ServicesSectionProps {
  onSelectService: (service: DentalService) => void;
  onBookService: (service: DentalService) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectService,
  onBookService
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'Todos los tratamientos' },
    { id: 'estetica', label: 'Estética & Diseño' },
    { id: 'rehabilitacion', label: 'Rehabilitación & Implantes' },
    { id: 'preventiva', label: 'Higiene & Prevención' },
    { id: 'infantil', label: 'Odontopediatría' }
  ];

  const filteredServices = DENTAL_SERVICES.filter((svc) => {
    const matchesCategory = selectedCategory === 'all' || svc.category === selectedCategory;
    const matchesSearch =
      svc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      svc.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      svc.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="servicios" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <span className="text-xs uppercase tracking-widest text-cyan-700 font-bold">
          Carta de Tratamientos Clínicos
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mt-2 font-display text-balance">
          Servicios Odontológicos de la Dra. Samara
        </h2>
        <p className="mt-3 text-base text-slate-600 leading-relaxed">
          Cada tratamiento combina tecnología digital no invasiva, biomateriales de alta biocompatibilidad y un enfoque cálido enfocado en tu tranquilidad.
        </p>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-4 border-b border-slate-100">
        {/* Interactive Segmented Filter Control */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl overflow-x-auto max-w-full">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="w-full md:w-64">
          <input
            type="text"
            placeholder="Buscar por tratamiento..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:outline-hidden focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-800 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service, index) => (
          <div
            key={service.id}
            className="group relative bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between hover:shadow-lg hover:border-cyan-300 transition-all duration-200 text-left"
          >
            <div>
              {/* Category & Editorial Numbering */}
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                <span className="font-semibold text-cyan-700">
                  {service.categoryLabel}
                </span>
                <span className="font-mono text-slate-400">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-cyan-800 transition-colors">
                {service.title}
              </h3>

              {/* Description */}
              <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                {service.shortDesc}
              </p>

              {/* Technical Specifications */}
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{service.duration} · {service.sessions}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="text-emerald-700 font-medium">Protocolo sin dolor</span>
                </div>
              </div>

              {/* Quick Perks */}
              <div className="mt-4 space-y-1.5">
                {service.keyBenefits.slice(0, 2).map((benefit, bIdx) => (
                  <div key={bIdx} className="flex items-start gap-2 text-xs text-slate-600">
                    <Check className="w-3.5 h-3.5 text-cyan-600 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => onSelectService(service)}
                className="text-xs font-semibold text-cyan-700 hover:text-cyan-900 inline-flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Detalles y tecnología</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onBookService(service)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-900 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                Agendar
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200/60 p-8">
          <p className="text-sm text-slate-600">
            No se encontraron servicios que coincidan con &ldquo;{searchQuery}&rdquo;.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="mt-3 text-xs font-semibold text-cyan-700 hover:underline"
          >
            Restablecer filtros
          </button>
        </div>
      )}
    </section>
  );
};
