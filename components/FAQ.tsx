import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { FAQItem } from '../types';

const faqItems: FAQItem[] = [
    {
        question: "Como recebo o presente?",
        answer: "Assim que você terminar de personalizar e concluir o pedido, o sistema gera na hora o seu link exclusivo e o QR Code. Você pode baixar e copiar na mesma hora."
    },
    {
        question: "Quais são os planos disponíveis?",
        answer: "Oferecemos o Plano Anual por R$ 21,00 e o Plano Vitalício por R$ 27,00, garantindo que sua homenagem seja eterna e sem anúncios."
    },
    {
        question: "O QR Code expira?",
        answer: "No Plano Vitalício, seu presente nunca expira. No Plano Anual, ele fica disponível por 12 meses a partir da criação."
    },
    {
        question: "Posso editar depois de pronto?",
        answer: "Para garantir a segurança dos dados, as informações são processadas no momento da criação. Se precisar de uma alteração drástica, nossa equipe de suporte pode ajudar no Plano Vitalício."
    },
    {
        question: "Funciona em qualquer celular?",
        answer: "Sim! A página é totalmente otimizada para ser aberta em qualquer smartphone (iPhone ou Android) através do QR Code ou link direto."
    }
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Dúvidas Frequentes</h2>
            <p className="text-gray-500">Tudo o que você precisa saber sobre o CODELOVE</p>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
              >
                <span className="font-semibold text-gray-800">{item.question}</span>
                <ChevronDown 
                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} 
                />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-5 pb-5 pt-0 text-gray-600 leading-relaxed border-t border-gray-50 mt-2">
                        <div className="pt-3">{item.answer}</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};