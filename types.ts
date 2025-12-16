import { LucideIcon } from 'lucide-react';

export interface PlanFeature {
  text: string;
  included: boolean;
}

export interface Plan {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  period: string;
  features: PlanFeature[];
  recommended: boolean;
  ctaText: string;
}

export interface Testimonial {
  name: string;
  time: string;
  text: string;
  avatar: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export type BackgroundType = 'none' | 'hearts' | 'stars_comets' | 'stars_meteors' | 'aurora' | 'vortex' | 'clouds' | 'emojis';
export type PhotoMode = 'coverflow' | 'cube' | 'cards' | 'flip';

export interface BuilderData {
  title: string;
  message: string;
  date: string;
  photos: string[]; // URLs for preview
  photoMode: PhotoMode;
  music: string; // Display name
  musicUrl?: string; // Actual Audio URL
  background: BackgroundType;
  customEmojis?: string;
  email: string;
  selectedPlan: 'annual' | 'lifetime' | null;
}