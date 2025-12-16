import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Gift } from 'lucide-react';
import { Plan } from '../types';

interface PricingProps {
  onOpenBuilder: () => void;
}

const plans: Plan[] = [
  {
    id: 'lifetime',
    name: '🎅 Para Sempre',
    subtitle: 'Especial de Natal',
    price: '27,00',
    period: 'pagamento único',
    recommended: true,
    ctaText: '🎄 Aproveitar agora',
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
  },
  {
    id: 'annual',
    name: '🎄 Plano Anual',
    subtitle: 'Presente válido por 1 ano',
    price: '21,00',
    period: 'por ano',
    recommended: false,
    ctaText: '🎄 Aproveitar agora',
    features: [
      { text: 'Contador em tempo real', included: true },
      { text: 'Mensagem personalizada', included: true },
      { text: 'Data especial', included: true },
      { text: 'QR Code exclusivo', included: true },
      { text: 'Até 4 imagens', included: true },
      { text: 'URL personalizada', included: true },
      { text: 'Suporte 24 horas', included: true },
      { text: 'Sem música', included: false },
      { text: 'Sem fundo dinâmico', included: false },
      { text: 'Sem animações exclusivas', included: false },
      { text: 'Sem memórias', included: false },
    ]
  }
];

export const Pricing: React.FC<PricingProps> = ({ onOpenBuilder }) => {
  return (
    <section className="py-24 bg-christmas-snow" id="pricing">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Nossos Planos de Natal 🎄</h2>
          <p className="text-gray-600 text-xl">Escolha o presente ideal 🎁</p>
        </div>

        <div className="flex flex-col lg:flex-row justify-center items-stretch gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`relative flex-1 rounded-3xl p-8 flex flex-col ${
                plan.recommended 
                  ? 'bg-white shadow-2xl border-2 border-christmas-gold transform scale-100 lg:scale-105 z-10' 
                  : 'bg-white shadow-lg border border-gray-100'
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-christmas-gold text-white font-bold py-2 px-6 rounded-full shadow-md text-sm uppercase tracking-wide flex items-center gap-2 whitespace-nowrap">
                  <span className="text-lg">⭐</span> Recomendado
                </div>
              )}

              <div className="mb-6 text-center">
                <h3 className={`text-2xl font-bold mb-1 ${plan.recommended ? 'text-christmas-red' : 'text-gray-800'}`}>
                    {plan.name}
                </h3>
                <p className="text-sm text-gray-500 mb-6">{plan.subtitle}</p>
                <div className="flex items-end justify-center gap-1 mb-2">
                    <span className="text-sm font-medium text-gray-500 mb-2">R$</span>
                    <span className="text-5xl font-extrabold text-gray-900">{plan.price}</span>
                </div>
                <p className="text-gray-400 text-sm">/ {plan.period}</p>
              </div>

              <div className="flex-1 mb-8 space-y-4">
                  {plan.recommended && <p className="text-center text-sm font-medium text-christmas-green mb-4">Presente vitalício. Uma memória eterna.</p>}
                  
                  <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-3">
                              {feature.included ? (
                                  <div className="mt-0.5 bg-green-100 p-1 rounded-full text-green-600 flex-shrink-0">
                                      <Check className="w-3 h-3" />
                                  </div>
                              ) : (
                                  <div className="mt-0.5 bg-red-50 p-1 rounded-full text-red-400 flex-shrink-0">
                                      <X className="w-3 h-3" />
                                  </div>
                              )}
                              <span className={`text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400'}`}>
                                  {feature.text}
                              </span>
                          </li>
                      ))}
                  </ul>
              </div>

              <button 
                  onClick={onOpenBuilder}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${
                  plan.recommended 
                  ? 'bg-christmas-red text-white hover:bg-christmas-darkRed' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}>
                  <Gift className="w-5 h-5" />
                  {plan.ctaText}
              </button>
              
              <div className="text-center mt-3">
                  <button onClick={onOpenBuilder} className="text-sm text-gray-400 underline hover:text-gray-600">🎁 Criar presente</button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};