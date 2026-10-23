import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  onBookAppointment: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onBookAppointment }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Servicios', href: '#servicios' },
    { label: 'Filosofía', href: '#filosofia' },
    { label: 'Resultados', href: '#resultados' },
    { label: 'Testimonios', href: '#testimonios' },
    { label: 'Preguntas', href: '#faq' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 py-3.5">
        {/* Zone 1: Brand Wordmark (Single text element in display face, no clutter) */}
        <a
          href="#"
          className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 font-display whitespace-nowrap shrink-0 hover:text-cyan-800 transition-colors"
        >
          Dra. Samara
        </a>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-slate-950 transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-4"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onBookAppointment}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-cyan-950 rounded-xl transition-all shadow-xs hover:shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
          >
            Agendar Cita
          </button>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-950 rounded-lg"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Complies with 15% mobile sticky cap rule) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white/98 px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-slate-700 hover:text-cyan-700 py-1"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};
