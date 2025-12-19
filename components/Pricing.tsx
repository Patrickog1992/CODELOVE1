import React from 'react';
import { Check, Gift, Sparkles } from 'lucide-react';
import { Plan } from '../types';

interface PricingProps {
  onOpenBuilder: () => void;
}

const plans: Plan[] = [
  {
    id: 'annual',
    name: '🎁 Plano Anual',
    subtitle: 'Acesso por 12 meses',
    price: '21,00',
    period: 'por ano',
    recommended: false,
    ctaText: 'Escolher Anual',
    features: [
      { text: 'Contador em tempo real', included: true },
      { text: 'Mensagem de Natal', included: true },
      { text: 'Data especial', included: true },
      { text: 'QR Code para imprimir', included: true },
      { text: 'Até 8 imagens na galeria', included: true },
      { text: 'Música de Natal', included: true },
    ]
  },
  {
    id: 'lifetime',
    name: '🎄 Plano Vitalício',
    subtitle: 'Acesso Eterno',
    price: '27,00',
    period: 'pagamento único',
    recommended: true,
    ctaText: 'Criar meu presente agora',
    features: [
      { text: 'TUDO do plano anual', included: true },
      { text: 'URL personalizada eterna', included: true },
      { text: 'Suporte prioritário 24h', included: true },
      { text: 'Animações exclusivas', included: true },
      { text: 'Efeito de Neve Realista', included: true },
      { text: 'Sem data de expiração', included: true },
    ]
  }
];

export const Pricing: React.FC<PricingProps> = ({ onOpenBuilder }) => {
  return (
    <section className="py-24 bg-christmas-snow" id="pricing">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-christmas-red font-bold uppercase tracking-widest text-sm mb-2 block">OFERTA DE NATAL</span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Escolha o seu presente 🎄</h2>
          <p className="text-gray-600 text-xl">Uma lembrança eterna para quem você ama 🎁</p>
        </div>

        <div className="flex flex-col lg:flex-row justify-center items-stretch gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex-1 rounded-3xl p-8 flex flex-col bg-white shadow-2xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${plan.recommended ? 'border-christmas-gold z-10' : 'border-gray-100'}`}
            >
              {plan.recommended && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-christmas-gold text-white font-bold py-2 px-6 rounded-full shadow-md text-sm uppercase tracking-wide flex items-center gap-2 whitespace-nowrap">
                  <Sparkles className="w-4 h-4" /> MAIS VENDIDO
                </div>
              )}

              <div className="mb-6 text-center">
                <h3 className={`text-2xl font-bold mb-1 ${plan.recommended ? 'text-christmas-red' : 'text-gray-800'}`}>
                    {plan.name}
                </h3>
                <p className="text-sm text-gray-500 mb-6">{plan.subtitle}</p>
                <div className="flex items-start justify-center gap-1 mb-2">
                    <span className="text-2xl font-bold mt-2 text-gray-900">R$</span>
                    <span className="text-6xl font-extrabold text-gray-900">{plan.price.split(',')[0]}</span>
                    <span className="text-2xl font-bold mt-2 text-gray-900">,{plan.price.split(',')[1]}</span>
                </div>
                <p className="text-gray-400 text-sm">{plan.period}</p>
              </div>

              <div className="flex-1 mb-8 space-y-4">
                  <ul className="grid grid-cols-1 gap-y-3">
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
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${plan.recommended ? 'bg-green-600 text-white hover:bg-green-500 animate-pulse-scale' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
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