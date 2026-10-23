import React, { useState } from 'react';
import { Header } from './components/Header';
import { AnimatedToothHero } from './components/AnimatedToothHero';
import { ServicesSection } from './components/ServicesSection';
import { BeforeAfterSlider } from './components/BeforeAfterSlider';
import { SmileQuiz } from './components/SmileQuiz';
import { AboutSection } from './components/AboutSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { ServiceModal } from './components/ServiceModal';
import { BookingModal } from './components/BookingModal';
import { DENTAL_SERVICES } from './data/servicesData';
import { DentalService } from './types';

export default function App() {
  const [selectedService, setSelectedService] = useState<DentalService | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState<boolean>(false);
  const [preselectedBookingService, setPreselectedBookingService] = useState<DentalService | null>(null);

  const handleOpenBooking = (service?: DentalService) => {
    if (service) {
      setPreselectedBookingService(service);
    } else {
      setPreselectedBookingService(null);
    }
    setBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FCFCFD] text-slate-800 flex flex-col font-sans selection:bg-cyan-100 selection:text-cyan-900">
      {/* Top Bar Header */}
      <Header onBookAppointment={() => handleOpenBooking()} />

      <main className="flex-1">
        {/* Hero Section: Centered animated tooth with roots that open on scroll to reveal services */}
        <AnimatedToothHero
          onSelectService={(service) => setSelectedService(service)}
          onBookAppointment={(serviceId) => {
            const found = serviceId ? DENTAL_SERVICES.find((s) => s.id === serviceId) : undefined;
            handleOpenBooking(found);
          }}
          featuredServices={DENTAL_SERVICES}
        />

        {/* Complete Services Directory */}
        <ServicesSection
          onSelectService={(service) => setSelectedService(service)}
          onBookService={(service) => handleOpenBooking(service)}
        />

        {/* Real Smile Transformation Before & After Slider */}
        <BeforeAfterSlider />

        {/* Interactive Clinical Smile Assessment Quiz */}
        <SmileQuiz onBookService={(service) => handleOpenBooking(service)} />

        {/* About Dra. Samara & The Clinic */}
        <AboutSection onBookAppointment={() => handleOpenBooking()} />

        {/* Verified Patient Testimonials */}
        <TestimonialsSection />

        {/* Frequently Asked Questions */}
        <FAQSection />
      </main>

      {/* Quiet Footer */}
      <Footer onBookAppointment={() => handleOpenBooking()} />

      {/* Service Detail Modal */}
      <ServiceModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onBookService={(service) => handleOpenBooking(service)}
      />

      {/* Dynamic Appointment Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        preselectedService={preselectedBookingService}
      />
    </div>
  );
}
