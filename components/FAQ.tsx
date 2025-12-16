import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { FAQItem } from '../types';

const faqItems: FAQItem[] = [
    {
        question: "Como recebo o presente?",
        answer: "Assim que o pagamento for confirmado, você receberá um e-mail com o acesso para criar sua página e o QR Code exclusivo imediatamente."
    },
    {
        question: "Posso editar depois de pronto?",
        answer: "Sim! No plano 'Para Sempre', você tem acesso vitalício e pode editar fotos e textos sempre que desejar."
    },
    {
        question: "O QR Code expira?",
        answer: "No plano 'Para Sempre', o QR Code é seu para a vida toda. No plano anual, ele é válido por 12 meses renováveis."
    },
    {
        question: "Quais são as formas de pagamento?",
        answer: "Aceitamos PIX para aprovação imediata e cartão de crédito. Todo o processo é 100% seguro."
    },
    {
        question: "Consigo ver como vai ficar antes de pagar?",
        answer: "Você pode visualizar exemplos de páginas criadas em nosso site. A personalização da sua página ocorre logo após a confirmação do pedido."
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
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};