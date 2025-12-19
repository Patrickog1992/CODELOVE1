import React from 'react';
import { Star, Quote } from 'lucide-react';
import { Testimonial } from '../types';

const testimonials: Testimonial[] = [
  {
    name: "Mariana e João",
    time: "1 mês atrás",
    text: "Foi o presente de Natal mais emocionante que já dei. Ele chorou quando escaneou o QR Code!",
    avatar: "https://i.imgur.com/73dp13S.jpg"
  },
  {
    name: "Ana e Pedro",
    time: "2 dias atrás",
    text: "Transformou nosso Natal. Simplesmente perfeito!",
    avatar: "https://i.imgur.com/pO7c6ZD.jpg"
  },
  {
    name: "Lucas e Carol",
    time: "3 meses atrás",
    text: "Uma surpresa linda e inesquecível.",
    avatar: "https://i.imgur.com/6hNipoh.jpg"
  },
  {
    name: "Camila e Felipe",
    time: "4 meses atrás",
    text: "Nunca imaginei um presente digital tão emocionante.",
    avatar: "https://i.imgur.com/73dp13S.jpg" // Reusing the first one to keep style consistent
  }
];

export const Testimonials: React.FC = () => {
  return (
    <section className="py-24 bg-white relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
           <span className="text-red-500 font-bold tracking-widest uppercase text-sm mb-2 block">❤️ Avaliações</span>
           <h2 className="text-3xl md:text-5xl font-bold text-gray-900">O que nossos clientes dizem neste Natal</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-christmas-snow p-6 rounded-2xl relative border border-gray-100"
            >
              <Quote className="absolute top-4 right-4 text-gray-200 w-8 h-8 rotate-180" />
              <div className="flex items-center gap-1 text-yellow-400 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 font-medium mb-6 italic">"{testimonial.text}"</p>
              
              <div className="flex items-center gap-3">
                <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    loading="lazy"
                    width="40"
                    height="40"
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" 
                />
                <div>
                  <h4 className="font-bold text-sm text-gray-900">{testimonial.name}</h4>
                  <span className="text-xs text-gray-500">{testimonial.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center mt-12 gap-3">
          <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white overflow-hidden">
                      <img 
                        src={`https://picsum.photos/50/50?random=${i+200}`} 
                        loading="lazy" 
                        width="32"
                        height="32"
                        className="w-full h-full object-cover" 
                        alt="" 
                      />
                  </div>
              ))}
          </div>
          <p className="text-christmas-darkRed font-bold flex items-center gap-2">
            ⭐ Mais de 71.346 histórias emocionadas
          </p>
        </div>
      </div>
    </section>
  );
};