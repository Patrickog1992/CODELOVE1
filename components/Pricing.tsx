import React from 'react';
import { Check, Gift } from 'lucide-react';
import { Plan } from '../types';

interface PricingProps {
  onOpenBuilder: () => void;
}

const plans: Plan[] = [
  {
    id: 'lifetime',
    name: '🎅 Presente de Natal',
    subtitle: 'Gratuito por tempo limitado',
    price: '0,00',
    period: 'grátis',
    recommended: true,
    ctaText: '🎄 Criar agora grátis',
    features: [
      { text: 'Contador em tempo real', included: true },
      { text: 'Mensagem de Natal personalizada', included: true },
      { text: 'Data especial', included: true },
      { text: 'QR Code exclusivo', included: true },
      { text: 'Até 8 imagens', included: true },
      { text: 'URL personalizada', included: true },
      { text: 'Suporte 24 horas', included: true },
      { text: 'Música de Natal', included: true },
      { text: 'Fundo dinâmico natalino', included: true },
      { text: 'Animações exclusivas', included: true },
      { text: 'Memórias especiais', included: true },
    ]
  }
];

export const Pricing: React.FC<PricingProps> = ({ onOpenBuilder }) => {
  return (
    <section className="py-24 bg-christmas-snow" id="pricing">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Seu Presente de Natal Grátis 🎄</h2>
          <p className="text-gray-600 text-xl">Crie sua página personalizada sem custos 🎁</p>
        </div>

        <div className="flex flex-col lg:flex-row justify-center items-stretch gap-8 max-w-2xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="relative flex-1 rounded-3xl p-8 flex flex-col bg-white shadow-2xl border-2 border-christmas-gold z-10"
            >
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-christmas-gold text-white font-bold py-2 px-6 rounded-full shadow-md text-sm uppercase tracking-wide flex items-center gap-2 whitespace-nowrap">
                <span className="text-lg">✨</span> EDIÇÃO ESPECIAL
              </div>

              <div className="mb-6 text-center">
                <h3 className="text-2xl font-bold mb-1 text-christmas-red">
                    {plan.name}
                </h3>
                <p className="text-sm text-gray-500 mb-6">{plan.subtitle}</p>
                <div className="flex items-end justify-center gap-1 mb-2">
                    <span className="text-5xl font-extrabold text-gray-900">GRÁTIS</span>
                </div>
                <p className="text-gray-400 text-sm">Aproveite o Natal com CODELOVE</p>
              </div>

              <div className="flex-1 mb-8 space-y-4">
                  <p className="text-center text-sm font-medium text-christmas-green mb-4">Tudo o que você precisa para emocionar.</p>
                  
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                      {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-3">
                              <div className="mt-0.5 bg-green-100 p-1 rounded-full text-green-600 flex-shrink-0">
                                  <Check className="w-3 h-3" />
                              </div>
                              <span className="text-sm text-gray-700">
                                  {feature.text}
                              </span>
                          </li>
                      ))}
                  </ul>
              </div>

              <button 
                  onClick={onOpenBuilder}
                  className="w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 bg-green-600 text-white hover:bg-green-500 animate-pulse-scale"
              >
                  <Gift className="w-5 h-5" />
                  {plan.ctaText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};