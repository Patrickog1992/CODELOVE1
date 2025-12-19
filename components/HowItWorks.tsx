import React from 'react';
import { Edit3, CreditCard, Gift, HeartHandshake, Wand2 } from 'lucide-react';

const steps = [
  {
    icon: Edit3,
    title: "Personalize",
    description: "Personalize sua página com mensagem de Natal, fotos especiais, efeitos natalinos e muito mais.",
    number: "1"
  },
  {
    icon: Wand2,
    title: "Gere o presente",
    description: "Finalize a personalização e gere seu QR Code exclusivo instantaneamente.",
    number: "2"
  },
  {
    icon: Gift,
    title: "Receba o link",
    description: "Você terá acesso imediato a um QR Code natalino e um link exclusivo da sua página.",
    number: "3"
  },
  {
    icon: HeartHandshake,
    title: "Compartilhe",
    description: "Entregue o QR Code como presente ou envie o link e faça alguém chorar de emoção neste Natal.",
    number: "4"
  }
];

export const HowItWorks: React.FC = () => {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-christmas-red font-semibold uppercase tracking-wider text-sm mb-2 block">Como funciona?</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Crie seu presente de Natal em poucos passos</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Personalize uma página natalina especial para surpreender quem você ama. É simples, rápido e 100% gratuito.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative p-8 rounded-2xl bg-christmas-snow hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-red-100 group"
            >
              <div className="absolute -top-4 -right-4 w-10 h-10 bg-christmas-red text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                {step.number}
              </div>
              <div className="w-14 h-14 bg-red-100 text-christmas-red rounded-xl flex items-center justify-center mb-6 group-hover:bg-christmas-red group-hover:text-white transition-colors">
                <step.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">🎄 {step.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Big Feature Section */}
        <div className="mt-24 flex flex-col md:flex-row items-center justify-center gap-12 max-w-6xl mx-auto">
            <div className="flex-1 text-center md:text-left relative z-10">
                <h2 className="text-4xl md:text-6xl font-extrabold text-christmas-darkRed leading-tight mb-6 tracking-tight drop-shadow-sm">
                  ✨ Uma mensagem de Natal que ficará para sempre.
                </h2>
                <p className="text-gray-600 text-xl md:text-2xl font-light">
                   Surpreenda quem você ama com uma experiência digital única, interativa e emocionante.
                </p>
                <div className="hidden md:block absolute -right-10 top-1/2 w-24 h-24 border-t-2 border-r-2 border-dashed border-red-300 rounded-tr-[50px] -rotate-12 transform translate-x-full"></div>
            </div>

            <div className="flex-1 flex justify-center md:justify-end relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-red-100 to-gold-100 rounded-full blur-3xl opacity-60 transform scale-110"></div>
                <div className="relative border-gray-900 bg-gray-900 border-[12px] rounded-[2.5rem] shadow-2xl overflow-hidden w-[280px] md:w-[300px] transform md:rotate-[-6deg] hover:rotate-0 transition-transform duration-500 z-10">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[24px] bg-gray-900 rounded-b-xl z-20"></div>
                    <img 
                      src="https://i.imgur.com/Ld8I8LR.png" 
                      alt="App Preview" 
                      className="w-full h-auto rounded-[2rem] bg-gray-100"
                    />
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};