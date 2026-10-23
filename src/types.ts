export interface DentalService {
  id: string;
  title: string;
  category: 'estetica' | 'rehabilitacion' | 'preventiva' | 'infantil';
  categoryLabel: string;
  shortDesc: string;
  fullDesc: string;
  duration: string;
  sessions: string;
  discomfortLevel: string; // e.g. "0/10 (Totalmente indoloro con anestesia computarizada)"
  keyBenefits: string[];
  techUsed: string[];
  idealFor: string;
  badge?: string;
}

export interface AppointmentFormData {
  serviceId: string;
  serviceTitle: string;
  date: string;
  timeSlot: string;
  fullName: string;
  phone: string;
  email: string;
  notes: string;
  isFirstVisit: boolean;
}

export interface Testimonial {
  id: string;
  patientName: string;
  treatment: string;
  text: string;
  rating: number;
  timeAgo: string;
  verified: boolean;
}
