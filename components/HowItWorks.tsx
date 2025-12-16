import React from 'react';
import { motion } from 'framer-motion';
import { Edit3, CreditCard, Gift, HeartHandshake } from 'lucide-react';

const steps = [
  {
    icon: Edit3,
    title: "Personalize",
    description: "Personalize sua página com mensagem de Natal, fotos especiais, efeitos natalinos e muito mais.",
    number: "1"
  },
  {
    icon: CreditCard,
    title: "Faça o pagamento",
    description: "Escolha o plano ideal e faça o pagamento de forma rápida e segura.",
    number: "2"
  },
  {
    icon: Gift,
    title: "Receba seu acesso",
    description: "Você receberá por email um QR Code natalino e um link exclusivo da sua página.",
    number: "3"
  },
  {
    icon: HeartHandshake,
    title: "Compartilhe a emoção",
    description: "Entregue o QR Code como presente ou envie o link e faça alguém chorar de emoção neste Natal.",
    number: "4"
  }
];

export const HowItWorks: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-christmas-red font-semibold uppercase tracking-wider text-sm mb-2 block">Como funciona?</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Crie seu presente de Natal em poucos passos</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Personalize uma página natalina especial para surpreender quem você ama. É simples, rápido e inesquecível.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
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
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
            <p className="text-christmas-green font-medium text-lg">✨ Uma mensagem de Natal que ficará para sempre.</p>
        </div>
      </div>
    </section>
  );
};