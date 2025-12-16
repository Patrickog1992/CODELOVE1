import React from 'react';
import { Clock, Snowflake, Music, Globe, QrCode, Link } from 'lucide-react';
import { Feature } from '../types';

const features: Feature[] = [
  {
    title: "Contador de tempo",
    description: "Mostre há quanto tempo vocês compartilham momentos especiais juntos.",
    icon: Clock
  },
  {
    title: "Animações natalinas",
    description: "Neve caindo, luzes de Natal, corações e efeitos especiais.",
    icon: Snowflake
  },
  {
    title: "Música de Natal dedicada",
    description: "Escolha uma música especial para tocar automaticamente na página.",
    icon: Music
  },
  {
    title: "Em todo lugar",
    description: "Crie sua página e presenteie alguém em qualquer lugar do mundo.",
    icon: Globe
  },
  {
    title: "QR Code exclusivo de Natal",
    description: "Um QR Code único para surpreender no dia 25.",
    icon: QrCode
  },
  {
    title: "URL personalizada",
    description: "Um link exclusivo com o nome de quem você ama.",
    icon: Link
  }
];

export const Features: React.FC = () => {
  return (
    <section className="py-24 bg-christmas-darkGreen text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="text-christmas-gold font-bold uppercase tracking-wider text-sm mb-2 block">🎁 Recursos Exclusivos</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Vários Recursos Especiais de Natal 🎄</h2>
          <p className="text-white/80 max-w-2xl mx-auto text-lg">
            Nossa plataforma oferece recursos incríveis para criar o presente digital de Natal perfeito.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors"
            >
              <div className="w-12 h-12 bg-christmas-gold/20 text-christmas-gold rounded-full flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-white/70 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};