import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, Users } from 'lucide-react';
import { SnowEffect } from './SnowEffect';

interface HeroProps {
  onOpenBuilder: () => void;
}

const USER_AVATARS = [
  "https://i.imgur.com/ymfZ9oQ.jpeg",
  "https://i.imgur.com/Egm2wH7.jpeg",
  "https://i.imgur.com/RGc4NuC.jpeg",
  "https://i.imgur.com/DJZkiOD.jpeg",
  "https://i.imgur.com/Ry3mBeu.jpeg"
];

export const Hero: React.FC<HeroProps> = ({ onOpenBuilder }) => {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-christmas-darkRed to-christmas-red text-white pt-36 pb-32">
      <SnowEffect />
      
      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
          <span className="text-xl">🎁</span>
          <span className="text-sm font-medium tracking-wide uppercase">Vamos começar?</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight max-w-4xl">
          Presenteie com amor <br className="hidden md:block" />neste Natal 🎄
        </h1>

        <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-10 leading-relaxed">
          Crie uma página natalina personalizada para alguém especial e surpreenda com uma mensagem de Natal cheia de amor, memórias e emoção — um presente que ficará para sempre.
        </p>

        <button
          onClick={onOpenBuilder}
          className="bg-christmas-gold text-christmas-darkRed text-lg font-bold py-4 px-10 rounded-full shadow-lg shadow-christmas-darkRed/50 hover:bg-yellow-300 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 mb-8"
        >
          <Heart className="w-5 h-5 fill-current" />
          🎄 Criar meu presente de Natal
        </button>

        <div className="flex flex-col items-center gap-2">
          <div className="flex -space-x-4">
             {USER_AVATARS.map((src, i) => (
               <img 
                key={i}
                src={src} 
                alt={`User ${i + 1}`}
                className="w-10 h-10 rounded-full border-2 border-christmas-red object-cover"
              />
             ))}
          </div>
          <div className="flex items-center gap-1 text-sm font-medium text-yellow-200">
             <Star className="w-4 h-4 fill-current" />
             <span>Mais de 71.346 usuários emocionados</span>
          </div>
        </div>
      </div>

      {/* Decorative Wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
        <svg className="relative block w-full h-[60px] md:h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-christmas-snow"></path>
        </svg>
      </div>
    </section>
  );
};